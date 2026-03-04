import React, { useState, useEffect } from 'react';
import { productsAPI, customersAPI, salesAPI, storeAccessAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProductModal, ProductTable } from '../components/shared';

// Helper function to format storage size (e.g., "GB_128" -> "128GB", "TB_1" -> "1TB")
const formatStorageSize = (storageSize) => {
  if (!storageSize) return '-';
  const parts = storageSize.split('_');
  if (parts.length === 2) {
    return `${parts[1]}${parts[0]}`;
  }
  return storageSize.replace(/_/g, ' ');
};

// Helper function to format RAM size (e.g., "GB_8" -> "8GB")
const formatRamSize = (ramSize) => {
  if (!ramSize) return '-';
  const parts = ramSize.split('_');
  if (parts.length === 2) {
    return `${parts[1]}${parts[0]}`;
  }
  return ramSize.replace(/_/g, ' ');
};

const ElectronicSale = () => {
  const { user, selectedStore } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showEditSaleModal, setShowEditSaleModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const searchLower = productSearchTerm.toLowerCase();
    return (
      (product.model || product.name || '').toLowerCase().includes(searchLower) ||
      (product.brand || '').toLowerCase().includes(searchLower) ||
      (product.serialNumber || '').toLowerCase().includes(searchLower)
    );
  });
  const [saleData, setSaleData] = useState({
    productId: '',
    customerId: '',
    newCustomer: {
      name: '',
      phone: ''
    },
    date: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    amountPaid: 0,
    paymentMethod: 'CASH',
    quantity: 1
  });
  const [editSaleData, setEditSaleData] = useState({
    productId: '',
    customerId: '',
    totalAmount: 0,
    amountPaid: 0,
    paymentMethod: 'CASH'
  });
  const [editSelectedProduct, setEditSelectedProduct] = useState(null);
  const [editProductSearchTerm, setEditProductSearchTerm] = useState('');
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editNewCustomer, setEditNewCustomer] = useState({ name: '', phone: '' });
  
  // Filter products for edit modal based on search term
  const filteredEditProducts = products.filter(product => {
    const searchLower = editProductSearchTerm.toLowerCase();
    return (
      (product.model || product.name || '').toLowerCase().includes(searchLower) ||
      (product.brand || '').toLowerCase().includes(searchLower) ||
      (product.serialNumber || '').toLowerCase().includes(searchLower)
    );
  });
  
  const [errors, setErrors] = useState({});
  const [salesSearchTerm, setSalesSearchTerm] = useState('');

  useEffect(() => {
    if (selectedStore) {
      setLoading(false);
    }
  }, [selectedStore]);

  useEffect(() => {
    if (selectedStore) {
      fetchProducts();
      fetchCustomers();
      fetchSales();
    }
  }, [selectedStore]);

  const fetchProducts = async () => {
    if (!selectedStore) return;
    
    try {
      setLoading(true);
      console.log('Fetching products for store:', selectedStore.id);
      
      const [smartphones, laptops, tablets, smartwatches, tvs, accessories] = await Promise.all([
        productsAPI.getSmartphonesByStore(selectedStore.id).then(res => {
          console.log('Smartphones fetched:', res.data?.length || 0);
          return res.data;
        }).catch(err => {
          console.error('Error fetching smartphones:', err);
          return [];
        }),
        productsAPI.getLaptopsByStore(selectedStore.id).then(res => {
          console.log('Laptops fetched:', res.data?.length || 0);
          return res.data;
        }).catch(err => {
          console.error('Error fetching laptops:', err);
          return [];
        }),
        productsAPI.getTabletsByStore(selectedStore.id).then(res => {
          console.log('Tablets fetched:', res.data?.length || 0);
          return res.data;
        }).catch(err => {
          console.error('Error fetching tablets:', err);
          return [];
        }),
        productsAPI.getSmartwatchesByStore(selectedStore.id).then(res => {
          console.log('Smartwatches fetched:', res.data?.length || 0);
          return res.data;
        }).catch(err => {
          console.error('Error fetching smartwatches:', err);
          return [];
        }),
        productsAPI.getTVsByStore(selectedStore.id).then(res => {
          console.log('TVs fetched:', res.data?.length || 0);
          return res.data;
        }).catch(err => {
          console.error('Error fetching TVs:', err);
          return [];
        }),
        productsAPI.getAccessoriesByStore(selectedStore.id).then(res => {
          console.log('Accessories fetched:', res.data?.length || 0);
          return res.data;
        }).catch(err => {
          console.error('Error fetching accessories:', err);
          return [];
        })
      ]);
      
      // Filter only products with AVAILABLE status (accessories don't have status field in DTO)
      const availableSmartphones = smartphones.filter(p => p.status === 'AVAILABLE');
      const availableLaptops = laptops.filter(p => p.status === 'AVAILABLE');
      const availableTablets = tablets.filter(p => p.status === 'AVAILABLE');
      const availableSmartwatches = smartwatches.filter(p => p.status === 'AVAILABLE');
      const availableTvs = tvs.filter(p => p.status === 'AVAILABLE');
      // Accessories don't have status field, include all with quantity > 0
      const availableAccessories = accessories.filter(p => p.quantity > 0);
      
      console.log('Available products:', {
        smartphones: availableSmartphones.length,
        laptops: availableLaptops.length,
        tablets: availableTablets.length,
        smartwatches: availableSmartwatches.length,
        tvs: availableTvs.length,
        accessories: availableAccessories.length
      });
      
      const allProducts = [
        ...availableSmartphones.map(p => ({ ...p, type: 'SMARTPHONE' })),
        ...availableLaptops.map(p => ({ ...p, type: 'LAPTOP' })),
        ...availableTablets.map(p => ({ ...p, type: 'TABLET' })),
        ...availableSmartwatches.map(p => ({ ...p, type: 'SMARTWATCH' })),
        ...availableTvs.map(p => ({ ...p, type: 'TV' })),
        ...availableAccessories.map(p => ({ 
          ...p, 
          type: 'ACCESSORY',
          // Map accessory fields to match expected structure
          model: p.category || 'Accessory',
          serialNumber: p.id?.toString() || 'N/A',
          storageSize: null,
          color: null,
          ramSize: null
        }))
      ];
      
      console.log('Total available products:', allProducts.length);
      setProducts(allProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    if (!selectedStore) return;
    
    try {
      const response = await customersAPI.getCustomersByStore(selectedStore.id);
      console.log('Customers fetched:', response.data);
      
      // Remove duplicates based on customer ID
      const uniqueCustomers = response.data.filter((customer, index, self) =>
        index === self.findIndex((c) => c.id === customer.id)
      );
      
      console.log('Unique customers:', uniqueCustomers.length, 'out of', response.data.length);
      setCustomers(uniqueCustomers);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const fetchSales = async () => {
    if (!selectedStore) return;
    
    try {
      const response = await salesAPI.getSalesByStore(selectedStore.id);
      setSales(response.data);
    } catch (err) {
      console.error('Failed to fetch sales:', err);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSaleData(prev => ({
      ...prev,
      productId: product.id,
      totalAmount: 0,
      quantity: product.type === 'ACCESSORY' ? 1 : 1
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert number fields to numbers
    if (name === 'totalAmount' || name === 'amountPaid' || name === 'quantity') {
      setSaleData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setSaleData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    // Convert number fields to numbers
    if (name === 'totalAmount' || name === 'amountPaid') {
      setEditSaleData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setEditSaleData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setSaleData(prev => ({
      ...prev,
      newCustomer: { ...prev.newCustomer, [name]: value }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!saleData.productId) {
      newErrors.productId = 'Please select a product';
    }
    
    if (!saleData.customerId && (!saleData.newCustomer.name || !saleData.newCustomer.phone)) {
      newErrors.customer = 'Please select a customer or add a new one';
    }
    
    if (saleData.amountPaid > saleData.totalAmount) {
      newErrors.amountPaid = 'Amount paid cannot exceed total amount';
    }
    
    if (saleData.amountPaid < 0) {
      newErrors.amountPaid = 'Amount paid cannot be negative';
    }
    
    if (selectedProduct?.type === 'ACCESSORY') {
      if (saleData.quantity < 1) {
        newErrors.quantity = 'Quantity must be at least 1';
      }
      if (saleData.quantity > selectedProduct.quantity) {
        newErrors.quantity = `Only ${selectedProduct.quantity} available in stock`;
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    
    return true;
  };

  const handleSubmitSale = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      let customerId = saleData.customerId;
      
      // Create new customer if needed
      if (!customerId) {
        const customerResponse = await customersAPI.createCustomer({
          name: saleData.newCustomer.name,
          phoneNumber: saleData.newCustomer.phone,
          storeId: selectedStore.id
        });
        customerId = customerResponse.data.id;
      }
      
      const salePayload = {
        electronicProductId: saleData.productId,
        customerId,
        storeId: selectedStore.id,
        branchId: null,
        salePrice: saleData.totalAmount,
        quantity: selectedProduct?.type === 'ACCESSORY' ? saleData.quantity : 1,
        totalAmount: saleData.totalAmount,
        amountPaid: saleData.amountPaid,
        paymentMethod: saleData.paymentMethod === 'CARD' ? 'CREDIT_CARD' : saleData.paymentMethod
      };
      
      await salesAPI.createSale(salePayload);
      fetchSales(); // Refresh the sales list
      fetchProducts(); // Refresh products list to update quantities
      
      // Reset form data
      setSaleData({
        productId: '',
        customerId: '',
        newCustomer: {
          name: '',
          phone: ''
        },
        date: new Date().toISOString().split('T')[0],
        totalAmount: 0,
        amountPaid: 0,
        paymentMethod: 'CASH',
        quantity: 1
      });
      setSelectedProduct(null);
      setProductSearchTerm('');
      setErrors({});
      setShowSaleModal(false); // Close the modal
    } catch (err) {
      console.error('Failed to create sale:', err);
      alert('Failed to process sale. Please try again.');
    }
  };

  const handleEditSale = (sale) => {
    setEditingSale(sale);
    setEditSelectedProduct(null);
    setEditProductSearchTerm('');
    setEditSaleData({
      productId: sale.electronicProductId || '',
      customerId: sale.customerId || '',
      totalAmount: parseFloat(sale.totalAmount) || 0,
      amountPaid: parseFloat(sale.amountPaid) || 0,
      paymentMethod: sale.paymentMethod || 'CASH'
    });
    setShowEditSaleModal(true);
  };

  const handleEditProductSelect = (product) => {
    setEditSelectedProduct(product);
    setEditSaleData(prev => ({
      ...prev,
      productId: product.id
    }));
  };

  const handleEditNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setEditNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEditCustomer = async (customerData) => {
    try {
      const customerPayload = {
        name: customerData.name,
        phoneNumber: customerData.phone,
        storeId: selectedStore.id
      };
      const response = await customersAPI.createCustomer(customerPayload);
      
      // Refresh customer list from server to avoid duplicates
      await fetchCustomers();
      
      setShowEditCustomerModal(false);
      setEditSaleData(prev => ({
        ...prev,
        customerId: response.data.id
      }));
    } catch (err) {
      console.error('Failed to create customer:', err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err.message?.includes('already exists')) {
        alert('A customer with this phone number already exists in your store.');
      } else {
        alert('Failed to create customer. Please try again.');
      }
    }
  };

  const handleUpdateSale = async (e) => {
    e.preventDefault();
    
    try {
      // Use new product/customer if selected, otherwise keep original
      const productId = editSaleData.productId || editingSale.electronicProductId;
      const customerId = editSaleData.customerId || editingSale.customerId;
      
      const updatePayload = {
        electronicProductId: productId,
        customerId: customerId,
        storeId: editingSale.storeId,
        branchId: editingSale.branchId,
        salePrice: editSaleData.totalAmount,
        quantity: editingSale.quantity || 1,
        totalAmount: editSaleData.totalAmount,
        amountPaid: editSaleData.amountPaid,
        paymentMethod: editSaleData.paymentMethod === 'CARD' ? 'CREDIT_CARD' : editSaleData.paymentMethod
      };
      
      await salesAPI.updateSale(editingSale.id, updatePayload);
      fetchSales();
      setShowEditSaleModal(false);
      setEditingSale(null);
      setEditSelectedProduct(null);
      setEditProductSearchTerm('');
    } catch (err) {
      console.error('Failed to update sale:', err);
      alert('Failed to update sale. Please try again.');
    }
  };

  const handleCreateCustomer = async (customerData) => {
    try {
      const customerPayload = {
        name: customerData.name,
        phoneNumber: customerData.phone,
        storeId: selectedStore.id
      };
      const response = await customersAPI.createCustomer(customerPayload);
      
      // Refresh customer list from server to avoid duplicates
      await fetchCustomers();
      
      setShowCustomerModal(false);
      setSaleData(prev => ({
        ...prev,
        customerId: response.data.id
      }));
    } catch (err) {
      console.error('Failed to create customer:', err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err.message?.includes('already exists')) {
        alert('A customer with this phone number already exists in your store.');
      } else {
        alert('Failed to create customer. Please try again.');
      }
    }
  };

  // Table columns for sales
  const salesColumns = [
    {
      key: 'date',
      title: 'Date',
    },
    {
      key: 'productName',
      title: 'Product',
    },
    {
      key: 'customerName',
      title: 'Customer',
    },
    {
      key: 'totalAmount',
      title: 'Selling Price',
      isPrice: true
    },
    {
      key: 'amountPaid',
      title: 'Amount Paid',
      isPrice: true
    },
    {
      key: 'balanceDue',
      title: 'Balance Due',
      isPrice: true
    }
  ];

  // Format sales data for table
  const formattedSales = sales
    .filter(sale => {
      const searchLower = salesSearchTerm.toLowerCase();
      return (
        (sale.productName || '').toLowerCase().includes(searchLower) ||
        (sale.productSerialNumber || '').toLowerCase().includes(searchLower) ||
        (sale.customerName || '').toLowerCase().includes(searchLower)
      );
    })
    .map(sale => ({
      ...sale,
      date: sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : 'N/A',
      productName: sale.productName || 'N/A',
      customerName: sale.customerName || 'N/A',
      totalAmount: `UGX ${(sale.totalAmount || 0).toLocaleString()}`,
      amountPaid: `UGX ${(sale.amountPaid || 0).toLocaleString()}`,
      balanceDue: sale.balanceDue != null ? `UGX ${sale.balanceDue.toLocaleString()}` : 'UGX 0'
    }));

  // Handle delete sale
  const handleDeleteSale = async (saleId) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await salesAPI.deleteSale(saleId);
        fetchSales(); // Refresh the sales list
      } catch (err) {
        console.error('Failed to delete sale:', err);
        alert('Failed to delete sale. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product, serial number, or customer..."
          value={salesSearchTerm}
          onChange={(e) => setSalesSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          onClick={() => {
            // Reset form data when opening modal
            setSaleData({
              productId: '',
              customerId: '',
              newCustomer: {
                name: '',
                phone: ''
              },
              date: new Date().toISOString().split('T')[0],
              totalAmount: 0,
              amountPaid: 0,
              paymentMethod: 'CASH',
              quantity: 1
            });
            setSelectedProduct(null);
            setProductSearchTerm('');
            setErrors({});
            setShowSaleModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
        >
          Add New Sale
        </button>
      </div>

      {/* Sales Table */}
      <ProductTable
        columns={salesColumns}
        data={formattedSales}
        emptyMessage="No sales records found"
        onEdit={handleEditSale}
        onDelete={handleDeleteSale}
      />

      {/* Add Sale Modal */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Sale</h2>
              <button 
                onClick={() => setShowSaleModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitSale}>
              {/* Product Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product *
                </label>
                {selectedProduct ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        {selectedProduct.type === 'ACCESSORY' ? (
                          <>
                            <p className="font-medium text-gray-900 dark:text-white">
                              <span className="font-bold">Category:</span> {selectedProduct.category}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-bold">Brand:</span> {selectedProduct.brand}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-gray-900 dark:text-white">
                              <span className="font-bold">Model:</span> {selectedProduct.model}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-bold">Storage:</span> {formatStorageSize(selectedProduct.storageSize)}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-bold">Color:</span> {selectedProduct.color}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-bold">RAM:</span> {formatRamSize(selectedProduct.ramSize)}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-bold">Serial Number:</span> {selectedProduct.serialNumber}
                            </p>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(null)}
                        className="text-red-600 dark:text-red-400"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowProductModal(true)}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-left"
                    >
                      Select Product
                    </button>
                    {errors.productId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.productId}</p>
                    )}
                  </>
                )}
              </div>

              {/* Quantity field for accessories */}
              {selectedProduct?.type === 'ACCESSORY' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity * (Available: {selectedProduct.quantity})
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={saleData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    min="1"
                    max={selectedProduct.quantity}
                    required
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
                  )}
                </div>
              )}

              {/* Customer Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer *
                </label>
                <select
                  name="customerId"
                  value={saleData.customerId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm mb-2"
                >
                  <option value="">Select existing customer</option>
                  {customers.map(c => (
                    <option key={`customer-${c.id}`} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <p className="text-center my-2 text-gray-500 dark:text-gray-400">OR</p>

                <button
                  type="button"
                  onClick={() => setShowCustomerModal(true)}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md mb-2"
                >
                  Add New Customer
                </button>

                {saleData.customerId === '' && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Customer Name"
                        value={saleData.newCustomer.name}
                        onChange={handleNewCustomerChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={saleData.newCustomer.phone}
                        onChange={handleNewCustomerChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                    </div>
                  </div>
                )}

                {errors.customer && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer}</p>
                )}
              </div>

              {/* Sale Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={saleData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Amount (UGX)
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={saleData.totalAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    min="0"
                    step="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount Paid (UGX)
                  </label>
                  <input
                    type="number"
                    name="amountPaid"
                    value={saleData.amountPaid}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    min="0"
                    step="1"
                    required
                  />
                  {errors.amountPaid && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.amountPaid}</p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={saleData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Complete Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sale Modal */}
      {showEditSaleModal && editingSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Sale</h2>
              <button 
                onClick={() => {
                  setShowEditSaleModal(false);
                  setEditingSale(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpdateSale}>
              {/* Product Selection - Editable */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product *
                </label>
                {editSelectedProduct ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        {editSelectedProduct.type === 'ACCESSORY' ? (
                          <>
                            <p className="font-medium text-gray-900 dark:text-white">
                              <span className="font-bold">Category:</span> {editSelectedProduct.category}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-bold">Brand:</span> {editSelectedProduct.brand}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-gray-900 dark:text-white">
                              <span className="font-bold">Model:</span> {editSelectedProduct.model}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-bold">Storage:</span> {formatStorageSize(editSelectedProduct.storageSize)}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-bold">Color:</span> {editSelectedProduct.color}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-bold">RAM:</span> {formatRamSize(editSelectedProduct.ramSize)}
                            </p>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditSelectedProduct(null)}
                        className="text-red-600 dark:text-red-400"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Current: <span className="font-bold">{editingSale.productName}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setEditProductSearchTerm(' ')}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-left"
                    >
                      Change Product
                    </button>
                  </div>
                )}
              </div>

              {/* Customer Selection - Editable */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer *
                </label>
                <select
                  name="customerId"
                  value={editSaleData.customerId}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm mb-2"
                >
                  <option value="">Select customer</option>
                  {customers.map(c => (
                    <option key={`edit-customer-${c.id}`} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current: <span className="font-medium">{editingSale.customerName}</span>
                </p>
              </div>

              {/* Sale Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Amount (UGX)
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={editSaleData.totalAmount}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    min="0"
                    step="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount Paid (UGX)
                  </label>
                  <input
                    type="number"
                    name="amountPaid"
                    value={editSaleData.amountPaid}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={editSaleData.paymentMethod}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditSaleModal(false);
                    setEditingSale(null);
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Selection Modal */}
      {editProductSearchTerm !== '' && !editSelectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Select New Product</h2>
              <button 
                onClick={() => {
                  setEditProductSearchTerm('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by serial number, model, brand..."
                value={editProductSearchTerm}
                onChange={(e) => setEditProductSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>
            
            {/* Product List - Scrollable dropdown */}
            <div className="overflow-y-auto max-h-[60vh] border border-gray-200 dark:border-gray-600 rounded-md">
              {filteredEditProducts.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No available products found
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Serial/ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Model/Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Storage</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Color</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">RAM/Qty</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredEditProducts.map((product) => (
                      <tr 
                        key={`edit-${product.type}-${product.id}`}
                        onClick={() => {
                          handleEditProductSelect(product);
                          setEditProductSearchTerm('');
                        }}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.type}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">
                          {product.serialNumber}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                          {product.type === 'ACCESSORY' ? product.category : product.model}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.type === 'ACCESSORY' ? '-' : formatStorageSize(product.storageSize)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.type === 'ACCESSORY' ? '-' : product.color}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.type === 'ACCESSORY' ? `Qty: ${product.quantity}` : formatRamSize(product.ramSize)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Selection Modal with Searchable Dropdown */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Select Product</h2>
              <button 
                onClick={() => {
                  setShowProductModal(false);
                  setProductSearchTerm('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by serial number, model, brand..."
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>
            
            {/* Product List - Scrollable dropdown */}
            <div className="overflow-y-auto max-h-[60vh] border border-gray-200 dark:border-gray-600 rounded-md">
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No available products found
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Serial/ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Model/Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Storage</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Color</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">RAM/Qty</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredProducts.map((product) => (
                      <tr 
                        key={`${product.type}-${product.id}`}
                        onClick={() => {
                          handleProductSelect(product);
                          setShowProductModal(false);
                          setProductSearchTerm('');
                        }}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.type}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">
                          {product.serialNumber}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                          {product.type === 'ACCESSORY' ? product.category : product.model}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.type === 'ACCESSORY' ? '-' : formatStorageSize(product.storageSize)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.type === 'ACCESSORY' ? '-' : product.color}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {product.type === 'ACCESSORY' ? `Qty: ${product.quantity}` : formatRamSize(product.ramSize)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Creation Modal */}
      <ProductModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title="Add New Customer"
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'phone', label: 'Phone', type: 'tel', required: true }
        ]}
        initialData={{}}
        onSubmit={handleCreateCustomer}
      />
    </div>
  );
};

export default ElectronicSale;
