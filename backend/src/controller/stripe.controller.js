import Stripe from 'stripe';
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import dotenv from "dotenv";
dotenv.config();

const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new ApiError(503, "Stripe is not configured on this server");
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

export const createCheckoutSession = asyncHandler(async (req, res) => {
    // Build a subscription checkout session for the Pro plan.
    const session = await getStripe().checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: process.env.STRIPE_PRO_PLAN_PRICE_ID, // Fixed ID from Stripe Dashboard
                quantity: 1,
            },
        ],
        mode: 'subscription',
        // Send the user back to the dashboard and include the session id for client-side verification.
        success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/dashboard`,
        customer_email: req.user.email,
        // Store the user id so the webhook can map the session back to the user.
        client_reference_id: req.user._id.toString(), // Crucial for Webhook identification
    });

    return res.status(200).json(new ApiResponse(200, { url: session.url }, "Checkout session created"));
});


export const handleStripeWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the webhook signature to ensure the request is from Stripe.
        event = getStripe().webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        throw new ApiError(400, `Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        // On successful checkout, mark the user as Pro and store the Stripe customer id.
        const session = event.data.object;
        
        // Update User in Database
        await User.findByIdAndUpdate(session.client_reference_id, {
            subscriptionStatus: 'pro',
            stripeCustomerId: session.customer
        });
    }

    res.json({ received: true });
});