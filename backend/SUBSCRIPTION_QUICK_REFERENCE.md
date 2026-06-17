# Subscription Architecture - Quick Reference

## 🚀 Quick Start

### Import Middleware
```javascript
import { 
  requireProPlan, 
  checkAiCredits, 
  validatePlan 
} from "../middleware/subscriptionMiddleware.js";
```

### Protect Routes

#### Pro-Only Feature
```javascript
router.post("/premium", isUserAvailable, requireProPlan, controller);
```

#### Credit-Based Feature
```javascript
router.post("/ai-feature", isUserAvailable, validatePlan, checkAiCredits, controller);
```

### Decrement Credits in Controller
```javascript
export const aiController = asyncHandler(async (req, res) => {
  const result = await aiOperation();
  
  // Decrement credits after success
  if (req.decrementCredits) {
    await req.decrementCredits();
  }
  
  return res.status(200).json(new ApiResponse(200, result));
});
```

---

## 📋 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/users/plan` | GET | ✅ | Get user's plan info |
| `/api/users/plans` | GET | ❌ | Get all available plans |
| `/api/users/plan` | PATCH | ✅ | Update user's plan |
| `/api/users/usage` | GET | ✅ | Get usage statistics |

---

## 🔒 Protected AI Routes

### Basic Features (Credit-Based)
- ✅ `/api/ai/analyze-jd`
- ✅ `/api/ai/rewrite`
- ✅ `/api/ai/suggestions`
- ✅ `/api/ai/generate-content`
- ✅ `/api/ai/suggest-skills`

### Premium Features (Pro-Only)
- 💎 `/api/ai/generate-cover-letter`
- 💎 `/api/ai/transform-resume`
- 💎 `/api/ai/refine-json`

---

## 🎯 User Model Methods

```javascript
// Check if user is Pro
user.isPro() // boolean

// Check if user can make AI request
user.canMakeAiRequest() // boolean

// Decrement credits
await user.decrementAiCredits()

// Reset monthly usage
await user.resetMonthlyUsage()
```

---

## 📊 Plan Comparison

| Feature | Free | Pro |
|---------|------|-----|
| **Price** | $0 | $29.99/mo |
| **AI Credits** | 5/month | Unlimited |
| **Resumes** | 3 max | Unlimited |
| **Basic AI** | ✅ | ✅ |
| **Cover Letters** | ❌ | ✅ |
| **Advanced AI** | ❌ | ✅ |
| **Custom Templates** | ❌ | ✅ |

---

## 🧪 Testing

### Create Test Users
```javascript
// Free user
await User.create({
  fullName: "Test Free",
  email: "free@test.com",
  password: "password123",
  plan: "free"
});

// Pro user
await User.create({
  fullName: "Test Pro",
  email: "pro@test.com",
  password: "password123",
  plan: "pro",
  subscriptionStatus: "active"
});
```

### Test Plan Upgrade
```bash
PATCH /api/users/plan
{
  "plan": "pro"
}
```

### Test Credit Depletion
```javascript
const user = await User.findOne({ email: "free@test.com" });
user.aiCredits = 0;
await user.save();
```

---

## ⚠️ Error Responses

### 403 - No Credits
```json
{
  "success": false,
  "message": "You have exhausted your AI credits...",
  "data": {
    "requiresUpgrade": true,
    "currentPlan": "free",
    "creditsRemaining": 0
  }
}
```

### 403 - Pro Required
```json
{
  "success": false,
  "message": "This feature requires a Pro subscription...",
  "data": {
    "requiresUpgrade": true,
    "currentPlan": "free",
    "feature": "premium"
  }
}
```

---

## 📁 File Structure

```
backend/src/
├── models/
│   └── user.model.js              # User schema with plan fields
├── middleware/
│   └── subscriptionMiddleware.js  # Protection middleware
├── utils/
│   └── planValidation.js          # Plan config & utilities
├── controller/
│   ├── userController.js          # Plan management endpoints
│   └── aiController.js            # AI endpoints with credit tracking
└── routes/
    ├── userRoutes.js              # User/plan routes
    └── aiRoutes.js                # Protected AI routes
```

---

## 🔑 Key Concepts

1. **Free users** get 5 AI credits per month
2. **Pro users** get unlimited AI credits
3. Credits auto-decrement after successful AI operations
4. Monthly usage resets automatically every 30 days
5. Premium features require Pro subscription
6. All errors include `requiresUpgrade` flag for frontend

---

## 📚 Full Documentation

See `SUBSCRIPTION_ARCHITECTURE.md` for complete documentation.
