import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storesAPI, shopsAPI } from '../services/api';

const Setup = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    shopType: '',
  });
  const [shops, setShops] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, setHasStoreAccess, setStoreId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await shopsAPI.getShops();
        setShops(response.data);
        // Set default shop type
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, shopType: response.data[0].shopType }));
        }
      } catch (err) {
        console.error('Failed to fetch shops:', err);
      }
    };
    fetchShops();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create the store
      const response = await storesAPI.createStore(formData);
      
      // Update the hasStoreAccess state and storeId
      setHasStoreAccess(true);
      localStorage.setItem('hasStoreAccess', 'true');
      
      // Store the storeId if returned
      if (response.data && response.data.id) {
        setStoreId(response.data.id);
        localStorage.setItem('storeId', String(response.data.id));
      }
      
      // Navigate based on shop type
      if (formData.shopType === 'RENTALS') {
        navigate('/rental-dashboard');
      } else if (formData.shopType === 'ELECTRONICS') {
        navigate('/dashboard');
      } else {
        // Default to suppliers page for other shop types
        navigate('/suppliers');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              DY Tech UG
            </span>
          </div>
        </div>

        {/* Setup Card */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Set Up Your Store
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Welcome, {user?.name || 'User'}! Create your first store to get started.
          </p>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Store Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your store name"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter store address"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter store phone number"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter store email"
              />
            </div>

            <div>
              <label htmlFor="shopType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shop Type *
              </label>
              <select
                id="shopType"
                name="shopType"
                value={formData.shopType}
                onChange={handleChange}
                required
                className="input-field"
              >
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.shopType}>
                    {shop.shopTypeName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Store...
                </span>
              ) : (
                'Create Store'
              )}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            You will be assigned as the store owner with full access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Setup;
