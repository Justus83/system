import { useState, useEffect } from 'react';
import { storesAPI, shopTypesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManageStores = () => {
  const { user, userStores, selectedStore: currentStore } = useAuth();
  const [userRole, setUserRole] = useState(null);
  
  // Get the user's role from store access data
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id) return;
      
      try {
        // Import the API here to avoid circular imports
        const { storeAccessAPI } = await import('../services/api');
        const response = await storeAccessAPI.getStoreAccessByUser(user.id);
        
        if (response.data && response.data.length > 0) {
          // Get the role from the first store access record
          // Since this is for store management, we assume OWNER role applies to all stores
          const role = response.data[0].role;
          setUserRole(role);
          console.log('ManageStores - Fetched user role:', role);
        }
      } catch (err) {
        console.error('Failed to fetch user role:', err);
      }
    };
    
    fetchUserRole();
  }, [user?.id]);
  
  // Debug: Log user role
  console.log('ManageStores - Current user role:', userRole);
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [storeForm, setStoreForm] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    shopType: ''
  });
  const [shops, setShops] = useState([]);
  const [storeLoading, setStoreLoading] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    fetchShops();
    fetchStores();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await shopTypesAPI.getShopTypes();
      setShops(response.data);
      if (response.data.length > 0) {
        setStoreForm(prev => ({ ...prev, shopType: response.data[0].shopType }));
      }
    } catch (err) {
      console.error('Failed to fetch shops:', err);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await storesAPI.getStores();
      setStores(response.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setStoreLoading(true);
    
    try {
      if (selectedStore) {
        await storesAPI.updateStore(selectedStore.id, storeForm);
        setMessage({ type: 'success', text: 'Store updated successfully' });
      } else {
        const response = await storesAPI.createStore(storeForm);
        const newStoreId = response.data.id;
        
        localStorage.setItem('storeId', String(newStoreId));
        localStorage.setItem('hasStoreAccess', 'true');
        
        setMessage({ type: 'success', text: 'Store created successfully! Refreshing page...' });
        setStoreForm({
          name: '',
          address: '',
          phoneNumber: '',
          email: '',
          shopType: shops[0]?.shopType || ''
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
      setShowStoreModal(false);
      fetchStores();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save store' });
    } finally {
      setStoreLoading(false);
    }
  };

  const handleDeleteStore = async (storeId) => {
    // Check if user is OWNER
    if (userRole !== 'OWNER') {
      setMessage({ 
        type: 'error', 
        text: 'Only store owners can delete stores.' 
      });
      return;
    }

    if (!window.confirm('Are you sure you want to delete this store? This will permanently delete the store and ALL related data including employees, products, sales, and transactions. This action cannot be undone.')) {
      return;
    }

    setMessage({ type: '', text: '' });
    try {
      await storesAPI.deleteStore(storeId);
      setMessage({ type: 'success', text: 'Store and all related data deleted successfully' });
      fetchStores();
    } catch (err) {
      console.error('Delete store error:', err);
      
      // Check if it's a foreign key constraint error
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete store';
      
      if (errorMessage.includes('foreign key constraint') || 
          errorMessage.includes('Cannot delete or update a parent row') ||
          errorMessage.includes('store_access')) {
        setMessage({ 
          type: 'error', 
          text: 'Database configuration error: The backend needs to be updated to support cascade delete. Please contact your system administrator to enable cascade delete for store deletion.' 
        });
      } else {
        setMessage({ type: 'error', text: errorMessage });
      }
    }
  };

  const openStoreModal = (store = null) => {
    if (store) {
      setSelectedStore(store);
      setStoreForm({
        name: store.name || '',
        address: store.address || '',
        phoneNumber: store.phoneNumber || '',
        email: store.email || '',
        shopType: store.shopType || shops[0]?.shopType || ''
      });
    } else {
      setSelectedStore(null);
      setStoreForm({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        shopType: shops[0]?.shopType || ''
      });
    }
    setShowStoreModal(true);
  };

  const filteredStores = stores.filter(store => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      (store.name || '').toLowerCase().includes(search) ||
      (store.address || '').toLowerCase().includes(search) ||
      (store.shopType || '').toLowerCase().includes(search) ||
      (store.phoneNumber || '').toLowerCase().includes(search) ||
      (store.email || '').toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Stores</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search stores by name, address, shop type, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button onClick={() => openStoreModal()} className="btn-primary flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Store
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Store Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Shop Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStores.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No stores</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery ? 'No stores match your search.' : 'Get started by creating a new store.'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {store.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {store.address || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {store.shopType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {store.phoneNumber || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {store.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                    <button
                      onClick={() => openStoreModal(store)}
                      className="p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {/* Debug: Show button for all users but with different styling */}
                    <button
                      onClick={() => handleDeleteStore(store.id)}
                      className={`p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors ${
                        userRole === 'OWNER' 
                          ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      title={userRole === 'OWNER' ? 'Delete Store (Owner Only)' : `Delete disabled - Role: ${userRole || 'Unknown'}`}
                      disabled={userRole !== 'OWNER'}
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

      {/* Store Modal */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedStore ? 'View/Edit Store' : 'Add New Store'}
              </h3>
              <button
                onClick={() => setShowStoreModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleStoreSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={storeForm.phoneNumber}
                  onChange={(e) => setStoreForm({ ...storeForm, phoneNumber: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={storeForm.email}
                  onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Shop Type *
                </label>
                <select
                  value={storeForm.shopType}
                  onChange={(e) => setStoreForm({ ...storeForm, shopType: e.target.value })}
                  className="input-field"
                  required
                >
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.shopType}>
                      {shop.shopTypeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowStoreModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={storeLoading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {storeLoading ? 'Saving...' : selectedStore ? 'Update Store' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStores;
