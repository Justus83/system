import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, storeAccessAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Inventory = () => {
  const { user, selectedStore } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'price');
  const [loading, setLoading] = useState(true);
  
  const [products, setProducts] = useState([]);
  const [priceSearch, setPriceSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [productForPriceEdit, setProductForPriceEdit] = useState(null);
  const [priceValue, setPriceValue] = useState('');
  
  const [stockData, setStockData] = useState([]);
  
  const [stockAmount, setStockAmount] = useState({
    supplierStock: 0,
    otherStock: 0,
    totalStock: 0
  });

  // Fetch products
  useEffect(() => {
    if (!selectedStore) {
      setLoading(false);
      return;
    }
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [smartphones, laptops, tablets, smartwatches, tvs, accessories] = await Promise.all([
          productsAPI.getSmartphonesByStore(selectedStore.id),
          productsAPI.getLaptopsByStore(selectedStore.id),
          productsAPI.getTabletsByStore(selectedStore.id),
          productsAPI.getSmartwatchesByStore(selectedStore.id),
          productsAPI.getTVsByStore(selectedStore.id),
          productsAPI.getAccessoriesByStore(selectedStore.id)
        ]);

        const allProducts = [
          ...(smartphones.data || []).map(p => ({ ...p, type: 'Smartphone' })),
          ...(laptops.data || []).map(p => ({ ...p, type: 'Laptop' })),
          ...(tablets.data || []).map(p => ({ ...p, type: 'Tablet' })),
          ...(smartwatches.data || []).map(p => ({ ...p, type: 'Smartwatch' })),
          ...(tvs.data || []).map(p => ({ ...p, type: 'TV' })),
          ...(accessories.data || []).map(p => ({ ...p, type: 'Accessory' }))
        ];

        const availableProducts = allProducts.filter(p => p.status === 'AVAILABLE');
        setProducts(availableProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedStore]);

  // Fetch stock data
  useEffect(() => {
    if (!selectedStore) return;
    
    const fetchStock = async () => {
      try {
        const [smartphones, laptops, tablets, smartwatches, tvs, accessories] = await Promise.all([
          productsAPI.getSmartphonesByStore(selectedStore.id),
          productsAPI.getLaptopsByStore(selectedStore.id),
          productsAPI.getTabletsByStore(selectedStore.id),
          productsAPI.getSmartwatchesByStore(selectedStore.id),
          productsAPI.getTVsByStore(selectedStore.id),
          productsAPI.getAccessoriesByStore(selectedStore.id)
        ]);

        const allProducts = [
          ...(smartphones.data || []).map(p => ({ ...p, type: 'Smartphone' })),
          ...(laptops.data || []).map(p => ({ ...p, type: 'Laptop' })),
          ...(tablets.data || []).map(p => ({ ...p, type: 'Tablet' })),
          ...(smartwatches.data || []).map(p => ({ ...p, type: 'Smartwatch' })),
          ...(tvs.data || []).map(p => ({ ...p, type: 'TV' })),
          ...(accessories.data || []).map(p => ({ ...p, type: 'Accessory' }))
        ];

        const availableProducts = allProducts.filter(p => p.status === 'AVAILABLE');

        const grouped = {};
        availableProducts.forEach(product => {
          const deviceType = product.type || 'Unknown';
          const deviceModel = product.modelEntity?.name || product.model || 'Unknown';
          const color = product.colorEntity?.name || product.color || 'N/A';
          const storage = product.storageSizeEntity?.name || product.storageSize || 'N/A';
          const ram = product.ramSizeEntity?.name || product.ramSize || 'N/A';
          const condition = product.productCondition || 'BOXED';
          const screenSize = product.screenSize || 'N/A';
          const resolution = product.resolution || 'N/A';
          const caseSizeMM = product.caseSizeMM || 'N/A';

          const key = `${deviceType}-${deviceModel}-${color}-${storage}-${ram}-${screenSize}-${resolution}-${caseSizeMM}-${condition}`;
          
          if (grouped[key]) {
            grouped[key].quantity += 1;
          } else {
            grouped[key] = {
              deviceType,
              deviceModel,
              color,
              storage,
              ram,
              screenSize,
              resolution,
              caseSizeMM,
              condition,
              quantity: 1
            };
          }
        });

        setStockData(Object.values(grouped));
      } catch (err) {
        console.error('Failed to fetch stock data:', err);
      }
    };
    
    fetchStock();
  }, [selectedStore]);

  // Fetch stock amount
  useEffect(() => {
    if (!selectedStore) return;
    
    const fetchStockAmount = async () => {
      try {
        const [smartphones, laptops, tablets, smartwatches, tvs, accessories] = await Promise.all([
          productsAPI.getSmartphonesByStore(selectedStore.id),
          productsAPI.getLaptopsByStore(selectedStore.id),
          productsAPI.getTabletsByStore(selectedStore.id),
          productsAPI.getSmartwatchesByStore(selectedStore.id),
          productsAPI.getTVsByStore(selectedStore.id),
          productsAPI.getAccessoriesByStore(selectedStore.id)
        ]);

        const allProducts = [
          ...(smartphones.data || []),
          ...(laptops.data || []),
          ...(tablets.data || []),
          ...(smartwatches.data || []),
          ...(tvs.data || []),
          ...(accessories.data || [])
        ];

        const availableProducts = allProducts.filter(p => p.status === 'AVAILABLE');

        let supplierStock = 0;
        let otherStock = 0;

        availableProducts.forEach(product => {
          const costPrice = product.costPrice || 0;
          if (product.supplierId) {
            supplierStock += costPrice;
          } else {
            otherStock += costPrice;
          }
        });

        setStockAmount({
          supplierStock,
          otherStock,
          totalStock: supplierStock + otherStock
        });
      } catch (err) {
        console.error('Failed to fetch stock amount:', err);
      }
    };
    
    fetchStockAmount();
  }, [selectedStore]);

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['price', 'stock', 'stockAmount'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleUpdatePrice = async (productId) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const data = {
        ...product,
        costPrice: parseFloat(priceValue)
      };

      switch (product.type) {
        case 'Smartphone':
          await productsAPI.updateSmartphone(productId, data);
          break;
        case 'Laptop':
          await productsAPI.updateLaptop(productId, data);
          break;
        case 'Tablet':
          await productsAPI.updateTablet(productId, data);
          break;
        case 'Smartwatch':
          await productsAPI.updateSmartwatch(productId, data);
          break;
        case 'TV':
          await productsAPI.updateTV(productId, data);
          break;
        case 'Accessory':
          await productsAPI.updateAccessory(productId, data);
          break;
        default:
          break;
      }

      setShowPriceModal(false);
      setProductForPriceEdit(null);
      setPriceValue('');
      
      // Refresh products
      const [smartphones, laptops, tablets, smartwatches, tvs, accessories] = await Promise.all([
        productsAPI.getSmartphonesByStore(selectedStore.id),
        productsAPI.getLaptopsByStore(selectedStore.id),
        productsAPI.getTabletsByStore(selectedStore.id),
        productsAPI.getSmartwatchesByStore(selectedStore.id),
        productsAPI.getTVsByStore(selectedStore.id),
        productsAPI.getAccessoriesByStore(selectedStore.id)
      ]);

      const allProducts = [
        ...(smartphones.data || []).map(p => ({ ...p, type: 'Smartphone' })),
        ...(laptops.data || []).map(p => ({ ...p, type: 'Laptop' })),
        ...(tablets.data || []).map(p => ({ ...p, type: 'Tablet' })),
        ...(smartwatches.data || []).map(p => ({ ...p, type: 'Smartwatch' })),
        ...(tvs.data || []).map(p => ({ ...p, type: 'TV' })),
        ...(accessories.data || []).map(p => ({ ...p, type: 'Accessory' }))
      ];
      setProducts(allProducts.filter(p => p.status === 'AVAILABLE'));
    } catch (err) {
      console.error('Failed to update price:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const searchLower = priceSearch.toLowerCase();
    const modelName = product.modelEntity?.name || product.model || '';
    const brandName = product.brandEntity?.name || product.brand || '';
    const serialNumber = product.serialNumber || '';
    const category = product.category || product.name || '';
    const colorName = product.colorEntity?.name || product.color || '';
    const storageName = product.storageSizeEntity?.name || product.storageSize || '';
    const ramName = product.ramSizeEntity?.name || product.ramSize || '';

    return (
      modelName.toLowerCase().includes(searchLower) ||
      brandName.toLowerCase().includes(searchLower) ||
      serialNumber.toLowerCase().includes(searchLower) ||
      category.toLowerCase().includes(searchLower) ||
      colorName.toLowerCase().includes(searchLower) ||
      storageName.toLowerCase().includes(searchLower) ||
      ramName.toLowerCase().includes(searchLower)
    );
  });

  const filteredStockData = stockData.filter(item => {
    if (!stockSearch) return true;
    const search = stockSearch.toLowerCase();
    return (
      (item.deviceType || '').toLowerCase().includes(search) ||
      (item.deviceModel || '').toLowerCase().includes(search) ||
      (item.color || '').toLowerCase().includes(search) ||
      (item.storage || '').toLowerCase().includes(search) ||
      (item.ram || '').toLowerCase().includes(search)
    );
  });

  const getConditionClass = (condition) => {
    const cond = (condition || 'BOXED').toLowerCase();
    if (cond === 'boxed') return 'condition-boxed';
    if (cond === 'used') return 'condition-used';
    return '';
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {activeTab === 'price' && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by device model, serial, brand, storage, etc..."
              value={priceSearch}
              onChange={(e) => setPriceSearch(e.target.value)}
              className="input-field w-full max-w-md"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Serial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Storage / RAM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Screen Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Resolution / Case Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Available Products</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No products found in inventory.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {product.type === 'Accessory' 
                          ? `${product.brandEntity?.name || product.brand} - ${product.name || product.category}`
                          : `${product.brandEntity?.name || product.brand} ${product.modelEntity?.name || product.model}`
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.serialNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="storage-info">
                          {product.type === 'Accessory' 
                            ? (product.supplierName || 'N/A')
                            : (() => {
                                const storage = product.storageSizeEntity?.name || product.storageSize || '';
                                const ram = product.ramSizeEntity?.name || product.ramSize || '';
                                if (storage && ram) return `${storage} / ${ram}`;
                                return storage || ram || 'N/A';
                              })()
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.type === 'TV' ? (product.screenSize || 'N/A') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.type === 'TV'
                          ? (product.resolution || 'N/A')
                          : product.type === 'Smartwatch'
                            ? (product.caseSizeMM || 'N/A')
                            : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {product.type === 'Accessory' 
                          ? (product.storeName || 'N/A')
                          : (product.costPrice && product.costPrice > 0 ? `UGX ${product.costPrice.toLocaleString()}` : <span className="no-price-text">Not Set</span>)
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="color-info">
                          {product.type === 'Accessory' 
                            ? 'N/A'
                            : (product.colorEntity?.name || product.color || 'N/A')
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setProductForPriceEdit(product);
                            setPriceValue(product.costPrice ?? '');
                            setShowPriceModal(true);
                          }}
                          className="edit-btn"
                          title="Edit Price"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by type, model, color, storage, etc..."
              value={stockSearch}
              onChange={(e) => setStockSearch(e.target.value)}
              className="input-field w-full max-w-md"
            />
          </div>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Device Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Device Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Storage / RAM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Screen Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Resolution / Case Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStockData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 2v7 00-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Products in Stock</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No available products in stock.</p>
                  </td>
                </tr>
              ) : (
                filteredStockData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.deviceType || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.deviceModel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.color}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.storage || 'N/A'}{item.ram ? ` / ${item.ram}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.deviceType === 'TV' ? (item.screenSize || 'N/A') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.deviceType === 'TV'
                        ? (item.resolution || 'N/A')
                        : item.deviceType === 'Smartwatch'
                          ? (item.caseSizeMM || 'N/A')
                          : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`condition-badge ${getConditionClass(item.condition)}`}>
                        {item.condition === 'boxed' ? 'BOXED' : item.condition === 'used' ? 'USED' : item.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      {item.quantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {activeTab === 'stockAmount' && (
        <div className="max-w-2xl">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Stock Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-blue-600">Supplier Stock</div>
                  <div className="text-xs text-gray-500">Available products from suppliers</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    <span className="text-blue-500 mr-1">UGX</span>
                    {stockAmount.supplierStock.toLocaleString()}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-blue-600">Other Sources</div>
                  <div className="text-xs text-gray-500">Available products from other sources</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    <span className="text-blue-500 mr-1">UGX</span>
                    {stockAmount.otherStock.toLocaleString()}
                  </span>
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                <td className="px-6 py-4">
                  <div className="text-base font-bold text-gray-900 dark:text-white">Total Stock Value</div>
                  <div className="text-xs text-gray-500">Total value of all available products</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-bold text-red-600">
                    <span className="text-red-500 mr-1">UGX</span>
                    {stockAmount.totalStock.toLocaleString()}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Price Modal */}
      {showPriceModal && productForPriceEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => { setShowPriceModal(false); setProductForPriceEdit(null); setPriceValue(''); }}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Price</h3>
                  <button
                    onClick={() => { setShowPriceModal(false); setProductForPriceEdit(null); setPriceValue(''); }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {productForPriceEdit.type === 'Accessory'
                    ? `${productForPriceEdit.brandEntity?.name || productForPriceEdit.brand} - ${productForPriceEdit.name || productForPriceEdit.category}`
                    : `${productForPriceEdit.brandEntity?.name || productForPriceEdit.brand} ${productForPriceEdit.modelEntity?.name || productForPriceEdit.model}`}
                  {productForPriceEdit.serialNumber && (
                    <span className="block text-gray-500 dark:text-gray-500 mt-1">Serial: {productForPriceEdit.serialNumber}</span>
                  )}
                </p>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cost Price (UGX)</label>
                <input
                  type="number"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  className="input-field w-full mb-4"
                  placeholder="Enter price"
                  min="0"
                  step="1000"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowPriceModal(false); setProductForPriceEdit(null); setPriceValue(''); }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => productForPriceEdit?.id && handleUpdatePrice(productForPriceEdit.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .storage-info {
          font-weight: 500;
          color: #2c3e50;
          background-color: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }
        .color-info {
          font-weight: 500;
          color: #2c3e50;
          background-color: #f8f9fa;
          padding: 4px 12px;
          border-radius: 4px;
          border: 1px solid #e9ecef;
          display: inline-block;
        }
        .edit-btn {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: background-color 0.3s;
        }
        .edit-btn:hover {
          background-color: #2980b9;
        }
        .no-price-text {
          color: red;
          font-style: italic;
        }
        .condition-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .condition-boxed {
          background-color: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #c8e6c9;
        }
        .condition-used {
          background-color: #fff3e0;
          color: #ef6c00;
          border: 1px solid #ffe0b2;
        }
      `}</style>
    </div>
  );
};

export default Inventory;
