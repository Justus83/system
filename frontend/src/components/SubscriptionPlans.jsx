import { useState } from 'react';

const SubscriptionPlans = ({ currentPlan, onSelectPlan, loading }) => {
  const plans = [
    {
      id: 'STARTER',
      name: 'Starter',
      price: 8.00,
      popular: false,
      features: [
        '1 Store',
        'No Branches',
        'Basic Support',
        'Email Support'
      ]
    },
    {
      id: 'PRO',
      name: 'Pro',
      price: 12.99,
      popular: true,
      features: [
        '2 Stores',
        '2 Branches per Store',
        'Priority Support',
        'Advanced Analytics'
      ]
    },
    {
      id: 'ULTIMATE',
      name: 'Ultimate',
      price: 30.00,
      popular: false,
      features: [
        '5 Stores',
        '10 Branches per Store',
        'Premium Support',
        '24/7 Support',
        'Advanced Analytics',
        'Custom Integrations'
      ]
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: 50.00,
      popular: false,
      features: [
        'Unlimited Stores',
        'Unlimited Branches',
        'Dedicated Support',
        '24/7 Priority Support',
        'Advanced Analytics',
        'Custom Integrations',
        'API Access'
      ]
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative card hover:shadow-xl transition-all ${
            plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
          } ${
            currentPlan === plan.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
          )}
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {plan.name}
            </h3>
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${plan.price}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelectPlan(plan.id)}
            disabled={loading || currentPlan === plan.id}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
              currentPlan === plan.id
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                : plan.popular
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            } disabled:opacity-50`}
          >
            {currentPlan === plan.id ? 'Current Plan' : loading ? 'Processing...' : 'Select Plan'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
