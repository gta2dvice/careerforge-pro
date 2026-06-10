import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ensureDevUser } from "../utils/ensureDevUser.js";

export const isUserAvailable = asyncHandler(async (req, res, next) => {
    if (process.env.SKIP_AUTH === "true") {
        const user = await ensureDevUser();

        if (!user) {
            throw new ApiError(
                500,
                "SKIP_AUTH is enabled but the development user could not be created."
            );
        }

        req.user = user;
        return next();
    }

    // 1. Get token from cookies (requires cookie-parser in app.js)
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }

    try {
        // 2. Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // 3. Find user and attach to request (excluding password)
        const user = await User.findById(decodedToken?.id).select("-password");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // IMPORTANT: Attach the user to the request object
        req.user = user; 
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});