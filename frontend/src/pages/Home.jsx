import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import WhatsAppButton from '../components/WhatsAppButton';

const Home = () => {
  const { isAuthenticated, hasStoreAccess, shopType, loading } = useAuth();
  const { darkMode } = useTheme();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect authenticated users to their appropriate dashboard
  if (isAuthenticated && hasStoreAccess) {
    if (shopType === 'RENTALS') {
      return <Navigate to="/rental-dashboard" replace />;
    } else if (shopType === 'ELECTRONICS') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Redirect authenticated users without store access to setup
  if (isAuthenticated && !hasStoreAccess) {
    return <Navigate to="/setup" replace />;
  }

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Sales Analytics',
      description: 'Track your sales performance with detailed analytics and reports.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Inventory Management',
      description: 'Manage your electronics inventory efficiently with real-time updates.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Customer Relations',
      description: 'Build stronger relationships with your customers through detailed insights.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Subtitle */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Building Digital Solutions for Modern Businesses
          </h1>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            We create websites, mobile apps, and business management systems that help you grow and succeed.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/what-we-do"
              className="btn-primary text-lg px-8 py-3"
            >
              What We Do
            </Link>
            {!isAuthenticated ? (
              <Link
                to="/signup"
                className="btn-secondary text-lg px-8 py-3"
              >
                Try Our System Free
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="btn-secondary text-lg px-8 py-3"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What We Offer
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to your business needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card hover:shadow-xl transition-shadow duration-300 text-center">
            <div className="text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Websites
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Custom-built, responsive websites that represent your brand and engage your customers.
            </p>
          </div>

          <div className="card hover:shadow-xl transition-shadow duration-300 text-center">
            <div className="text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Mobile Apps
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Native and cross-platform mobile applications for iOS and Android devices.
            </p>
          </div>

          <div className="card hover:shadow-xl transition-shadow duration-300 text-center">
            <div className="text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Business Systems
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Complete management systems to streamline your operations and boost productivity.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/what-we-do"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-lg inline-flex items-center"
          >
            Learn More About Our Services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Featured System */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Management System
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Use our system to manage your business efficiently. Currently supporting electronics shops and rental properties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-8">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Electronics Shop Management
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Complete solution for managing your electronics retail business with inventory tracking, sales management, and customer relations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Inventory Management
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sales & Returns Tracking
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Supplier Management
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-8">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Rental Property Management
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Streamline your rental business with tenant management, payment tracking, and maintenance request handling.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Tenant Management
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Rent Payment Tracking
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Maintenance Requests
                </li>
              </ul>
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="text-center">
            <p className="text-xl text-primary-600 dark:text-primary-400 font-semibold mb-4">
              🎉 Start with a FREE 1-Month Trial!
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Plans starting from $8/month. No credit card required for trial.
            </p>
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-3 inline-block"
              >
                Start Your Free Trial
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Whether you need a website, mobile app, or business management system, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/what-we-do"
              className="btn-secondary text-lg px-8 py-3 inline-block"
            >
              Explore Our Services
            </Link>
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-3 inline-block"
              >
                Try Our System Free
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} DY Tech UG. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default Home;
