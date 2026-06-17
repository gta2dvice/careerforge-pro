import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  aiHealthCheck,
  analyzeJobDescription,
  getResumeSuggestions,
  rewriteResumeBullet,
  generateAIContent,
  transformResume,
  optimizeExistingResume,
  getSkillSuggestions,
  generateCoverLetter,
} from "../controller/aiController.js";
import { isUserAvailable } from "../middleware/authMiddleware.js";
import { 
  checkAiCredits, 
  requireProPlan, 
  validatePlan 
} from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

// Public health check
router.get("/health", aiHealthCheck);

// Basic AI features - available to all authenticated users with credits
// These routes check AI credits and decrement them
router.post("/analyze-jd", isUserAvailable, validatePlan, checkAiCredits, analyzeJobDescription);
router.post("/rewrite", isUserAvailable, validatePlan, checkAiCredits, rewriteResumeBullet);
router.post("/suggestions", isUserAvailable, validatePlan, checkAiCredits, getResumeSuggestions);
router.post("/generate-content", isUserAvailable, validatePlan, checkAiCredits, generateAIContent);
router.post("/suggest-skills", isUserAvailable, validatePlan, checkAiCredits, getSkillSuggestions);

// Premium AI features - require Pro subscription
// Cover letter generation is a Pro-only feature
router.post(
  "/generate-cover-letter",
  isUserAvailable,
  requireProPlan,
  upload.single("resumeFile"),
  generateCoverLetter
);

// Advanced resume transformation - Pro feature
router.post(
  "/transform-resume",
  isUserAvailable,
  requireProPlan,
  upload.single("resume"),
  optimizeExistingResume
);

// JSON refinement - Pro feature for advanced optimization
router.post("/refine-json", isUserAvailable, requireProPlan, transformResume);

// Test endpoint
router.get("/test", isUserAvailable, (req, res) =>
  res.json({ 
    message: "AI Router is operational",
    plan: req.user.plan,
    credits: req.user.aiCredits
  })
);

export default router;
