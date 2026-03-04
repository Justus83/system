import { useState, useEffect } from 'react';

const ProductDetailsModal = ({ isOpen, onClose, product, productType }) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (isOpen && product) {
      fetchProductDetails();
    }
  }, [isOpen, product]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch sale history
      const salesResponse = await fetch(`http://localhost:5001/api/electronic-sales`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const salesData = await salesResponse.json();
      const productSales = salesData.filter(sale => sale.electronicProductId === product.id);

      // Fetch payment history for each sale
      const salesWithPayments = await Promise.all(
        productSales.map(async (sale) => {
          try {
            const paymentsResponse = await fetch(`http://localhost:5001/api/payments/sale/${sale.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const payments = await paymentsResponse.json();
            return { ...sale, payments };
          } catch (err) {
            console.error(`Failed to fetch payments for sale ${sale.id}:`, err);
            return { ...sale, payments: [] };
          }
        })
      );

      // Fetch return history
      const returnsResponse = await fetch(`http://localhost:5001/api/electronic-returns`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const allReturns = await returnsResponse.json();
      const productReturns = allReturns.filter(ret => ret.returnedProductId === product.id);

      // Fetch broker transactions
      const brokerResponse = await fetch(`http://localhost:5001/api/electronic-broker-transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const allBrokerTxns = await brokerResponse.json();
      const productBrokerTxns = allBrokerTxns.filter(txn => txn.electronicProductId === product.id);

      // Get IDs of sold broker transactions to exclude them from broker transactions list
      const soldBrokerIds = new Set(
        productBrokerTxns
          .filter(txn => txn.status === 'SOLD' || txn.status === 'Sold')
          .map(txn => txn.id)
      );

      setDetails({
        sales: salesWithPayments,
        returns: productReturns,
        brokerTransactions: productBrokerTxns.filter(txn => !soldBrokerIds.has(txn.id)) // Exclude sold transactions by ID
      });
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      SOLD: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      RETURNED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Product Details & History
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Product Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Product Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Brand & Model</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{product.brand} {product.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Serial Number</p>
                      <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">{product.serialNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Condition</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{product.productCondition || 'N/A'}</p>
                    </div>
                    {product.storageSize && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Storage</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{product.storageSize}</p>
                      </div>
                    )}
                    {product.ramSize && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">RAM</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{product.ramSize}</p>
                      </div>
                    )}
                    {product.color && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Color</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{product.color}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.sourceType === 'SUPPLIER' ? product.supplierName || 'Supplier' : product.otherSourceName || 'Other'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sales History (only when there is data) */}
                {details?.sales && details.sales.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sales History</h4>
                    <div className="space-y-3">
                      {details.sales.map((sale) => (
                        <div key={`${sale.isBrokerSale ? 'broker' : 'sale'}-${sale.id}`} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Sale Date</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(sale.saleDate)}</p>
                              </div>
                              {sale.isBrokerSale ? (
                                <>
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Broker</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{sale.brokerName || 'N/A'}</p>
                                  </div>
                                  {sale.brokerShopName && (
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Broker Shop</p>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">{sale.brokerShopName}</p>
                                    </div>
                                  )}
                                  {sale.takenAt && (
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Date Taken</p>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(sale.takenAt)}</p>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{sale.customerName || 'N/A'}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Sale Price</p>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">UGX {(sale.salePrice || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{sale.paymentMethod || 'N/A'}</p>
                              </div>
                              {sale.brokerName && !sale.isBrokerSale && (
                                <div className="col-span-2">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Broker</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{sale.brokerName}</p>
                                </div>
                              )}
                              {sale.isCreditSale && (
                                <>
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">UGX {(sale.totalAmount || 0).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Amount Paid</p>
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">UGX {(sale.amountPaid || 0).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Balance Due</p>
                                    <p className="text-sm font-medium text-red-600 dark:text-red-400">UGX {(sale.balanceDue || 0).toLocaleString()}</p>
                                  </div>
                                </>
                              )}
                            </div>
                            {sale.isBrokerSale && (
                              <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded whitespace-nowrap">
                                Broker Sale
                              </span>
                            )}
                          </div>
                          
                          {/* Payment History for this sale */}
                          {!sale.isBrokerSale && (sale.amountPaid > 0 || (sale.payments && sale.payments.length > 0)) && (
                            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment History</p>
                              <div className="space-y-2">
                                {/* Initial payment made during sale */}
                                {sale.amountPaid > 0 && (
                                  <div className="bg-white dark:bg-gray-800 rounded p-2 flex justify-between items-center">
                                    <div className="flex-1 grid grid-cols-3 gap-2">
                                      <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                        <p className="text-xs font-medium text-gray-900 dark:text-white">{formatDate(sale.saleDate)}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                                        <p className="text-xs font-medium text-green-600 dark:text-green-400">UGX {(sale.amountPaid || 0).toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Method</p>
                                        <p className="text-xs font-medium text-gray-900 dark:text-white">{sale.paymentMethod || 'N/A'}</p>
                                      </div>
                                    </div>
                                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded">Initial</span>
                                  </div>
                                )}
                                
                                {/* Subsequent payments */}
                                {sale.payments && sale.payments.map((payment) => (
                                  <div key={payment.id} className="bg-white dark:bg-gray-800 rounded p-2 flex justify-between items-center">
                                    <div className="flex-1 grid grid-cols-3 gap-2">
                                      <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                        <p className="text-xs font-medium text-gray-900 dark:text-white">{formatDate(payment.paymentDate)}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                                        <p className="text-xs font-medium text-green-600 dark:text-green-400">UGX {(payment.paymentAmount || 0).toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Method</p>
                                        <p className="text-xs font-medium text-gray-900 dark:text-white">{payment.paymentMethod || 'N/A'}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Returns History (only when there is data) */}
                {details?.returns && details.returns.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Returns History</h4>
                    <div className="space-y-3">
                      {details.returns.map((returnItem) => (
                        <div key={returnItem.id} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Return Date</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(returnItem.returnDate)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Reason</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{returnItem.returnReason || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{returnItem.returnStatus || 'N/A'}</p>
                            </div>
                            {returnItem.replacementProductName && (
                              <div className="col-span-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Replacement</p>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">{returnItem.replacementProductName}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Broker Transactions (only when there is data) */}
                {details?.brokerTransactions && details.brokerTransactions.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Broker Transactions</h4>
                    <div className="space-y-3">
                      {details.brokerTransactions.map((txn) => (
                        <div key={txn.id} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{txn.brokerName || 'N/A'}</p>
                              {txn.brokerShopName && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">{txn.brokerShopName}</p>
                              )}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${
                              txn.status === 'TAKEN' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              txn.status === 'RETURNED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {txn.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Date Taken</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(txn.takenAt)}</p>
                            </div>
                            {txn.returnedAt && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Date Returned</p>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">{formatDate(txn.returnedAt)}</p>
                              </div>
                            )}
                            {txn.soldAt && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Date Sold</p>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{formatDate(txn.soldAt)}</p>
                              </div>
                            )}
                            {txn.sellingPrice && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Selling Price</p>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">UGX {(txn.sellingPrice || 0).toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
