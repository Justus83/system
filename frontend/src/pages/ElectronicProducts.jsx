import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, storeAccessAPI, shopsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProductTable, TabNavigation, SearchBar, ProductModal } from '../components/shared';
import ProductDetailsModal from '../components/products/ProductDetailsModal';

const ElectronicProducts = () => {
  const { user, selectedStore, branchId } = useAuth();
  const [searchParams] = useSearchParams();
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = searchParams.get('tab');
    return tabFromUrl || 'smartphones';
  });
  const [products, setProducts] = useState({
    smartphones: [],
    laptops: [],
    tablets: [],
    smartwatches: [],
    tvs: [],
    accessories: [],
  });

  // Update activeTab when URL params change
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Auto-dismiss error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (selectedStore) {
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

  const fetchProducts = async () => {
    if (!selectedStore) return;
    
    try {
      setLoading(true);
      const [smartphones, laptops, tablets, smartwatches, tvs, accessories] = await Promise.all([
        productsAPI.getSmartphonesByStore(selectedStore.id).then(res => res.data).catch(() => []),
        productsAPI.getLaptopsByStore(selectedStore.id).then(res => res.data).catch(() => []),
        productsAPI.getTabletsByStore(selectedStore.id).then(res => res.data).catch(() => []),
        productsAPI.getSmartwatchesByStore(selectedStore.id).then(res => res.data).catch(() => []),
        productsAPI.getTVsByStore(selectedStore.id).then(res => res.data).catch(() => []),
        productsAPI.getAccessoriesByStore(selectedStore.id).then(res => res.data).catch(() => []),
      ]);
      
      setProducts({
        smartphones,
        laptops,
        tablets,
        smartwatches,
        tvs,
        accessories,
      });
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const getProductCount = (category) => products[category].length;

  const getTotalCount = () => 
    Object.values(products).reduce((sum, arr) => sum + arr.length, 0);

  const handleEdit = async (product) => {
    try {
      console.log('Fetching full product details for ID:', product.id);
      
      // Fetch full product details from the detailed endpoint
      const token = localStorage.getItem('token');
      let endpoint;
      
      switch (activeTab) {
        case 'smartphones':
          endpoint = `/api/smartphones/${product.id}`;
          break;
        case 'laptops':
          endpoint = `/api/laptops/${product.id}`;
          break;
        case 'tablets':
          endpoint = `/api/tablets/${product.id}`;
          break;
        case 'smartwatches':
          endpoint = `/api/smartwatches/${product.id}`;
          break;
        case 'tvs':
          endpoint = `/api/tvs/${product.id}`;
          break;
        case 'accessories':
          endpoint = `/api/accessories/${product.id}`;
          break;
        default:
          endpoint = `/api/smartphones/${product.id}`;
      }
      
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const fullProduct = await response.json();
        console.log('Full product details (raw):', fullProduct);
        
        // Ensure enums are loaded before setting form data
        await fetchEnums();
        
        // Build form data based on product type
        const baseFormData = {
          id: fullProduct.id,
        };

        // Add product-specific fields
        if (activeTab === 'accessories') {
          baseFormData.brand = fullProduct.brand;
          baseFormData.category = fullProduct.category || fullProduct.name;
          baseFormData.quantity = fullProduct.quantity || 1;
          baseFormData.sourceType = fullProduct.sourceType || 'SUPPLIER';
          baseFormData.supplierId = fullProduct.supplierId || '';
          baseFormData.otherSourceName = fullProduct.otherSourceName || '';
          baseFormData.otherSourcePhoneNumber = fullProduct.otherSourcePhoneNumber || '';
        } else {
          baseFormData.brand = fullProduct.brand;
          baseFormData.model = fullProduct.model;
          baseFormData.serialNumber = fullProduct.serialNumber;
          baseFormData.color = fullProduct.color;
          baseFormData.costPrice = fullProduct.costPrice;
          baseFormData.sourceType = fullProduct.sourceType || 'SUPPLIER';
          baseFormData.supplierId = fullProduct.supplierId || '';
          baseFormData.sourceName = fullProduct.otherSourceName || '';
          baseFormData.sourcePhone = fullProduct.otherSourcePhoneNumber || '';
        }

        // Add product-specific fields
        if (['smartphones', 'laptops', 'tablets'].includes(activeTab)) {
          console.log('Full product - storageSize:', fullProduct.storageSize);
          console.log('Full product - ramSize:', fullProduct.ramSize);
          
          const normalizedStorageSize = fullProduct.storageSize?.toUpperCase();
          const normalizedRamSize = fullProduct.ramSize?.toUpperCase();
          
          console.log('Looking for storage:', normalizedStorageSize, 'in:', enumOptions.storage);
          console.log('Looking for RAM:', normalizedRamSize, 'in:', enumOptions.ram);

          const storageOption = enumOptions.storage.find(s => 
            s.name.toUpperCase() === normalizedStorageSize ||
            s.displayName.toUpperCase() === normalizedStorageSize?.replace('_', '') ||
            new RegExp(`^${normalizedStorageSize?.replace('_', '')}`, 'i').test(s.displayName)
          );

          const ramOption = enumOptions.ram.find(r => 
            r.name.toUpperCase() === normalizedRamSize ||
            r.displayName.toUpperCase() === normalizedRamSize?.replace('_', '') ||
            new RegExp(`^${normalizedRamSize?.replace('_', '')}`, 'i').test(r.displayName)
          );

          console.log('Storage match:', storageOption);
          console.log('RAM match:', ramOption);

          baseFormData.storageSize = storageOption?.name || fullProduct.storageSize || '';
          baseFormData.ramSize = ramOption?.name || fullProduct.ramSize || '';
        } else if (activeTab === 'smartwatches') {
          baseFormData.caseSizeMM = fullProduct.caseSizeMM || '';
        } else if (activeTab === 'tvs') {
          baseFormData.screenSize = fullProduct.screenSize || '';
          baseFormData.resolution = fullProduct.resolution || '';
          baseFormData.tvType = fullProduct.tvType || '';
          baseFormData.color = fullProduct.color || '';
        }
        
        setFormData(baseFormData);
        setShowAddModal(true);
      } else {
        console.error('Failed to fetch full product details');
        // Fallback to using the partial data
        const fallbackData = {};

        if (activeTab === 'accessories') {
          fallbackData.brand = product.brand;
          fallbackData.category = product.category || product.name;
          fallbackData.quantity = product.quantity || 1;
          fallbackData.sourceType = product.sourceType || 'SUPPLIER';
          fallbackData.supplierId = product.supplierId || '';
          fallbackData.otherSourceName = product.otherSourceName || '';
          fallbackData.otherSourcePhoneNumber = product.otherSourcePhoneNumber || '';
        } else {
          fallbackData.brand = product.brand;
          fallbackData.model = product.model;
          fallbackData.serialNumber = product.serialNumber;
          fallbackData.color = product.color || '';
          fallbackData.costPrice = product.costPrice || '';
          fallbackData.sourceType = product.sourceType || 'SUPPLIER';
          fallbackData.supplierId = product.supplierId || '';
          fallbackData.sourceName = product.otherSourceName || '';
          fallbackData.sourcePhone = product.otherSourcePhoneNumber || '';
        }

        if (['smartphones', 'laptops', 'tablets'].includes(activeTab)) {
          fallbackData.storageSize = product.storageSize || '';
          fallbackData.ramSize = product.ramSize || '';
        } else if (activeTab === 'smartwatches') {
          fallbackData.caseSizeMM = product.caseSizeMM || '';
        } else if (activeTab === 'tvs') {
          fallbackData.screenSize = product.screenSize || '';
          fallbackData.resolution = product.resolution || '';
          fallbackData.tvType = product.tvType || '';
          fallbackData.color = product.color || '';
        }
        
        setFormData(fallbackData);
        setShowAddModal(true);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
      // Fallback to using the partial data
      const fallbackData = {};

      if (activeTab === 'accessories') {
        fallbackData.brand = product.brand;
        fallbackData.category = product.category || product.name;
        fallbackData.quantity = product.quantity || 1;
        fallbackData.sourceType = product.sourceType || 'SUPPLIER';
        fallbackData.supplierId = product.supplierId || '';
        fallbackData.otherSourceName = product.otherSourceName || '';
        fallbackData.otherSourcePhoneNumber = product.otherSourcePhoneNumber || '';
      } else {
        fallbackData.brand = product.brand;
        fallbackData.model = product.model;
        fallbackData.serialNumber = product.serialNumber;
        fallbackData.color = product.color || '';
        fallbackData.costPrice = product.costPrice || '';
        fallbackData.sourceType = product.sourceType || 'SUPPLIER';
        fallbackData.supplierId = product.supplierId || '';
        fallbackData.sourceName = product.otherSourceName || '';
        fallbackData.sourcePhone = product.otherSourcePhoneNumber || '';
      }

      if (['smartphones', 'laptops', 'tablets'].includes(activeTab)) {
        fallbackData.storageSize = product.storageSize || '';
        fallbackData.ramSize = product.ramSize || '';
      } else if (activeTab === 'smartwatches') {
        fallbackData.caseSizeMM = product.caseSizeMM || '';
      } else if (activeTab === 'tvs') {
        fallbackData.screenSize = product.screenSize || '';
        fallbackData.resolution = product.resolution || '';
        fallbackData.tvType = product.tvType || '';
        fallbackData.color = product.color || '';
      }
      
      setFormData(fallbackData);
      setShowAddModal(true);
    }
  };

  // Get delete API method based on product type
  const getDeleteMethod = (productType) => {
    const deleteMethods = {
      smartphones: productsAPI.deleteSmartphone,
      laptops: productsAPI.deleteLaptop,
      tablets: productsAPI.deleteTablet,
      smartwatches: productsAPI.deleteSmartwatch,
      tvs: productsAPI.deleteTV,
      accessories: productsAPI.deleteAccessory,
    };
    return deleteMethods[productType] || productsAPI.deleteSmartphone;
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const deleteMethod = getDeleteMethod(activeTab);
        await deleteMethod(productId);
        
        // Refresh the product list after successful deletion
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete product:', err);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleEnumAdded = (enumType) => {
    // Refresh enums when a new one is added
    fetchEnums();
  };

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
const [enumOptions, setEnumOptions] = useState({
    brands: [],
    storage: [],
    ram: [],
    colors: [],
    models: [],
    sources: [],
    screenSizes: [],
    resolutions: [],
    tvTypes: [],
    conditions: []
  });

  // Form state
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    serialNumber: '',
    storageSize: '',
    ramSize: '',
    color: '',
    productCondition: 'NEW',
    costPrice: '',
    sourceType: 'SUPPLIER',
    supplierId: '',
    sourceName: '',
    sourcePhone: '',
    otherSourceName: '',
    otherSourcePhoneNumber: '',
    caseSizeMM: '',
    screenSize: '',
    resolution: '',
    tvType: '',
    name: '',
    category: '',
    quantity: 1,
  });

  useEffect(() => {
    fetchEnums();
  }, []);

const fetchEnums = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
const [brandsRes, storageRes, ramRes, colorRes, modelRes, sourceRes, screenSizeRes, resolutionRes, tvTypeRes, conditionRes] = await Promise.all([
        fetch(`http://localhost:5001/api/enums/brands?storeId=${selectedStore?.id}`, { headers }),
        fetch(`http://localhost:5001/api/enums/storage-sizes?storeId=${selectedStore?.id}`, { headers }),
        fetch(`http://localhost:5001/api/enums/ram-sizes?storeId=${selectedStore?.id}`, { headers }),
        fetch(`http://localhost:5001/api/enums/colors?storeId=${selectedStore?.id}`, { headers }),
        fetch(`http://localhost:5001/api/enums/models?storeId=${selectedStore?.id}`, { headers }),
        fetch('http://localhost:5001/api/enums/source-types', { headers }),
        fetch(`http://localhost:5001/api/enums/screen-sizes?storeId=${selectedStore?.id}`, { headers }),
        fetch(`http://localhost:5001/api/enums/resolutions?storeId=${selectedStore?.id}`, { headers }),
        fetch(`http://localhost:5001/api/enums/tv-types?storeId=${selectedStore?.id}`, { headers }),
        fetch('http://localhost:5001/api/enums/product-conditions', { headers })
      ]);
      
      const brands = brandsRes.ok ? await brandsRes.json() : [];
      const storage = storageRes.ok ? await storageRes.json() : [];
      const ram = ramRes.ok ? await ramRes.json() : [];
      const colors = colorRes.ok ? await colorRes.json() : [];
      const models = modelRes.ok ? await modelRes.json() : [];
      const sources = sourceRes.ok ? await sourceRes.json() : [];
      const screenSizes = screenSizeRes.ok ? await screenSizeRes.json() : [];
      const resolutions = resolutionRes.ok ? await resolutionRes.json() : [];
      const tvTypes = tvTypeRes.ok ? await tvTypeRes.json() : [];
      const conditions = conditionRes.ok ? await conditionRes.json() : [];
      
      console.log('Storage size enum values:', JSON.stringify(storage, null, 2));
      console.log('RAM size enum values:', JSON.stringify(ram, null, 2));
      
      setEnumOptions({ brands, storage, ram, colors, models, sources, screenSizes, resolutions, tvTypes, conditions });
    } catch (err) {
      console.error('Failed to fetch enums:', err);
    }
  };

  useEffect(() => {
    if (showAddModal) {
      // Only fetch data when modal is opening, not when closing
      fetchEnums();
      fetchSuppliers();
    }
  }, [showAddModal]);

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/suppliers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        setSuppliers([]);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
      setSuppliers([]);
    }
  };

  // Get API endpoint based on product type
  const getApiEndpoint = (productType) => {
    const endpoints = {
      smartphones: '/api/smartphones',
      laptops: '/api/laptops',
      tablets: '/api/tablets',
      smartwatches: '/api/smartwatches',
      tvs: '/api/tvs',
      accessories: '/api/accessories',
    };
    return endpoints[productType] || '/api/smartphones';
  };

  // Helper function to clean display names (remove underscores and dashes)
  const cleanDisplayName = (value) => {
    if (!value) return '';
    return value
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\bGB\b/g, 'GB')
      .replace(/\bTB\b/g, 'TB');
  };

  // Build payload based on product type
