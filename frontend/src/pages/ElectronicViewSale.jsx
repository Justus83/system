import React, { useState, useEffect, useMemo } from 'react';
import { salesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ElectronicViewSale = () => {
  const { user, selectedStore } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  
  // Filter states
  const [filterType, setFilterType] = useState('all'); // all, today, thisMonth, thisYear, custom
  const [profitLossFilter, setProfitLossFilter] = useState('all'); // all, profit, loss
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (selectedStore) {
      // Only fetch sales if this is an electronics store
      if (selectedStore.shop?.shopType === 'ELECTRONICS') {
        fetchSales();
      }
    }
  }, [selectedStore]);

  const fetchSales = async () => {
    if (!selectedStore) return;
    
    // Only fetch if this is an electronics store
    if (selectedStore.shop?.shopType !== 'ELECTRONICS') {
      setSales([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await salesAPI.getSalesByStore(selectedStore.id);
      setSales(response.data);
    } catch (err) {
      console.error('Failed to fetch sales:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter sales based on selected filter
  const filteredSales = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    return sales.filter(sale => {
      // Date filter
      if (!sale.saleDate) return false;
      
      const saleDate = new Date(sale.saleDate);
      
      switch (filterType) {
        case 'today':
          if (saleDate < today) return false;
          break;
        case 'thisMonth':
          if (saleDate < thisMonth) return false;
          break;
        case 'thisYear':
          if (saleDate < thisYear) return false;
          break;
        case 'custom':
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include full end date
            if (saleDate < start || saleDate > end) return false;
          }
          break;
      }

      // Profit/Loss filter
      if (profitLossFilter === 'profit') {
        if (!sale.profit || sale.profit <= 0) return false;
      } else if (profitLossFilter === 'loss') {
        if (!sale.loss || sale.loss <= 0) return false;
      }

      return true;
    });
  }, [sales, filterType, startDate, endDate, profitLossFilter]);

  // Table columns configuration
  const columns = [
    { key: 'saleDate', title: 'Date', isDate: true },
    { key: 'product', title: 'Product' },
    { key: 'salePrice', title: 'Selling Price', isPrice: true },
    { key: 'profit', title: 'Profit', isProfit: true },
    { key: 'loss', title: 'Loss', isLoss: true },
    { key: 'amountPaid', title: 'Amount Paid', isPrice: true },
    { key: 'balanceDue', title: 'Balance Due', isPrice: true }
  ];

  // Format sales data for table
  const formattedSales = filteredSales.map(sale => ({
    ...sale,
    saleDate: sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : 'N/A',
    product: sale.productName && sale.productSerialNumber 
      ? (
        <div>
          <div className="font-medium">{sale.productName}</div>
          <div className="text-xs text-gray-500">{sale.productSerialNumber}</div>
        </div>
      )
      : sale.productName || sale.productSerialNumber || 'N/A',
    salePrice: sale.salePrice != null ? sale.salePrice.toFixed(2) : '0.00',
    profit: sale.profit != null && sale.profit > 0 ? sale.profit.toFixed(2) : '-',
    loss: sale.loss != null && sale.loss > 0 ? sale.loss.toFixed(2) : '-',
    amountPaid: sale.amountPaid?.toFixed(2) || '0.00',
    balanceDue: sale.balanceDue != null ? sale.balanceDue.toFixed(2) : '0.00'
  }));

  // Calculate totals
  const totals = useMemo(() => {
    const totalSalePrice = filteredSales.reduce((sum, s) => sum + (parseFloat(s.salePrice) || 0), 0);
    const totalProfit = filteredSales.reduce((sum, s) => sum + (parseFloat(s.profit) || 0), 0);
    const totalLoss = filteredSales.reduce((sum, s) => sum + (parseFloat(s.loss) || 0), 0);
    const totalAmountPaid = filteredSales.reduce((sum, s) => sum + (parseFloat(s.amountPaid) || 0), 0);
    const totalBalanceDue = filteredSales.reduce((sum, s) => sum + (parseFloat(s.balanceDue) || 0), 0);
    return {
      salePrice: totalSalePrice.toFixed(2),
      profit: totalProfit.toFixed(2),
      loss: totalLoss.toFixed(2),
      amountPaid: totalAmountPaid.toFixed(2),
      balanceDue: totalBalanceDue.toFixed(2)
    };
  }, [filteredSales]);

  const renderCell = (column, value) => {
    if (column.key === 'product') {
      return value;
    }
    if (column.isPrice) {
      return value ? `UGX ${parseFloat(value).toLocaleString()}` : '-';
    }
    if (column.isProfit) {
      return value !== '-' ? (
        <span className="text-green-600 dark:text-green-400 font-medium">+UGX {parseFloat(value).toLocaleString()}</span>
      ) : '-';
    }
    if (column.isLoss) {
      return value !== '-' ? (
        <span className="text-red-600 dark:text-red-400 font-medium">-UGX {parseFloat(value).toLocaleString()}</span>
      ) : '-';
    }
    return value || '-';
  };

  const renderTotalCell = (column) => {
    const value = totals[column.key];
    if (column.key === 'saleDate') {
      return <span className="font-bold">TOTAL</span>;
    }
    if (column.key === 'product') {
      return <span className="font-bold">{filteredSales.length} sales</span>;
    }
    if (column.isPrice) {
      return <span className="font-bold">UGX {parseFloat(value).toLocaleString()}</span>;
    }
    if (column.isProfit) {
      return <span className="text-green-600 dark:text-green-400 font-bold">+UGX {parseFloat(value).toLocaleString()}</span>;
    }
    if (column.isLoss) {
      return <span className="text-red-600 dark:text-red-400 font-bold">-UGX {parseFloat(value).toLocaleString()}</span>;
    }
    return value;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Electronic View Sales</h1>
        <button
          onClick={fetchSales}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="thisMonth">This Month</option>
              <option value="thisYear">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          {filterType === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <span className="text-gray-500 dark:text-gray-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}

          {/* Profit/Loss Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profit/Loss:</label>
            <select
              value={profitLossFilter}
              onChange={(e) => setProfitLossFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All</option>
              <option value="profit">Profit Only</option>
              <option value="loss">Loss Only</option>
            </select>
          </div>
          
          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredSales.length} of {sales.length} sales
          </div>
        </div>
      </div>

      {/* Sales Table with Totals */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {formattedSales.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No sales records found
                  </td>
                </tr>
              ) : (
                formattedSales.map((sale, index) => (
                  <tr key={sale.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                      >
                        {renderCell(column, sale[column.key])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
              {/* Totals Row */}
              <tr className="bg-gray-100 dark:bg-gray-600 font-bold">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                  >
                    {renderTotalCell(column)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ElectronicViewSale;
