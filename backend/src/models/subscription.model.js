import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const subscriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User reference is required"],
    index: true
  },
  stripeCustomerId: {
    type: String,
    required: [true, "Stripe customer ID is required"]
  },
  stripeSubscriptionId: {
    type: String,
    required: [true, "Stripe subscription ID is required"],
    unique: true,
    index: true
  },
  plan: {
    type: String,
    default: 'pro',
    required: true
  },
  status: {
    type: String,
    required: [true, "Subscription status is required"]
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"]
  },
  billingPeriod: {
    type: String,
    default: 'month',
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'paid',
    required: true
  }
}, {
  timestamps: true
});

const Subscription = model('Subscription', subscriptionSchema);
export default Subscription;
