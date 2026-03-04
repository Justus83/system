import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { barSalesAPI, countersAPI, inventoryAPI, barShiftsAPI } from '../services/api';

const BarSales = () => {
  const { selectedStore, user } = useAuth();
  const [counters, setCounters] = useState([]);
  const [selectedCounter, setSelectedCounter] = useState(null);
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftAction, setShiftAction] = useState(null); // 'start' or 'end'
  const [activeShift, setActiveShift] = useState(null);
  const [lastClosedShift, setLastClosedShift] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saleItems, setSaleItems] = useState([]);
  const [shiftFormData, setShiftFormData] = useState({
    openingCash: 0,
    closingCash: 0,
    notes: '',
    stockItems: [],
  });
  const [formData, setFormData] = useState({
    paymentMethod: 'CASH',
    servedBy: user?.username || '',
    saleDate: new Date().toISOString().slice(0, 10), // Format: YYYY-MM-DD
  });

  useEffect(() => {
    fetchCounters();
  }, [selectedStore]);

  useEffect(() => {
    if (selectedCounter) {
      fetchSales();
      fetchInventory();
      fetchActiveShift();
      fetchLastClosedShift();
    }
  }, [selectedCounter]);

  const fetchCounters = async () => {
    if (!selectedStore) return;
    
    try {
      const response = await countersAPI.getCountersByStore(selectedStore.id);
      const activeCounters = response.data.filter(c => c.active);
      setCounters(activeCounters);
      if (activeCounters.length > 0 && !selectedCounter) {
        setSelectedCounter(activeCounters[0]);
      }
    } catch (error) {
      console.error('Error fetching counters:', error);
      setError('Failed to fetch counters');
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    if (!selectedCounter) return;
    
    setLoading(true);
    try {
      const response = await barSalesAPI.getSalesByCounter(selectedCounter.id);
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setError('Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    if (!selectedCounter) return;
    
    try {
      const response = await inventoryAPI.getInventoryByCounter(selectedCounter.id);
      setInventory(response.data.filter(item => item.quantity > 0));
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchActiveShift = async () => {
    if (!selectedCounter) return;
    
    try {
      const response = await barShiftsAPI.getActiveShiftByCounter(selectedCounter.id);
      setActiveShift(response.data);
    } catch (error) {
      if (error.response?.status !== 204) {
        console.error('Error fetching active shift:', error);
      }
      setActiveShift(null);
    }
  };

  const fetchLastClosedShift = async () => {
    if (!selectedCounter) return;
    
    try {
      const response = await barShiftsAPI.getLastClosedShiftByCounter(selectedCounter.id);
      setLastClosedShift(response.data);
    } catch (error) {
      if (error.response?.status !== 204) {
        console.error('Error fetching last closed shift:', error);
      }
      setLastClosedShift(null);
    }
  };

  const handleStartShift = () => {
    setShiftAction('start');
    
    // Initialize stock items from current inventory
    const stockItems = inventory.map(item => ({
      productType: item.productType,
      productId: item.productId,
      productName: [item.brandName, item.sizeName, item.packagingName, item.yearName]
        .filter(d => d && d !== 'N/A')
        .join(' '),
      openingQuantity: item.quantity,
      closingQuantity: 0,
    }));

    setShiftFormData({
      openingCash: lastClosedShift?.closingCash || 0,
      closingCash: 0,
      notes: '',
      stockItems: stockItems,
    });

    setShowShiftModal(true);
  };

  const handleEndShift = () => {
    if (!activeShift) return;
    
    setShiftAction('end');
    
    // Initialize stock items from current inventory
    const stockItems = inventory.map(item => ({
      productType: item.productType,
      productId: item.productId,
      productName: [item.brandName, item.sizeName, item.packagingName, item.yearName]
        .filter(d => d && d !== 'N/A')
        .join(' '),
      openingQuantity: 0,
      closingQuantity: item.quantity,
    }));

    setShiftFormData({
      openingCash: 0,
      closingCash: 0,
      notes: '',
      stockItems: stockItems,
    });

    setShowShiftModal(true);
  };

  const handleShiftSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      if (shiftAction === 'start') {
        const shiftData = {
          counterId: selectedCounter.id,
          userId: user.id,
          openingCash: parseFloat(shiftFormData.openingCash),
          stockItems: shiftFormData.stockItems.map(item => ({
            productType: item.productType,
            productId: item.productId,
            productName: item.productName,
            openingQuantity: parseInt(item.openingQuantity),
          })),
        };

        await barShiftsAPI.startShift(shiftData);
        fetchActiveShift();
      } else if (shiftAction === 'end') {
        const shiftData = {
          closingCash: parseFloat(shiftFormData.closingCash),
          notes: shiftFormData.notes,
          stockItems: shiftFormData.stockItems.map(item => ({
            productType: item.productType,
            productId: item.productId,
            productName: item.productName,
            closingQuantity: parseInt(item.closingQuantity),
          })),
        };

        await barShiftsAPI.endShift(activeShift.id, shiftData);
        fetchActiveShift();
        fetchLastClosedShift();
      }

      setShowShiftModal(false);
      resetShiftForm();
    } catch (error) {
      console.error('Error managing shift:', error);
      setError('Error managing shift: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const resetShiftForm = () => {
    setShiftFormData({
      openingCash: 0,
      closingCash: 0,
      notes: '',
      stockItems: [],
    });
    setShiftAction(null);
  };

  const updateShiftStockItem = (index, field, value) => {
    const updated = [...shiftFormData.stockItems];
    updated[index][field] = value;
    setShiftFormData({ ...shiftFormData, stockItems: updated });
  };

  const addSaleItem = () => {
    setSaleItems([...saleItems, {
      productId: '',
      productType: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
    }]);
  };

  const removeSaleItem = (index) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const updateSaleItem = (index, field, value) => {
    const updated = [...saleItems];
    updated[index][field] = value;

    if (field === 'productId') {
      const product = inventory.find(item => item.id === parseInt(value));
      if (product) {
        updated[index].productType = product.productType;
        const details = [product.brandName, product.sizeName, product.packagingName, product.yearName]
          .filter(d => d && d !== 'N/A')
          .join(' ');
        updated[index].productName = details;
        updated[index].productId = product.productId;
      }
    }

    setSaleItems(updated);
  };

  const calculateTotal = () => {
    return saleItems.reduce((sum, item) => {
      return sum + (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (saleItems.length === 0) {
      setError('Please add at least one item to the sale');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const saleData = {
        counterId: selectedCounter.id,
        paymentMethod: formData.paymentMethod,
        servedBy: formData.servedBy,
        saleDate: new Date(formData.saleDate).toISOString(),
        totalAmount: calculateTotal(),
        items: saleItems.map(item => ({
          productId: item.productId,
          productType: item.productType,
          productName: item.productName,
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })),
      };

      await barSalesAPI.createSale(saleData);
      setShowModal(false);
      resetForm();
      fetchSales();
      fetchInventory();
    } catch (error) {
      console.error('Error creating sale:', error);
      setError('Error creating sale: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;
    
    try {
      await barSalesAPI.deleteSale(id);
      fetchSales();
    } catch (error) {
      console.error('Error deleting sale:', error);
      alert('Error deleting sale');
    }
  };

  const resetForm = () => {
    setFormData({
      paymentMethod: 'CASH',
      servedBy: user?.username || '',
      saleDate: new Date().toISOString().slice(0, 10),
    });
    setSaleItems([]);
    setError('');
  };

  const canManageSales = () => {
    if (!user?.role) return true;
    const allowedRoles = ['OWNER', 'ADMIN', 'BRANCH_MANAGER', 'MANAGER', 'STORE_MANAGER', 'CASHIER'];
    return allowedRoles.includes(user.role);
  };

  const filteredSales = sales.filter(sale => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (sale.servedBy && sale.servedBy.toLowerCase().includes(term)) ||
      (sale.paymentMethod && sale.paymentMethod.toLowerCase().includes(term))
    );
  });

  if (loading && !selectedCounter) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (counters.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg">
          <p className="font-medium">No counters available</p>
          <p className="text-sm mt-1">Please create at least one counter before making sales.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bar Sales</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Record and track bar sales
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Counter Selection */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Counter
        </label>
        <select
          value={selectedCounter?.id || ''}
          onChange={(e) => {
            const counter = counters.find(c => c.id === parseInt(e.target.value));
            setSelectedCounter(counter);
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        >
          {counters.map(counter => (
            <option key={counter.id} value={counter.id}>
              {counter.name}
            </option>
          ))}
        </select>
      </div>

      {/* Shift Status */}
      {selectedCounter && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shift Status
              </h3>
              {activeShift ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                    Active Shift
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Started: {new Date(activeShift.shiftStart).toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  No Active Shift
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {!activeShift ? (
                <button
                  onClick={handleStartShift}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start Shift
                </button>
              ) : (
                <button
                  onClick={handleEndShift}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  End Shift
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search and Add */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search sales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        />
        {canManageSales() && (
          <button
            onClick={() => {
              if (!activeShift) {
                alert('Please start a shift before making sales');
                return;
              }
              resetForm();
              setShowModal(true);
            }}
            disabled={!activeShift}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={!activeShift ? 'Start a shift first' : 'Create new sale'}
          >
            New Sale
          </button>
        )}
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Served By
              </th>
              {canManageSales() && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No matching sales found' : 'No sales recorded. Create your first sale to get started.'}
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(sale.saleDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {sale.items?.length || 0} item(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${sale.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {sale.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {sale.servedBy}
                  </td>
                  {canManageSales() && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              New Sale
            </h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Sale Items */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sale Items
                    </label>
                    <button
                      type="button"
                      onClick={addSaleItem}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Item
                    </button>
                  </div>

                  {saleItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      No items added. Click "Add Item" to start.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {saleItems.map((item, index) => (
                        <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <select
                              value={item.productId ? inventory.find(inv => inv.productId === item.productId && inv.productType === item.productType)?.id || '' : ''}
                              onChange={(e) => updateSaleItem(index, 'productId', e.target.value)}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white text-sm"
                              required
                            >
                              <option value="">Select Product</option>
                              {inventory.map(inv => {
                                const details = [inv.brandName, inv.sizeName, inv.packagingName, inv.yearName]
                                  .filter(d => d && d !== 'N/A')
                                  .join(' ');
                                return (
                                  <option key={inv.id} value={inv.id}>
                                    {details}
                                  </option>
                                );
                              })}
                            </select>

                            <input
                              type="number"
                              placeholder="Quantity"
                              value={item.quantity}
                              onChange={(e) => updateSaleItem(index, 'quantity', e.target.value)}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white text-sm"
                              required
                              min="1"
                            />

                            <input
                              type="number"
                              placeholder="Unit Price"
                              value={item.unitPrice}
                              onChange={(e) => updateSaleItem(index, 'unitPrice', e.target.value)}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white text-sm"
                              required
                              min="0"
                              step="0.01"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeSaleItem(index)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                {saleItems.length > 0 && (
                  <div className="flex justify-end">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      Total: ${calculateTotal().toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Sale Info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.saleDate}
                      onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                      <option value="MOBILE">Mobile Money</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Served By
                    </label>
                    <input
                      type="text"
                      value={formData.servedBy}
                      onChange={(e) => setFormData({ ...formData, servedBy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  disabled={saving || saleItems.length === 0}
                >
                  {saving ? 'Processing...' : 'Complete Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shift Management Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {shiftAction === 'start' ? 'Start Shift' : 'End Shift'}
            </h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Show last shift verification for start shift */}
            {shiftAction === 'start' && lastClosedShift && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                  Previous Shift Handover
                </h3>
                <div className="text-sm text-blue-800 dark:text-blue-400">
                  <p>Last shift ended: {new Date(lastClosedShift.shiftEnd).toLocaleString()}</p>
                  <p>Closing Cash: ${lastClosedShift.closingCash?.toFixed(2)}</p>
                  <p className="text-xs mt-1">Verify the opening values match what you found</p>
                </div>
              </div>
            )}

            <form onSubmit={handleShiftSubmit}>
              <div className="space-y-4">
                {/* Cash Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {shiftAction === 'start' ? 'Opening Cash' : 'Closing Cash'}
                  </label>
                  <input
                    type="number"
                    value={shiftAction === 'start' ? shiftFormData.openingCash : shiftFormData.closingCash}
                    onChange={(e) => setShiftFormData({ 
                      ...shiftFormData, 
                      [shiftAction === 'start' ? 'openingCash' : 'closingCash']: e.target.value 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Stock Items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {shiftAction === 'start' ? 'Opening Stock' : 'Closing Stock'}
                  </h3>
                  <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                            Product
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {shiftFormData.stockItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                              {item.productName}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={shiftAction === 'start' ? item.openingQuantity : item.closingQuantity}
                                onChange={(e) => updateShiftStockItem(
                                  index, 
                                  shiftAction === 'start' ? 'openingQuantity' : 'closingQuantity', 
                                  e.target.value
                                )}
                                className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                                required
                                min="0"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes (for end shift) */}
                {shiftAction === 'end' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={shiftFormData.notes}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      rows="3"
                      placeholder="Any issues or notes about this shift..."
                    />
                  </div>
                )}

                {/* Shift Summary (for end shift) */}
                {shiftAction === 'end' && activeShift && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Shift Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Opening Cash:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          ${activeShift.openingCash?.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Total Sales:</span>
                        <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                          ${activeShift.totalSales?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Total Expenses:</span>
                        <span className="ml-2 font-medium text-red-600 dark:text-red-400">
                          ${activeShift.totalExpenses?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Expected Cash:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          ${(parseFloat(activeShift.openingCash) + parseFloat(activeShift.totalSales || 0) - parseFloat(activeShift.totalExpenses || 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowShiftModal(false);
                    resetShiftForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Processing...' : shiftAction === 'start' ? 'Start Shift' : 'End Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarSales;
