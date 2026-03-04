import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apartmentsAPI } from '../services/api';

const RentalApartmentsList = () => {
  const { selectedStore } = useAuth();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApartmentModal, setShowApartmentModal] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [apartmentForm, setApartmentForm] = useState({
    apartmentName: '',
    location: '',
  });

  useEffect(() => {
    if (selectedStore) {
      fetchData();
    }
  }, [selectedStore]);

  const fetchData = async () => {
    try {
      const apartmentsRes = await apartmentsAPI.getApartmentsByStore(selectedStore.id);
      setApartments(apartmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApartmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        apartmentName: apartmentForm.apartmentName,
        location: apartmentForm.location || null,
        storeId: Number(selectedStore.id) 
      };
      if (editingApartment) {
        await apartmentsAPI.updateApartment(editingApartment.id, data);
      } else {
        await apartmentsAPI.createApartment(data);
      }
      fetchData();
      handleCloseApartmentModal();
    } catch (error) {
      console.error('Error saving apartment:', error);
      console.error('Error response:', error.response?.data);
      alert(`Error saving apartment: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteApartment = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apartmentsAPI.deleteApartment(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleEditApartment = (apartment) => {
    setEditingApartment(apartment);
    setApartmentForm({
      apartmentName: apartment.apartmentName,
      location: apartment.location || '',
    });
    setShowApartmentModal(true);
  };

  const handleCloseApartmentModal = () => {
    setShowApartmentModal(false);
    setEditingApartment(null);
    setApartmentForm({
      apartmentName: '',
      location: '',
    });
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const filteredApartments = apartments.filter(apartment =>
    apartment.apartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (apartment.location && apartment.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-6">
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search apartments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 w-64"
          />
          <button onClick={() => setShowApartmentModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Apartment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apartment Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApartments.map((apartment) => (
              <tr key={apartment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{apartment.apartmentName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{apartment.location || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEditApartment(apartment)} 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteApartment(apartment.id)} 
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

      {filteredApartments.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          {searchTerm ? 'No apartments found matching your search.' : 'No apartments found. Click "Add Apartment" to create one.'}
        </div>
      )}

      {/* Apartment Modal */}
      {showApartmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingApartment ? 'Edit' : 'Add'} Apartment</h2>
            <form onSubmit={handleApartmentSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Apartment Name *</label>
                <input type="text" required value={apartmentForm.apartmentName}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, apartmentName: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Location</label>
                <input type="text" value={apartmentForm.location}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, location: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={handleCloseApartmentModal} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  {editingApartment ? 'Update' : 'Create'}
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

export default RentalApartmentsList;
