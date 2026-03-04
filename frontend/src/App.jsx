import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import WhatWeDo from './pages/WhatWeDo';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ElectronicDashboard from './pages/ElectronicDashboard';
import Setup from './pages/Setup';
import Suppliers from './pages/Suppliers';
import Employees from './pages/Employees';
import ElectronicProducts from './pages/ElectronicProducts';
import ElectronicBrokers from './pages/ElectronicBrokers';
import ElectronicBrokerTransactions from './pages/ElectronicBrokerTransactions';
import ElectronicSale from './pages/ElectronicSale';
import ElectronicCredit from './pages/ElectronicCredit';
import ElectronicViewSale from './pages/ElectronicViewSale';
import ElectronicInvestments from './pages/ElectronicInvestments';
import ElectronicShipments from './pages/ElectronicShipments';
import ElectronicReturns from './pages/ElectronicReturns';
import ElectronicSupplierReturns from './pages/ElectronicSupplierReturns';
import Expenses from './pages/Expenses';
import ElectronicInventory from './pages/ElectronicInventory';
import ElectronicChangePassword from './pages/ElectronicChangePassword';
import ManageStores from './pages/ManageStores';
import ManageBranches from './pages/ManageBranches';
import ManageSubscription from './pages/ManageSubscription';
import RentalDashboard from './pages/RentalDashboard';
import RentalHouses from './pages/RentalHouses';
import RentalHousesList from './pages/RentalHousesList';
import RentalHouseRooms from './pages/RentalHouseRooms';
import RentalApartments from './pages/RentalApartments';
import RentalApartmentsList from './pages/RentalApartmentsList';
import RentalSuites from './pages/RentalSuites';
import RentalHostels from './pages/RentalHostels';
import RentalRooms from './pages/RentalRooms';
import RentalTenants from './pages/RentalTenants';
import RentalPayments from './pages/RentalPayments';
import BarDashboard from './pages/BarDashboard';
import BarProducts from './pages/BarProducts';
import BarCounters from './pages/BarCounters';
import BarInventory from './pages/BarInventory';
import BarSales from './pages/BarSales';

// Protected Route Component
const ProtectedRoute = ({ children, excludeRoles = [], requireShopType = null }) => {
  const { isAuthenticated, loading, hasStoreAccess, user, shopType } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasStoreAccess) {
    return <Navigate to="/setup" replace />;
  }

  // Check if user role is excluded from this route
  if (excludeRoles.length > 0 && user?.role && excludeRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if route requires specific shop type
  if (requireShopType && shopType !== requireShopType) {
    console.log('Shop type mismatch:', { requireShopType, shopType });
    // Redirect to appropriate dashboard based on shop type
    if (shopType === 'RENTALS') {
      return <Navigate to="/rental-dashboard" replace />;
    } else if (shopType === 'ELECTRONICS') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/suppliers" replace />;
    }
  }

  return children;
};

// Public Route Component (no redirect for home page)
const PublicRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return children;
};

// Setup Route Component (only accessible if authenticated but no store access)
const SetupRoute = ({ children }) => {
  const { isAuthenticated, loading, hasStoreAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (hasStoreAccess) {
    // Redirect to appropriate dashboard based on shop type
    const savedShopType = localStorage.getItem('shopType');
    if (savedShopType === 'RENTALS') {
      return <Navigate to="/rental-dashboard" replace />;
    } else if (savedShopType === 'ELECTRONICS') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/suppliers" replace />;
    }
  }
  
  return children;
};

// Layout Component with Navbar and Sidebar
const Layout = ({ children, showNavbar = true, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {showNavbar && <Navbar />}
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? 'ml-64' : ''}>
        {children}
      </main>
    </div>
  );
};

// Component to track route changes
const RouteTracker = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Save the current route if user is authenticated and it's not a public route
    if (isAuthenticated && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup') {
      localStorage.setItem('lastRoute', location.pathname);
    }
  }, [location, isAuthenticated]);

  return null;
};

function AppContent() {
  return (
    <Router>
      <RouteTracker />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Layout>
                <Home />
              </Layout>
            </PublicRoute>
          }
        />
        <Route
          path="/what-we-do"
          element={
            <PublicRoute>
              <Layout>
                <WhatWeDo />
              </Layout>
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Layout showNavbar={false}>
                <Login />
              </Layout>
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Layout showNavbar={false}>
                <Signup />
              </Layout>
            </PublicRoute>
          }
        />

        {/* Setup Route - for authenticated users without store access */}
        <Route
          path="/setup"
          element={
            <SetupRoute>
              <Layout showNavbar={false}>
                <Setup />
              </Layout>
            </SetupRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Layout showSidebar>
                <Suppliers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute excludeRoles={['OWNER']}>
              <Layout showSidebar>
                <Employees />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/electronic-products"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicProducts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/brokers"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicBrokers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/broker-transactions"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicBrokerTransactions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/electronic-sale"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicSale />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/credit-sales"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicCredit />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicSale />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-sales"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicViewSale />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicInvestments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipments"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicShipments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/returns"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicReturns />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier-returns"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicSupplierReturns />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Layout showSidebar>
                <Expenses />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={<Navigate to="/settings/change-password" replace />}
        />
        <Route
          path="/settings/change-password"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicChangePassword />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/stores"
          element={
            <ProtectedRoute>
              <Layout showSidebar>
                <ManageStores />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/branches"
          element={
            <ProtectedRoute>
              <Layout showSidebar>
                <ManageBranches />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/subscription"
          element={
            <ProtectedRoute>
              <Layout showSidebar>
                <ManageSubscription />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute requireShopType="ELECTRONICS">
              <Layout showSidebar>
                <ElectronicInventory />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rental Routes */}
        <Route
          path="/rental-dashboard"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-houses"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalHouses />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-houses-list"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalHousesList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-house-rooms"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalHouseRooms />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-apartments"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalApartments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-apartments-list"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalApartmentsList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-suites"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalSuites />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-hostels"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalHostels />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-rooms"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalRooms />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-tenants"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalTenants />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-payments"
          element={
            <ProtectedRoute requireShopType="RENTALS">
              <Layout showSidebar>
                <RentalPayments />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Bar Routes */}
        <Route
          path="/bar-dashboard"
          element={
            <ProtectedRoute requireShopType="BAR">
              <Layout showSidebar>
                <BarDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bar-products"
          element={
            <ProtectedRoute requireShopType="BAR">
              <Layout showSidebar>
                <BarProducts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bar-expenses"
          element={
            <ProtectedRoute requireShopType="BAR">
              <Layout showSidebar>
                <Expenses />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bar-counters"
          element={
            <ProtectedRoute requireShopType="BAR">
              <Layout showSidebar>
                <BarCounters />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bar-inventory"
          element={
            <ProtectedRoute requireShopType="BAR">
              <Layout showSidebar>
                <BarInventory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bar-sales"
          element={
            <ProtectedRoute requireShopType="BAR">
              <Layout showSidebar>
                <BarSales />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
