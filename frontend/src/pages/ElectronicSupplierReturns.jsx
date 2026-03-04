import { useState, useEffect, useRef } from 'react';
import { supplierReturnsAPI, suppliersAPI, productsAPI, shopsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SupplierReturns = () => {
  const { user, selectedStore } = useAuth();
  const dropdownRef = useRef(null);
  const [returns, setReturns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [editingReturn, setEditingReturn] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: '',
    productId: '',
    status: 'RETURNED_TO_SUPPLIER',
    returnDate: new Date().toISOString().split('T')[0],
    productValue: '',
    returnReason: '',
    notes: '',
    replacementSerialNumber: '',
    replacementReason: '',
  });
  const [replacementData, setReplacementData] = useState({
    replacementSerialNumber: '',
    replacementReason: '',
  });

  useEffect(() => {
    if (selectedStore) {
      fetchReturns();
      fetchSuppliers();
      fetchProducts();
      fetchShopInfo();
    }
  }, [selectedStore]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchShopInfo = async () => {
    if (!selectedStore?.shop?.id) return;
    
    try {
      const shopResponse = await shopsAPI.getShop(selectedStore.shop.id);
      setShopInfo(shopResponse.data);
    } catch (err) {
      console.error('Failed to fetch shop info:', err);
    }
  };

  const fetchReturns = async () => {
    if (!selectedStore) return;
    
    try {
      setLoading(true);
      const response = await supplierReturnsAPI.getSupplierReturns();
      // Filter returns by store on the frontend since there's no store-specific endpoint
      const storeReturns = (response.data || []).filter(returnItem => 
        returnItem.storeId === selectedStore.id
      );
      setReturns(storeReturns);
    } catch (err) {
      console.error('Failed to fetch supplier returns:', err);
      setError('Failed to fetch supplier returns');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    if (!selectedStore) return;
    
    try {
      const response = await suppliersAPI.getSuppliersByStore(selectedStore.id);
      setSuppliers(response.data || []);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const fetchProducts = async () => {
    if (!selectedStore) return;
    
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
      // Get the selected product
      const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
      
      if (!selectedProduct) {
        setError('Selected product not found');
        return;
      }

      // Determine supplier based on available data
      let supplierId = null;
      
      if (selectedProduct.sourceType === 'SUPPLIER' && selectedProduct.supplierId) {
        // Has supplier - use it
        supplierId = selectedProduct.supplierId;
      } else if (selectedProduct.sourceType === 'OTHER' || 
                 (selectedProduct.sourceType === 'SUPPLIER' && selectedProduct.otherSourceName)) {
        // Has other source data - use that
        supplierId = null;
      } else {
        // No source information at all
        setError('Product has no source information (neither supplier nor other source). Please edit the product first.');
        return;
      }

      const returnData = {
        supplierId: supplierId,
        electronicProductId: parseInt(formData.productId),
        status: formData.status,
        returnDate: new Date(formData.returnDate).toISOString(),
        productValue: formData.productValue ? parseFloat(formData.productValue) : 0,
        returnReason: formData.returnReason,
        notes: formData.notes,
        storeId: editingReturn ? editingReturn.storeId : selectedStore.id,
      };

      // Add replacement fields if status is RETURNED_TO_SUPPLIER_REPLACED
      if (formData.status === 'RETURNED_TO_SUPPLIER_REPLACED') {
        returnData.replacementSerialNumber = formData.replacementSerialNumber;
        returnData.replacementReason = formData.replacementReason;
      }
      
      if (editingReturn) {
        await supplierReturnsAPI.updateSupplierReturn(editingReturn.id, returnData);
        setSuccessMsg('Supplier return updated successfully!');
      } else {
        await supplierReturnsAPI.createSupplierReturn(returnData);
        setSuccessMsg('Supplier return recorded successfully!');
      }
      
      setTimeout(() => {
        setShowModal(false);
        setEditingReturn(null);
        setFormData({
          supplierId: '',
          productId: '',
          status: 'PENDING',
          returnDate: new Date().toISOString().split('T')[0],
          productValue: '',
          returnReason: '',
          notes: '',
          replacementSerialNumber: '',
          replacementReason: '',
        });
        fetchReturns();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save supplier return');
    }
  };

  const handleEdit = (returnItem) => {
    setEditingReturn(returnItem);
    
    // Set the product search query to show the selected product
    const selectedProduct = products.find(p => p.id === returnItem.electronicProductId);
    if (selectedProduct) {
      setProductSearchQuery(`${selectedProduct.model || selectedProduct.name} - ${selectedProduct.serialNumber}`);
    }
    
    setFormData({
      supplierId: returnItem.supplierId || '',
      productId: returnItem.electronicProductId || '',
      status: returnItem.status || 'RETURNED_TO_SUPPLIER',
      returnDate: returnItem.returnDate ? returnItem.returnDate.split('T')[0] : new Date().toISOString().split('T')[0],
      productValue: returnItem.productValue || '',
      returnReason: returnItem.returnReason || '',
      notes: returnItem.notes || '',
      replacementSerialNumber: returnItem.replacementSerialNumber || '',
      replacementReason: returnItem.replacementReason || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier return?')) {
      return;
    }
    
    try {
      await supplierReturnsAPI.deleteSupplierReturn(id);
      fetchReturns();
    } catch (err) {
      setError('Failed to delete supplier return');
    }
  };

  const openReplacementModal = (returnItem) => {
    setSelectedReturn(returnItem);
    setReplacementData({
      replacementSerialNumber: '',
      replacementReason: '',
    });
    setShowReplacementModal(true);
  };

  const handleProcessReplacement = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await supplierReturnsAPI.processReplacement(
        selectedReturn.id,
        replacementData.replacementSerialNumber,
        replacementData.replacementReason
      );
      setSuccessMsg('Replacement processed successfully!');
      setTimeout(() => {
        setShowReplacementModal(false);
        setSelectedReturn(null);
        fetchReturns();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process replacement');
    }
  };

  const openModal = () => {
    setEditingReturn(null);
    setError('');
    setSuccessMsg('');
    setProductSearchQuery(''); // Clear product search
    setShowProductDropdown(false); // Close dropdown
    setFormData({
      supplierId: '',
      productId: '',
      status: 'RETURNED_TO_SUPPLIER',
      returnDate: new Date().toISOString().split('T')[0],
      productValue: '',
      returnReason: '',
      notes: '',
      replacementSerialNumber: '',
      replacementReason: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReturn(null);
    setProductSearchQuery(''); // Clear product search
    setShowProductDropdown(false); // Close dropdown
  };

  const filteredReturns = returns.filter(r => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      (r.productName || '').toLowerCase().includes(search) ||
      (r.productSerialNumber || '').toLowerCase().includes(search) ||
      (r.supplierName || '').toLowerCase().includes(search) ||
      (r.returnReason || '').toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'RETURNED_TO_SUPPLIER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'RETURNED_TO_SUPPLIER_REPLACED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'RETURNED_TO_SUPPLIER':
        return 'Returned to Supplier';
      case 'RETURNED_TO_SUPPLIER_REPLACED':
        return 'Returned - Replaced';
      default:
        return status;
    }
  };

  const pageTitle = shopInfo ? `${shopInfo.shopTypeName} Supplier Returns` : 'Supplier Returns';

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
            placeholder="Search supplier returns..."
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
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Replacement
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No supplier returns</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new supplier return.</p>
                  </td>
                </tr>
              ) : (
                filteredReturns.map((returnItem) => (
                  <tr key={returnItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {returnItem.returnDate ? new Date(returnItem.returnDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {returnItem.productName || '-'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {returnItem.productSerialNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="max-w-xs truncate" title={returnItem.returnReason}>
                        {returnItem.returnReason || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {returnItem.replacementSerialNumber ? (
                        <div>
                          <div className="font-medium text-green-600 dark:text-green-400">
                            {returnItem.replacementSerialNumber}
                          </div>
                          {returnItem.replacementReason && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate" title={returnItem.replacementReason}>
                              {returnItem.replacementReason}
                            </div>
                          )}
                          {returnItem.replacementDate && (
                            <div className="text-xs text-gray-400">
                              {new Date(returnItem.replacementDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">No replacement</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(returnItem.status)}`}>
                        {getStatusLabel(returnItem.status)}
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
                        onClick={() => openReplacementModal(returnItem)}
                        className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Process Replacement"
                        disabled={returnItem.replacementSerialNumber}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
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

      {/* Add/Edit Modal */}
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
                    {editingReturn ? 'Edit Supplier Return' : 'Record Supplier Return'}
                  </h3>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Product Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Searchable Product Selection */}
                      <div className="relative" ref={dropdownRef}>
                        <input
                          type="text"
                          placeholder="Search and select product..."
                          value={productSearchQuery}
                          onChange={(e) => setProductSearchQuery(e.target.value)}
                          onFocus={() => setShowProductDropdown(true)}
                          className="input-field w-full pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        
                        {/* Dropdown Results */}
                        {showProductDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {products
                              .filter(product => {
                                if (!productSearchQuery) return true;
                                const search = productSearchQuery.toLowerCase();
                                const model = (product.model || product.name || '').toLowerCase();
                                const serial = (product.serialNumber || '').toLowerCase();
                                return model.includes(search) || serial.includes(search);
                              })
                              .map((product) => (
                                <div
                                  key={product.id}
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, productId: product.id }));
                                    setProductSearchQuery(`${product.model || product.name} - ${product.serialNumber}`);
                                    setShowProductDropdown(false);
                                  }}
                                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                                >
                                  {product.model || product.name} - {product.serialNumber}
                                </div>
                              ))
                            }
                            {products.filter(product => {
                              if (!productSearchQuery) return true;
                              const search = productSearchQuery.toLowerCase();
                              const model = (product.model || product.name || '').toLowerCase();
                              const serial = (product.serialNumber || '').toLowerCase();
                              return model.includes(search) || serial.includes(search);
                            }).length === 0 && (
                              <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                                No products found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Hidden input for form validation */}
                      <input
                        type="hidden"
                        name="productId"
                        value={formData.productId}
                        required
                      />
                    </div>

                    {/* Return Date */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Return Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        required
                        className="input-field w-full"
                      />
                    </div>

                    {/* Status */}
                    <div className="mb-4 col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="input-field w-full"
                      >
                        <option value="RETURNED_TO_SUPPLIER">Returned to Supplier</option>
                        <option value="RETURNED_TO_SUPPLIER_REPLACED">Returned to Supplier - Replaced</option>
                      </select>
                    </div>

                    {/* Replacement Fields - Show only when RETURNED_TO_SUPPLIER_REPLACED */}
                    {formData.status === 'RETURNED_TO_SUPPLIER_REPLACED' && (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Replacement Serial Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="replacementSerialNumber"
                            value={formData.replacementSerialNumber}
                            onChange={handleChange}
                            required
                            className="input-field w-full"
                            placeholder="Enter replacement serial number"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Color <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="replacementReason"
                            value={formData.replacementReason}
                            onChange={handleChange}
                            required
                            className="input-field w-full"
                            placeholder="Enter color"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Return Reason - Full Width */}
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

      {/* Replacement Modal */}
      {showReplacementModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowReplacementModal(false)}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleProcessReplacement}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Process Replacement
                  </h3>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Product:</strong> {selectedReturn?.productName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Serial:</strong> {selectedReturn?.productSerialNumber}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Supplier:</strong> {selectedReturn?.supplierName}
                    </p>
                  </div>

                  {/* Replacement Serial Number */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Replacement Serial Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={replacementData.replacementSerialNumber}
                      onChange={(e) => setReplacementData(prev => ({ ...prev, replacementSerialNumber: e.target.value }))}
                      required
                      className="input-field w-full"
                      placeholder="Enter replacement serial number"
                    />
                  </div>

                  {/* Replacement Reason */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Replacement Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={replacementData.replacementReason}
                      onChange={(e) => setReplacementData(prev => ({ ...prev, replacementReason: e.target.value }))}
                      required
                      rows="3"
                      className="input-field w-full"
                      placeholder="Reason for replacement"
                    ></textarea>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary w-full sm:w-auto sm:ml-3">
                    Process Replacement
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReplacementModal(false)}
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

export default SupplierReturns;
