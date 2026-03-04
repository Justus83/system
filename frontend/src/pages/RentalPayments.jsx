import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rentPaymentsAPI, tenantsAPI } from '../services/api';

const RentalPayments = () => {
  const { selectedStore } = useAuth();
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    tenantId: '',
    amountPaid: '',
    rentPayable: '',
    balance: '',
    paymentDate: new Date().toISOString().split('T')[0],
    nextPaymentDate: '',
    paymentStatus: 'Fully Paid',
    paymentMethod: '',
    remarks: '',
    storeId: selectedStore?.id || '',
  });

  useEffect(() => {
    if (selectedStore) {
      fetchData();
    }
  }, [selectedStore]);

  const fetchData = async () => {
    try {
      const [paymentsRes, tenantsRes] = await Promise.all([
        rentPaymentsAPI.getRentPaymentsByStore(selectedStore.id),
        tenantsAPI.getTenantsByStore(selectedStore.id),
      ]);
      setPayments(paymentsRes.data);
      setTenants(tenantsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBalance = (rentPayable, amountPaid) => {
    const balance = parseFloat(rentPayable || 0) - parseFloat(amountPaid || 0);
    return balance.toFixed(2);
  };

  const handleTenantChange = (tenantId) => {
    const selectedTenant = tenants.find(t => t.id === parseInt(tenantId));
    let rentPayable = 0;
    
    if (selectedTenant) {
      // Get the rent from the assigned property
      if (selectedTenant.rentalHousePrice) {
        rentPayable = selectedTenant.rentalHousePrice;
      } else if (selectedTenant.suitePrice) {
        rentPayable = selectedTenant.suitePrice;
      } else if (selectedTenant.hostelRoomPrice) {
        rentPayable = selectedTenant.hostelRoomPrice;
      }
    }
    
    const newFormData = { 
      ...formData, 
      tenantId,
      rentPayable: rentPayable.toString()
    };
    newFormData.balance = calculateBalance(newFormData.rentPayable, newFormData.amountPaid);
    setFormData(newFormData);
  };

  const handleAmountChange = (value) => {
    const newFormData = { ...formData, amountPaid: value };
    newFormData.balance = calculateBalance(newFormData.rentPayable, newFormData.amountPaid);
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, storeId: selectedStore.id };
      if (editingPayment) {
        await rentPaymentsAPI.updateRentPayment(editingPayment.id, data);
      } else {
        await rentPaymentsAPI.createRentPayment(data);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Error saving payment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await rentPaymentsAPI.deleteRentPayment(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      tenantId: payment.tenantId,
      amountPaid: payment.amountPaid,
      rentPayable: payment.rentPayable,
      balance: payment.balance,
      paymentDate: payment.paymentDate,
      nextPaymentDate: payment.nextPaymentDate || '',
      paymentStatus: payment.paymentStatus,
      paymentMethod: payment.paymentMethod || '',
      remarks: payment.remarks || '',
      storeId: payment.storeId,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPayment(null);
    setFormData({
      tenantId: '',
      amountPaid: '',
      rentPayable: '',
      balance: '',
      paymentDate: new Date().toISOString().split('T')[0],
      nextPaymentDate: '',
      paymentStatus: 'Fully Paid',
      paymentMethod: '',
      remarks: '',
      storeId: selectedStore?.id || '',
    });
  };

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rent Payments</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Record Payment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent Payable</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4">{payment.tenantName}</td>
                <td className="px-6 py-4">{payment.rentPayable}</td>
                <td className="px-6 py-4">{payment.amountPaid}</td>
                <td className="px-6 py-4">
                  <span className={payment.balance > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                    {payment.balance}
                  </span>
                </td>
                <td className="px-6 py-4">{payment.paymentDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    payment.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-800' : 
                    payment.paymentStatus === 'Incomplete' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {payment.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEdit(payment)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button onClick={() => handleDelete(payment.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{editingPayment ? 'Edit' : 'Record'} Payment</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Tenant *</label>
                  <select required value={formData.tenantId}
                    onChange={(e) => handleTenantChange(e.target.value)}
                    className="w-full border rounded px-3 py-2">
                    <option value="">Select Tenant</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} - {t.rentalHouseName || t.suiteName || t.hostelRoomName || 'No Property Assigned'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Amount Paid *</label>
                  <input type="number" step="0.01" required value={formData.amountPaid}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Date *</label>
                  <input type="date" required value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Next Payment Date</label>
                  <input type="date" value={formData.nextPaymentDate}
                    onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                    className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <select value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full border rounded px-3 py-2">
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  {editingPayment ? 'Update' : 'Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default RentalPayments;
