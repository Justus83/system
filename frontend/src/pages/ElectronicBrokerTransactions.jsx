import { useState, useEffect } from 'react';
import { brokerTransactionsAPI, brokersAPI, productsAPI, storeAccessAPI, shopsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BrokerTransactions = () => {
  const { user, selectedStore } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [products, setProducts] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    brokerId: '',
    productId: '',
    status: 'TAKEN',
    sellingPrice: '',
    amountPaid: '',
    paymentMethod: '',
  });

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    if (!productSearch) return true;
    const search = productSearch.toLowerCase();
    return (
      (product.serialNumber || '').toLowerCase().includes(search) ||
      (product.model || '').toLowerCase().includes(search) ||
      (product.name || '').toLowerCase().includes(search) ||
      (product.brand || '').toLowerCase().includes(search)
    );
  });

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      (transaction.productSerialNumber || '').toLowerCase().includes(search) ||
      (transaction.productModel || '').toLowerCase().includes(search) ||
      (transaction.brokerName || '').toLowerCase().includes(search) ||
      (transaction.productType || '').toLowerCase().includes(search)
    );
  });

  // Handle product selection from modal
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      productId: product.id
    }));
    setShowProductModal(false);
    setProductSearch('');
  };

  const handleClearProduct = () => {
    setSelectedProduct(null);
    setFormData(prev => ({
      ...prev,
      productId: ''
    }));
  };

  useEffect(() => {
    if (selectedStore) {
      fetchTransactions();
      fetchBrokers();
      fetchProducts();
      fetchShopInfo();
    }
  }, [selectedStore]);

  const fetchShopInfo = async () => {
    if (!selectedStore?.shop?.id) return;
    
    try {
      const shopResponse = await shopsAPI.getShop(selectedStore.shop.id);
      setShopInfo(shopResponse.data);
    } catch (err) {
      console.error('Failed to fetch shop info:', err);
    }
  };

  const fetchBrokers = async () => {
    if (!selectedStore) return;
    
    try {
      const response = await brokersAPI.getBrokersByStore(selectedStore.id);
      setBrokers(response.data);
    } catch (err) {
      console.error('Failed to fetch brokers:', err);
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
      
      // Filter to only show AVAILABLE products for broker transactions
      const allProducts = [
        ...(smartphones || []).filter(p => p.status === 'AVAILABLE').map(p => ({ ...p, productType: 'Smartphone' })),
        ...(laptops || []).filter(p => p.status === 'AVAILABLE').map(p => ({ ...p, productType: 'Laptop' })),
        ...(tablets || []).filter(p => p.status === 'AVAILABLE').map(p => ({ ...p, productType: 'Tablet' })),
        ...(smartwatches || []).filter(p => p.status === 'AVAILABLE').map(p => ({ ...p, productType: 'Smartwatch' })),
        ...(tvs || []).filter(p => p.status === 'AVAILABLE').map(p => ({ ...p, productType: 'TV' })),
        ...(accessories || []).filter(p => p.status === 'AVAILABLE').map(p => ({ ...p, productType: 'Accessory' })),
      ];
      
      setProducts(allProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchTransactions = async () => {
    if (!selectedStore) return;
    
    try {
      setLoading(true);
      const response = await brokerTransactionsAPI.getTransactionsByStore(selectedStore.id);
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    // Validate required fields
    if (!selectedStore && !editingTransaction?.storeId) {
      setError('Store information is not available. Please refresh the page.');
      return;
    }
    
    if (!formData.brokerId) {
      setError('Please select a broker');
      return;
    }
    
    if (!formData.productId) {
      setError('Please select a product');
      return;
    }
    
    try {
      const transactionData = {
        storeId: editingTransaction ? editingTransaction.storeId : selectedStore.id,
        branchId: null,
        electronicProductId: parseInt(formData.productId),
        brokerId: parseInt(formData.brokerId),
        status: formData.status,
        takenAt: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        notes: null,
        // Include sale information when status is SOLD
        sellingPrice: formData.status === 'SOLD' ? parseFloat(formData.sellingPrice) : null,
        amountPaid: formData.status === 'SOLD' ? parseFloat(formData.amountPaid) : null,
        paymentMethod: formData.status === 'SOLD' ? formData.paymentMethod : null
      };
      
      console.log('Submitting transaction data:', JSON.stringify(transactionData, null, 2));
      
      if (editingTransaction) {
        await brokerTransactionsAPI.updateTransaction(editingTransaction.id, transactionData);
        setSuccessMsg('Transaction updated successfully!');
      } else {
        await brokerTransactionsAPI.createTransaction(transactionData);
        setSuccessMsg('Transaction recorded successfully!');
      }
      
      setTimeout(() => {
        setShowModal(false);
        setEditingTransaction(null);
        setSelectedProduct(null);
        setSuccessMsg('');
        setFormData({
          date: new Date().toISOString().split('T')[0],
          brokerId: '',
          productId: '',
          status: 'TAKEN',
          sellingPrice: '',
          amountPaid: '',
          paymentMethod: '',
        });
        fetchTransactions();
      }, 1500);
    } catch (err) {
      console.error('Transaction submission error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to save transaction');
    }
  };

  const handleEdit = async (transaction) => {
    setEditingTransaction(transaction);
    
    // For editing, we need to fetch the specific product even if it's not AVAILABLE
    // since it's already part of this transaction
    try {
      // Try to find the product in the current products list first
      let product = products.find(p => p.id === transaction.electronicProductId);
      
      // If not found (because it might be TAKEN), fetch it directly
      if (!product && transaction.electronicProductId) {
        const productType = transaction.productType?.toLowerCase();
        let productResponse;
        
        switch(productType) {
          case 'smartphone':
            productResponse = await productsAPI.getSmartphone(transaction.electronicProductId);
            product = { ...productResponse.data, productType: 'Smartphone' };
            break;
          case 'laptop':
            productResponse = await productsAPI.getLaptop(transaction.electronicProductId);
            product = { ...productResponse.data, productType: 'Laptop' };
            break;
          case 'tablet':
            productResponse = await productsAPI.getTablet(transaction.electronicProductId);
            product = { ...productResponse.data, productType: 'Tablet' };
            break;
          case 'smartwatch':
            productResponse = await productsAPI.getSmartwatch(transaction.electronicProductId);
            product = { ...productResponse.data, productType: 'Smartwatch' };
            break;
          case 'tv':
            productResponse = await productsAPI.getTV(transaction.electronicProductId);
            product = { ...productResponse.data, productType: 'TV' };
            break;
          case 'accessory':
            productResponse = await productsAPI.getAccessory(transaction.electronicProductId);
            product = { ...productResponse.data, productType: 'Accessory' };
            break;
        }
      }
      
      if (product) {
        setSelectedProduct(product);
      }
    } catch (err) {
      console.error('Failed to fetch product for editing:', err);
    }
    
    setFormData({
      date: transaction.takenAt ? new Date(transaction.takenAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      brokerId: transaction.brokerId || '',
      productId: transaction.electronicProductId || '',
      status: transaction.status || 'TAKEN',
      sellingPrice: transaction.sellingPrice || '',
      amountPaid: transaction.amountPaid || '',
      paymentMethod: transaction.paymentMethod || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    
    try {
      await brokerTransactionsAPI.deleteTransaction(id);
      fetchTransactions();
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  const openModal = () => {
    if (!selectedStore) {
      setError('Store information is not available. Please refresh the page.');
      return;
    }
    setEditingTransaction(null);
    setSelectedProduct(null);
    setError('');
    setSuccessMsg('');
    setFormData({
      date: new Date().toISOString().split('T')[0],
      brokerId: '',
      productId: '',
      status: 'TAKEN',
      sellingPrice: '',
      amountPaid: '',
      paymentMethod: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setSelectedProduct(null);
    setError('');
    setSuccessMsg('');
  };

  const pageTitle = shopInfo ? `${shopInfo.shopTypeName} Broker Transactions` : 'Broker Transactions';

  if (loading && !selectedStore) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-4 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by serial number, model, broker, or product type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg 
            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={openModal}
          className="btn-primary flex items-center whitespace-nowrap"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Transaction
        </button>
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
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Storage/RAM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Broker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.filter(t => t.status === 'TAKEN').length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      {searchQuery ? 'No transactions found' : 'No taken transactions'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating a new transaction.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions
                  .filter(transaction => transaction.status === 'TAKEN')
                  .map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.productModel || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.productStorageSize || transaction.productRamSize ? (
                        <>
                          {transaction.productStorageSize}
                          {transaction.productStorageSize && transaction.productRamSize && ' / '}
                          {transaction.productRamSize}
                        </>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.productColor || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
                      {transaction.productSerialNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.brokerName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
          </div>

          <div className="relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-4xl max-h-[90vh] flex flex-col">
              <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {editingTransaction ? 'Edit Broker Transaction' : 'Add Broker Transaction'}
                  </h3>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div>
                      {/* Date Field */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Transaction Date <span className="text-red-500">*</span>
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

                      {/* Broker Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Broker <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="brokerId"
                          value={formData.brokerId}
                          onChange={handleChange}
                          required
                          className="input-field w-full"
                        >
                          <option value="">Select Broker</option>
                          {brokers.map((broker) => (
                            <option key={broker.id} value={broker.id}>
                              {broker.name} {broker.contact ? `(${broker.contact})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Transaction Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                          className="input-field w-full"
                        >
                          <option value="TAKEN">Taken</option>
                          <option value="RETURNED">Returned</option>
                          <option value="SOLD">Sold</option>
                        </select>
                      </div>

                      {/* Payment Method - Only shown when status is SOLD */}
                      {formData.status === 'SOLD' && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Payment Method <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            required={formData.status === 'SOLD'}
                            className="input-field w-full"
                          >
                            <option value="">Select Payment Method</option>
                            <option value="CASH">Cash</option>
                            <option value="MOBILE_MONEY">Mobile Money</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div>
                      {/* Product Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Product <span className="text-red-500">*</span>
                        </label>
                        {selectedProduct ? (
                          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  <span className="font-bold">Model:</span> {selectedProduct.model}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  <span className="font-bold">Storage:</span> {selectedProduct.storageSize || '-'}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  <span className="font-bold">Color:</span> {selectedProduct.color}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  <span className="font-bold">RAM:</span> {selectedProduct.ramSize || '-'}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  <span className="font-bold">Serial:</span> {selectedProduct.serialNumber}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleClearProduct}
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                              >
                                Change
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowProductModal(true)}
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-left hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            Select Product
                          </button>
                        )}
                        {!selectedProduct && !formData.productId && (
                          <p className="text-sm text-red-500 mt-1">Please select a product</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sale Fields - Shown only when status is SOLD - Full Width */}
                  {formData.status === 'SOLD' && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Sale Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Total Amount <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="sellingPrice"
                            value={formData.sellingPrice}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required={formData.status === 'SOLD'}
                            className="input-field w-full"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Amount Paid <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="amountPaid"
                            value={formData.amountPaid}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required={formData.status === 'SOLD'}
                            className="input-field w-full"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse flex-shrink-0 border-t border-gray-200 dark:border-gray-600">
                  <button type="submit" className="btn-primary w-full sm:w-auto sm:ml-3">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingTransaction ? 'Update Transaction' : 'Record Transaction'}
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
      )}

      {/* Product Selection Modal - Similar to ElectronicSale */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Select Product</h2>
              <button 
                onClick={() => {
                  setShowProductModal(false);
                  setProductSearch('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by serial number, model, brand..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>
            
            {/* Product List - Scrollable table */}
            <div className="overflow-y-auto max-h-[60vh] border border-gray-200 dark:border-gray-600 rounded-md">
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No products found
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Serial Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Model</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Storage</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Color</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">RAM</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredProducts.map((product) => (
                      <tr 
                        key={`${product.productType}-${product.id}`}
                        onClick={() => handleProductSelect(product)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">
                          {product.serialNumber}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                          {product.model}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.storageSize || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.color || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.ramSize || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokerTransactions;
