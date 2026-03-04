import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { barProductsAPI, suppliersAPI } from '../services/api';

const BarDashboard = () => {
  const { selectedStore } = useAuth();
  const [beers, setBeers] = useState([]);
  const [spirits, setSpirits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBeers: 0,
    totalSpirits: 0,
    totalProducts: 0,
    totalValue: 0,
    lowStockBeers: 0,
    lowStockSpirits: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStore) return;
      
      setLoading(true);
      try {
        const [beersRes, spiritsRes, suppliersRes] = await Promise.all([
          barProductsAPI.getBeersByStore(selectedStore.id),
          barProductsAPI.getSpiritsByStore(selectedStore.id),
          suppliersAPI.getSuppliersByStore(selectedStore.id),
        ]);

        const beersData = beersRes.data;
        const spiritsData = spiritsRes.data;
        
        setBeers(beersData);
        setSpirits(spiritsData);
        setSuppliers(suppliersRes.data);

        // Calculate stats
        const totalBeers = beersData.reduce((sum, b) => sum + (b.quantity || 0), 0);
        const totalSpirits = spiritsData.reduce((sum, v) => sum + (v.quantity || 0), 0);
        const totalValue = [...beersData, ...spiritsData].reduce((sum, p) => 
          sum + ((p.costPrice || 0) * (p.quantity || 0)), 0
        );
        const lowStockBeers = beersData.filter(b => b.quantity < 10).length;
        const lowStockSpirits = spiritsData.filter(v => v.quantity < 10).length;

        setStats({
          totalBeers,
          totalSpirits,
          totalProducts: totalBeers + totalSpirits,
          totalValue,
          lowStockBeers,
          lowStockSpirits,
        });
      } catch (error) {
        console.error('Error fetching bar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStore]);

  const formatCurrency = (value) => {
    return `UGX ${value?.toLocaleString() || '0'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg p-6 mb-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">
            <i className="fas fa-wine-bottle mr-2"></i>
            Bar Dashboard
          </h1>
          <p className="text-amber-100">Manage your bar inventory and track stock levels</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Beers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-beer"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalBeers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Total Beers
                </div>
                {stats.lowStockBeers > 0 && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                    <i className="fas fa-exclamation-triangle"></i> {stats.lowStockBeers} low stock
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Total Spirits */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-glass-martini-alt"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSpirits}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Total Spirits
                </div>
                {stats.lowStockSpirits > 0 && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                    <i className="fas fa-exclamation-triangle"></i> {stats.lowStockSpirits} low stock
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-boxes"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalProducts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Total Units
                </div>
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalValue)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Inventory Value
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Beers Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fas fa-beer"></i>
              Beer Inventory
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Packaging</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {beers.slice(0, 10).map((beer) => (
                    <tr key={beer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{beer.brandName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{beer.sizeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{beer.packagingName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          beer.quantity < 10 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {beer.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {beers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No beers in inventory
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Spirits Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fas fa-glass-martini-alt"></i>
              Spirit Inventory
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Volume</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {spirits.slice(0, 10).map((spirit) => (
                    <tr key={spirit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{spirit.brandName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{spirit.typeName} {spirit.sizeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{spirit.volumeMl}ml</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          spirit.quantity < 10 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {spirit.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {spirits.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No spirits in inventory
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Suppliers Section */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <i className="fas fa-truck"></i>
            Suppliers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="font-semibold text-gray-900 dark:text-white">{supplier.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <i className="fas fa-phone mr-1"></i>
                  {supplier.phoneNumber}
                </div>
                {supplier.email && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <i className="fas fa-envelope mr-1"></i>
                    {supplier.email}
                  </div>
                )}
              </div>
            ))}
            {suppliers.length === 0 && (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
                No suppliers found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarDashboard;
