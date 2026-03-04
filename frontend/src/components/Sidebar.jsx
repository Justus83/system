import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storeAccessAPI } from '../services/api';

const Sidebar = () => {
  const { isAuthenticated, user, selectedStore } = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [brokersOpen, setBrokersOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [barProductsOpen, setBarProductsOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [investmentOpen, setInvestmentOpen] = useState(false);
  const [returnsOpen, setReturnsOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [hostelsOpen, setHostelsOpen] = useState(false);
  const [apartmentsOpen, setApartmentsOpen] = useState(false);
  const [housesOpen, setHousesOpen] = useState(false);
  const [barInventoryOpen, setBarInventoryOpen] = useState(false);

  // Check if the selected store is an electronics shop
  const isElectronicsShop = selectedStore?.shop?.shopType === 'ELECTRONICS';
  const isRentalsShop = selectedStore?.shop?.shopType === 'RENTALS';
  const isBarShop = selectedStore?.shop?.shopType === 'BAR';
  const hasBrokers = isElectronicsShop;

  const fetchUserRole = async () => {
    try {
      const response = await storeAccessAPI.getStoreAccessByUser(user.id);
      
      if (response.data && response.data.length > 0) {
        // Find the store access for the selected store
        const storeAccess = selectedStore 
          ? response.data.find(sa => sa.storeId === selectedStore.id) || response.data[0]
          : response.data[0];
        
        setUserRole(storeAccess.role);
      } else {
        setUserRole(null);
      }
    } catch (err) {
      console.error('Failed to fetch user role:', err);
      setUserRole(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserRole();
    }
  }, [isAuthenticated, user?.id, selectedStore]);

  useEffect(() => {
    if (location.pathname === '/brokers' || location.pathname === '/broker-transactions') {
      setBrokersOpen(true);
    }
    if (location.pathname === '/electronic-products' || location.pathname.startsWith('/electronic-products')) {
      setProductsOpen(true);
    }
    if (location.pathname === '/bar-products' || location.pathname.startsWith('/bar-products')) {
      setBarProductsOpen(true);
    }
    if (location.pathname === '/electronic-sale' || location.pathname === '/credit-sales' || location.pathname === '/sales') {
      setSalesOpen(true);
    }
    if (location.pathname === '/settings' || location.pathname.startsWith('/settings')) {
      setSettingsOpen(true);
    }
    if (location.pathname === '/investments' || location.pathname === '/shipments') {
      setInvestmentOpen(true);
    }
    if (location.pathname === '/returns' || location.pathname === '/supplier-returns') {
      setReturnsOpen(true);
    }
    if (location.pathname === '/inventory') {
      setInventoryOpen(true);
    }
    if (location.pathname === '/rental-hostels' || location.pathname === '/rental-rooms') {
      setHostelsOpen(true);
    }
    if (location.pathname === '/rental-apartments-list' || location.pathname === '/rental-suites') {
      setApartmentsOpen(true);
    }
    if (location.pathname === '/rental-houses-list' || location.pathname === '/rental-house-rooms') {
      setHousesOpen(true);
    }
    if (location.pathname === '/bar-counters' || location.pathname === '/bar-inventory') {
      setBarInventoryOpen(true);
    }
  }, [location.pathname]);

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      ownerOnly: true, // Only OWNER can see
      electronicsOnly: true, // Only for electronics shops
    },
    {
      name: 'Rental Dashboard',
      path: '/rental-dashboard',
      rentalsOnly: true, // Only for rentals shops
    },
    {
      name: 'Bar Dashboard',
      path: '/bar-dashboard',
      barOnly: true, // Only for bar shops
    },
    {
      name: 'Tenants',
      path: '/rental-tenants',
      rentalsOnly: true,
    },
    {
      name: 'Payments',
      path: '/rental-payments',
      rentalsOnly: true,
    },
    {
      name: 'Suppliers',
      path: '/suppliers',
    },
    {
      name: 'Employees',
      path: '/employees',
      ownerOnly: true, // Only OWNER can see
    },
    {
      name: 'Expenses',
      path: '/expenses',
    },
  ];

  const returnsMenuItems = [
    {
      name: 'Shop Returns',
      path: '/returns',
      electronicsOnly: true, // Only for electronics shops
    },
    {
      name: 'Supplier Returns',
      path: '/supplier-returns',
      electronicsOnly: true, // Only for electronics shops
    },
  ];

  const investmentMenuItems = [
    {
      name: 'Investments',
      path: '/investments',
      ownerOnly: true, // Only OWNER can see
      electronicsOnly: true, // Only for electronics shops
    },
    {
      name: 'Shipments',
      path: '/shipments',
      electronicsOnly: true, // Only for electronics shops
    },
  ];

  const brokerMenuItems = [
    {
      name: 'View Brokers',
      path: '/brokers',
    },
    {
      name: 'Broker Transactions',
      path: '/broker-transactions',
    },
  ];

  const productMenuItems = [
    {
      name: 'Smartphones',
      path: '/electronic-products?tab=smartphones',
    },
    {
      name: 'Laptops',
      path: '/electronic-products?tab=laptops',
    },
    {
      name: 'Tablets',
      path: '/electronic-products?tab=tablets',
    },
    {
      name: 'Smartwatches',
      path: '/electronic-products?tab=smartwatches',
    },
    {
      name: 'TVs',
      path: '/electronic-products?tab=tvs',
    },
    {
      name: 'Accessories',
      path: '/electronic-products?tab=accessories',
    },
  ];

  const barProductMenuItems = [
    {
      name: 'Beers',
      path: '/bar-products?type=beer',
    },
    {
      name: 'Spirits',
      path: '/bar-products?type=spirit',
    },
    {
      name: 'Wines',
      path: '/bar-products?type=wine',
    },
    {
      name: 'Champagnes',
      path: '/bar-products?type=champagne',
    },
    {
      name: 'Juices',
      path: '/bar-products?type=juice',
    },
    {
      name: 'Soft Drinks',
      path: '/bar-products?type=softdrink',
    },
  ];

  const salesMenuItems = [
    {
      name: 'Sale',
      path: '/electronic-sale',
    },
    {
      name: 'View Sales',
      path: '/view-sales',
    },
    {
      name: 'Credit',
      path: '/credit-sales',
    },
  ];

  const settingsMenuItems = [
    {
      name: 'Settings',
      path: '/settings/change-password',
    },
    {
      name: 'Stores',
      path: '/settings/stores',
      ownerOnly: true, // Only OWNER can see
    },
    {
      name: 'Branches',
      path: '/settings/branches',
      ownerOnly: true, // Only OWNER can see
    },
    {
      name: 'Subscription',
      path: '/settings/subscription',
      ownerOnly: true, // Only OWNER can see
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isBrokersActive = () => {
    return location.pathname === '/brokers' || location.pathname === '/broker-transactions';
  };

  const isProductsActive = () => {
    return location.pathname === '/electronic-products' || location.pathname.startsWith('/electronic-products');
  };

  const isSalesActive = () => {
    return location.pathname === '/electronic-sale' || location.pathname === '/credit-sales' || location.pathname === '/sales';
  };

  const isSettingsActive = () => {
    return location.pathname === '/settings' || location.pathname.startsWith('/settings');
  };

  const isInvestmentActive = () => {
    return location.pathname === '/investments' || location.pathname === '/shipments';
  };

  const isReturnsActive = () => {
    return location.pathname === '/returns' || location.pathname === '/supplier-returns';
  };

  const isInventoryActive = () => {
    return location.pathname === '/inventory';
  };

  const isHostelsActive = () => {
    return location.pathname === '/rental-hostels' || location.pathname === '/rental-rooms';
  };

  const isApartmentsActive = () => {
    return location.pathname === '/rental-apartments-list' || location.pathname === '/rental-suites';
  };

  const isHousesActive = () => {
    return location.pathname === '/rental-houses-list' || location.pathname === '/rental-house-rooms';
  };

  const isBarInventoryActive = () => {
    return location.pathname === '/bar-counters' || location.pathname === '/bar-inventory';
  };

  const inventoryMenuItems = [
    {
      name: 'Price',
      path: '/inventory?tab=price',
      ownerOnly: true, // Only OWNER can see
    },
    {
      name: 'Stock',
      path: '/inventory?tab=stock',
    },
    {
      name: 'Stock Amount',
      path: '/inventory?tab=stockAmount',
    },
  ];

  const hostelsMenuItems = [
    {
      name: 'Hostels',
      path: '/rental-hostels',
    },
    {
      name: 'Rooms',
      path: '/rental-rooms',
    },
  ];

  const apartmentsMenuItems = [
    {
      name: 'Apartments',
      path: '/rental-apartments-list',
    },
    {
      name: 'Suites',
      path: '/rental-suites',
    },
  ];

  const housesMenuItems = [
    {
      name: 'Houses',
      path: '/rental-houses-list',
    },
    {
      name: 'Rooms',
      path: '/rental-house-rooms',
    },
  ];

  const barInventoryMenuItems = [
    {
      name: 'Counters',
      path: '/bar-counters',
    },
    {
      name: 'Inventory',
      path: '/bar-inventory',
    },
  ];



  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200 z-30">
      <div className="h-full overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            // Hide menu item if it's owner-only and user is not OWNER
            if (item.ownerOnly && userRole !== 'OWNER') {
              return null;
            }
            
            // Hide menu item if it's electronics-only and store is not electronics
            if (item.electronicsOnly && !isElectronicsShop) {
              return null;
            }
            
            // Hide menu item if it's rentals-only and store is not rentals
            if (item.rentalsOnly && !isRentalsShop) {
              return null;
            }

            // Hide menu item if it's bar-only and store is not bar
            if (item.barOnly && !isBarShop) {
              return null;
            }
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Rental Houses Dropdown - Only for rentals shops */}
          {isRentalsShop && (
            <div className="pt-2">
              <button
                onClick={() => setHousesOpen(!housesOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isHousesActive()
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Rental Houses</span>
                <svg
                  className={`w-4 h-4 transition-transform ${housesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {housesOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {housesMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Apartments Dropdown - Only for rentals shops */}
          {isRentalsShop && (
            <div className="pt-2">
              <button
                onClick={() => setApartmentsOpen(!apartmentsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isApartmentsActive()
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Apartments</span>
                <svg
                  className={`w-4 h-4 transition-transform ${apartmentsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {apartmentsOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {apartmentsMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hostels Dropdown - Only for rentals shops */}
          {isRentalsShop && (
            <div className="pt-2">
              <button
                onClick={() => setHostelsOpen(!hostelsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isHostelsActive()
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Hostels</span>
                <svg
                  className={`w-4 h-4 transition-transform ${hostelsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {hostelsOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {hostelsMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Returns Dropdown */}
          {isElectronicsShop && (
            <div className="pt-2">
              <button
                onClick={() => setReturnsOpen(!returnsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isReturnsActive()
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Returns</span>
                <svg
                  className={`w-4 h-4 transition-transform ${returnsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {returnsOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {returnsMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Investment Dropdown */}
          {isElectronicsShop && (
            <div className="pt-2">
              <button
                onClick={() => setInvestmentOpen(!investmentOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isInvestmentActive()
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Investment</span>
                <svg
                  className={`w-4 h-4 transition-transform ${investmentOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {investmentOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {investmentMenuItems.map((item) => {
                    // Hide menu item if it's owner-only and user is not OWNER
                    if (item.ownerOnly && userRole !== 'OWNER') {
                      return null;
                    }
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive(item.path)
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Sales Dropdown */}
          {isElectronicsShop && (
            <div className="pt-2">
              <button
                onClick={() => setSalesOpen(!salesOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isSalesActive()
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Sales</span>
                <svg
                  className={`w-4 h-4 transition-transform ${salesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {salesOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {salesMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Products Dropdown */}
          {isElectronicsShop && (
            <div className="pt-2">
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isProductsActive()
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Products</span>
                <svg
                  className={`w-4 h-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {productsOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {productMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isProductsActive()
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bar Products Dropdown */}
          {isBarShop && (
            <div className="pt-2">
              <button
                onClick={() => setBarProductsOpen(!barProductsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/bar-products')
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Products</span>
                <svg
                  className={`w-4 h-4 transition-transform ${barProductsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {barProductsOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {barProductMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname.startsWith('/bar-products')
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bar Inventory Dropdown */}
          {isBarShop && (
            <div className="pt-2">
              <button
                onClick={() => setBarInventoryOpen(!barInventoryOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isBarInventoryActive()
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Inventory</span>
                <svg
                  className={`w-4 h-4 transition-transform ${barInventoryOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {barInventoryOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {barInventoryMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bar Sales */}
          {isBarShop && (
            <div className="pt-2">
              <Link
                to="/bar-sales"
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/bar-sales'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Sales</span>
              </Link>
            </div>
          )}

          {/* Brokers Dropdown - Only for electronics shops */}
          {hasBrokers && (
            <div className="pt-2">
              <button
                onClick={() => setBrokersOpen(!brokersOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isBrokersActive()
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Brokers</span>
                <svg
                  className={`w-4 h-4 transition-transform ${brokersOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {brokersOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {brokerMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Inventory Dropdown */}
          {isElectronicsShop && (
            <div className="pt-2">
              <button
                onClick={() => setInventoryOpen(!inventoryOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isInventoryActive()
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>Inventory</span>
                <svg
                  className={`w-4 h-4 transition-transform ${inventoryOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {inventoryOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                  {inventoryMenuItems.map((item) => {
                    // Hide menu item if it's owner-only and user is not OWNER
                    if (item.ownerOnly && userRole !== 'OWNER') {
                      return null;
                    }
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive(item.path)
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Settings Dropdown */}
          <div className="pt-2">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isSettingsActive()
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>Settings</span>
              <svg
                className={`w-4 h-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {settingsOpen && (
              <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                {settingsMenuItems.map((item) => {
                  // Hide menu item if it's owner-only and user is not OWNER
                  if (item.ownerOnly && userRole !== 'OWNER') {
                    return null;
                  }
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
