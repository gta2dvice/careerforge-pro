import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to check if user has an active Pro subscription
 * Requires isUserAvailable middleware to run first
 */
export const requireProPlan = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  // Check if user has pro plan and active subscription
  if (!req.user.isPro()) {
    throw new ApiError(
      403,
      "This feature requires a Pro subscription. Please upgrade your plan.",
      [],
      null,
      {
        requiresUpgrade: true,
        currentPlan: req.user.plan,
        feature: "premium"
      }
    );
  }

  next();
});

/**
 * Middleware to check if user can make AI requests
 * Checks credits for free users, unlimited for pro users
 */
export const checkAiCredits = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  // Check if user can make AI request
  if (!req.user.canMakeAiRequest()) {
    throw new ApiError(
      403,
      "You have exhausted your AI credits. Please upgrade to Pro for unlimited access.",
      [],
      null,
      {
        requiresUpgrade: true,
        currentPlan: req.user.plan,
        creditsRemaining: req.user.aiCredits,
        feature: "ai_credits"
      }
    );
  }

  // Decrement credits after successful request (will be called in controller)
  req.decrementCredits = async () => {
    await req.user.decrementAiCredits();
  };

  next();
});

/**
 * Middleware to validate subscription plan
 * Allows both free and pro users but attaches plan info to request
 */
export const validatePlan = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  // Reset monthly usage if needed
  await req.user.resetMonthlyUsage();

  // Attach plan information to request
  req.planInfo = {
    plan: req.user.plan,
    isPro: req.user.isPro(),
    creditsRemaining: req.user.aiCredits,
    monthlyRequests: req.user.monthlyAiRequests,
    subscriptionStatus: req.user.subscriptionStatus
  };

  next();
});

/**
 * Middleware to check if user has sufficient credits or pro plan
 * More flexible than requireProPlan - allows free users with credits
 */
export const requireCreditsOrPro = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  const canProceed = req.user.isPro() || req.user.aiCredits > 0;

  if (!canProceed) {
    throw new ApiError(
      403,
      "Insufficient credits. Please upgrade to Pro or wait for your monthly credits to reset.",
      [],
      null,
      {
        requiresUpgrade: true,
        currentPlan: req.user.plan,
        creditsRemaining: req.user.aiCredits,
        nextResetDate: new Date(req.user.lastResetDate.getTime() + 30 * 24 * 60 * 60 * 1000)
      }
    );
  }

  next();
});

/**
 * Middleware factory to create plan-specific middleware
 * @param {string[]} allowedPlans - Array of allowed plan names
 */
export const requirePlans = (allowedPlans = ["free", "pro"]) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!allowedPlans.includes(req.user.plan)) {
      throw new ApiError(
        403,
        `This feature is only available for ${allowedPlans.join(" or ")} plans.`,
        [],
        null,
        {
          requiresUpgrade: true,
          currentPlan: req.user.plan,
          allowedPlans
        }
      );
    }

    next();
  });
};
