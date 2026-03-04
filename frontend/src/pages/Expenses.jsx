import { useState, useEffect } from 'react';
import { expensesAPI, shopsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Expenses = () => {
  const { user, selectedStore } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [filter, setFilter] = useState('today');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [formData, setFormData] = useState({
    expenseDate: new Date().toISOString().split('T')[0],
    expenditure: '',
    amount: '',
    description: '',
    category: 'OTHER',
  });

  const expenseCategories = [
    { value: 'RENT', label: 'Rent' },
    { value: 'UTILITIES', label: 'Utilities' },
    { value: 'SALARIES', label: 'Salaries' },
    { value: 'TRANSPORT', label: 'Transport' },
    { value: 'SUPPLIES', label: 'Supplies' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'TAXES', label: 'Taxes' },
    { value: 'OTHER', label: 'Other' },
  ];

  useEffect(() => {
    if (selectedStore) {
      fetchExpenses();
    }
  }, [selectedStore, filter, customDate, startDate, endDate]);

  useEffect(() => {
    if (selectedStore) {
      fetchShopInfo();
    }
  }, [selectedStore]); // Only fetch shop info when store changes

  const fetchShopInfo = async () => {
    if (!selectedStore?.shop?.id) return;
    
    try {
      const shopResponse = await shopsAPI.getShop(selectedStore.shop.id);
      setShopInfo(shopResponse.data);
    } catch (err) {
      console.error('Failed to fetch shop info:', err);
    }
  };

  const fetchExpenses = async () => {
    if (!selectedStore) return;
    
    try {
      let response;
      const today = new Date().toISOString().split('T')[0];
      
      switch (filter) {
        case 'today':
          response = await expensesAPI.getExpensesByStoreAndDate(selectedStore.id, today);
          break;
        case 'daily':
          response = await expensesAPI.getExpensesByStoreAndDate(selectedStore.id, customDate);
          break;
        case 'weekly':
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          response = await expensesAPI.getExpensesByStoreAndDateRange(selectedStore.id, weekAgo, today);
          break;
        case 'monthly':
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          response = await expensesAPI.getExpensesByStoreAndDateRange(selectedStore.id, monthAgo, today);
          break;
        case 'yearly':
          const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
          response = await expensesAPI.getExpensesByStoreAndDateRange(selectedStore.id, yearStart, today);
          break;
        case 'custom':
          response = await expensesAPI.getExpensesByStoreAndDateRange(selectedStore.id, startDate, endDate);
          break;
        default:
          response = await expensesAPI.getExpensesByStore(selectedStore.id);
      }
      
      const expensesData = response.data || [];
      setExpenses(expensesData);
      
      // Calculate total
      const total = expensesData.reduce((sum, exp) => sum + (exp.amount || 0), 0);
      setTotalAmount(total);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      setError('Failed to load expenses');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    try {
      const expenseData = {
        expenseDate: formData.expenseDate,
        expenditure: formData.expenditure,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        storeId: selectedStore.id,
      };
      
      if (editingExpense) {
        await expensesAPI.updateExpense(editingExpense.id, expenseData);
        setSuccessMsg('Expense updated successfully!');
      } else {
        await expensesAPI.createExpense(expenseData);
        setSuccessMsg('Expense recorded successfully!');
      }
      
      setTimeout(() => {
        setShowModal(false);
        setEditingExpense(null);
        setFormData({
          expenseDate: new Date().toISOString().split('T')[0],
          expenditure: '',
          amount: '',
          description: '',
          category: 'OTHER',
        });
        fetchExpenses();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      expenseDate: expense.expenseDate ? expense.expenseDate.split('T')[0] : new Date().toISOString().split('T')[0],
      expenditure: expense.expenditure || '',
      amount: expense.amount || '',
      description: expense.description || '',
      category: expense.category || 'OTHER',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await expensesAPI.deleteExpense(id);
      setSuccessMsg('Expense deleted successfully!');
      fetchExpenses();
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  const openModal = () => {
    setEditingExpense(null);
    setError('');
    setSuccessMsg('');
    setFormData({
      expenseDate: new Date().toISOString().split('T')[0],
      expenditure: '',
      amount: '',
      description: '',
      category: 'OTHER',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExpense(null);
  };

  const getCategoryLabel = (category) => {
    const cat = expenseCategories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'RENT':
        return 'bg-purple-100 text-purple-800';
      case 'UTILITIES':
        return 'bg-blue-100 text-blue-800';
      case 'SALARIES':
        return 'bg-green-100 text-green-800';
      case 'TRANSPORT':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUPPLIES':
        return 'bg-indigo-100 text-indigo-800';
      case 'MAINTENANCE':
        return 'bg-pink-100 text-pink-800';
      case 'MARKETING':
        return 'bg-orange-100 text-orange-800';
      case 'INSURANCE':
        return 'bg-teal-100 text-teal-800';
      case 'TAXES':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDateRangeLabel = () => {
    const today = new Date();
    
    switch (filter) {
      case 'today':
        return `Showing expenses for today: ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
      case 'daily':
        return `Showing expenses for ${new Date(customDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
      case 'weekly':
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return `Showing expenses for the last 7 days: ${weekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'monthly':
        return `Showing expenses for ${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      case 'yearly':
        return `Showing expenses for ${today.getFullYear()}`;
      case 'custom':
        return `Showing expenses from ${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} to ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      default:
        return '';
    }
  };

  // Filter expenses based on search query
  const filteredExpenses = expenses.filter(expense =>
    expense.expenditure?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageTitle = shopInfo ? `${shopInfo.shopTypeName} Expenses` : 'Expenses';

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

      {successMsg && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-4">
          {successMsg}
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter By
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="today">Today</option>
              <option value="daily">Custom Date</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {filter === 'daily' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input-field w-full"
              />
            </div>
          )}

          {filter === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="input-field w-full"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses..."
              className="input-field w-full"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={openModal}
              className="btn-primary flex items-center gap-2 w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Expense
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {getDateRangeLabel()}
        </div>
      </div>

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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expenditure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount (UGX)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No expenses</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new expense.</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {expense.expenditure || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                      UGX {expense.amount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
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
      )}

      {/* Total Amount Below Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4">
        <div className="flex justify-end items-center">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300 mr-3">Total Expenses:</span>
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">
            UGX {totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                  </h3>

                  {/* Expense Date */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="expenseDate"
                      value={formData.expenseDate}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      required
                      className="input-field w-full"
                    />
                  </div>

                  {/* Expenditure */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expenditure <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="expenditure"
                      value={formData.expenditure}
                      onChange={handleChange}
                      required
                      className="input-field w-full"
                      placeholder="e.g., Rent, Utilities, Supplies"
                    />
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount (UGX) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field w-full"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary w-full sm:w-auto sm:ml-3">
                    {editingExpense ? 'Update Expense' : 'Add Expense'}
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
    </div>
  );
};

export default Expenses;
