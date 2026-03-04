import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apartmentsAPI, suitesAPI } from '../services/api';

const RentalSuites = () => {
  const { selectedStore } = useAuth();
  const [apartments, setApartments] = useState([]);
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuiteModal, setShowSuiteModal] = useState(false);
  const [editingSuite, setEditingSuite] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSuiteSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        suiteName: suiteForm.suiteName,
        price: Number(suiteForm.price),
        apartmentId: Number(suiteForm.apartmentId),
        status: editingSuite ? suiteForm.status : 'VACANT',
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

  const handleEditSuite = (suite) => {
    setEditingSuite(suite);
    setSuiteForm({
      suiteName: suite.suiteName,
      price: suite.price,
      apartmentId: suite.apartmentId,
      status: suite.status,
    });
    setShowSuiteModal(true);
  };

  const handleCloseSuiteModal = () => {
    setShowSuiteModal(false);
    setEditingSuite(null);
    setSuiteForm({
      suiteName: '',
      price: '',
      apartmentId: '',
      status: 'VACANT',
    });
  };

  const getApartmentName = (apartmentId) => {
    const apartment = apartments.find(a => a.id === apartmentId);
    return apartment ? apartment.apartmentName : 'Unknown';
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const filteredSuites = suites.filter(suite =>
    suite.suiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getApartmentName(suite.apartmentId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-6">
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search suites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 w-64"
          />
          <button onClick={() => setShowSuiteModal(true)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Suite
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suite Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apartment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (UGX)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSuites.map((suite) => (
              <tr key={suite.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{suite.suiteName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{getApartmentName(suite.apartmentId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{suite.price.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    suite.status === 'VACANT' ? 'bg-green-100 text-green-800' : 
                    suite.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {suite.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEditSuite(suite)} 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteSuite(suite.id)} 
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

      {filteredSuites.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          {searchTerm ? 'No suites found matching your search.' : 'No suites found. Click "Add Suite" to create one.'}
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
                <label className="block text-sm font-medium mb-2">Price (UGX) *</label>
                <input type="number" required value={suiteForm.price}
                  onChange={(e) => setSuiteForm({ ...suiteForm, price: e.target.value })}
                  className="w-full border rounded px-3 py-2" 
                  placeholder="e.g., 800000" />
              </div>
              {editingSuite && (
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
              )}
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

export default RentalSuites;
