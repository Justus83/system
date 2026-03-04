import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, storeAccessAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasStoreAccess, setHasStoreAccess] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [shopType, setShopType] = useState(null);
  const [userStores, setUserStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const storeAccess = localStorage.getItem('hasStoreAccess');
    const savedStoreId = localStorage.getItem('storeId');
    const savedBranchId = localStorage.getItem('branchId');
    const savedShopType = localStorage.getItem('shopType');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setHasStoreAccess(storeAccess === 'true');
        setStoreId(savedStoreId ? parseInt(savedStoreId) : null);
        setBranchId(savedBranchId ? parseInt(savedBranchId) : null);
        setShopType(savedShopType);
        
        // Fetch user stores if authenticated
        if (storeAccess === 'true' && parsedUser) {
          fetchUserStores(parsedUser.id);
        }
      } catch (error) {
        // If there's an error parsing user data, clear everything
        console.error('Error loading user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('hasStoreAccess');
        localStorage.removeItem('storeId');
        localStorage.removeItem('branchId');
        localStorage.removeItem('shopType');
        localStorage.removeItem('selectedStore');
      }
    }
    setLoading(false);
  }, []);

  const fetchUserStores = async (userId) => {
    try {
      const response = await storeAccessAPI.getStoreAccessByUser(userId);
      if (response.data && response.data.length > 0) {
        const storeData = response.data.map(sa => sa.store).filter(Boolean);
        setUserStores(storeData);
        
        // Set the selected store
        const savedSelectedStore = localStorage.getItem('selectedStore');
        let storeToSelect = null;
        
        if (savedSelectedStore) {
          try {
            const parsedStore = JSON.parse(savedSelectedStore);
            const foundStore = storeData.find(store => store.id === parsedStore.id);
            storeToSelect = foundStore || storeData[0];
          } catch (err) {
            storeToSelect = storeData[0];
          }
        } else {
          storeToSelect = storeData[0];
        }
        
        if (storeToSelect) {
          setSelectedStore(storeToSelect);
          localStorage.setItem('selectedStore', JSON.stringify(storeToSelect));
          // Update shopType from selected store
          if (storeToSelect?.shop?.shopType) {
            setShopType(storeToSelect.shop.shopType);
            localStorage.setItem('shopType', storeToSelect.shop.shopType);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch user stores:', err);
    }
  };

  const selectStore = (store) => {
    setSelectedStore(store);
    localStorage.setItem('selectedStore', JSON.stringify(store));
    // Update shopType when store changes
    if (store?.shop?.shopType) {
      setShopType(store.shop.shopType);
      localStorage.setItem('shopType', store.shop.shopType);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: userData, hasStoreAccess: storeAccess, storeId: userStoreId, branchId: userBranchId, shopType: userShopType } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('hasStoreAccess', String(storeAccess));
      if (userStoreId) localStorage.setItem('storeId', String(userStoreId));
      if (userBranchId) localStorage.setItem('branchId', String(userBranchId));
      if (userShopType) localStorage.setItem('shopType', userShopType);
      
      setUser(userData);
      setHasStoreAccess(storeAccess);
      setStoreId(userStoreId);
      setBranchId(userBranchId);
      setShopType(userShopType);
      
      // Fetch user stores after successful login
      if (storeAccess && userData) {
        fetchUserStores(userData.id);
      }
      
      return { success: true, hasStoreAccess: storeAccess, shopType: userShopType };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      // Don't auto-login after registration - user should login manually
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hasStoreAccess');
    localStorage.removeItem('storeId');
    localStorage.removeItem('branchId');
    localStorage.removeItem('shopType');
    localStorage.removeItem('selectedStore');
    setUser(null);
    setHasStoreAccess(false);
    setStoreId(null);
    setBranchId(null);
    setShopType(null);
    setUserStores([]);
    setSelectedStore(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasStoreAccess,
    setHasStoreAccess,
    storeId,
    branchId,
    shopType,
    userStores,
    selectedStore,
    setStoreId,
    setBranchId,
    setShopType,
    fetchUserStores,
    selectStore,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
