import { Router } from "express";
import {
  start,
  createResume,
  getALLResume,
  getResume,
  updateResume,
  removeResume,
} from "../controller/resumeController.js";
import { generatePdf } from "../controller/pdfController.js";
import { isUserAvailable } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/start", start);

router.post("/", isUserAvailable, createResume);
router.get("/all", isUserAvailable, getALLResume);
router.get("/single", isUserAvailable, getResume);
router.put("/", isUserAvailable, updateResume);
router.delete("/", isUserAvailable, removeResume);

router.get("/download/:resume_id", generatePdf);

export default router;