// Helper function to convert display names to enum names (e.g., "1TB" -> "TB_1", "16GB" -> "GB_16")
  // Also handles incorrectly formatted enum names (e.g., "1TB_" -> "TB_1")
  const cleanEnumValue = (value) => {
    if (typeof value !== 'string') return value;
    
    // If already in correct enum format (e.g., "TB_1", "GB_16"), return as is
    // Also handle trailing underscore variants like "GB_256_" or "TB_1_"
    if ((value.startsWith('TB_') || value.startsWith('GB_'))) {
      // Remove trailing underscore if present and return
      return value.replace(/_$/, '');
    }
    
    // Handle incorrectly formatted enum names (e.g., "256GB_" -> "GB_256", "1TB_" -> "TB_1")
    // These have the number first, then the unit with trailing underscore
    if (value.endsWith('_')) {
      const baseValue = value.slice(0, -1); // Remove trailing underscore
      
      // Check for patterns like "256GB" or "1TB" (number + unit without underscore)
      if (baseValue.includes('TB')) {
        const numberPart = baseValue.replace('TB', '').replace(/\D/g, '');
        return 'TB_' + numberPart;
      }
      if (baseValue.includes('GB')) {
        const numberPart = baseValue.replace('GB', '').replace(/\D/g, '');
        return 'GB_' + numberPart;
      }
    }
    
    // Convert display name to enum name format (e.g., "1TB" -> "TB_1", "16GB" -> "GB_16")
    if (value.includes('TB') && !value.includes('_')) {
      const numberPart = value.replace('TB', '').replace(/\D/g, '');
      return 'TB_' + numberPart;
    } else if (value.includes('GB') && !value.includes('_')) {
      const numberPart = value.replace('GB', '').replace(/\D/g, '');
      return 'GB_' + numberPart;
    }
    
    return value;
  };

  const buildPayload = (data, productType) => {
    // Handle accessories separately
    if (productType === 'accessories') {
      return {
        id: data.id, // Include id for updates
        brand: data.brand,
        category: data.category,
        quantity: parseInt(data.quantity) || 1,
        storeId: selectedStore.id,
        branchId: branchId, // Use logged-in user's branch
        sourceType: data.sourceType,
        supplierId: data.sourceType === 'SUPPLIER' ? parseInt(data.supplierId) : null,
        otherSourceName: data.sourceType === 'OTHER' ? data.otherSourceName : null,
        otherSourcePhoneNumber: data.sourceType === 'OTHER' ? data.otherSourcePhoneNumber : null,
      };
    }

    // For all other products
    const basePayload = {
      id: data.id, // Include id for updates
      brand: data.brand,
      model: data.model,
      serialNumber: data.serialNumber,
      color: data.color,
      costPrice: parseFloat(data.costPrice) || 0,
      storeId: selectedStore.id,
      sourceType: data.sourceType,
      supplierId: data.sourceType === 'SUPPLIER' ? parseInt(data.supplierId) : null,
      otherSourceName: data.sourceType !== 'SUPPLIER' ? data.sourceName : null,
      otherSourcePhoneNumber: data.sourceType !== 'SUPPLIER' ? data.sourcePhone : null,
    };

    // Add product-specific fields
    if (['smartphones', 'laptops', 'tablets'].includes(productType)) {
      basePayload.storageSize = data.storageSize;
      basePayload.ramSize = data.ramSize;
    } else if (productType === 'smartwatches') {
      basePayload.caseSizeMM = data.caseSizeMM ? parseInt(data.caseSizeMM) : null;
    } else if (productType === 'tvs') {
      basePayload.screenSize = data.screenSize;
      basePayload.resolution = data.resolution;
      basePayload.tvType = data.tvType;
      basePayload.color = data.color;
    }

    return basePayload;
  };

  const handleAddSubmit = async (data) => {
    setSaving(true);
    try {
      const endpoint = getApiEndpoint(activeTab);
      const payload = buildPayload(data, activeTab);
      
      // Check if we're editing an existing product
      const isEditing = !!data.id; // Check if we have an existing ID
      
      if (isEditing) {
        // Edit existing product (PUT request)
        const response = await fetch(`http://localhost:5001${endpoint}/${data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }
      } else {
        // Add new product (POST request)
        const response = await fetch(`http://localhost:5001${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }
      }
      
      setShowAddModal(false);
      setFormData({
        brand: '',
        model: '',
        serialNumber: '',
        storageSize: '',
        ramSize: '',
        color: '',
        costPrice: '',
        sourceType: 'SUPPLIER',
        supplierId: '',
        sourceName: '',
        sourcePhone: '',
        otherSourceName: '',
        otherSourcePhoneNumber: '',
        caseSizeMM: '',
        screenSize: '',
        resolution: '',
        tvType: '',
        name: '',
        category: '',
        quantity: 1,
      });
      
      // Force re-fetch of products by calling fetchProducts directly
      fetchProducts();
    } catch (err) {
      console.error('Failed to add/update product:', err);
      setError(err.message || 'Failed to add/update product');
    } finally {
      setSaving(false);
    }
  };

  // Table columns configuration - Unified for smartphones, laptops, tablets
  const getColumns = (productType) => {
    // Unified columns for smartphones, laptops, tablets: model, serial, RAM, storage, color, status
    const unifiedColumns = [
      { 
        key: 'model', 
        title: 'Model', 
        isPrimary: true,
        format: (value) => cleanDisplayName(value)
      },
      { key: 'serialNumber', title: 'Serial', isMono: true },
      { 
        key: 'ramSize', 
        title: 'RAM',
        format: (value) => cleanDisplayName(value)
      },
      { 
        key: 'storageSize', 
        title: 'Storage',
        format: (value) => cleanDisplayName(value)
      },
      { 
        key: 'color', 
        title: 'Color',
        format: (value) => cleanDisplayName(value)
      },
      { key: 'status', title: 'Status', isStatus: true },
    ];

    switch (productType) {
      case 'smartphones':
      case 'laptops':
      case 'tablets':
        return unifiedColumns;
      case 'smartwatches':
        return [
          { key: 'model', title: 'Model', isPrimary: true },
          { key: 'serialNumber', title: 'Serial', isMono: true },
          { key: 'caseSizeMM', title: 'Case Size (mm)' },
          { key: 'color', title: 'Color' },
          { key: 'status', title: 'Status', isStatus: true },
        ];
      case 'tvs':
        return [
          { key: 'model', title: 'Model', isPrimary: true },
          { key: 'serialNumber', title: 'Serial', isMono: true },
          { key: 'screenSize', title: 'Screen Size' },
          { key: 'resolution', title: 'Resolution' },
          { key: 'tvType', title: 'Type' },
          { key: 'color', title: 'Color' },
          { key: 'status', title: 'Status', isStatus: true },
        ];
      case 'accessories':
        return [
          { key: 'category', title: 'Category', isPrimary: true },
          { key: 'brand', title: 'Brand' },
          { key: 'quantity', title: 'Quantity' },
        ];
      default:
        return unifiedColumns;
    }
  };

  const tabs = [
    { id: 'smartphones', label: 'Smartphones', count: getProductCount('smartphones') },
    { id: 'laptops', label: 'Laptops', count: getProductCount('laptops') },
    { id: 'tablets', label: 'Tablets', count: getProductCount('tablets') },
    { id: 'smartwatches', label: 'Smartwatches', count: getProductCount('smartwatches') },
    { id: 'tvs', label: 'TVs', count: getProductCount('tvs') },
    { id: 'accessories', label: 'Accessories', count: getProductCount('accessories') },
  ];

  // Check if user can see/edit cost prices (only management roles)
  const canSeeCostPrice = () => {
    // If no role is set, default to true for backward compatibility
    if (!user?.role) return true;
    const allowedRoles = ['OWNER', 'ADMIN', 'BRANCH_MANAGER', 'MANAGER', 'STORE_MANAGER'];
    return allowedRoles.includes(user.role);
  };

  // Check if user can edit/delete products (only management roles)
  const canManageProducts = () => {
    // If no role is set, default to true for backward compatibility
    if (!user?.role) return true;
    const allowedRoles = ['OWNER', 'ADMIN', 'BRANCH_MANAGER', 'MANAGER', 'STORE_MANAGER'];
    return allowedRoles.includes(user.role);
  };

  const formFields = useMemo(() => {
    // For accessories, use different base fields
    if (activeTab === 'accessories') {
      return [
        { name: 'brand', label: 'Brand', type: 'select', required: true, placeholder: 'Select Brand',
          options: enumOptions.brands.map(b => ({ value: b.name, label: b.name })) },
        { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'Enter category (e.g., Charger, Case)' },
        { name: 'quantity', label: 'Quantity', type: 'number', required: true, placeholder: 'Enter quantity', min: 1 },
        { name: 'sourceType', label: 'Source Type', type: 'select', required: true, placeholder: 'Select Source',
          options: enumOptions.sources.map(s => ({ value: s.name, label: s.name })) },
        { name: 'supplierId', label: 'Supplier', type: 'select', required: false, placeholder: 'Select Supplier',
          options: suppliers.map(s => ({ value: s.id, label: s.name })) },
        { name: 'otherSourceName', label: 'Source Name', type: 'text', required: false },
        { name: 'otherSourcePhoneNumber', label: 'Source Phone', type: 'text', required: false }
      ];
    }

    // For all other products
    const baseFields = [
      { name: 'brand', label: 'Brand', type: 'select', required: true, placeholder: 'Select Brand',
        options: enumOptions.brands.map(b => ({ value: b.name, label: b.name })) },
      { name: 'model', label: 'Model', type: 'select', required: true, placeholder: 'Select Model',
        options: enumOptions.models.map(m => ({ value: m.name, label: m.name })) },
      { name: 'serialNumber', label: 'Serial Number', type: 'text', required: true },
      { name: 'color', label: 'Color', type: 'select', required: true, placeholder: 'Select Color',
        options: enumOptions.colors.map(c => ({ value: c.name, label: c.name })) },
      { name: 'productCondition', label: 'Condition', type: 'select', required: true, placeholder: 'Select Condition',
        options: enumOptions.conditions.map(c => ({ value: c.name, label: c.name })) },
    ];

    // Add product-specific fields
    if (['smartphones', 'laptops', 'tablets'].includes(activeTab)) {
      baseFields.push(
        { name: 'storageSize', label: 'Storage', type: 'select', required: true, placeholder: 'Select Storage',
          options: enumOptions.storage.map(s => ({ value: s.name, label: s.name })) },
        { name: 'ramSize', label: 'RAM', type: 'select', required: false, placeholder: 'Select RAM',
          options: enumOptions.ram.map(r => ({ value: r.name, label: r.name })) }
      );
    } else if (activeTab === 'smartwatches') {
      baseFields.push(
        { name: 'caseSizeMM', label: 'Case Size (mm)', type: 'number', required: false, placeholder: 'Enter case size' }
      );
    } else if (activeTab === 'tvs') {
      baseFields.push(
        { name: 'screenSize', label: 'Screen Size', type: 'select', required: true, placeholder: 'Select Screen Size',
          options: enumOptions.screenSizes.map(s => ({ value: s.name, label: s.name })) },
        { name: 'resolution', label: 'Resolution', type: 'select', required: false, placeholder: 'Select Resolution',
          options: enumOptions.resolutions.map(r => ({ value: r.name, label: r.name })) },
        { name: 'tvType', label: 'TV Type', type: 'select', required: true, placeholder: 'Select TV Type',
          options: enumOptions.tvTypes.map(t => ({ value: t.name, label: t.name })) }
      );
    }

    // Add cost price field only for OWNER and ADMIN roles
    if (canSeeCostPrice()) {
      baseFields.push(
        { name: 'costPrice', label: 'Cost Price', type: 'number', required: false, placeholder: 'Enter cost price' }
      );
    }

    // Add common fields for all products except accessories
    baseFields.push(
      { name: 'sourceType', label: 'Source Type', type: 'select', required: true, placeholder: 'Select Source',
        options: enumOptions.sources.map(s => ({ value: s.name, label: s.name })) },
      { name: 'supplierId', label: 'Supplier', type: 'select', required: false, placeholder: 'Select Supplier',
        options: suppliers.map(s => ({ value: s.id, label: s.name })) },
      { name: 'sourceName', label: 'Source Name', type: 'text', required: false },
      { name: 'sourcePhone', label: 'Source Phone', type: 'text', required: false }
    );

    return baseFields;
  }, [enumOptions, suppliers, activeTab, user?.role]);

  const pageTitle = shopInfo ? `${shopInfo.shopTypeName} Electronic Products` : 'Electronic Products';

  if (loading && !selectedStore) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search products..."
        onAddClick={() => setShowAddModal(true)}
        addButtonText={`Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/s$/, '')}`}
        showAddButton={canManageProducts()}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <ProductTable
            columns={getColumns(activeTab)}
            data={products[activeTab]}
            emptyMessage={`No ${activeTab} found`}
            searchQuery={searchQuery}
            onView={handleView}
            onEdit={canManageProducts() ? handleEdit : null}
            onDelete={canManageProducts() ? handleDelete : null}
            actions={true}
          />
        </div>
      )}

      <ProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setError(null);
        }}
        onSubmit={handleAddSubmit}
        title={`Add New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/s$/, '')}`}
        fields={formFields}
        initialData={formData}
        suppliers={suppliers}
        saving={saving}
        sourceType={formData.sourceType}
        onEnumAdded={handleEnumAdded}
        error={error}
        storeId={selectedStore?.id}
      />

      <ProductDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        productType={activeTab}
      />
    </div>
  );
};

export default ElectronicProducts;
