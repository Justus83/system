import { useState, useEffect, useRef } from 'react';
import { customerReturnsAPI, salesAPI, productsAPI, shopsAPI, enumsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Returns = () => {
  const { user, selectedStore } = useAuth();
  const saleDropdownRef = useRef(null);
  const replacementDropdownRef = useRef(null);
  const [returns, setReturns] = useState([]);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [returnStatuses, setReturnStatuses] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReturn, setEditingReturn] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saleSearchQuery, setSaleSearchQuery] = useState('');
  const [showSaleDropdown, setShowSaleDropdown] = useState(false);
  const [replacementSearchQuery, setReplacementSearchQuery] = useState('');
  const [showReplacementDropdown, setShowReplacementDropdown] = useState(false);
  const [formData, setFormData] = useState({
    saleId: '',
    returnedProductId: '',
    returnDate: new Date().toISOString().split('T')[0],
    returnReason: '',
    returnStatus: 'RETURNED_TO_STOCK',
    replacementProductId: '',
    refundAmount: '',
    isReplacement: false,
    replacementDate: '',
    notes: '',
  });

  useEffect(() => {
    fetchReturnStatuses();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      // Only fetch returns if this is an electronics store
      if (selectedStore.shop?.shopType === 'ELECTRONICS') {
        fetchReturns();
        fetchSales();
        fetchProducts();
        fetchShopInfo();
      }
    }
  }, [selectedStore]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (saleDropdownRef.current && !saleDropdownRef.current.contains(event.target)) {
        setShowSaleDropdown(false);
      }
      if (replacementDropdownRef.current && !replacementDropdownRef.current.contains(event.target)) {
        setShowReplacementDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const fetchReturnStatuses = async () => {
    try {
      const response = await enumsAPI.getReturnStatuses();
      setReturnStatuses(response.data || []);
    } catch (err) {
      console.error('Failed to fetch return statuses:', err);
    }
  };

  const fetchShopInfo = async () => {
    if (!selectedStore) return;
    
    try {
      if (selectedStore.shop?.id) {
        const shopResponse = await shopsAPI.getShop(selectedStore.shop.id);
        setShopInfo(shopResponse.data);
      }
    } catch (err) {
      console.error('Failed to fetch shop info:', err);
    }
  };

  const fetchReturns = async () => {
    if (!selectedStore) return;
    
    // Only fetch if this is an electronics store
    if (selectedStore.shop?.shopType !== 'ELECTRONICS') {
      setReturns([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await customerReturnsAPI.getReturnsByStore(selectedStore.id);
      setReturns(response.data || []);
    } catch (err) {
      console.error('Failed to fetch returns:', err);
      setError('Failed to fetch returns');
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    if (!selectedStore) return;
    
    // Only fetch if this is an electronics store
    if (selectedStore.shop?.shopType !== 'ELECTRONICS') {
      setSales([]);
      return;
    }
    
    try {
      const response = await salesAPI.getSalesByStore(selectedStore.id);
      setSales(response.data || []);
    } catch (err) {
      console.error('Failed to fetch sales:', err);
    }
  };

  const fetchProducts = async () => {
    if (!selectedStore) return;
    
    // Only fetch if this is an electronics store
    if (selectedStore.shop?.shopType !== 'ELECTRONICS') {
      setProducts([]);
      return;
    }
    
    try {
      const [smartphones, laptops, tablets, smartwatches, tvs, accessories] = await Promise.all([
        productsAPI.getSmartphonesByStore(selectedStore.id).then(res => res.data).catch(() => []),
        productsAPI.getLaptopsByStore(selectedStore.id).then(res => res.data).catch(() => []),
        productsAPI.getTabletsByStore(selectedStore.id).then(res => res.data).catch(() => []),
        productsAPI.getSmartwatchesByStore(selectedStore.id).then(res => res.data).catch(() => []),
        productsAPI.getTVsByStore(selectedStore.id).then(res => res.data).catch(() => []),
        productsAPI.getAccessoriesByStore(selectedStore.id).then(res => res.data).catch(() => [])
      ]);
      
      const allProducts = [
        ...(smartphones || []).map(p => ({ ...p, productType: 'Smartphone' })),
        ...(laptops || []).map(p => ({ ...p, productType: 'Laptop' })),
        ...(tablets || []).map(p => ({ ...p, productType: 'Tablet' })),
        ...(smartwatches || []).map(p => ({ ...p, productType: 'Smartwatch' })),
        ...(tvs || []).map(p => ({ ...p, productType: 'TV' })),
        ...(accessories || []).map(p => ({ ...p, productType: 'Accessory' })),
      ];
      
      setProducts(allProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    try {
      const returnData = {
        electronicSaleId: parseInt(formData.saleId),
        returnedProductId: parseInt(formData.returnedProductId),
        returnReason: formData.returnReason,
        returnStatus: formData.returnStatus,
        returnDate: new Date(formData.returnDate).toISOString(),
        replacementProductId: formData.replacementProductId ? parseInt(formData.replacementProductId) : null,
        refundAmount: formData.refundAmount ? parseFloat(formData.refundAmount) : 0,
        isReplacement: formData.replacementProductId ? true : false,
        replacementDate: formData.replacementProductId ? new Date().toISOString() : null,
        notes: formData.notes,
        storeId: editingReturn ? editingReturn.storeId : selectedStore?.id,
      };
      
      console.log('Submitting return data:', returnData);
      
      if (editingReturn) {
        await customerReturnsAPI.updateReturn(editingReturn.id, returnData);
        setSuccessMsg('Return updated successfully!');
      } else {
        await customerReturnsAPI.createReturn(returnData);
        setSuccessMsg('Return recorded successfully!');
      }
      
      fetchReturns();
      setShowModal(false);
      setEditingReturn(null);
      setSaleSearchQuery(''); // Clear sale search
      setReplacementSearchQuery(''); // Clear replacement search
      setFormData({
        saleId: '',
        returnedProductId: '',
        returnDate: new Date().toISOString().split('T')[0],
        returnReason: '',
        returnStatus: 'RETURNED_TO_STOCK',
        replacementProductId: '',
        refundAmount: '',
        isReplacement: false,
        replacementDate: '',
        notes: '',
      });
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save return');
    }
  };

  const handleEdit = (returnItem) => {
    setEditingReturn(returnItem);
    
    // Set the sale search query to show the selected sale
    const selectedSale = sales.find(s => s.id === returnItem.electronicSaleId);
    if (selectedSale) {
      setSaleSearchQuery(`${selectedSale.productName || 'Unknown Product'} | ${selectedSale.productSerialNumber || selectedSale.serialNumber || 'N/A'} | ${selectedSale.customerName || 'N/A'}`);
    }
    
    // Set the replacement product search query if there's a replacement
    const selectedReplacement = products.find(p => p.id === returnItem.replacementProductId);
    if (selectedReplacement) {
      const model = selectedReplacement.model || selectedReplacement.modelName || '';
      const serialNumber = selectedReplacement.serialNumber || 'No Serial';
      setReplacementSearchQuery(`${model || `Product #${selectedReplacement.id}`} | ${serialNumber}`);
    }
    
    setFormData({
      saleId: returnItem.electronicSaleId || '',
      returnedProductId: returnItem.returnedProductId || '',
      returnDate: returnItem.returnDate ? returnItem.returnDate.split('T')[0] : new Date().toISOString().split('T')[0],
      returnReason: returnItem.returnReason || '',
      returnStatus: returnItem.returnStatus || 'RETURNED_TO_STOCK',
      replacementProductId: returnItem.replacementProductId || '',
      refundAmount: returnItem.refundAmount || '',
      isReplacement: returnItem.isReplacement || false,
      replacementDate: returnItem.replacementDate ? returnItem.replacementDate.split('T')[0] : '',
      notes: returnItem.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this return?')) {
      return;
    }
    
    try {
      await customerReturnsAPI.deleteReturn(id);
      fetchReturns();
    } catch (err) {
      setError('Failed to delete return');
    }
  };

  const openModal = () => {
    setEditingReturn(null);
    setError('');
    setSuccessMsg('');
    setSaleSearchQuery(''); // Clear sale search
    setShowSaleDropdown(false); // Close sale dropdown
    setReplacementSearchQuery(''); // Clear replacement search
    setShowReplacementDropdown(false); // Close replacement dropdown
    setFormData({
      saleId: '',
      returnedProductId: '',
      returnDate: new Date().toISOString().split('T')[0],
      returnReason: '',
      returnStatus: 'RETURNED_TO_STOCK',
      replacementProductId: '',
      refundAmount: '',
      isReplacement: false,
      replacementDate: '',
      notes: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReturn(null);
    setSaleSearchQuery(''); // Clear sale search
    setShowSaleDropdown(false); // Close sale dropdown
    setReplacementSearchQuery(''); // Clear replacement search
    setShowReplacementDropdown(false); // Close replacement dropdown
  };

  const filteredReturns = returns.filter(r => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      (r.saleProductName || '').toLowerCase().includes(search) ||
      (r.saleProductSerialNumber || '').toLowerCase().includes(search) ||
      (r.returnReason || '').toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'RETURNED_TO_STOCK':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'RETURNED_TO_SUPPLIER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'TOTAL_LOSS':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'RETURNED_TO_STOCK':
        return 'Returned to Stock';
      case 'RETURNED_TO_SUPPLIER':
        return 'Returned to Supplier';
      case 'TOTAL_LOSS':
        return 'Total Loss';
      default:
        return status;
    }
  };

  const pageTitle = shopInfo ? `${shopInfo.shopTypeName} Returns` : 'Customer Returns';

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
            placeholder="Search returns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button onClick={openModal} className="btn-primary flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Return</span>
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
                  Returned Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Replacement Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No returns</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new return.</p>
                  </td>
                </tr>
              ) : (
                filteredReturns.map((returnItem) => (
                  <tr key={returnItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {returnItem.returnDate ? new Date(returnItem.returnDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">{returnItem.returnedProductName || returnItem.saleProductName || '-'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {returnItem.returnedProductSerialNumber || returnItem.saleProductSerialNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {returnItem.replacementProductName ? (
                        <div>
                          <div className="font-medium text-green-600 dark:text-green-400">
                            {returnItem.replacementProductName}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 font-mono">
                            {returnItem.replacementProductSerialNumber || 'N/A'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No replacement</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="max-w-xs truncate" title={returnItem.returnReason}>
                        {returnItem.returnReason || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(returnItem.returnStatus)}`}>
                        {getStatusLabel(returnItem.returnStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                      <button
                        onClick={() => handleEdit(returnItem)}
                        className="p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(returnItem.id)}
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

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {editingReturn ? 'Edit Return' : 'Record Return'}
                  </h3>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  {/* Date, Sale and Status Row */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Return Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Return Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        required
                        max={new Date().toISOString().split('T')[0]}
                        className="input-field w-full"
                      />
                    </div>

                    {/* Sale Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sale <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Searchable Sale Selection */}
                      <div className="relative" ref={saleDropdownRef}>
                        <input
                          type="text"
                          placeholder="Search and select sale..."
                          value={saleSearchQuery}
                          onChange={(e) => setSaleSearchQuery(e.target.value)}
                          onFocus={() => setShowSaleDropdown(true)}
                          className="input-field w-full pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        
                        {/* Dropdown Results */}
                        {showSaleDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {sales
                              .filter(sale => {
                                if (!saleSearchQuery) return true;
                                const search = saleSearchQuery.toLowerCase();
                                const productName = (sale.productName || '').toLowerCase();
                                const serialNumber = (sale.productSerialNumber || sale.serialNumber || '').toLowerCase();
                                const customerName = (sale.customerName || '').toLowerCase();
                                return productName.includes(search) || serialNumber.includes(search) || customerName.includes(search);
                              })
                              .map((sale) => (
                                <div
                                  key={sale.id}
                                  onClick={() => {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      saleId: sale.id,
                                      returnedProductId: sale.electronicProductId || ''
                                    }));
                                    setSaleSearchQuery(`${sale.productName || 'Unknown Product'} | ${sale.productSerialNumber || sale.serialNumber || 'N/A'} | ${sale.customerName || 'N/A'}`);
                                    setShowSaleDropdown(false);
                                  }}
                                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                                >
                                  {sale.productName || 'Unknown Product'} | {sale.productSerialNumber || sale.serialNumber || 'N/A'} | {sale.customerName || 'N/A'}
                                </div>
                              ))
                            }
                            {sales.filter(sale => {
                              if (!saleSearchQuery) return true;
                              const search = saleSearchQuery.toLowerCase();
                              const productName = (sale.productName || '').toLowerCase();
                              const serialNumber = (sale.productSerialNumber || sale.serialNumber || '').toLowerCase();
                              const customerName = (sale.customerName || '').toLowerCase();
                              return productName.includes(search) || serialNumber.includes(search) || customerName.includes(search);
                            }).length === 0 && (
                              <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                                No sales found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Hidden input for form validation */}
                      <input
                        type="hidden"
                        name="saleId"
                        value={formData.saleId}
                        required
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="returnStatus"
                        value={formData.returnStatus}
                        onChange={handleChange}
                        required
                        className="input-field w-full"
                      >
                        {returnStatuses.map((status) => (
                          <option key={status.name} value={status.name}>
                            {status.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Return Reason */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="returnReason"
                      value={formData.returnReason}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="input-field w-full"
                      placeholder="Reason for return"
                    ></textarea>
                  </div>

                  {/* Replacement Product */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Replacement Product
                    </label>
                    
                    {/* Searchable Replacement Product Selection */}
                    <div className="relative" ref={replacementDropdownRef}>
                      <input
                        type="text"
                        placeholder="Search and select replacement product..."
                        value={replacementSearchQuery}
                        onChange={(e) => setReplacementSearchQuery(e.target.value)}
                        onFocus={() => setShowReplacementDropdown(true)}
                        className="input-field w-full pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      
                      {/* Dropdown Results */}
                      {showReplacementDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {/* No Replacement Option */}
                          <div
                            onClick={() => {
                              setFormData(prev => ({ ...prev, replacementProductId: '' }));
                              setReplacementSearchQuery('');
                              setShowReplacementDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-500 dark:text-gray-400"
                          >
                            No Replacement
                          </div>
                          
                          {/* Available Products */}
                          {products
                            .filter(p => p.status === 'AVAILABLE')
                            .filter(product => {
                              if (!replacementSearchQuery) return true;
                              const search = replacementSearchQuery.toLowerCase();
                              const model = (product.model || product.modelName || '').toLowerCase();
                              const serialNumber = (product.serialNumber || '').toLowerCase();
                              return model.includes(search) || serialNumber.includes(search);
                            })
                            .map((product) => {
                              const model = product.model || product.modelName || '';
                              const serialNumber = product.serialNumber || 'No Serial';
                              
                              return (
                                <div
                                  key={product.id}
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, replacementProductId: product.id }));
                                    setReplacementSearchQuery(`${model || `Product #${product.id}`} | ${serialNumber}`);
                                    setShowReplacementDropdown(false);
                                  }}
                                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                                >
                                  {model || `Product #${product.id}`} | {serialNumber}
                                </div>
                              );
                            })
                          }
                          
                          {/* No products found message */}
                          {products.filter(p => p.status === 'AVAILABLE').filter(product => {
                            if (!replacementSearchQuery) return true;
                            const search = replacementSearchQuery.toLowerCase();
                            const model = (product.model || product.modelName || '').toLowerCase();
                            const serialNumber = (product.serialNumber || '').toLowerCase();
                            return model.includes(search) || serialNumber.includes(search);
                          }).length === 0 && replacementSearchQuery && (
                            <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                              No products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary w-full sm:w-auto sm:ml-3">
                    {editingReturn ? 'Update Return' : 'Record Return'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                  >
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

export default Returns;
