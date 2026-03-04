import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rentalHousesAPI } from '../services/api';

const RentalHouses = () => {
  const { selectedStore } = useAuth();
  const [rentalHouses, setRentalHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    houseName: '',
    price: '',
    location: '',
    status: 'VACANT',
  });

  useEffect(() => {
    if (selectedStore) {
      fetchData();
    }
  }, [selectedStore]);

  const fetchData = async () => {
    try {
      const housesRes = await rentalHousesAPI.getRentalHousesByStore(selectedStore.id);
      setRentalHouses(housesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        houseName: formData.houseName,
        price: Number(formData.price),
        location: formData.location || null,
        status: editingHouse ? formData.status : 'VACANT',
        storeId: Number(selectedStore.id) 
      };
      if (editingHouse) {
        await rentalHousesAPI.updateRentalHouse(editingHouse.id, data);
      } else {
        await rentalHousesAPI.createRentalHouse(data);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving rental house:', error);
      console.error('Error response:', error.response?.data);
      alert(`Error saving rental house: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await rentalHousesAPI.deleteRentalHouse(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleEdit = (house) => {
    setEditingHouse(house);
    setFormData({
      houseName: house.houseName,
      price: house.price,
      location: house.location || '',
      status: house.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHouse(null);
    setFormData({
      houseName: '',
      price: '',
      location: '',
      status: 'VACANT',
    });
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const filteredHouses = rentalHouses.filter(house =>
    house.houseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (house.location && house.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-6">
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search rental houses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 w-64"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Rental House
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (UGX)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredHouses.map((house) => (
              <tr key={house.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{house.houseName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{house.price.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{house.location || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    house.status === 'VACANT' ? 'bg-green-100 text-green-800' : 
                    house.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {house.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEdit(house)} 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(house.id)} 
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

      {filteredHouses.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          {searchTerm ? 'No rental houses found matching your search.' : 'No rental houses found. Click "Add Rental House" to create one.'}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingHouse ? 'Edit' : 'Add'} Rental House</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">House Name *</label>
                <input type="text" required value={formData.houseName}
                  onChange={(e) => setFormData({ ...formData, houseName: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Price (UGX) *</label>
                <input type="number" required value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., 1000000" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Location</label>
                <input type="text" value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              {editingHouse && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border rounded px-3 py-2">
                    <option value="VACANT">VACANT</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  {editingHouse ? 'Update' : 'Create'}
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

export default RentalHouses;
