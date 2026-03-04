import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAnalyticsAPI } from '../services/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ElectronicDashboard = () => {
  const { selectedStore } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedStore) return;
      
      setLoading(true);
      try {
        const response = await dashboardAnalyticsAPI.getAnalytics(selectedStore.id, selectedYear);
        setAnalytics(response.data);
        
        // Generate available years (current year and 5 years back)
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 6; i++) {
          years.push(currentYear - i);
        }
        setAvailableYears(years);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedStore, selectedYear]);

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

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No analytics data available</p>
        </div>
      </div>
    );
  }

  const { yearlySummary, monthlyData, topProducts, leastProducts, currentStats } = analytics;

  // Chart data for monthly trends
  const monthlyTrendsData = {
    labels: monthlyData?.map(m => m.month) || [],
    datasets: [
      {
        label: 'Sales',
        data: monthlyData?.map(m => m.sales) || [],
        backgroundColor: 'rgba(102, 126, 234, 0.7)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      },
      {
        label: 'Profit',
        data: monthlyData?.map(m => m.profit) || [],
        backgroundColor: 'rgba(40, 167, 69, 0.7)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1,
      },
      {
        label: 'Loss',
        data: monthlyData?.map(m => m.loss) || [],
        backgroundColor: 'rgba(220, 53, 69, 0.7)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenditure',
        data: monthlyData?.map(m => m.expenditure) || [],
        backgroundColor: 'rgba(255, 193, 7, 0.7)',
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 1,
      },
      {
        label: 'Investment',
        data: monthlyData?.map(m => m.investment) || [],
        backgroundColor: 'rgba(156, 39, 176, 0.7)',
        borderColor: 'rgba(156, 39, 176, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for net income trend
  const netIncomeTrendData = {
    labels: monthlyData?.map(m => m.month) || [],
    datasets: [
      {
        label: 'Net Income',
        data: monthlyData?.map(m => m.netIncome) || [],
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart data for top products
  const topProductsData = {
    labels: topProducts?.slice(0, 10).map(p => p.fullName) || [],
    datasets: [
      {
        label: 'Units Sold',
        data: topProducts?.slice(0, 10).map(p => p.salesCount) || [],
        backgroundColor: 'rgba(102, 126, 234, 0.7)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-6 mb-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">
            <i className="fas fa-chart-line mr-2"></i>
            Analytics Dashboard
          </h1>
          <p className="text-purple-100 mb-4">Comprehensive view of your store's performance and financial metrics</p>
          
          {/* Year Selector */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 flex items-center gap-4">
            <label htmlFor="yearSelect" className="font-semibold">Select Year:</label>
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 rounded-md bg-white text-gray-900 font-semibold min-w-[120px] cursor-pointer outline-none"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Total Sales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(yearlySummary?.totalSales)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Total Sales ({selectedYear})
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  <i className="fas fa-chart-line"></i> Matches Sales Page
                </div>
              </div>
            </div>
          </div>

          {/* Total Expenditure */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(yearlySummary?.totalExpenditure)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Total Expenditure ({selectedYear})
                </div>
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  <i className="fas fa-arrow-down"></i> Operational Costs
                </div>
              </div>
            </div>
          </div>

          {/* Total Investment */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(yearlySummary?.totalInvestment)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Total Investment ({selectedYear})
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <i className="fas fa-chart-line"></i> Capital Input
                </div>
              </div>
            </div>
          </div>

          {/* Net Income */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(yearlySummary?.netIncome)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Net Income ({selectedYear})
                </div>
                <div className={`text-xs mt-1 ${yearlySummary?.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <i className={`fas fa-arrow-${yearlySummary?.netIncome >= 0 ? 'up' : 'down'}`}></i> Profit - (Loss + Expenditure)
                </div>
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-box"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentStats?.totalProducts || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Total Products
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  <i className="fas fa-check-circle"></i> {currentStats?.availableProducts || 0} Available
                </div>
              </div>
            </div>
          </div>

          {/* Total Profit */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(yearlySummary?.totalProfit)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Total Profit ({selectedYear})
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  <i className="fas fa-arrow-up"></i> Gross Profit
                </div>
              </div>
            </div>
          </div>

          {/* Current Month Sales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white text-2xl">
                <i className="fas fa-calendar-day"></i>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(currentStats?.currentMonthSales)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Current Month Sales
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  <i className="fas fa-calendar"></i> {new Date().toLocaleString('default', { month: 'long' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trends Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fas fa-chart-bar"></i>
              Monthly Financial Trends
            </h3>
            <div className="h-80">
              <Bar data={monthlyTrendsData} options={chartOptions} />
            </div>
          </div>

          {/* Top Products Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fas fa-star"></i>
              Top Selling Products ({selectedYear})
            </h3>
            <div className="h-80">
              <Bar data={topProductsData} options={chartOptions} />
            </div>
          </div>

          {/* Net Income Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fas fa-percentage"></i>
              Net Income Trend
            </h3>
            <div className="h-80">
              <Line data={netIncomeTrendData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="space-y-6">
          {/* Monthly Statistics Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fas fa-calendar-alt"></i>
              Monthly Financial Statistics
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sales</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Profit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loss</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expenditure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Investment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Net Income</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {monthlyData?.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{data.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatCurrency(data.sales)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">{formatCurrency(data.profit)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400">{formatCurrency(data.loss)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600 dark:text-orange-400">{formatCurrency(data.expenditure)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(data.investment)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${data.netIncome >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(data.netIncome)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Performance Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i className="fas fa-crown"></i>
                Top Selling Products
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Units Sold</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {topProducts?.slice(0, 10).map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white">{product.deviceModel}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{product.brand}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {product.salesCount} units
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(product.totalRevenue)}
                        </td>
                      </tr>
                    ))}
                    {(!topProducts || topProducts.length === 0) && (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          <i className="fas fa-box-open text-4xl mb-2 block"></i>
                          No sales data available for {selectedYear}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Least Selling Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i className="fas fa-chart-line-down"></i>
                Least Selling Products
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Units Sold</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {leastProducts?.slice(0, 10).map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white">{product.deviceModel}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{product.brand}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {product.salesCount} units
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(product.totalRevenue)}
                        </td>
                      </tr>
                    ))}
                    {(!leastProducts || leastProducts.length === 0) && (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          <i className="fas fa-box-open text-4xl mb-2 block"></i>
                          No sales data available for {selectedYear}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectronicDashboard;
