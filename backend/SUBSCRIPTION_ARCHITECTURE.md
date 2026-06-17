# SaaS Subscription Architecture Documentation

## Overview

This document describes the complete subscription architecture implemented for CareerForge Pro, including user plans, middleware protection, credit management, and API endpoints.

## Table of Contents

1. [User Model](#user-model)
2. [Subscription Plans](#subscription-plans)
3. [Middleware](#middleware)
4. [API Endpoints](#api-endpoints)
5. [Usage Examples](#usage-examples)
6. [Testing](#testing)

---

## User Model

### Schema Fields

The User model (`backend/src/models/user.model.js`) includes the following subscription-related fields:

```javascript
{
  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free",
    required: true
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  subscriptionStatus: {
    type: String,
    enum: ["active", "inactive", "cancelled", "past_due"],
    default: "active"
  },
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  aiCredits: {
    type: Number,
    default: 5  // Free users get 5 credits per month
  },
  monthlyAiRequests: {
    type: Number,
    default: 0
  },
  lastResetDate: {
    type: Date,
    default: Date.now
  }
}
```

### Model Methods

#### `isPro()`
Checks if user has an active Pro subscription.

```javascript
user.isPro() // Returns true if plan === "pro" && subscriptionStatus === "active"
```

#### `canMakeAiRequest()`
Checks if user can make AI requests based on their plan and credits.

```javascript
user.canMakeAiRequest() // Returns true if pro or has credits > 0
```

#### `decrementAiCredits()`
Decrements AI credits for free users, tracks usage for all users.

```javascript
await user.decrementAiCredits()
```

#### `resetMonthlyUsage()`
Resets monthly usage counters (called automatically, can be triggered by cron).

```javascript
await user.resetMonthlyUsage()
```

---

## Subscription Plans

### Plan Configuration

Plans are defined in `backend/src/utils/planValidation.js`:

#### Free Plan
- **Price**: $0/month
- **AI Credits**: 5 per month
- **Max Resumes**: 3
- **Features**:
  - ✅ Resume Builder
  - ✅ Basic AI Optimization
  - ✅ PDF Export
  - ❌ Advanced AI Features
  - ❌ Cover Letter Generation
  - ❌ Custom Templates
  - ❌ Priority Support

#### Pro Plan
- **Price**: $29.99/month
- **AI Credits**: Unlimited
- **Max Resumes**: Unlimited
- **Features**:
  - ✅ Resume Builder
  - ✅ Basic AI Optimization
  - ✅ PDF Export
  - ✅ Advanced AI Features
  - ✅ Cover Letter Generation
  - ✅ Custom Templates
  - ✅ Priority Support

---

## Middleware

### Location
`backend/src/middleware/subscriptionMiddleware.js`

### Available Middleware

#### 1. `requireProPlan`
Requires user to have an active Pro subscription.

```javascript
router.post("/premium-feature", isUserAvailable, requireProPlan, controller);
```

**Error Response (403)**:
```json
{
  "success": false,
  "message": "This feature requires a Pro subscription. Please upgrade your plan.",
  "data": {
    "requiresUpgrade": true,
    "currentPlan": "free",
    "feature": "premium"
  }
}
```

#### 2. `checkAiCredits`
Checks if user has AI credits available (or is Pro).

```javascript
router.post("/ai-feature", isUserAvailable, checkAiCredits, controller);
```

**Usage in Controller**:
```javascript
// After successful AI operation
if (req.decrementCredits) {
  await req.decrementCredits();
}
```

**Error Response (403)**:
```json
{
  "success": false,
  "message": "You have exhausted your AI credits. Please upgrade to Pro for unlimited access.",
  "data": {
    "requiresUpgrade": true,
    "currentPlan": "free",
    "creditsRemaining": 0,
    "feature": "ai_credits"
  }
}
```

#### 3. `validatePlan`
Validates plan and attaches plan info to request (non-blocking).

```javascript
router.post("/feature", isUserAvailable, validatePlan, controller);
```

**Attached to Request**:
```javascript
req.planInfo = {
  plan: "free",
  isPro: false,
  creditsRemaining: 3,
  monthlyRequests: 2,
  subscriptionStatus: "active"
}
```

#### 4. `requireCreditsOrPro`
More flexible - allows free users with credits OR pro users.

```javascript
router.post("/flexible-feature", isUserAvailable, requireCreditsOrPro, controller);
```

#### 5. `requirePlans(allowedPlans)`
Factory function for custom plan requirements.

```javascript
router.post("/custom", isUserAvailable, requirePlans(["pro"]), controller);
```

---

## API Endpoints

### User/Plan Management

#### GET `/api/users/plan`
Get current user's subscription plan information.

**Auth**: Required  
**Response**:
```json
{
  "success": true,
  "data": {
    "currentPlan": "free",
    "planName": "Free",
    "isPro": false,
    "features": { ... },
    "limits": { ... },
    "usage": {
      "aiCredits": 3,
      "monthlyRequests": 2,
      "daysUntilReset": 28
    },
    "subscriptionStatus": "active",
    "canUpgrade": true
  }
}
```

#### GET `/api/users/plans`
Get all available subscription plans.

**Auth**: Not required  
**Response**:
```json
{
  "success": true,
  "data": {
    "free": { ... },
    "pro": {
      "name": "Pro",
      "price": 29.99,
      "features": { ... },
      "benefits": [
        "Unlimited AI optimizations",
        "Unlimited resume storage",
        ...
      ]
    }
  }
}
```

#### PATCH `/api/users/plan`
Update user's subscription plan (for testing/admin).

**Auth**: Required  
**Body**:
```json
{
  "plan": "pro"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "planInfo": { ... }
  },
  "message": "Plan updated successfully"
}
```

#### GET `/api/users/usage`
Get user's usage statistics.

**Auth**: Required  
**Response**:
```json
{
  "success": true,
  "data": {
    "plan": "free",
    "aiCredits": 3,
    "monthlyAiRequests": 2,
    "subscriptionStatus": "active",
    "lastResetDate": "2026-05-17T12:00:00.000Z",
    "isPro": false,
    "canMakeAiRequest": true
  }
}
```

### Protected AI Routes

All AI routes in `backend/src/routes/aiRoutes.js` are now protected:

#### Basic AI Features (Credit-based)
- `POST /api/ai/analyze-jd` - Analyze job description
- `POST /api/ai/rewrite` - Rewrite resume bullet
- `POST /api/ai/suggestions` - Get optimization suggestions
- `POST /api/ai/generate-content` - Generate AI content
- `POST /api/ai/suggest-skills` - Suggest skills

**Middleware**: `isUserAvailable, validatePlan, checkAiCredits`

#### Premium AI Features (Pro-only)
- `POST /api/ai/generate-cover-letter` - Generate cover letter
- `POST /api/ai/transform-resume` - Transform resume from PDF
- `POST /api/ai/refine-json` - Advanced JSON refinement

**Middleware**: `isUserAvailable, requireProPlan`

---

## Usage Examples

### Example 1: Protecting a New Premium Route

```javascript
import { requireProPlan } from "../middleware/subscriptionMiddleware.js";

router.post(
  "/premium-feature",
  isUserAvailable,
  requireProPlan,
  premiumController
);
```

### Example 2: Using Credits in Controller

```javascript
export const aiFeature = asyncHandler(async (req, res) => {
  // Your AI logic here
  const result = await performAiOperation();
  
  // Decrement credits after successful operation
  if (req.decrementCredits) {
    await req.decrementCredits();
  }
  
  return res.status(200).json(new ApiResponse(200, result, "Success"));
});
```

### Example 3: Checking Plan in Controller

```javascript
export const flexibleFeature = asyncHandler(async (req, res) => {
  const isPro = req.user.isPro();
  
  if (isPro) {
    // Provide enhanced features for Pro users
    return enhancedResponse();
  } else {
    // Provide basic features for free users
    return basicResponse();
  }
});
```

### Example 4: Manual Plan Validation

```javascript
import { validateAction } from "../utils/planValidation.js";

export const someController = asyncHandler(async (req, res) => {
  const validation = validateAction(req.user, "cover_letter");
  
  if (!validation.allowed) {
    throw new ApiError(403, validation.reason, [], null, {
      requiresUpgrade: validation.requiresUpgrade
    });
  }
  
  // Proceed with feature
});
```

---

## Testing

### Test User Creation

Create test users with different plans:

```javascript
// Free user
const freeUser = await User.create({
  fullName: "Free User",
  email: "free@test.com",
  password: "password123",
  plan: "free"
});

// Pro user
const proUser = await User.create({
  fullName: "Pro User",
  email: "pro@test.com",
  password: "password123",
  plan: "pro",
  subscriptionStatus: "active"
});
```

### Testing Credit Depletion

```javascript
// Deplete credits for free user
const user = await User.findOne({ email: "free@test.com" });
user.aiCredits = 0;
await user.save();

// Try to make AI request - should fail with 403
```

### Testing Plan Upgrade

```bash
# Login as free user
POST /api/users/login
{
  "email": "free@test.com",
  "password": "password123"
}

# Upgrade to pro
PATCH /api/users/plan
{
  "plan": "pro"
}

# Verify upgrade
GET /api/users/plan
```

### Testing Protected Routes

```bash
# As free user - should succeed (with credits)
POST /api/ai/analyze-jd
Authorization: Bearer <token>

# As free user - should fail (Pro required)
POST /api/ai/generate-cover-letter
Authorization: Bearer <token>

# As pro user - should succeed
POST /api/ai/generate-cover-letter
Authorization: Bearer <token>
```

---

## Error Handling

All subscription-related errors return consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "data": {
    "requiresUpgrade": true,
    "currentPlan": "free",
    "feature": "feature_name",
    "creditsRemaining": 0
  }
}
```

Frontend can check `data.requiresUpgrade` to show upgrade prompts.

---

## Future Enhancements

1. **Stripe Integration**: Connect `stripeCustomerId` and `stripeSubscriptionId` to actual Stripe webhooks
2. **Cron Jobs**: Implement automated monthly credit resets
3. **Usage Analytics**: Track detailed usage patterns per user
4. **Plan Limits**: Enforce resume count limits for free users
5. **Grace Periods**: Allow grace period for expired subscriptions
6. **Promo Codes**: Add promotional code support
7. **Team Plans**: Implement team/organization subscriptions

---

## Summary

The subscription architecture provides:

✅ **User Model** with plan and credit tracking  
✅ **Middleware** for route protection  
✅ **Plan Validation** utilities  
✅ **API Endpoints** for plan management  
✅ **Credit System** with automatic tracking  
✅ **Flexible Protection** for different feature tiers  

All components work together to create a complete SaaS subscription system ready for production use.
