import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

// User schema with auth fields and billing/credits metadata.
const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    index: true 
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    index: true 
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  // Subscription plan field
  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free",
    required: true
  },
  // Stripe and subscription-related fields
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeSubscriptionId: {
    type: String,
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ["active", "inactive", "cancelled", "past_due"],
    default: "active"
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  // AI Credits for usage tracking
  aiCredits: {
    type: Number,
    default: 5 // Default free credits for new users
  },
  // Usage limits based on plan
  monthlyAiRequests: {
    type: Number,
    default: 0
  },
  lastResetDate: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Hash passwords before persisting new or updated users.
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare a plain password with the stored hash for login.
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user has an active pro subscription
userSchema.methods.isPro = function() {
  return this.plan === "pro" && this.subscriptionStatus === "active";
};

// Check if user can make AI requests based on their plan
userSchema.methods.canMakeAiRequest = function() {
  if (this.plan === "pro" && this.subscriptionStatus === "active") {
    return true; // Unlimited for pro users
  }
  
  // Free users have limited requests
  return this.aiCredits > 0;
};

// Decrement AI credits for free users
userSchema.methods.decrementAiCredits = async function() {
  if (this.plan === "free" && this.aiCredits > 0) {
    this.aiCredits -= 1;
    this.monthlyAiRequests += 1;
    await this.save();
  } else if (this.plan === "pro") {
    this.monthlyAiRequests += 1;
    await this.save();
  }
};

// Reset monthly usage (can be called by a cron job)
userSchema.methods.resetMonthlyUsage = async function() {
  const now = new Date();
  const lastReset = new Date(this.lastResetDate);
  const daysSinceReset = (now - lastReset) / (1000 * 60 * 60 * 24);
  
  if (daysSinceReset >= 30) {
    this.monthlyAiRequests = 0;
    this.lastResetDate = now;
    
    // Reset credits for free users
    if (this.plan === "free") {
      this.aiCredits = 5;
    }
    
    await this.save();
  }
};

const User = model('User', userSchema);
export default User;
