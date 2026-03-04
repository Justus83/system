import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apartmentsAPI, suitesAPI } from '../services/api';

const RentalApartments = () => {
  const { selectedStore } = useAuth();
  const [apartments, setApartments] = useState([]);
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApartmentModal, setShowApartmentModal] = useState(false);
  const [showSuiteModal, setShowSuiteModal] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [editingSuite, setEditingSuite] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [apartmentForm, setApartmentForm] = useState({
    apartmentName: '',
    location: '',
  });
  const [suiteForm, setSuiteForm] = useState({
    suiteName: '',
    price: '',
    apartmentId: '',
    status: 'VACANT',
  });

  useEffect(() => {
    if (selectedStore) {
      fetchData();
    }
  }, [selectedStore]);

  const fetchData = async () => {
    try {
      const [apartmentsRes, suitesRes] = await Promise.all([
        apartmentsAPI.getApartmentsByStore(selectedStore.id),
        suitesAPI.getSuitesByStore(selectedStore.id),
      ]);
      setApartments(apartmentsRes.data);
      setSuites(suitesRes.data);
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

  const handleSuiteSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        suiteName: suiteForm.suiteName,
        price: Number(suiteForm.price),
        apartmentId: Number(suiteForm.apartmentId),
        status: suiteForm.status,
        storeId: Number(selectedStore.id) 
      };
      if (editingSuite) {
        await suitesAPI.updateSuite(editingSuite.id, data);
      } else {
        await suitesAPI.createSuite(data);
      }
      fetchData();
      handleCloseSuiteModal();
    } catch (error) {
      console.error('Error saving suite:', error);
      console.error('Error response:', error.response?.data);
      alert(`Error saving suite: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteApartment = async (id) => {
    if (window.confirm('Are you sure? This will delete all suites in this apartment.')) {
      try {
        await apartmentsAPI.deleteApartment(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleDeleteSuite = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await suitesAPI.deleteSuite(id);
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
      storeId: apartment.storeId,
    });
    setShowApartmentModal(true);
  };

  const handleEditSuite = (suite) => {
    setEditingSuite(suite);
    setSuiteForm({
      suiteName: suite.suiteName,
      price: suite.price,
      apartmentId: suite.apartmentId,
      status: suite.status,
      storeId: suite.storeId,
    });
    setShowSuiteModal(true);
  };

  const handleCloseApartmentModal = () => {
    setShowApartmentModal(false);
    setEditingApartment(null);
    setApartmentForm({
      apartmentName: '',
      location: '',
      storeId: selectedStore?.id || '',
    });
  };

  const handleCloseSuiteModal = () => {
    setShowSuiteModal(false);
    setEditingSuite(null);
    setSuiteForm({
      suiteName: '',
      price: '',
      apartmentId: '',
      status: 'VACANT',
      storeId: selectedStore?.id || '',
    });
  };

  const getSuitesForApartment = (apartmentId) => {
    return suites.filter(s => s.apartmentId === apartmentId);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Apartments & Suites</h1>
        <div className="space-x-2">
          <button onClick={() => setShowApartmentModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Apartment
          </button>
          <button onClick={() => setShowSuiteModal(true)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Suite
          </button>
        </div>
      </div>

      {/* Apartments List */}
      <div className="space-y-4">
        {apartments.map((apartment) => (
          <div key={apartment.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{apartment.apartmentName}</h3>
                <p className="text-gray-600">Location: {apartment.location}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEditApartment(apartment)} className="text-blue-600 hover:text-blue-900">Edit</button>
                <button onClick={() => handleDeleteApartment(apartment.id)} className="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </div>

            {/* Suites in this apartment */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Suites ({getSuitesForApartment(apartment.id).length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getSuitesForApartment(apartment.id).map((suite) => (
                  <div key={suite.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{suite.suiteName}</p>
                        <p className="text-sm text-gray-600">Price: {suite.price}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          suite.status === 'VACANT' ? 'bg-green-100 text-green-800' : 
                          suite.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {suite.status}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <button onClick={() => handleEditSuite(suite)} className="text-xs text-blue-600 hover:text-blue-900">Edit</button>
                        <button onClick={() => handleDeleteSuite(suite.id)} className="text-xs text-red-600 hover:text-red-900">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

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

      {/* Suite Modal */}
      {showSuiteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingSuite ? 'Edit' : 'Add'} Suite</h2>
            <form onSubmit={handleSuiteSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Suite Name *</label>
                <input type="text" required value={suiteForm.suiteName}
                  onChange={(e) => setSuiteForm({ ...suiteForm, suiteName: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Apartment *</label>
                <select required value={suiteForm.apartmentId}
                  onChange={(e) => setSuiteForm({ ...suiteForm, apartmentId: e.target.value })}
                  className="w-full border rounded px-3 py-2">
                  <option value="">Select Apartment</option>
                  {apartments.map(a => <option key={a.id} value={a.id}>{a.apartmentName}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Price *</label>
                <input type="number" required value={suiteForm.price}
                  onChange={(e) => setSuiteForm({ ...suiteForm, price: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select value={suiteForm.status}
                  onChange={(e) => setSuiteForm({ ...suiteForm, status: e.target.value })}
                  className="w-full border rounded px-3 py-2">
                  <option value="VACANT">VACANT</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={handleCloseSuiteModal} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  {editingSuite ? 'Update' : 'Create'}
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

export default RentalApartments;
