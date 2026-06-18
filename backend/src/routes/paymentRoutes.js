import { Router } from "express";
import { createCheckoutSession, verifyCheckoutSession } from "../controller/stripe.controller.js";
import { isUserAvailable } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @route   POST /api/payments/create-checkout-session
 * @desc    Create a Stripe Checkout Session for Pro plan
 * @access  Private
 */
router.post("/create-checkout-session", isUserAvailable, createCheckoutSession);

/**
 * @route   GET /api/payments/verify-session
 * @desc    Verify a completed checkout session (used by success page)
 * @access  Private
 */
router.get("/verify-session", isUserAvailable, verifyCheckoutSession);

// Legacy route alias for backward compatibility
router.post("/create-checkout", isUserAvailable, createCheckoutSession);

export default router;