import { Router } from "express";
import { generatePdfFromHtml } from "../controller/pdfController.js";

const router = Router();

router.post("/generate", generatePdfFromHtml);

export default router;
