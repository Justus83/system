import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  rentalHousesAPI, 
  apartmentsAPI, 
  tenantsAPI,
  rentPaymentsAPI 
} from '../services/api';

const RentalDashboard = () => {
  const { selectedStore } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalTenants: 0,
    totalPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!selectedStore) return;
      
      if (selectedStore.shop?.shopType !== 'RENTALS') {
        setLoading(false);
        return;
      }
      
      try {
        const [rentalHouses, apartments, tenants, payments] = await Promise.all([
          rentalHousesAPI.getRentalHousesByStore(selectedStore.id).catch(() => ({ data: [] })),
          apartmentsAPI.getApartmentsByStore(selectedStore.id).catch(() => ({ data: [] })),
          tenantsAPI.getTenantsByStore(selectedStore.id).catch(() => ({ data: [] })),
          rentPaymentsAPI.getRentPaymentsByStore(selectedStore.id).catch(() => ({ data: [] })),
        ]);

        const totalProperties = (rentalHouses.data?.length || 0) + (apartments.data?.length || 0);

        setStats({
          totalProperties,
          totalTenants: tenants.data?.length || 0,
          totalPayments: payments.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedStore]);

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: '🏠',
      color: 'bg-green-500',
      link: '/rental-properties'
    },
    {
      title: 'Total Tenants',
      value: stats.totalTenants,
      icon: '👥',
      color: 'bg-purple-500',
      link: '/rental-tenants'
    },
    {
      title: 'Total Payments',
      value: stats.totalPayments,
      icon: '💰',
      color: 'bg-yellow-500',
      link: '/rental-payments'
    },
  ];

  const quickActions = [
    { name: 'Rental Houses', icon: '🏠', link: '/rental-houses', color: 'bg-green-500' },
    { name: 'Apartments & Suites', icon: '🏢', link: '/rental-apartments', color: 'bg-indigo-500' },
    { name: 'Hostels & Rooms', icon: '🏨', link: '/rental-hostels', color: 'bg-pink-500' },
    { name: 'Manage Tenants', icon: '👥', link: '/rental-tenants', color: 'bg-purple-500' },
    { name: 'Rent Payments', icon: '💰', link: '/rental-payments', color: 'bg-yellow-500' },
    { name: 'Meter Readings', icon: '⚡', link: '/rental-meter-readings', color: 'bg-orange-500' },
    { name: 'Maintenance', icon: '🔧', link: '/rental-maintenance', color: 'bg-red-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Rentals Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            onClick={() => navigate(stat.link)}
            className={`${stat.color} text-white rounded-lg shadow-lg p-6 cursor-pointer hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.link)}
              className={`${action.color} text-white rounded-lg p-4 hover:opacity-90 transition-opacity flex flex-col items-center justify-center space-y-2`}
            >
              <span className="text-3xl">{action.icon}</span>
              <span className="text-sm font-medium text-center">{action.name}</span>
            </button>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default RentalDashboard;
