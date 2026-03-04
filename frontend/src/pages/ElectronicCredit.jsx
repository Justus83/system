import React, { useState, useEffect } from 'react';
import { salesAPI, paymentsAPI, productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProductTable } from '../components/shared';

const ElectronicCredit = () => {
  const { user, selectedStore } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creditSales, setCreditSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [paymentData, setPaymentData] = useState({
    paymentAmount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH'
  });

  // Payment method options
  const paymentMethods = [
    { value: 'CASH', label: 'Cash' },
    { value: 'MOBILE_MONEY', label: 'Mobile Money' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' }
  ];

  // Calculate totals
  const totals = creditSales.reduce((acc, sale) => {
    const balance = parseFloat(sale.balanceDue) || 0;
    const totalAmount = parseFloat(sale.totalAmount) || 0;
    const amountPaid = parseFloat(sale.amountPaid) || 0;
    acc.totalSellingPrice += totalAmount;
    acc.totalAmountPaid += amountPaid;
    acc.totalBalance += balance;
    return acc;
  }, { totalSellingPrice: 0, totalAmountPaid: 0, totalBalance: 0 });

  useEffect(() => {
    if (selectedStore) {
      // Only fetch credit sales if this is an electronics store
      if (selectedStore.shop?.shopType === 'ELECTRONICS') {
        fetchCreditSales();
        fetchProducts();
      }
    }
  }, [selectedStore]);
  const fetchCreditSales = async () => {
    if (!selectedStore) return;
    
    // Only fetch if this is an electronics store
    if (selectedStore.shop?.shopType !== 'ELECTRONICS') {
      setCreditSales([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await salesAPI.getSalesByStore(selectedStore.id);
      
      // Filter sales with outstanding balance
      const salesWithBalance = response.data.filter(sale => {
        const balance = parseFloat(sale.balanceDue) || 0;
        return balance > 0;
      });
      
      // Filter by store if needed
      const filteredSales = selectedStore 
        ? salesWithBalance.filter(sale => sale.storeId === selectedStore.id)
        : salesWithBalance;
      
      setCreditSales(filteredSales);
    } catch (err) {
      console.error('Failed to fetch credit sales:', err);
      setMessage({ type: 'error', text: 'Failed to load credit sales' });
    } finally {
      setLoading(false);
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
        ...smartphones.map(p => ({ ...p, type: 'SMARTPHONE' })),
        ...laptops.map(p => ({ ...p, type: 'LAPTOP' })),
        ...tablets.map(p => ({ ...p, type: 'TABLET' })),
        ...smartwatches.map(p => ({ ...p, type: 'SMARTWATCH' })),
        ...tvs.map(p => ({ ...p, type: 'TV' })),
        ...accessories.map(p => ({ ...p, type: 'ACCESSORY' }))
      ];
      
      setProducts(allProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleOpenPaymentModal = (sale) => {
    setSelectedSale(sale);
    setPaymentData({
      paymentAmount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'CASH'
    });
    setShowPaymentModal(true);
  };

  const handleOpenHistoryModal = async (sale) => {
    setSelectedSale(sale);
    try {
      // Fetch payment history from the payments API
      const response = await paymentsAPI.getPaymentsBySaleId(sale.id);
      setPaymentHistory(response.data || []);
    } catch (err) {
      console.error('Failed to fetch payment history:', err);
      setPaymentHistory([]);
    }
    setShowHistoryModal(true);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    
    if (!selectedSale) return;
    
    const paymentAmount = parseFloat(paymentData.paymentAmount);
    const currentBalance = parseFloat(selectedSale.balanceDue) || 0;
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setMessage({ type: 'error', text: 'Payment amount must be greater than 0' });
      return;
    }
    
    if (paymentAmount > currentBalance) {
      setMessage({ type: 'error', text: `Payment amount cannot exceed balance of UGX ${currentBalance.toLocaleString()}` });
      return;
    }

    try {
      // Create payment record with method and date
      const paymentPayload = {
        electronicSaleId: selectedSale.id,
        paymentAmount: paymentAmount,
        paymentDate: new Date(paymentData.paymentDate).toISOString(),
        paymentMethod: paymentData.paymentMethod
      };
      
      await paymentsAPI.createPayment(paymentPayload);
      
      setMessage({ type: 'success', text: 'Payment added successfully!' });
      setShowPaymentModal(false);
      fetchCreditSales(); // Refresh the list
    } catch (err) {
      console.error('Failed to add payment:', err);
      setMessage({ type: 'error', text: 'Failed to add payment. Please try again.' });
    }
  };

  // Filter credit sales based on search term
  const filteredCreditSales = creditSales.filter(sale => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (sale.customerName || '').toLowerCase().includes(search) ||
      (sale.customerPhone || '').toLowerCase().includes(search) ||
      (sale.productName || '').toLowerCase().includes(search) ||
      (sale.productSerialNumber || '').toLowerCase().includes(search)
    );
  });

  // Table columns - show device details similar to stock view
  const columns = [
    {
      key: 'customerName',
      title: 'Customer',
    },
    {
      key: 'deviceType',
      title: 'Device Type',
    },
    {
      key: 'model',
      title: 'Model',
    },
    {
      key: 'color',
      title: 'Color',
    },
    {
      key: 'storageRam',
      title: 'Storage / RAM',
    },
    {
      key: 'screenOrCase',
      title: 'Screen / Case',
    },
    {
      key: 'productSerialNumber',
      title: 'Serial Number',
    },
    {
      key: 'balanceDue',
      title: 'Balance',
      isPrice: true
    }
  ];

  // Format data for table
  const formattedData = filteredCreditSales.map(sale => {
    // Find the product to get device type
    const product = products.find(p => p.id === sale.electronicProductId);
    const deviceType = product?.type || 'N/A';
    const model = product?.model || product?.category || sale.productName || 'N/A';
    const color = product?.color || 'N/A';
    const storage = product?.storageSize || '';
    const ram = product?.ramSize || '';
    const storageRam = storage ? `${storage}${ram ? ` / ${ram}` : ''}` : (ram || 'N/A');
    const screenOrCase =
      deviceType === 'TV'
        ? product?.screenSize || 'N/A'
        : deviceType === 'SMARTWATCH'
          ? (product?.caseSizeMM || 'N/A')
          : 'N/A';
    
    return {
      ...sale,
      customerName: sale.customerName || 'N/A',
      deviceType,
      model,
      color,
      storageRam,
      screenOrCase,
      productSerialNumber: sale.productSerialNumber || 'N/A',
      balanceDue: sale.balanceDue != null ? parseFloat(sale.balanceDue).toFixed(2) : '0.00'
    };
  });

  // Format payment method for display
  const formatPaymentMethod = (method) => {
    const found = paymentMethods.find(pm => pm.value === method);
    return found ? found.label : method;
  };

  // Custom render for actions
  const renderActions = (sale) => (
    <div className="flex space-x-2">
      <button
        onClick={() => handleOpenPaymentModal(sale)}
        className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
        title="Add Payment"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      <button
        onClick={() => handleOpenHistoryModal(sale)}
        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        title="View Payment History"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Message Notification */}
      {message.text && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })} className="text-current opacity-70 hover:opacity-100">
              ×
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by customer name, contact, device model, serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Credit Sales Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      ) : filteredCreditSales.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No matching customers found' : 'No Customers with Outstanding Balance'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try a different search term' : 'All sales are fully paid'}
          </p>
        </div>
      ) : (
        <>
          <ProductTable
            columns={columns}
            data={formattedData}
            emptyMessage="No credit sales found"
            renderActions={renderActions}
          />
          
          {/* Totals Row */}
          <div className="mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-end items-center gap-8">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {searchTerm ? 'Search Results Total:' : 'Grand Total Outstanding Balance:'}
              </span>
              <span className="text-xl font-bold text-red-600">
                UGX {filteredCreditSales.reduce((sum, s) => sum + (parseFloat(s.balanceDue) || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Add Payment Modal */}
      {showPaymentModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add Payment</h2>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="font-medium text-gray-800 dark:text-white">{selectedSale.customerName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSale.productName} - {selectedSale.productSerialNumber}</p>
              <p className="text-sm text-red-600 font-medium mt-2">
                Current Balance: UGX {parseFloat(selectedSale.balanceDue).toLocaleString()}
              </p>
            </div>
            
            <form onSubmit={handleAddPayment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Amount (UGX) *
                </label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={paymentData.paymentAmount}
                  onChange={handlePaymentChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  required
                  min="1"
                  step="1"
                  placeholder={`Enter amount (max: UGX ${parseFloat(selectedSale.balanceDue).toLocaleString()})`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handlePaymentChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  required
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Date *
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={paymentData.paymentDate}
                  onChange={handlePaymentChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {showHistoryModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Payment History</h2>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="font-medium text-gray-800 dark:text-white">{selectedSale.customerName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSale.productName}</p>
            </div>
            
            {paymentHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No payment history available</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-600">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        UGX {parseFloat(payment.paymentAmount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {formatPaymentMethod(payment.paymentMethod)}
                      </span>
                      {payment.createdByName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          By: {payment.createdByName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectronicCredit;
