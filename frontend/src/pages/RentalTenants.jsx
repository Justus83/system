import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tenantsAPI, rentalHousesAPI, suitesAPI, hostelRoomsAPI, apartmentsAPI, hostelsAPI } from '../services/api';

const RentalTenants = () => {
  const { selectedStore } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState({ 
    houses: [], 
    suites: [], 
    rooms: [], 
    apartments: [], 
    hostels: [] 
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    otherContact: '',
    occupation: '',
    address: '',
    nationality: '',
    email: '',
    nextOfKin: '',
    dateOfRegistration: new Date().toISOString().split('T')[0],
    propertyType: '', // 'hostel', 'apartment', or 'rental'
    hostelId: '',
    apartmentId: '',
    rentalHouseId: '',
    suiteId: '',
    hostelRoomId: '',
    storeId: selectedStore?.id || '',
  });

  useEffect(() => {
    if (selectedStore) {
      fetchData();
    }
  }, [selectedStore]);

  const fetchData = async () => {
    try {
      const [tenantsRes, housesRes, suitesRes, roomsRes, apartmentsRes, hostelsRes] = await Promise.all([
        tenantsAPI.getTenantsByStore(selectedStore.id),
        rentalHousesAPI.getRentalHousesByStore(selectedStore.id),
        suitesAPI.getSuitesByStore(selectedStore.id),
        hostelRoomsAPI.getHostelRoomsByStore(selectedStore.id),
        apartmentsAPI.getApartmentsByStore(selectedStore.id),
        hostelsAPI.getHostelsByStore(selectedStore.id),
      ]);
      setTenants(tenantsRes.data);
      setProperties({
        houses: housesRes.data.filter(h => h.price > 0), // Only rooms with price
        suites: suitesRes.data,
        rooms: roomsRes.data,
        apartments: apartmentsRes.data,
        hostels: hostelsRes.data,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      
      const data = {
        name: formData.name,
        contact: formData.contact,
        address: formData.address || null,
        email: formData.email || null,
        dateOfRegistration: formData.dateOfRegistration,
        storeId: selectedStore.id,
        rentalHouseId: formData.rentalHouseId || null,
        suiteId: formData.suiteId || null,
        hostelRoomId: formData.hostelRoomId || null,
      };
      
      console.log('Sending tenant data:', data);
      console.log('Token present:', !!token);
      
      if (editingTenant) {
        await tenantsAPI.updateTenant(editingTenant.id, data);
      } else {
        await tenantsAPI.createTenant(data);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving tenant:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      if (error.response?.status === 403) {
        alert('Access denied. Your session may have expired. Please log in again.');
      } else {
        alert(`Error saving tenant: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await tenantsAPI.deleteTenant(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    
    // Determine property type and IDs
    let propertyType = '';
    let hostelId = '';
    let apartmentId = '';
    
    if (tenant.hostelRoomId) {
      propertyType = 'hostel';
      const room = properties.rooms.find(r => r.id === tenant.hostelRoomId);
      hostelId = room?.hostelId || '';
    } else if (tenant.suiteId) {
      propertyType = 'apartment';
      const suite = properties.suites.find(s => s.id === tenant.suiteId);
      apartmentId = suite?.apartmentId || '';
    } else if (tenant.rentalHouseId) {
      propertyType = 'rental';
    }
    
    setFormData({
      name: tenant.name,
      contact: tenant.contact,
      otherContact: tenant.otherContact || '',
      occupation: tenant.occupation || '',
      address: tenant.address,
      nationality: tenant.nationality || '',
      email: tenant.email || '',
      nextOfKin: tenant.nextOfKin || '',
      dateOfRegistration: tenant.dateOfRegistration,
      propertyType: propertyType,
      hostelId: hostelId,
      apartmentId: apartmentId,
      rentalHouseId: tenant.rentalHouseId || '',
      suiteId: tenant.suiteId || '',
      hostelRoomId: tenant.hostelRoomId || '',
      storeId: tenant.storeId,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTenant(null);
    setFormData({
      name: '',
      contact: '',
      otherContact: '',
      occupation: '',
      address: '',
      nationality: '',
      email: '',
      nextOfKin: '',
      dateOfRegistration: new Date().toISOString().split('T')[0],
      propertyType: '',
      hostelId: '',
      apartmentId: '',
      rentalHouseId: '',
      suiteId: '',
      hostelRoomId: '',
      storeId: selectedStore?.id || '',
    });
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const filteredTenants = tenants.filter(tenant => {
    const name = tenant.name.toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) ||
           tenant.contact.toLowerCase().includes(search) ||
           (tenant.hostelName && tenant.hostelName.toLowerCase().includes(search)) ||
           (tenant.apartmentName && tenant.apartmentName.toLowerCase().includes(search)) ||
           (tenant.rentalHouseName && tenant.rentalHouseName.toLowerCase().includes(search)) ||
           (tenant.hostelRoomName && tenant.hostelRoomName.toLowerCase().includes(search)) ||
           (tenant.suiteName && tenant.suiteName.toLowerCase().includes(search));
  });

  return (
    <div className="p-6">
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 w-64"
          />
          <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Tenant
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Hostel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Apartment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Rental House</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Room/Suite</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contact</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {tenant.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-300">{tenant.hostelName || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-300">{tenant.apartmentName || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-300">{tenant.rentalHouseName || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {tenant.hostelRoomName || tenant.suiteName || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{tenant.contact}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEdit(tenant)} 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(tenant.id)} 
                    className="text-red-600 hover:text-red-900"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow mt-4">
          {searchTerm ? 'No tenants found matching your search.' : 'No tenants found. Click "Add Tenant" to create one.'}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{editingTenant ? 'Edit' : 'Add'} Tenant</h2>
            <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name *</label>
                  <input type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact *</label>
                  <input type="text" required value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded px-3 py-2" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input type="text" value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border rounded px-3 py-2" />
                </div>
                
                {/* Property Selection - Matching Table Columns */}
                <div className="col-span-2 border-t pt-4 mt-2">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">Property Assignment</h3>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Property Type *</label>
                  <select required value={formData.propertyType}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      propertyType: e.target.value,
                      hostelId: '',
                      apartmentId: '',
                      rentalHouseId: '',
                      suiteId: '',
                      hostelRoomId: ''
                    })}
                    className="w-full border rounded px-3 py-2">
                    <option value="">Select Property Type</option>
                    <option value="hostel">Hostel</option>
                    <option value="apartment">Apartment</option>
                    <option value="rental">Rental House</option>
                  </select>
                </div>
                
                {formData.propertyType === 'hostel' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Hostel *</label>
                      <select required value={formData.hostelId}
                        onChange={(e) => setFormData({ ...formData, hostelId: e.target.value, hostelRoomId: '' })}
                        className="w-full border rounded px-3 py-2">
                        <option value="">Select Hostel</option>
                        {properties.hostels.map(h => <option key={h.id} value={h.id}>{h.hostelName}</option>)}
                      </select>
                    </div>
                    
                    {formData.hostelId && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Hostel Room *</label>
                        <select required value={formData.hostelRoomId}
                          onChange={(e) => setFormData({ ...formData, hostelRoomId: e.target.value })}
                          className="w-full border rounded px-3 py-2">
                          <option value="">Select Room</option>
                          {properties.rooms
                            .filter(r => r.hostelId === Number(formData.hostelId))
                            .filter(r => r.status === 'VACANT' || r.id === editingTenant?.hostelRoomId)
                            .map(r => 
                            <option key={r.id} value={r.id}>
                              {r.roomName} {r.status === 'OCCUPIED' ? '(Currently Occupied)' : ''}
                            </option>
                          )}
                        </select>
                      </div>
                    )}
                  </>
                )}
                
                {formData.propertyType === 'apartment' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Apartment *</label>
                      <select required value={formData.apartmentId}
                        onChange={(e) => setFormData({ ...formData, apartmentId: e.target.value, suiteId: '' })}
                        className="w-full border rounded px-3 py-2">
                        <option value="">Select Apartment</option>
                        {properties.apartments.map(a => <option key={a.id} value={a.id}>{a.apartmentName}</option>)}
                      </select>
                    </div>
                    
                    {formData.apartmentId && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Suite *</label>
                        <select required value={formData.suiteId}
                          onChange={(e) => setFormData({ ...formData, suiteId: e.target.value })}
                          className="w-full border rounded px-3 py-2">
                          <option value="">Select Suite</option>
                          {properties.suites
                            .filter(s => s.apartmentId === Number(formData.apartmentId))
                            .filter(s => s.status === 'VACANT' || s.id === editingTenant?.suiteId)
                            .map(s => 
                            <option key={s.id} value={s.id}>
                              {s.suiteName} {s.status === 'OCCUPIED' ? '(Currently Occupied)' : ''}
                            </option>
                          )}
                        </select>
                      </div>
                    )}
                  </>
                )}
                
                {formData.propertyType === 'rental' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Rental House Room *</label>
                    <select required value={formData.rentalHouseId}
                      onChange={(e) => setFormData({ ...formData, rentalHouseId: e.target.value })}
                      className="w-full border rounded px-3 py-2">
                      <option value="">Select Room</option>
                      {properties.houses
                        .filter(h => h.status === 'VACANT' || h.id === editingTenant?.rentalHouseId)
                        .map(h => 
                        <option key={h.id} value={h.id}>
                          {h.houseName} {h.status === 'OCCUPIED' ? '(Currently Occupied)' : ''}
                        </option>
                      )}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Date *</label>
                  <input type="date" required value={formData.dateOfRegistration}
                    onChange={(e) => setFormData({ ...formData, dateOfRegistration: e.target.value })}
                    className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  {editingTenant ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalTenants;
