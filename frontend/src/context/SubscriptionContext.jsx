import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import {
  fetchPlanInfo,
  fetchUsageStats,
  updatePlan as updatePlanApi,
  createCheckoutSession,
  parseSubscriptionError,
} from '../services/subscriptionService';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  // Plan state
  const [planInfo, setPlanInfo] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState(null);

  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [upgradeFeature, setUpgradeFeature] = useState('');

  /**
   * Load the user's current plan info from the backend.
   * Silently fails if user is not authenticated (e.g. on landing page).
   */
  const loadPlanInfo = useCallback(async () => {
    setIsLoadingPlan(true);
    setPlanError(null);
    try {
      const info = await fetchPlanInfo();
      setPlanInfo(info);
      return info;
    } catch (err) {
      // Don't show error if it's a 401 (user not logged in)
      if (err?.response?.status !== 401) {
        setPlanError(err.message);
      }
      return null;
    } finally {
      setIsLoadingPlan(false);
    }
  }, []);

  /**
   * Load usage statistics
   */
  const loadUsageStats = useCallback(async () => {
    try {
      const stats = await fetchUsageStats();
      setUsageStats(stats);
      return stats;
    } catch (err) {
      // Silently fail for unauthenticated users
      return null;
    }
  }, []);

  /**
   * Refresh all subscription data
   */
  const refreshSubscription = useCallback(async () => {
    await Promise.all([loadPlanInfo(), loadUsageStats()]);
  }, [loadPlanInfo, loadUsageStats]);

  /**
   * Update plan (for dev/testing - production uses Stripe)
   */
  const changePlan = useCallback(async (newPlan) => {
    try {
      const result = await updatePlanApi(newPlan);
      // Refresh plan info after update
      await loadPlanInfo();
      return result;
    } catch (err) {
      setPlanError(err.message);
      throw err;
    }
  }, [loadPlanInfo]);

  /**
   * Trigger upgrade flow via Stripe checkout
   */
  const triggerUpgrade = useCallback(async () => {
    try {
      const session = await createCheckoutSession();
      if (session?.url) {
        window.location.href = session.url;
      }
      return session;
    } catch (err) {
      setPlanError(err.message);
      throw err;
    }
  }, []);

  /**
   * Show upgrade modal with a reason
   */
  const promptUpgrade = useCallback((reason = '', feature = '') => {
    setUpgradeReason(reason);
    setUpgradeFeature(feature);
    setShowUpgradeModal(true);
  }, []);

  /**
   * Dismiss upgrade modal
   */
  const dismissUpgrade = useCallback(() => {
    setShowUpgradeModal(false);
    setUpgradeReason('');
    setUpgradeFeature('');
  }, []);

  /**
   * Handle API errors that might be subscription-related.
   * Returns true if it was a subscription error (and shows modal).
   */
  const handleSubscriptionError = useCallback((error) => {
    const parsed = parseSubscriptionError(error);
    if (parsed.isUpgradeRequired) {
      promptUpgrade(parsed.message, parsed.feature);
      return true;
    }
    return false;
  }, [promptUpgrade]);

  // Derived convenience flags
  const isPro = planInfo?.isPro ?? false;
  const currentPlan = planInfo?.currentPlan ?? 'free';
  const aiCredits = planInfo?.usage?.aiCredits ?? usageStats?.aiCredits ?? null;
  const canMakeAiRequest = usageStats?.canMakeAiRequest ?? (isPro || (aiCredits !== null && aiCredits > 0));

  return (
    <SubscriptionContext.Provider value={{
      // State
      planInfo,
      usageStats,
      isLoadingPlan,
      planError,
      showUpgradeModal,
      upgradeReason,
      upgradeFeature,

      // Derived
      isPro,
      currentPlan,
      aiCredits,
      canMakeAiRequest,

      // Actions
      loadPlanInfo,
      loadUsageStats,
      refreshSubscription,
      changePlan,
      triggerUpgrade,
      promptUpgrade,
      dismissUpgrade,
      handleSubscriptionError,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
