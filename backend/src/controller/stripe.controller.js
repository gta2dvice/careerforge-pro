import Stripe from 'stripe';
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * Lazy-initialize Stripe SDK with the secret key from environment.
 * Throws a clear 503 if the key is missing so the frontend can show a
 * helpful message instead of a cryptic crash.
 */
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new ApiError(503, "Stripe is not configured on this server. Set STRIPE_SECRET_KEY in your .env");
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

/**
 * @desc    Create a Stripe Checkout Session for Pro plan subscription
 * @route   POST /api/payments/create-checkout-session
 * @access  Private (requires isUserAvailable)
 */
export const createCheckoutSession = asyncHandler(async (req, res) => {
    const stripe = getStripe();
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Authentication required to create checkout session");
    }

    // Prevent already-Pro users from double subscribing
    if (user.plan === "pro" && user.subscriptionStatus === "active") {
        throw new ApiError(400, "You already have an active Pro subscription");
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Build Stripe Checkout Session
    const sessionConfig = {
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: user.email,
        client_reference_id: user._id.toString(),
        success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/payment-cancel`,
        metadata: {
            userId: user._id.toString(),
            userEmail: user.email,
            plan: "pro",
        },
    };

    // Use a fixed Stripe Price ID if available (production),
    // otherwise create an inline price (development/testing)
    if (process.env.STRIPE_PRO_PLAN_PRICE_ID) {
        sessionConfig.line_items = [
            {
                price: process.env.STRIPE_PRO_PLAN_PRICE_ID,
                quantity: 1,
            },
        ];
    } else {
        // Inline price for development — ₹299/month
        sessionConfig.line_items = [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'CareerForge Pro',
                        description: 'Unlimited AI credits, resumes, cover letters & premium templates',
                    },
                    unit_amount: 29900, // ₹299.00 in paise
                    recurring: {
                        interval: 'month',
                    },
                },
                quantity: 1,
            },
        ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res
        .status(200)
        .json(new ApiResponse(200, { 
            sessionId: session.id,
            url: session.url 
        }, "Checkout session created successfully"));
});

/**
 * @desc    Verify a Checkout Session by ID (for the success page)
 * @route   GET /api/payments/verify-session?session_id=cs_xxx
 * @access  Private
 */
export const verifyCheckoutSession = asyncHandler(async (req, res) => {
    const stripe = getStripe();
    const { session_id } = req.query;

    if (!session_id) {
        throw new ApiError(400, "session_id query parameter is required");
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
        throw new ApiError(404, "Checkout session not found");
    }

    // If payment was successful, update user's plan
    // (This is a temporary measure until webhooks are implemented in Week 3 Day 5)
    if (session.payment_status === 'paid' && session.client_reference_id) {
        const user = await User.findById(session.client_reference_id);
        if (user && user.plan !== 'pro') {
            user.plan = 'pro';
            user.subscriptionStatus = 'active';
            user.stripeCustomerId = session.customer;
            user.stripeSubscriptionId = session.subscription;
            user.subscriptionStartDate = new Date();
            await user.save();
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            status: session.payment_status,
            customerEmail: session.customer_email,
            plan: 'pro',
        }, "Session verified successfully"));
});

/**
 * @desc    Handle Stripe Webhook events
 * @route   POST /api/payments/webhook
 * @access  Public (verified via Stripe signature)
 */
export const handleStripeWebhook = asyncHandler(async (req, res) => {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new ApiError(503, "Stripe webhook secret is not configured on this server");
    }

    if (!sig) {
        throw new ApiError(400, "Missing Stripe signature header");
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        throw new ApiError(400, `Webhook Error: Signature verification failed. ${err.message}`);
    }

    console.log(`Received verified Stripe webhook event: ${event.type}`);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        const userId = session.client_reference_id;
        const stripeSubscriptionId = session.subscription;
        const stripeCustomerId = session.customer;

        if (!userId) {
            console.error("Webhook Error: Missing client_reference_id in session metadata", session.id);
            throw new ApiError(400, "Webhook Error: Missing client_reference_id in session metadata");
        }

        if (!stripeSubscriptionId) {
            console.error("Webhook Error: Missing subscription ID in session", session.id);
            throw new ApiError(400, "Webhook Error: Missing subscription ID in session");
        }

        // 1. Idempotency Check: Prevent duplicate webhook processing
        const existingSubscription = await Subscription.findOne({ stripeSubscriptionId });
        if (existingSubscription) {
            console.log(`Webhook Warning: Subscription ${stripeSubscriptionId} already processed. Ignoring duplicate event.`);
            return res.status(200).json(new ApiResponse(200, { received: true, duplicate: true }, "Subscription already processed"));
        }

        // 2. Retrieve the User
        const user = await User.findById(userId);
        if (!user) {
            console.error(`Webhook Error: User with ID ${userId} not found`);
            throw new ApiError(404, `Webhook Error: User with ID ${userId} not found`);
        }

        // 3. Retrieve actual subscription period from Stripe to get exact end date
        let subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30-day default fallback
        try {
            const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
            if (stripeSub && stripeSub.current_period_end) {
                subscriptionEndDate = new Date(stripeSub.current_period_end * 1000);
            }
        } catch (stripeErr) {
            console.error("Stripe API error fetching subscription details:", stripeErr.message);
            // Fall back to default 30 days and proceed
        }

        // 4. Update the User Model
        user.plan = 'pro';
        user.subscriptionStatus = 'active';
        user.stripeCustomerId = stripeCustomerId;
        user.stripeSubscriptionId = stripeSubscriptionId;
        user.subscriptionStartDate = new Date();
        user.subscriptionEndDate = subscriptionEndDate;
        await user.save();

        // 5. Store Subscription details in MongoDB
        const amountPaid = session.amount_total ? session.amount_total / 100 : 299; // convert paise to INR, default to 299

        await Subscription.create({
            userId: user._id,
            stripeCustomerId,
            stripeSubscriptionId,
            plan: 'pro',
            status: 'active',
            amount: amountPaid,
            billingPeriod: 'month',
            paymentStatus: session.payment_status || 'paid'
        });

        console.log(`Successfully upgraded user ${userId} to Pro plan and created subscription record`);
    }

    return res.status(200).json(new ApiResponse(200, { received: true }, "Webhook handled successfully"));
});