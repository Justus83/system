import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscriptionsAPI } from '../services/api';
import SubscriptionPlans from '../components/SubscriptionPlans';

const ManageSubscription = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState({ type: '', text: '' });
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await subscriptionsAPI.getSubscriptionByUserId(user.id);
      setSubscription(response.data);
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
    }
  };

  const handleSubscriptionChange = async (planId) => {
    setMessage({ type: '', text: '' });
    
    if (!subscription) {
      setMessage({ type: 'error', text: 'No subscription found' });
      return;
    }

    if (subscription.plan === planId) {
      return;
    }

    setSubscriptionLoading(true);
    try {
      await subscriptionsAPI.upgradePlan(subscription.id, planId);
      setMessage({ type: 'success', text: 'Subscription updated successfully' });
      fetchSubscription();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update subscription' });
    } finally {
      setSubscriptionLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Subscription</h1>
      
      {message.text && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select the perfect plan for your business needs
          </p>
        </div>

        {subscription && (
          <div className="card max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {subscription.planDisplayName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  ${subscription.price}/month
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  subscription.active 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                }`}>
                  {subscription.active ? '✓ Active' : '✗ Inactive'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t dark:border-gray-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {subscription.maxStores === -1 ? '∞' : subscription.maxStores}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stores</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {subscription.maxUsers === -1 ? '∞' : subscription.maxUsers}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {subscription.maxBranches === -1 ? '∞' : subscription.maxBranches}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Branches</p>
              </div>
            </div>
          </div>
        )}

        <SubscriptionPlans
          currentPlan={subscription?.plan}
          onSelectPlan={handleSubscriptionChange}
          loading={subscriptionLoading}
        />

        {!subscription && (
          <div className="text-center mt-8">
            <p className="text-gray-500 dark:text-gray-400">
              No active subscription found. Please select a plan to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSubscription;
