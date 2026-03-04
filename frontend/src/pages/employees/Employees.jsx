import { useState, useEffect } from 'react';
import { usersAPI, storeAccessAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import EmployeeModal from './EmployeeModal';
import EmployeeTable from './EmployeeTable';

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUserStore();
    fetchEmployees();
  }, []);

  const fetchUserStore = async () => {
    try {
      const response = await storeAccessAPI.getStoreAccessByUser(user?.id);
      if (response.data && response.data.length > 0) {
        setStoreId(response.data[0].storeId);
      }
    } catch (err) {
      console.error('Failed to fetch store access:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      // Filter to show only employees (users with employee-specific fields) and exclude OWNER role
      const employeeUsers = response.data.filter(u => 
        (u.employeeId || u.position || u.department) && u.role !== 'OWNER'
      );
      setEmployees(employeeUsers);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setError('');
    setSubmitting(true);
    
    if (!storeId && !editingEmployee) {
      setError('No store associated with your account. Please contact support.');
      setSubmitting(false);
      return;
    }
    
    try {
      const userData = {
        ...formData,
        role: 'EMPLOYEE',
        hireDate: formData.hireDate && formData.hireDate.trim() !== '' ? new Date(formData.hireDate).toISOString() : null,
      };

      if (editingEmployee) {
        await usersAPI.updateUser(editingEmployee.id, userData);
      } else {
        const userResponse = await usersAPI.createUser(userData);
        
        // Create store access for the new employee
        if (userResponse.data && userResponse.data.id && storeId) {
          await storeAccessAPI.createStoreAccess({
            userId: userResponse.data.id,
            storeId: storeId,
          });
        }
      }
      
      setShowModal(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    
    try {
      await usersAPI.deleteUser(id);
      fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  const openModal = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setError('');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your employees</p>
        </div>
        <button onClick={openModal} className="btn-primary flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Employee</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <EmployeeTable
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <EmployeeModal
        isOpen={showModal}
        employee={editingEmployee}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  );
};

export default Employees;
