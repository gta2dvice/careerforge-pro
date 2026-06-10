import User from "../models/user.model.js";

/** Default development user (maps `role: "pro"` → subscriptionStatus). */
export const DEV_USER_DEFAULTS = {
  fullName: "Development User",
  email: "dev@careerforge.com",
  password: "dev-password-change-me",
  subscriptionStatus: "pro",
  aiCredits: 100,
};

/**
 * Ensures a development user exists when SKIP_AUTH is enabled.
 * Used at server startup and on each authenticated request (idempotent).
 */
export const ensureDevUser = async () => {
  if (process.env.SKIP_AUTH !== "true") {
    return null;
  }

  if (process.env.DEV_USER_ID) {
    const byId = await User.findById(process.env.DEV_USER_ID).select("-password");
    if (byId) {
      return byId;
    }
    console.warn(
      `[Dev Auth] DEV_USER_ID=${process.env.DEV_USER_ID} not found; falling back to dev email lookup or create.`
    );
  }

  const email = (
    process.env.DEV_USER_EMAIL || DEV_USER_DEFAULTS.email
  ).toLowerCase();

  let user = await User.findOne({ email }).select("-password");

  if (user) {
    return user;
  }

  const created = await User.create({
    fullName: process.env.DEV_USER_NAME || DEV_USER_DEFAULTS.fullName,
    email,
    password: process.env.DEV_USER_PASSWORD || DEV_USER_DEFAULTS.password,
    subscriptionStatus: DEV_USER_DEFAULTS.subscriptionStatus,
    aiCredits: DEV_USER_DEFAULTS.aiCredits,
  });

  console.info("[Dev Auth] Created development user", {
    email: created.email,
    id: created._id.toString(),
    subscriptionStatus: created.subscriptionStatus,
  });

  return User.findById(created._id).select("-password");
};
