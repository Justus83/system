import { useState, useEffect } from 'react';
import { suppliersAPI, storeAccessAPI, shopsAPI, investmentsAPI, shipmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Shipments = () => {
  const { user, selectedStore } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isAddingMore, setIsAddingMore] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    investmentId: '',
    date: new Date().toISOString().split('T')[0],
    stockExpected: '',
    stockBrought: '',
    productDetails: [{ productName: '', quantityExpected: 0, quantityReceived: 0 }],
  });

  useEffect(() => {
    if (selectedStore) {
      fetchSuppliers();
      fetchShopInfo();
      fetchInvestments();
      fetchShipments();
    }
  }, [selectedStore]);

  const fetchUserStore = async () => {
    try {
      const response = await storeAccessAPI.getStoreAccessByUser(user?.id);
      if (response.data && response.data.length > 0) {
        setStoreId(selectedStore.id);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch store access:', err);
      setLoading(false);
    }
  };

  const fetchShopInfo = async () => {
    if (!selectedStore?.shop?.id) return;
    
    try {
      const shopResponse = await shopsAPI.getShop(selectedStore.shop.id);
      setShopInfo(shopResponse.data);
    } catch (err) {
      console.error('Failed to fetch shop info:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getSuppliers();
      setSuppliers(response.data || []);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const fetchInvestments = async () => {
    if (!selectedStore) return;
    
    try {
      const response = await investmentsAPI.getInvestmentsByStore(selectedStore.id);
      setInvestments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch investments:', err);
    }
  };

  const fetchShipments = async () => {
    if (!selectedStore) return;
    
    try {
      const response = await shipmentsAPI.getShipmentsByStore(selectedStore.id);
      setShipments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
      setError('Failed to load shipments');
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // When investment is selected, load its products (only for new shipments)
    if (name === 'investmentId' && value && !isAddingMore) {
      const selectedInvestment = investments.find(inv => inv.id === parseInt(value));
      if (selectedInvestment && selectedInvestment.productDetails) {
        try {
          const products = JSON.parse(selectedInvestment.productDetails);
          
          const productDetailsWithReceived = products.map(p => ({
            productName: p.productName,
            quantityExpected: p.quantity || 0,
            quantityReceived: 0
          }));
          
          // Calculate total expected
          const totalExpected = productDetailsWithReceived.reduce((sum, p) => sum + (p.quantityExpected || 0), 0);
          
          setFormData(prev => ({
            ...prev,
            productDetails: productDetailsWithReceived,
            stockExpected: totalExpected,
            stockBrought: 0
          }));
        } catch (err) {
          console.error('Failed to parse product details:', err);
        }
      }
    }
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.productDetails];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    
    // Auto-calculate stockBrought when quantityReceived changes
    if (field === 'quantityReceived') {
      const totalReceived = updatedProducts.reduce((sum, p) => sum + (parseInt(p.quantityReceived) || 0), 0);
      setFormData(prev => ({ ...prev, productDetails: updatedProducts, stockBrought: totalReceived }));
    } else {
      setFormData(prev => ({ ...prev, productDetails: updatedProducts }));
    }
  };

  const removeProductRow = (index) => {
    if (formData.productDetails.length > 1) {
      const updatedProducts = formData.productDetails.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, productDetails: updatedProducts }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    try {
      let finalProductDetails = formData.productDetails;
      let finalStockBrought = parseInt(formData.stockBrought) || 0;
      
      // If we're adding more (isAddingMore), we need to ADD the new quantities to existing ones
      if (editingShipment && isAddingMore) {
        finalProductDetails = formData.productDetails.map(p => ({
          productName: p.productName,
          quantityExpected: p.quantityExpected,
          quantityReceived: (p.quantityBroughtSoFar || 0) + (p.quantityReceived || 0)  // ADD new to existing
        }));
        
        // Calculate total brought after adding
        finalStockBrought = finalProductDetails.reduce((sum, p) => sum + (p.quantityReceived || 0), 0);
      }
      
      const shipmentData = {
        shipmentDate: new Date(formData.date).toISOString(),
        invoiceId: formData.investmentId ? parseInt(formData.investmentId) : null,
        stockExpected: parseInt(formData.stockExpected) || 0,
        stockBrought: finalStockBrought,
        productDetails: JSON.stringify(finalProductDetails.filter(p => p.productName)),
        storeId: selectedStore.id,
      };
      
      if (editingShipment) {
        // Update existing shipment
        await shipmentsAPI.updateShipment(editingShipment.id, shipmentData);
        setSuccessMsg('Shipment updated successfully!');
      } else {
        // Create new shipment
        await shipmentsAPI.createShipment(shipmentData);
        setSuccessMsg('Shipment recorded successfully!');
      }
      
      fetchShipments();
      setShowModal(false);
      setEditingShipment(null);
      setIsAddingMore(false);
      setFormData({
        investmentId: '',
        date: new Date().toISOString().split('T')[0],
        stockExpected: '',
        stockBrought: '',
        productDetails: [{ productName: '', quantityExpected: 0, quantityReceived: 0 }],
      });
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save shipment');
    }
  };

  const handleAddMore = async (shipment) => {
    // Add more items to the existing shipment
    if (shipment.invoiceId) {
      const selectedInvestment = investments.find(inv => inv.id === shipment.invoiceId);
      
      if (selectedInvestment && selectedInvestment.productDetails) {
        try {
          const products = JSON.parse(selectedInvestment.productDetails);
          
          // Get what's already brought in THIS shipment
          let currentProducts = [];
          if (shipment.productDetails) {
            try {
              currentProducts = JSON.parse(shipment.productDetails);
            } catch (err) {
              console.error('Failed to parse current shipment product details:', err);
            }
          }
          
          // Map current quantities
          const alreadyBrought = {};
          currentProducts.forEach(p => {
            alreadyBrought[p.productName] = p.quantityReceived || 0;
          });
          
          const productDetailsWithReceived = products.map(p => ({
            productName: p.productName,
            quantityExpected: p.quantity || 0,
            quantityBroughtSoFar: alreadyBrought[p.productName] || 0,  // What's already in this shipment
            quantityReceived: 0  // Empty, ready to ADD more
          }));
          
          const totalExpected = productDetailsWithReceived.reduce((sum, p) => sum + (p.quantityExpected || 0), 0);
          const totalAlreadyBrought = productDetailsWithReceived.reduce((sum, p) => sum + (p.quantityBroughtSoFar || 0), 0);
          
          setFormData({
            investmentId: shipment.invoiceId.toString(),
            date: shipment.date ? shipment.date.split('T')[0] : new Date().toISOString().split('T')[0],
            stockExpected: totalExpected,
            stockBrought: totalAlreadyBrought,
            productDetails: productDetailsWithReceived
          });
          
          setEditingShipment(shipment);  // Set to editing mode to update
          setIsAddingMore(true);
          setShowModal(true);
        } catch (err) {
          console.error('Failed to parse product details:', err);
          alert('Error loading product details: ' + err.message);
        }
      } else {
        alert('This invoice has no product details.');
      }
    } else {
      alert('This shipment has no invoice associated with it.');
    }
  };

  const handleDelete = async (shipmentId) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        await shipmentsAPI.deleteShipment(shipmentId);
        setSuccessMsg('Shipment deleted successfully!');
        fetchShipments();
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete shipment');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const openModal = () => {
    setError('');
    setSuccessMsg('');
    setIsAddingMore(false);  // This is a new shipment, only 2 columns
    setFormData({
      investmentId: '',
      date: new Date().toISOString().split('T')[0],
      stockExpected: '',
      stockBrought: '',
      productDetails: [{ productName: '', quantityExpected: 0, quantityReceived: 0 }],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const pageTitle = shopInfo ? `${shopInfo.shopTypeName} Shipments` : 'Shipments';

  const filteredShipments = shipments.filter(shipment => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    const investment = investments.find(inv => inv.id === shipment.invoiceId);
    return (
      (investment?.invoiceNumber || '').toLowerCase().includes(search) ||
      (shipment.productDetails || '').toLowerCase().includes(search) ||
      (shipment.shipmentDate || '').toLowerCase().includes(search)
    );
  });

  if (loading && !selectedStore) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{pageTitle}</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search shipments by invoice number, date, or product details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button onClick={openModal} className="btn-primary flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-4">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expected
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Brought
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No shipments</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {searchQuery ? 'No shipments match your search.' : 'Get started by recording a new shipment.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {shipment.date ? new Date(shipment.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {shipment.invoiceNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {shipment.stockExpected || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {shipment.stockBrought || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                      <button
                        onClick={() => handleAddMore(shipment)}
                        className="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Add More Shipment"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(shipment.id)}
                        className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-white/20 rounded-lg p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white">
                        {editingShipment ? 'Edit Shipment' : 'Record Shipment'}
                      </h3>
                      <p className="text-blue-100 text-sm">Track incoming products from suppliers</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 px-6 py-6">
                  {/* Date and Invoice Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Date */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Shipment Date <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="input-field w-full"
                      />
                    </div>

                    {/* Investment/Invoice */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Invoice/Investment
                      </label>
                      {isAddingMore ? (
                        <div className="input-field w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed flex items-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {investments.find(inv => inv.id === parseInt(formData.investmentId))?.invoiceNumber || `Investment #${formData.investmentId}`}
                          </span>
                        </div>
                      ) : (
                        <select
                          name="investmentId"
                          value={formData.investmentId}
                          onChange={handleChange}
                          className="input-field w-full"
                        >
                          <option value="">Select Invoice</option>
                          {investments.map((inv) => (
                            <option key={inv.id} value={inv.id}>
                              {inv.invoiceNumber || `Investment #${inv.id}`}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  {formData.investmentId && formData.productDetails.length > 0 && formData.productDetails[0].productName ? (
                    <div className="mb-4">
                      <div className="flex items-center mb-3">
                        <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                          Product Details
                        </h4>
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                          {formData.productDetails.length} item(s)
                        </span>
                      </div>
                      <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                                Product Name
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider w-24">
                                Expected
                              </th>
                              {isAddingMore && (
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider w-28">
                                  Brought So Far
                                </th>
                              )}
                              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider w-28">
                                Brought Now
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {formData.productDetails.map((product, index) => (
                              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {product.productName}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                      {product.quantityExpected}
                                    </span>
                                  </div>
                                </td>
                                {isAddingMore && (
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-center">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                        {product.quantityBroughtSoFar || 0}
                                      </span>
                                    </div>
                                  </td>
                                )}
                                <td className="px-4 py-3">
                                  <input
                                    type="number"
                                    value={product.quantityReceived}
                                    onChange={(e) => handleProductChange(index, 'quantityReceived', parseInt(e.target.value) || 0)}
                                    className="input-field w-full text-center font-medium"
                                    min="0"
                                    max={isAddingMore ? (product.quantityExpected - (product.quantityBroughtSoFar || 0)) : product.quantityExpected}
                                    placeholder="0"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Summary */}
                      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Items Received:</span>
                          </div>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formData.stockBrought} / {formData.stockExpected}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Select an invoice to view product details</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-600">
                  <button type="submit" className="btn-primary w-full sm:w-auto sm:ml-3 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingShipment ? 'Update Shipment' : 'Record Shipment'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipments;
