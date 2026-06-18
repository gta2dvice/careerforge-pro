import { apiClient, USER_API, PAYMENT_API } from '../api/client';

/**
 * Get current user's subscription plan information
 * @returns {Promise<Object>} Plan info with features, limits, usage
 */
export const fetchPlanInfo = async () => {
  const response = await apiClient.get(`${USER_API}/plan`);
  if (!response.data?.success) {
    throw new Error(response.data?.message || 'Failed to fetch plan info');
  }
  return response.data.data;
};

/**
 * Get all available subscription plans for comparison
 * @returns {Promise<Object>} Plan comparison data
 */
export const fetchAvailablePlans = async () => {
  const response = await apiClient.get(`${USER_API}/plans`);
  if (!response.data?.success) {
    throw new Error(response.data?.message || 'Failed to fetch plans');
  }
  return response.data.data;
};

/**
 * Get user's current usage statistics
 * @returns {Promise<Object>} Usage stats (credits, requests, etc.)
 */
export const fetchUsageStats = async () => {
  const response = await apiClient.get(`${USER_API}/usage`);
  if (!response.data?.success) {
    throw new Error(response.data?.message || 'Failed to fetch usage stats');
  }
  return response.data.data;
};

/**
 * Update user's plan (for testing/admin - will be replaced by Stripe in production)
 * @param {string} plan - 'free' or 'pro'
 * @returns {Promise<Object>} Updated user and plan info
 */
export const updatePlan = async (plan) => {
  const response = await apiClient.patch(`${USER_API}/plan`, { plan });
  if (!response.data?.success) {
    throw new Error(response.data?.message || 'Failed to update plan');
  }
  return response.data.data;
};

/**
 * Create a Stripe checkout session for Pro upgrade
 * @returns {Promise<Object>} Checkout session with URL
 */
export const createCheckoutSession = async () => {
  const response = await apiClient.post(`${PAYMENT_API}/create-checkout-session`);
  if (!response.data?.success) {
    throw new Error(response.data?.message || 'Failed to create checkout session');
  }
  return response.data.data;
};

/**
 * Check if an API error is a subscription/upgrade error
 * @param {Error} error - Axios error
 * @returns {{ isUpgradeRequired: boolean, message: string, feature: string, creditsRemaining: number }}
 */
export const parseSubscriptionError = (error) => {
  const data = error?.response?.data?.data || error?.response?.data;
  const status = error?.response?.status;

  if (status === 403 && data?.requiresUpgrade) {
    return {
      isUpgradeRequired: true,
      message: error.response.data.message || 'This feature requires an upgrade.',
      feature: data.feature || 'premium',
      creditsRemaining: data.creditsRemaining ?? null,
      currentPlan: data.currentPlan || 'free',
    };
  }

  return {
    isUpgradeRequired: false,
    message: error?.response?.data?.message || error.message || 'An error occurred.',
    feature: null,
    creditsRemaining: null,
    currentPlan: null,
  };
};
