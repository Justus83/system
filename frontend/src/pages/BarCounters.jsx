import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { countersAPI } from '../services/api';
import { SearchBar, ProductTable, ProductModal } from '../components/shared';

const BarCounters = () => {
  const { selectedStore, user } = useAuth();
  const [counters, setCounters] = useState([]);
  const [filteredCounters, setFilteredCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCounter, setEditingCounter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCounters();
  }, [selectedStore]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCounters(counters);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = counters.filter(counter =>
      counter.name?.toLowerCase().includes(term) ||
      counter.description?.toLowerCase().includes(term)
    );
    setFilteredCounters(filtered);
  }, [searchTerm, counters]);

  const fetchCounters = async () => {
    if (!selectedStore) return;
    
    setLoading(true);
    try {
      const response = await countersAPI.getCountersByStore(selectedStore.id);
      setCounters(response.data);
      setFilteredCounters(response.data);
    } catch (error) {
      console.error('Error fetching counters:', error);
      setError('Failed to fetch counters');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    setError('');
    try {
      const dataToSubmit = {
        ...data,
        storeId: selectedStore.id,
      };

      if (editingCounter) {
        await countersAPI.updateCounter(editingCounter.id, dataToSubmit);
      } else {
        await countersAPI.createCounter(dataToSubmit);
      }

      setShowModal(false);
      resetForm();
      fetchCounters();
    } catch (error) {
      console.error('Error saving counter:', error);
      setError('Error saving counter: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (counter) => {
    setEditingCounter(counter);
    setFormData({
      name: counter.name || '',
      description: counter.description || '',
      isActive: counter.isActive !== undefined ? counter.isActive : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this counter? This will also delete all inventory records for this counter.')) return;
    
    try {
      await countersAPI.deleteCounter(id);
      fetchCounters();
    } catch (error) {
      console.error('Error deleting counter:', error);
      alert('Error deleting counter: ' + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true,
    });
    setEditingCounter(null);
    setError('');
  };

  const canManageCounters = () => {
    if (!user?.role) return true;
    const allowedRoles = ['OWNER', 'ADMIN', 'MANAGER', 'STORE_MANAGER'];
    return allowedRoles.includes(user.role);
  };

  const columns = [
    { key: 'name', title: 'Counter Name', isPrimary: true },
    { key: 'description', title: 'Description' },
    { 
      key: 'isActive', 
      title: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  const formFields = [
    { 
      name: 'name', 
      label: 'Counter Name', 
      type: 'text', 
      required: true, 
      placeholder: 'e.g., Main Bar, VIP Lounge, Poolside Bar'
    },
    { 
      name: 'description', 
      label: 'Description', 
      type: 'textarea', 
      required: false, 
      placeholder: 'Optional description'
    },
    { 
      name: 'isActive', 
      label: 'Active', 
      type: 'checkbox', 
      required: false 
    },
  ];

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Counter Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your bar counters/locations for inventory tracking
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search counters..."
        onAddClick={() => {
          resetForm();
          setShowModal(true);
        }}
        addButtonText="Add Counter"
        showAddButton={canManageCounters()}
      />

      <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <ProductTable
          columns={columns}
          data={filteredCounters}
          emptyMessage="No counters found. Add your first counter to start tracking inventory."
          searchQuery={searchTerm}
          onEdit={canManageCounters() ? handleEdit : null}
          onDelete={canManageCounters() ? handleDelete : null}
          actions={true}
        />
      </div>

      <ProductModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        title={`${editingCounter ? 'Edit' : 'Add'} Counter`}
        fields={formFields}
        initialData={formData}
        saving={saving}
        error={error}
      />
    </div>
  );
};

export default BarCounters;
