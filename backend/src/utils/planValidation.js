/**
 * Plan Validation Utilities
 * Centralized logic for subscription plan validation and feature access
 */

// Plan configuration with features and limits
export const PLAN_CONFIG = {
  free: {
    name: "Free",
    price: 0,
    features: {
      resumeBuilder: true,
      basicAiOptimization: true,
      pdfExport: true,
      resumeStorage: 3, // Max resumes
      aiCreditsPerMonth: 5,
      advancedAiFeatures: false,
      prioritySupport: false,
      customTemplates: false,
      coverLetterGeneration: false,
      unlimitedResumes: false
    },
    limits: {
      maxResumes: 3,
      maxAiRequests: 5,
      maxMonthlyOptimizations: 5
    }
  },
  pro: {
    name: "Pro",
    price: 29.99,
    features: {
      resumeBuilder: true,
      basicAiOptimization: true,
      pdfExport: true,
      resumeStorage: -1, // Unlimited
      aiCreditsPerMonth: -1, // Unlimited
      advancedAiFeatures: true,
      prioritySupport: true,
      customTemplates: true,
      coverLetterGeneration: true,
      unlimitedResumes: true
    },
    limits: {
      maxResumes: -1, // Unlimited
      maxAiRequests: -1, // Unlimited
      maxMonthlyOptimizations: -1 // Unlimited
    }
  }
};

/**
 * Check if a user's plan has access to a specific feature
 * @param {string} plan - User's plan (free/pro)
 * @param {string} feature - Feature name to check
 * @returns {boolean}
 */
export const hasFeatureAccess = (plan, feature) => {
  const planConfig = PLAN_CONFIG[plan];
  if (!planConfig) return false;
  
  return planConfig.features[feature] === true || planConfig.features[feature] === -1;
};

/**
 * Get feature limit for a user's plan
 * @param {string} plan - User's plan (free/pro)
 * @param {string} limitType - Type of limit to check
 * @returns {number} - Limit value (-1 for unlimited)
 */
export const getFeatureLimit = (plan, limitType) => {
  const planConfig = PLAN_CONFIG[plan];
  if (!planConfig) return 0;
  
  return planConfig.limits[limitType] || 0;
};

/**
 * Check if user has reached their plan limit
 * @param {string} plan - User's plan
 * @param {string} limitType - Type of limit to check
 * @param {number} currentUsage - Current usage count
 * @returns {boolean}
 */
export const hasReachedLimit = (plan, limitType, currentUsage) => {
  const limit = getFeatureLimit(plan, limitType);
  
  // -1 means unlimited
  if (limit === -1) return false;
  
  return currentUsage >= limit;
};

/**
 * Validate if user can perform an action based on their plan
 * @param {Object} user - User object with plan and usage data
 * @param {string} action - Action to validate
 * @returns {Object} - { allowed: boolean, reason: string }
 */
export const validateAction = (user, action) => {
  const plan = user.plan || "free";
  
  switch (action) {
    case "create_resume":
      if (plan === "pro") {
        return { allowed: true };
      }
      // Check resume count for free users (would need to pass resume count)
      return { 
        allowed: true, 
        warning: "Free plan limited to 3 resumes" 
      };
      
    case "ai_optimization":
      if (!user.canMakeAiRequest()) {
        return {
          allowed: false,
          reason: "No AI credits remaining. Upgrade to Pro for unlimited access.",
          requiresUpgrade: true
        };
      }
      return { allowed: true };
      
    case "cover_letter":
      if (!hasFeatureAccess(plan, "coverLetterGeneration")) {
        return {
          allowed: false,
          reason: "Cover letter generation is a Pro feature.",
          requiresUpgrade: true
        };
      }
      return { allowed: true };
      
    case "advanced_ai":
      if (!hasFeatureAccess(plan, "advancedAiFeatures")) {
        return {
          allowed: false,
          reason: "Advanced AI features require a Pro subscription.",
          requiresUpgrade: true
        };
      }
      return { allowed: true };
      
    case "custom_templates":
      if (!hasFeatureAccess(plan, "customTemplates")) {
        return {
          allowed: false,
          reason: "Custom templates are available on Pro plan.",
          requiresUpgrade: true
        };
      }
      return { allowed: true };
      
    default:
      return { allowed: true };
  }
};

/**
 * Get plan comparison data for upgrade prompts
 * @returns {Object}
 */
export const getPlanComparison = () => {
  return {
    free: {
      ...PLAN_CONFIG.free,
      cta: "Current Plan"
    },
    pro: {
      ...PLAN_CONFIG.pro,
      cta: "Upgrade to Pro",
      benefits: [
        "Unlimited AI optimizations",
        "Unlimited resume storage",
        "Advanced AI features",
        "Cover letter generation",
        "Priority support",
        "Custom templates"
      ]
    }
  };
};

/**
 * Calculate days until credit reset
 * @param {Date} lastResetDate - Last reset date
 * @returns {number}
 */
export const daysUntilReset = (lastResetDate) => {
  const now = new Date();
  const resetDate = new Date(lastResetDate);
  const nextReset = new Date(resetDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.ceil((nextReset - now) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, daysRemaining);
};

/**
 * Format plan info for API responses
 * @param {Object} user - User object
 * @returns {Object}
 */
export const formatPlanInfo = (user) => {
  const plan = user.plan || "free";
  const config = PLAN_CONFIG[plan];
  
  return {
    currentPlan: plan,
    planName: config.name,
    isPro: user.isPro(),
    features: config.features,
    limits: config.limits,
    usage: {
      aiCredits: user.aiCredits,
      monthlyRequests: user.monthlyAiRequests,
      daysUntilReset: daysUntilReset(user.lastResetDate)
    },
    subscriptionStatus: user.subscriptionStatus,
    canUpgrade: plan === "free"
  };
};

/**
 * Check if user needs to upgrade for a feature
 * @param {Object} user - User object
 * @param {string} feature - Feature to check
 * @returns {Object}
 */
export const checkUpgradeRequired = (user, feature) => {
  const plan = user.plan || "free";
  const hasAccess = hasFeatureAccess(plan, feature);
  
  if (hasAccess) {
    return { required: false };
  }
  
  return {
    required: true,
    currentPlan: plan,
    feature,
    message: `This feature requires a Pro subscription.`,
    upgradeUrl: "/pricing"
  };
};
