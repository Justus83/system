import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WhatsAppButton from '../components/WhatsAppButton';

const WhatWeDo = () => {
  const { isAuthenticated } = useAuth();

  const services = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      title: 'Websites',
      description: 'Custom-built, responsive websites tailored to your business needs. From landing pages to complex web applications.',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Modern UI/UX']
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android that deliver exceptional user experiences.',
      features: ['iOS & Android', 'Cross-Platform', 'Offline Support', 'Push Notifications']
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      title: 'Business Systems',
      description: 'Comprehensive management systems designed to streamline your business operations and boost productivity.',
      features: ['Inventory Management', 'Sales Tracking', 'Analytics & Reports', 'Multi-User Access']
    }
  ];

  const systemFeatures = [
    {
      title: 'Electronics Shop Management',
      description: 'Complete solution for managing electronics retail businesses with inventory, sales, and customer management.',
      icon: '📱'
    },
    {
      title: 'Rental Property Management',
      description: 'Streamline your rental business with tenant management, payment tracking, and maintenance requests.',
      icon: '🏠'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              What We Do
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              We build digital solutions that transform businesses. From websites to mobile apps and complete business management systems.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We offer a full range of digital services to help your business succeed in the modern world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="card hover:shadow-xl transition-all duration-300"
            >
              <div className="text-primary-600 dark:text-primary-400 mb-4">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Business Systems Showcase */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Management System
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A powerful, all-in-one business management platform currently supporting electronics shops and rental properties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {systemFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            {!isAuthenticated ? (
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-3 inline-block"
              >
                Try Our System Free for 1 Month
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="btn-primary text-lg px-8 py-3 inline-block"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Why Choose DY Tech UG?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Quick turnaround times without compromising quality
              </p>
            </div>
            <div className="card">
              <div className="text-3xl mb-3">💎</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Quality Code
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Clean, maintainable, and scalable solutions
              </p>
            </div>
            <div className="card">
              <div className="text-3xl mb-3">🛠️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ongoing Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We're here to help even after launch
              </p>
            </div>
            <div className="card">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Fair Pricing
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Transparent pricing with no hidden costs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Let's discuss how we can help transform your business with our digital solutions.
          </p>
          <Link
            to="/"
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default WhatWeDo;
