import { Router } from "express";
import {
  start,
  loginUser,
  logoutUser,
  registerUser,
  getPlanInfo,
  getPlans,
  updatePlan,
  getUsageStats
} from "../controller/userController.js";
import { isUserAvailable } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @route   GET /api/users/
 * @desc    Verify session and return user data
 * @access  Private
 */
router.get("/", isUserAvailable, start);

/**
 * @route   POST /api/users/register
 * @desc    Register a new account
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and set session cookie
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/users/logout
 * @desc    Clear session cookie and end session
 * @access  Private
 */
router.get("/logout", isUserAvailable, logoutUser);

/**
 * @route   GET /api/users/plan
 * @desc    Get user's subscription plan information
 * @access  Private
 */
router.get("/plan", isUserAvailable, getPlanInfo);

/**
 * @route   GET /api/users/plans
 * @desc    Get available subscription plans
 * @access  Public
 */
router.get("/plans", getPlans);

/**
 * @route   PATCH /api/users/plan
 * @desc    Update user's subscription plan
 * @access  Private
 */
router.patch("/plan", isUserAvailable, updatePlan);

/**
 * @route   GET /api/users/usage
 * @desc    Get user's usage statistics
 * @access  Private
 */
router.get("/usage", isUserAvailable, getUsageStats);

export default router;
