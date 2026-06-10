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

const router = express.Router();

// Week 2 — AI Optimization API
router.get("/health", aiHealthCheck);
router.post("/analyze-jd", isUserAvailable, analyzeJobDescription);
router.post("/rewrite", isUserAvailable, rewriteResumeBullet);
router.post("/suggestions", isUserAvailable, getResumeSuggestions);

// Additional AI endpoints
router.get("/test", isUserAvailable, (req, res) =>
  res.json({ message: "AI Router is operational" })
);
router.post("/generate-content", isUserAvailable, generateAIContent);
router.post(
  "/transform-resume",
  isUserAvailable,
  upload.single("resume"),
  optimizeExistingResume
);
router.post("/refine-json", isUserAvailable, transformResume);
router.route("/generate-cover-letter").post(
  upload.single("resumeFile"),
  generateCoverLetter
);
router.post("/suggest-skills", isUserAvailable, getSkillSuggestions);

export default router;
