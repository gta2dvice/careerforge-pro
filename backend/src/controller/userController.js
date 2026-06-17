import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatPlanInfo, getPlanComparison } from "../utils/planValidation.js";

/**
 * @desc    Verify current session
 * @route   GET /api/users/start
 */
const start = asyncHandler(async (req, res) => {
    // req.user is populated by the authMiddleware
    if (!req.user) {
        throw new ApiError(404, "User session not found or expired");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User session verified"));
});

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 */
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    // Validation
    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields (fullName, email, password) are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const newUser = await User.create({
        fullName,
        email,
        password, // Hashing should be handled in user.model.js pre-save hook
    });

    // Remove password from response
    const createdUser = await User.findById(newUser._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User successfully registered"));
});

/**
 * @desc    Login user & get token
 * @route   POST /api/users/login
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate Token
   const jwtToken = generateToken(user._id);

    // Production Cookie Options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    const loggedInUser = await User.findById(user._id).select("-password");

    return res
        .status(200)
        .cookie("token", jwtToken, cookieOptions)
        .json(
            new ApiResponse(
                200, 
                { user: loggedInUser, token: jwtToken }, 
                "User logged in successfully"
            )
        );
});

/**
 * @desc    Logout user / Clear cookie
 * @route   POST /api/users/logout
 */
const logoutUser = asyncHandler(async (req, res) => {
    // Clear cookie regardless of session status for better UX
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res
        .status(200)
        .clearCookie("token", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

/**
 * @desc    Get user's subscription plan info
 * @route   GET /api/users/plan
 * @access  Private
 */
const getPlanInfo = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication required");
    }

    const planInfo = formatPlanInfo(req.user);

    return res
        .status(200)
        .json(new ApiResponse(200, planInfo, "Plan information retrieved successfully"));
});

/**
 * @desc    Get plan comparison for upgrade
 * @route   GET /api/users/plans
 * @access  Public
 */
const getPlans = asyncHandler(async (req, res) => {
    const plans = getPlanComparison();

    return res
        .status(200)
        .json(new ApiResponse(200, plans, "Available plans retrieved successfully"));
});

/**
 * @desc    Update user's subscription plan (for testing/admin)
 * @route   PATCH /api/users/plan
 * @access  Private
 */
const updatePlan = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication required");
    }

    const { plan } = req.body;

    if (!plan || !["free", "pro"].includes(plan)) {
        throw new ApiError(400, "Invalid plan. Must be 'free' or 'pro'");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update plan
    user.plan = plan;
    
    // If upgrading to pro, set subscription as active
    if (plan === "pro") {
        user.subscriptionStatus = "active";
        user.subscriptionStartDate = new Date();
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");
    const planInfo = formatPlanInfo(updatedUser);

    return res
        .status(200)
        .json(new ApiResponse(200, { user: updatedUser, planInfo }, "Plan updated successfully"));
});

/**
 * @desc    Get user's usage statistics
 * @route   GET /api/users/usage
 * @access  Private
 */
const getUsageStats = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication required");
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Reset monthly usage if needed
    await user.resetMonthlyUsage();

    const stats = {
        plan: user.plan,
        aiCredits: user.aiCredits,
        monthlyAiRequests: user.monthlyAiRequests,
        subscriptionStatus: user.subscriptionStatus,
        lastResetDate: user.lastResetDate,
        isPro: user.isPro(),
        canMakeAiRequest: user.canMakeAiRequest()
    };

    return res
        .status(200)
        .json(new ApiResponse(200, stats, "Usage statistics retrieved successfully"));
});

export { 
    start, 
    loginUser, 
    logoutUser, 
    registerUser,
    getPlanInfo,
    getPlans,
    updatePlan,
    getUsageStats
};
