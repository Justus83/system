import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { branchesAPI } from '../services/api';

const ManageBranches = () => {
  const { user, selectedStore, userStores } = useAuth();
  const [message, setMessage] = useState({ type: '', text: '' });
  const [branches, setBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchForm, setBranchForm] = useState({
    location: '',
    phoneNumber: '',
    email: '',
    storeId: ''
  });
  const [branchLoading, setBranchLoading] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const messageTimeoutRef = useRef(null);

  // Clear message timeout when component unmounts
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // No need to fetch stores here anymore, they're managed in AuthContext
  }, []);

  // Fetch branches when selected store changes
  useEffect(() => {
    if (selectedStore) {
      fetchBranches();
      setBranchForm(prev => ({ ...prev, storeId: selectedStore.id }));
    }
  }, [selectedStore]);

  const fetchBranches = async () => {
    if (!selectedStore) return;
    
    try {
      // Fetch branches only for the selected store
      const response = await branchesAPI.getBranchesByStore(selectedStore.id);
      const branchesWithStore = response.data.map(branch => ({ ...branch, store: selectedStore }));
      setBranches(branchesWithStore);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    }
  };

  const setMessageWithTimeout = (messageObj, timeout = 3000) => {
    // Clear any existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    
    setMessage(messageObj);
    
    // Set new timeout
    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ type: '', text: '' });
      messageTimeoutRef.current = null;
    }, timeout);
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setBranchLoading(true);
    
    try {
      if (selectedBranch) {
        await branchesAPI.updateBranch(selectedBranch.id, branchForm);
        setMessageWithTimeout({ type: 'success', text: 'Branch updated successfully' });
      } else {
        await branchesAPI.createBranch(branchForm);
        setMessageWithTimeout({ type: 'success', text: 'Branch created successfully' });
        setBranchForm({
          location: '',
          phoneNumber: '',
          email: '',
          storeId: selectedStore?.id || ''
        });
      }
      setShowBranchModal(false);
      fetchBranches();
    } catch (err) {
      setMessageWithTimeout({ type: 'error', text: err.response?.data?.message || 'Failed to save branch' }, 5000);
    } finally {
      setBranchLoading(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!window.confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      return;
    }

    try {
      await branchesAPI.deleteBranch(branchId);
      setMessageWithTimeout({ type: 'success', text: 'Branch deleted successfully' });
      fetchBranches();
    } catch (err) {
      setMessageWithTimeout({ type: 'error', text: err.response?.data?.message || 'Failed to delete branch' }, 5000);
    }
  };

  const openBranchModal = (branch = null) => {
    if (branch) {
      setSelectedBranch(branch);
      setBranchForm({
        location: branch.location || '',
        phoneNumber: branch.phoneNumber || '',
        email: branch.email || '',
        storeId: branch.storeId || selectedStore?.id || ''
      });
    } else {
      setSelectedBranch(null);
      setBranchForm({
        location: '',
        phoneNumber: '',
        email: '',
        storeId: selectedStore?.id || ''
      });
    }
    setShowBranchModal(true);
  };

  const filteredBranches = branches.filter(branch => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      (branch.location || '').toLowerCase().includes(search) ||
      (branch.phoneNumber || '').toLowerCase().includes(search) ||
      (branch.email || '').toLowerCase().includes(search) ||
      (branch.store?.name || '').toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Branches</h1>
      
      {message.text && (
        <div className={`mb-4 p-4 rounded-lg flex items-center justify-between ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          <span>{message.text}</span>
          <button
            onClick={() => {
              if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
                messageTimeoutRef.current = null;
              }
              setMessage({ type: '', text: '' });
            }}
            className="ml-4 text-current hover:opacity-70 transition-opacity"
            title="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Branches
          </h2>
          {branches.length > 0 && (
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search branches by location, phone, email, or store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={() => openBranchModal()}
                disabled={!selectedStore}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Branch
              </button>
            </div>
          )}
        </div>

        {!selectedStore ? (
          <div className="card text-center py-8">
            <p className="text-yellow-600 dark:text-yellow-400 mb-4">
              You need to select a store first before managing branches.
            </p>
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery ? 'No branches match your search.' : 'No branches found'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => openBranchModal()}
                className="btn-primary inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Branch
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBranches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {branch.location || 'No location'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {branch.store?.name || 'Unknown store'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {branch.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {branch.phoneNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openBranchModal(branch)}
                          className="p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteBranch(branch.id)}
                          className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedBranch ? 'View/Edit Branch' : 'Add New Branch'}
              </h3>
              <button
                onClick={() => setShowBranchModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleBranchSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={branchForm.location}
                  onChange={(e) => setBranchForm({ ...branchForm, location: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={branchForm.phoneNumber}
                  onChange={(e) => setBranchForm({ ...branchForm, phoneNumber: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={branchForm.email}
                  onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                  className="input-field"
                  placeholder="branch@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store
                </label>
                <input
                  type="text"
                  value={selectedStore?.name || ''}
                  disabled
                  className="input-field bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={branchLoading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {branchLoading ? 'Saving...' : selectedBranch ? 'Update Branch' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBranches;
