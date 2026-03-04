import { useState, useEffect } from 'react';
import { usersAPI, branchesAPI, storeAccessAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeModal from '../components/employees/EmployeeModal';

const Employees = () => {
  const { user, selectedStore } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    employeeId: '',
    position: '',
    hireDate: '',
    salary: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    isActive: true,
    role: 'EMPLOYEE',
    branchId: '',
  });

  useEffect(() => {
    if (selectedStore) {
      fetchEmployees();
    }
  }, [selectedStore]);

  useEffect(() => {
    if (selectedStore) {
      fetchBranches();
    }
  }, [selectedStore]);

  const fetchBranches = async () => {
    if (!selectedStore) return;
    
    try {
      const response = await branchesAPI.getBranchesByStore(selectedStore.id);
      setBranches(response.data || []);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    }
  };

  const fetchEmployees = async () => {
    if (!selectedStore) return;
    
    try {
      setLoading(true);
      
      // Get all store access records and filter by the selected store
      const storeAccessResponse = await storeAccessAPI.getAllStoreAccess();
      const storeAccessRecords = storeAccessResponse.data || [];
      
      // Filter store access records for the selected store
      const storeEmployeeAccess = storeAccessRecords.filter(access => 
        access.storeId === selectedStore.id
      );
      
      // Get all users
      const usersResponse = await usersAPI.getUsers();
      const allUsers = usersResponse.data || [];
      
      // Filter users to only include those who have access to the selected store
      const storeUserIds = storeEmployeeAccess.map(access => access.userId);
      const storeUsers = allUsers.filter(user => storeUserIds.includes(user.id));
      
      // Filter out users with OWNER role and inactive users, then map name to fullName
      const filteredEmployees = storeUsers
        .filter(emp => {
          return emp.role !== 'OWNER' && emp.isActive !== false;
        })
        .map(emp => ({
          ...emp,
          fullName: emp.name // Map backend 'name' to frontend 'fullName'
        }));
        
      setEmployees(filteredEmployees);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedStore && !editingEmployee) {
      setError('No store selected. Please select a store from the top navigation.');
      return;
    }
    
    try {
      if (editingEmployee) {
        const updateData = { 
          ...formData,
          name: formData.fullName, // Map fullName to name for backend
          hireDate: formData.hireDate && formData.hireDate.trim() !== '' ? new Date(formData.hireDate).toISOString() : null,
        };
        delete updateData.password;
        delete updateData.fullName; // Remove fullName as backend doesn't expect it
        await usersAPI.updateUser(editingEmployee.id, updateData);
      } else {
        const userData = {
          ...formData,
          name: formData.fullName, // Map fullName to name for backend
          hireDate: formData.hireDate && formData.hireDate.trim() !== '' ? new Date(formData.hireDate).toISOString() : null,
        };
        delete userData.fullName; // Remove fullName as backend doesn't expect it
        const userResponse = await usersAPI.createUser(userData);
        const newUserId = userResponse.data.id;
        
        await storeAccessAPI.createStoreAccess({
          userId: newUserId,
          storeId: selectedStore.id,
          branchId: formData.branchId ? parseInt(formData.branchId) : null,
          role: formData.role,
        });
      }
      
      setShowModal(false);
      setEditingEmployee(null);
      resetForm();
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      fullName: employee.name || employee.fullName || '',
      email: employee.email || '',
      password: '',
      phoneNumber: employee.phoneNumber || '',
      employeeId: employee.employeeId || '',
      position: employee.position || '',
      department: employee.department || '',
      hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
      salary: employee.salary || '',
      address: employee.address || '',
      emergencyContact: employee.emergencyContact || '',
      emergencyPhone: employee.emergencyPhone || '',
      isActive: employee.isActive !== undefined ? employee.isActive : true,
      role: 'EMPLOYEE',
    });
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
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      employeeId: '',
      position: '',
      department: '',
      hireDate: '',
      salary: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      isActive: true,
      role: 'EMPLOYEE',
      branchId: '',
    });
  };

  const filteredEmployees = employees.filter(employee => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      (employee.fullName || '').toLowerCase().includes(search) ||
      (employee.email || '').toLowerCase().includes(search) ||
      (employee.phoneNumber || '').toLowerCase().includes(search) ||
      (employee.position || '').toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search employees by name, email, phone, or position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
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
        employees={filteredEmployees}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <EmployeeModal
        show={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        editingEmployee={editingEmployee}
        branches={branches}
        error={error}
      />
    </div>
  );
};

export default Employees;
