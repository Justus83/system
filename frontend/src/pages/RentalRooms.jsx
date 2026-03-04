import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { hostelsAPI, hostelRoomsAPI } from '../services/api';

const RentalRooms = () => {
  const { selectedStore } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roomForm, setRoomForm] = useState({
    roomName: '',
    price: '',
    hostelId: '',
    status: 'VACANT',
  });

  useEffect(() => {
    if (selectedStore) {
      fetchData();
    }
  }, [selectedStore]);

  const fetchData = async () => {
    try {
      const [hostelsRes, roomsRes] = await Promise.all([
        hostelsAPI.getHostelsByStore(selectedStore.id),
        hostelRoomsAPI.getHostelRoomsByStore(selectedStore.id),
      ]);
      setHostels(hostelsRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        ...roomForm, 
        storeId: Number(selectedStore.id),
        hostelId: Number(roomForm.hostelId),
        price: Number(roomForm.price),
        status: editingRoom ? roomForm.status : 'VACANT' // New rooms are always VACANT
      };
      if (editingRoom) {
        await hostelRoomsAPI.updateHostelRoom(editingRoom.id, data);
      } else {
        await hostelRoomsAPI.createHostelRoom(data);
      }
      fetchData();
      handleCloseRoomModal();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Error saving room');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await hostelRoomsAPI.deleteHostelRoom(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      roomName: room.roomName,
      price: room.price,
      hostelId: room.hostelId,
      status: room.status,
    });
    setShowRoomModal(true);
  };

  const handleCloseRoomModal = () => {
    setShowRoomModal(false);
    setEditingRoom(null);
    setRoomForm({
      roomName: '',
      price: '',
      hostelId: '',
      status: 'VACANT',
    });
  };

  const getHostelName = (hostelId) => {
    const hostel = hostels.find(h => h.id === hostelId);
    return hostel ? hostel.hostelName : 'Unknown';
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const filteredRooms = rooms.filter(room =>
    room.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getHostelName(room.hostelId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-6">
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 w-64"
          />
          <button onClick={() => setShowRoomModal(true)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Room
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (UGX)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{room.roomName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{getHostelName(room.hostelId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{room.price.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    room.status === 'VACANT' ? 'bg-green-100 text-green-800' : 
                    room.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEditRoom(room)} 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteRoom(room.id)} 
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

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          {searchTerm ? 'No rooms found matching your search.' : 'No rooms found. Click "Add Room" to create one.'}
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingRoom ? 'Edit' : 'Add'} Room</h2>
            <form onSubmit={handleRoomSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Room Name *</label>
                <input type="text" required value={roomForm.roomName}
                  onChange={(e) => setRoomForm({ ...roomForm, roomName: e.target.value })}
                  className="w-full border rounded px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Hostel *</label>
                <select required value={roomForm.hostelId}
                  onChange={(e) => setRoomForm({ ...roomForm, hostelId: e.target.value })}
                  className="w-full border rounded px-3 py-2">
                  <option value="">Select Hostel</option>
                  {hostels.map(h => <option key={h.id} value={h.id}>{h.hostelName}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Price (UGX) *</label>
                <input type="number" required value={roomForm.price}
                  onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                  className="w-full border rounded px-3 py-2" 
                  placeholder="e.g., 500000" />
              </div>
              {editingRoom && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={roomForm.status}
                    onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                    className="w-full border rounded px-3 py-2">
                    <option value="VACANT">VACANT</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={handleCloseRoomModal} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  {editingRoom ? 'Update' : 'Create'}
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

export default RentalRooms;
