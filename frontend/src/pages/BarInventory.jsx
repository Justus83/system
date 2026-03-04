import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { inventoryAPI, countersAPI, barProductsAPI } from '../services/api';

const BarInventory = () => {
  const { selectedStore, user } = useAuth();
  const [counters, setCounters] = useState([]);
  const [selectedCounter, setSelectedCounter] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [productType, setProductType] = useState('beer');
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    productType: 'BEER',
    quantity: 0,
  });

  useEffect(() => {
    fetchCounters();
  }, [selectedStore]);

  useEffect(() => {
    if (selectedCounter) {
      fetchInventory();
    }
  }, [selectedCounter]);

  useEffect(() => {
    fetchProducts();
  }, [selectedStore, productType]);

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

  const fetchInventory = async () => {
    if (!selectedCounter) return;
    
    setLoading(true);
    try {
      const response = await inventoryAPI.getInventoryByCounter(selectedCounter.id);
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!selectedStore) return;
    
    try {
      let productsRes;
      if (productType === 'beer') {
        productsRes = await barProductsAPI.getBeersByStore(selectedStore.id);
      } else if (productType === 'spirit') {
        productsRes = await barProductsAPI.getSpiritsByStore(selectedStore.id);
      } else if (productType === 'wine') {
        productsRes = await barProductsAPI.getWinesByStore(selectedStore.id);
      } else if (productType === 'champagne') {
        productsRes = await barProductsAPI.getChampagnesByStore(selectedStore.id);
      } else if (productType === 'juice') {
        productsRes = await barProductsAPI.getJuicesByStore(selectedStore.id);
      } else {
        productsRes = await barProductsAPI.getSoftDrinksByStore(selectedStore.id);
      }
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const dataToSubmit = {
        counterId: selectedCounter.id,
        productId: formData.productId,
        productType: formData.productType,
        quantity: parseInt(formData.quantity),
      };

      if (editingItem) {
        await inventoryAPI.updateInventory(editingItem.id, dataToSubmit);
      } else {
        await inventoryAPI.createInventory(dataToSubmit);
      }

      setShowModal(false);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error('Error saving inventory:', error);
      setError('Error saving inventory: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleAdjustStock = async (item, adjustment) => {
    try {
      await inventoryAPI.adjustInventory(item.id, adjustment);
      fetchInventory();
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Error adjusting stock: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
    
    try {
      await inventoryAPI.deleteInventory(id);
      fetchInventory();
    } catch (error) {
      console.error('Error deleting inventory:', error);
      alert('Error deleting inventory');
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      productType: 'BEER',
      quantity: 0,
    });
    setEditingItem(null);
    setError('');
    setProductType('beer');
  };

  const canManageInventory = () => {
    if (!user?.role) return true;
    const allowedRoles = ['OWNER', 'ADMIN', 'BRANCH_MANAGER', 'MANAGER', 'STORE_MANAGER'];
    return allowedRoles.includes(user.role);
  };

  const getProductDisplay = (item) => {
    // Use productName from backend if available
    if (item.productName) {
      return item.productName;
    }
    
    // Fallback to productDetails if it exists (for backward compatibility)
    if (item.productDetails) {
      if (item.productType === 'BEER') {
        return `${item.productDetails?.brandName} - ${item.productDetails?.sizeName} (${item.productDetails?.packagingName})`;
      } else if (item.productType === 'SPIRIT' || item.productType === 'WINE') {
        return `${item.productDetails?.typeName} - ${item.productDetails?.brandName} - ${item.productDetails?.sizeName}`;
      } else if (item.productType === 'CHAMPAGNE' || item.productType === 'JUICE') {
        return `${item.productDetails?.brandName} - ${item.productDetails?.sizeName || 'N/A'}`;
      } else {
        return `${item.productDetails?.typeName} - ${item.productDetails?.brandName || 'N/A'}`;
      }
    }
    
    return 'Unknown Product';
  };

  const filteredInventory = inventory.filter(item => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.brandName && item.brandName.toLowerCase().includes(term)) ||
      (item.sizeName && item.sizeName.toLowerCase().includes(term)) ||
      (item.packagingName && item.packagingName.toLowerCase().includes(term)) ||
      (item.yearName && item.yearName.toLowerCase().includes(term)) ||
      (item.productType && item.productType.toLowerCase().includes(term))
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
          <p className="text-sm mt-1">Please create at least one counter in Counter Management before managing inventory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track stock levels for each counter
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

      {/* Search and Add */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        />
        {canManageInventory() && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Stock
          </button>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Packaging
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Quantity
              </th>
              {canManageInventory() && (
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
            ) : filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No matching inventory items found' : 'No inventory items. Add stock to get started.'}
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.brandName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.sizeName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.packagingName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.yearName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      item.quantity <= 5 
                        ? 'text-red-600 dark:text-red-400' 
                        : item.quantity <= 10 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {item.quantity}
                    </span>
                  </td>
                  {canManageInventory() && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAdjustStock(item, -1)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Decrease quantity"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item, 1)}
                          className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Increase quantity"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setFormData({
                              productId: item.productId,
                              productType: item.productType,
                              quantity: item.quantity,
                            });
                            setProductType(item.productType.toLowerCase());
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingItem ? 'Edit' : 'Add'} Inventory
            </h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product Type
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => {
                      setProductType(e.target.value);
                      setFormData({
                        ...formData,
                        productType: e.target.value.toUpperCase(),
                        productId: '',
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    disabled={editingItem}
                  >
                    <option value="beer">Beer</option>
                    <option value="spirit">Spirit</option>
                    <option value="wine">Wine</option>
                    <option value="champagne">Champagne</option>
                    <option value="juice">Juice</option>
                    <option value="softdrink">Soft Drink</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                    disabled={editingItem}
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {productType === 'beer' 
                          ? `${product.brandName} - ${product.sizeName} (${product.packagingName})`
                          : productType === 'spirit' || productType === 'wine'
                          ? `${product.typeName} - ${product.brandName} - ${product.sizeName}`
                          : productType === 'champagne' || productType === 'juice'
                          ? `${product.brandName} - ${product.sizeName || 'N/A'}`
                          : `${product.typeName} - ${product.brandName || 'N/A'}`
                        }
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                    min="0"
                  />
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
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarInventory;
