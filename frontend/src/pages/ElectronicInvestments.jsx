import { useState, useEffect } from 'react';
import { suppliersAPI, storeAccessAPI, shopsAPI, investmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Investments = () => {
  const { user, selectedStore } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'CASH',
    paymentDate: new Date().toISOString().split('T')[0]
  });
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    investmentDate: new Date().toISOString().split('T')[0],
    supplierId: '',
    productDetails: [{ productName: '', quantity: 1 }],
    totalAmount: '',
    amountPaid: '',
    productCondition: 'boxed',
  });

  useEffect(() => {
    if (selectedStore) {
      setLoading(false);
    }
  }, [selectedStore]);

  useEffect(() => {
    if (selectedStore) {
      fetchSuppliers();
      fetchShopInfo();
      fetchInvestments();
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

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getSuppliers();
      setSuppliers(response.data || []);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const fetchInvestments = async () => {
    if (!selectedStore) return;
    
    try {
      const response = await investmentsAPI.getInvestmentsByStore(selectedStore.id);
      setInvestments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch investments:', err);
      setError('Failed to load investments');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.productDetails];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setFormData(prev => ({ ...prev, productDetails: updatedProducts }));
  };

  const addProductRow = () => {
    setFormData(prev => ({
      ...prev,
      productDetails: [...prev.productDetails, { productName: '', quantity: 1 }]
    }));
  };

  const removeProductRow = (index) => {
    if (formData.productDetails.length > 1) {
      const updatedProducts = formData.productDetails.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, productDetails: updatedProducts }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    try {
      const investmentData = {
        invoiceNumber: formData.invoiceNumber,
        investmentDate: new Date(formData.investmentDate).toISOString(),
        supplierId: parseInt(formData.supplierId),
        productDetails: JSON.stringify(formData.productDetails.filter(p => p.productName)),
        totalAmount: parseFloat(formData.totalAmount),
        amountPaid: parseFloat(formData.amountPaid) || 0,
        productCondition: formData.productCondition,
        storeId: selectedStore.id,
      };
      
      if (editingInvestment) {
        await investmentsAPI.updateInvestment(editingInvestment.id, investmentData);
        setSuccessMsg('Investment updated successfully!');
      } else {
        await investmentsAPI.createInvestment(investmentData);
        setSuccessMsg('Investment recorded successfully!');
      }
      
      fetchInvestments();
      setShowModal(false);
      setEditingInvestment(null);
      setFormData({
        invoiceNumber: '',
        investmentDate: new Date().toISOString().split('T')[0],
        supplierId: '',
        productDetails: [{ productName: '', quantity: 1 }],
        totalAmount: '',
        amountPaid: '',
        productCondition: 'boxed',
      });
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save investment');
    }
  };

  const handleEdit = (investment) => {
    setEditingInvestment(investment);
    setFormData({
      invoiceNumber: investment.invoiceNumber || '',
      investmentDate: investment.investmentDate ? investment.investmentDate.split('T')[0] : new Date().toISOString().split('T')[0],
      supplierId: investment.supplierId || '',
      productDetails: investment.productDetails ? JSON.parse(investment.productDetails) : [{ productName: '', quantity: 1 }],
      totalAmount: investment.totalAmount || '',
      amountPaid: investment.amountPaid || '',
      productCondition: investment.productCondition || 'boxed',
    });
    setShowModal(true);
  };

  const handleDelete = async (investmentId) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      try {
        await investmentsAPI.deleteInvestment(investmentId);
        setSuccessMsg('Investment deleted successfully!');
        fetchInvestments();
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete investment');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleAddPayment = (investment) => {
    setSelectedInvestment(investment);
    setPaymentData({
      amount: investment.balance || '',
      paymentMethod: 'CASH',
      paymentDate: new Date().toISOString().split('T')[0]
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      await investmentsAPI.addPayment(
        selectedInvestment.id,
        parseFloat(paymentData.amount),
        paymentData.paymentMethod
      );
      setSuccessMsg('Payment added successfully!');
      fetchInvestments();
      setShowPaymentModal(false);
      setSelectedInvestment(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add payment');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setEditingInvestment(null);
    setError('');
    setSuccessMsg('');
    setFormData({
      invoiceNumber: '',
      investmentDate: new Date().toISOString().split('T')[0],
      supplierId: '',
      productDetails: [{ productName: '', quantity: 1 }],
      totalAmount: '',
      amountPaid: '',
      productCondition: 'boxed',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingInvestment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pageTitle = shopInfo ? `${shopInfo.shopTypeName} Investments` : 'Investments';

  const filteredInvestments = investments.filter(investment => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      (investment.invoiceNumber || '').toLowerCase().includes(search) ||
      (investment.supplierName || '').toLowerCase().includes(search) ||
      (investment.productDetails || '').toLowerCase().includes(search)
    );
  });

  if (loading && !selectedStore) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{pageTitle}</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search investments by invoice number, supplier, or product details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button onClick={openModal} className="btn-primary flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Investment</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-4">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvestments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No investments</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {searchQuery ? 'No investments match your search.' : 'Get started by creating a new investment.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInvestments.map((investment) => (
                  <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      {investment.invoiceNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {investment.investmentDate ? new Date(investment.investmentDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {investment.supplierName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      UGX {investment.totalAmount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      UGX {investment.amountPaid?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      UGX {investment.balance?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                      <button
                        onClick={() => handleEdit(investment)}
                        className="p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(investment.id)}
                        className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      {investment.balance > 0 && (
                        <button
                          onClick={() => handleAddPayment(investment)}
                          className="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                          title="Add Payment"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {editingInvestment ? 'Edit Investment' : 'New Investment'}
                  </h3>

                  {/* Invoice Number and Date */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Invoice Number
                      </label>
                      <input
                        type="text"
                        name="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={handleChange}
                        className="input-field w-full"
                        placeholder="INV-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Investment Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="investmentDate"
                        value={formData.investmentDate}
                        onChange={handleChange}
                        required
                        className="input-field w-full"
                      />
                    </div>
                  </div>

                  {/* Supplier */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="supplierId"
                      value={formData.supplierId}
                      onChange={handleChange}
                      required
                      className="input-field w-full"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product Condition */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Condition <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="productCondition"
                          value="boxed"
                          checked={formData.productCondition === 'boxed'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Boxed
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="productCondition"
                          value="used"
                          checked={formData.productCondition === 'used'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Used
                      </label>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Products <span className="text-red-500">*</span>
                    </label>
                    {formData.productDetails.map((product, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={product.productName}
                          onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                          className="input-field flex-1"
                          placeholder="Product name"
                          required
                        />
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                          className="input-field w-24"
                          min="1"
                          required
                        />
                        {formData.productDetails.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProductRow(index)}
                            className="p-2 text-red-600 hover:text-red-900"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addProductRow}
                      className="text-primary-600 hover:text-primary-900 text-sm"
                    >
                      + Add Product
                    </button>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total Amount (UGX) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={handleChange}
                        required
                        className="input-field w-full"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Amount Paid (UGX)
                      </label>
                      <input
                        type="number"
                        name="amountPaid"
                        value={formData.amountPaid}
                        onChange={handleChange}
                        className="input-field w-full"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary w-full sm:w-auto sm:ml-3">
                    {editingInvestment ? 'Update Investment' : 'Add Investment'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedInvestment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowPaymentModal(false)}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handlePaymentSubmit}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center mb-4">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Add Payment
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Invoice: {selectedInvestment.invoiceNumber || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        UGX {selectedInvestment.totalAmount?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Already Paid:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        UGX {selectedInvestment.amountPaid?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Balance Due:</span>
                      <span className="font-bold text-red-600 dark:text-red-400">
                        UGX {selectedInvestment.balance?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment Amount (UGX) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={paymentData.amount}
                      onChange={handlePaymentChange}
                      required
                      min="0.01"
                      max={selectedInvestment.balance}
                      step="0.01"
                      className="input-field w-full"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={paymentData.paymentDate}
                      onChange={handlePaymentChange}
                      required
                      className="input-field w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="paymentMethod"
                      value={paymentData.paymentMethod}
                      onChange={handlePaymentChange}
                      required
                      className="input-field w-full"
                    >
                      <option value="CASH">Cash</option>
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="MOBILE_MONEY">Mobile Money</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CHECK">Check</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary w-full sm:w-auto sm:ml-3">
                    Add Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
