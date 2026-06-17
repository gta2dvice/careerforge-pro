import Resume from "../models/resume.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { aiOptimizationService } from "../services/aiOptimization.service.js";
import { rewriteResumeContent } from "../ai/resumeRewriter.js";
import {
  chatCompletion,
  checkGroqHealth,
  logAiError,
  parseJsonFromResponse,
} from "../ai/groqClient.js";
import pdf from "pdf-parse-new";

/**
 * @route   GET /api/ai/health
 */
export const aiHealthCheck = asyncHandler(async (req, res) => {
  const health = await checkGroqHealth();
  const statusCode = health.ok ? 200 : 503;

  return res.status(statusCode).json(
    new ApiResponse(
      statusCode,
      health,
      health.ok ? "AI service is healthy" : "AI service is unavailable"
    )
  );
});

/**
 * @route   POST /api/ai/analyze-jd
 * @desc    JD Analysis Agent + deterministic ATS scoring
 */
export const analyzeJobDescription = asyncHandler(async (req, res) => {
  const { resumeData, jobDescription, jdText } = req.body;
  const jd = jobDescription || jdText;

  if (!resumeData || !jd?.trim()) {
    throw new ApiError(400, "Resume data and job description are required.");
  }

  try {
    const data = await aiOptimizationService.analyzeJobDescription(resumeData, jd);
    
    // Decrement AI credits after successful request
    if (req.decrementCredits) {
      await req.decrementCredits();
    }
    
    return res.status(200).json(new ApiResponse(200, data, "Job description analyzed"));
  } catch (error) {
    logAiError("analyze-jd-route", error);
    throw new ApiError(502, "Failed to analyze job description", [], error.message);
  }
});

/**
 * @route   POST /api/ai/suggestions
 * @desc    Missing keywords, weak bullets, improvement suggestions
 */
export const getResumeSuggestions = asyncHandler(async (req, res) => {
  const { resumeData, jobDescription, jdText, priorAnalysis } = req.body;
  const jd = jobDescription || jdText;

  if (!resumeData || !jd?.trim()) {
    throw new ApiError(400, "Resume data and job description are required.");
  }

  try {
    const data = await aiOptimizationService.getSuggestions(
      resumeData,
      jd,
      priorAnalysis
    );
    
    // Decrement AI credits after successful request
    if (req.decrementCredits) {
      await req.decrementCredits();
    }
    
    return res.status(200).json(new ApiResponse(200, data, "Optimization suggestions ready"));
  } catch (error) {
    logAiError("suggestions-route", error);
    throw new ApiError(502, "Failed to generate suggestions", [], error.message);
  }
});

/**
 * @route   POST /api/ai/rewrite
 * @desc    ATS-friendly bullet rewriter (Groq)
 */
export const rewriteResumeBullet = asyncHandler(async (req, res) => {
  const { bulletText, keyword, jobDescription, jdText, jdAnalysis } = req.body;
  const jd = jobDescription || jdText;

  if (!bulletText?.trim() || !keyword?.trim()) {
    throw new ApiError(400, "bulletText and keyword are required.");
  }

  try {
    const data = await aiOptimizationService.rewriteBulletPoint({
      bulletText,
      keyword,
      jobDescription: jd,
      jdAnalysis,
    });
    
    // Decrement AI credits after successful request
    if (req.decrementCredits) {
      await req.decrementCredits();
    }
    
    return res.status(200).json(new ApiResponse(200, data, "Bullet rewritten successfully"));
  } catch (error) {
    logAiError("rewrite-route", error);
    throw new ApiError(502, "Failed to rewrite bullet point", [], error.message);
  }
});

/**
 * @route   POST /api/ai/generate-content
 * @desc    Legacy content generation (summary / bullets)
 */
export const generateAIContent = asyncHandler(async (req, res) => {
  const { promptType, context } = req.body;

  if (!promptType || !context) {
    throw new ApiError(400, "Prompt type and context are required.");
  }

  try {
    const data = await rewriteResumeContent(promptType, context);
    
    // Decrement AI credits after successful request
    if (req.decrementCredits) {
      await req.decrementCredits();
    }
    
    return res.status(200).json(new ApiResponse(200, data, "Content generated successfully"));
  } catch (error) {
    logAiError("generate-content-route", error, { promptType });
    throw new ApiError(502, "Failed to generate AI content", [], error.message);
  }
});

/**
 * @route   POST /api/ai/transform-resume
 */
export const optimizeExistingResume = asyncHandler(async (req, res) => {
  const { title, jobDescription } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Please upload a Resume PDF.");
  }

  const pdfData = await pdf(req.file.buffer);
  const rawText = pdfData.text;

  if (!rawText || rawText.trim().length < 50) {
    throw new ApiError(400, "The PDF content is too short or unreadable.");
  }

  try {
    const content = await chatCompletion({
      operation: "transform-resume-pdf",
      jsonMode: true,
      messages: [
        {
          role: "system",
          content:
            "You convert resume text into structured JSON. Return only valid JSON with no markdown.",
        },
        {
          role: "user",
          content: `Convert this raw resume text into structured JSON and optimize for the job description.

Resume text:
${rawText}

Job description:
${jobDescription || "General professional role"}

Return JSON:
{
  "firstName": "",
  "lastName": "",
  "jobTitle": "",
  "email": "",
  "phone": "",
  "address": "",
  "summary": "",
  "experience": [{"title": "", "companyName": "", "startDate": "", "endDate": "", "workSummary": ""}],
  "education": [{"universityName": "", "degree": "", "major": "", "startDate": "", "endDate": ""}],
  "skills": [{"name": "", "rating": 0}]
}`,
        },
      ],
    });

    const optimizedData = parseJsonFromResponse(content);

    const finalResumeData = {
      ...optimizedData,
      title: title || `Optimized - ${optimizedData.jobTitle || "Resume"}`,
      user: req.user._id,
      themeColor: "#9333ea",
    };

    const savedResume = await Resume.create(finalResumeData);

    return res
      .status(201)
      .json(new ApiResponse(201, { resumeId: savedResume._id }, "Resume forged successfully"));
  } catch (error) {
    logAiError("transform-resume-route", error);
    throw new ApiError(502, "Failed to transform resume with AI", [], error.message);
  }
});

/**
 * @route   POST /api/ai/refine-json
 */
export const transformResume = asyncHandler(async (req, res) => {
  const { resumeData, jobDescription } = req.body;

  if (!jobDescription) {
    throw new ApiError(400, "Job description is required for refinement.");
  }

  try {
    const content = await chatCompletion({
      operation: "refine-json",
      jsonMode: true,
      messages: [
        {
          role: "system",
          content:
            "You are a senior technical recruiter. Return only valid JSON with no markdown.",
        },
        {
          role: "user",
          content: `Rewrite this resume data to align with the job description.

Resume Data:
${JSON.stringify(resumeData)}

Job Description:
${jobDescription}

Return JSON with a single key "transformedData" containing the optimized resume object.`,
        },
      ],
    });

    const data = parseJsonFromResponse(content);
    return res.status(200).json(new ApiResponse(200, data, "Resume refined successfully"));
  } catch (error) {
    logAiError("refine-json-route", error);
    throw new ApiError(502, "Failed to refine resume with AI", [], error.message);
  }
});

/**
 * @route   POST /api/ai/generate-cover-letter
 */
export const generateCoverLetter = asyncHandler(async (req, res) => {
  let { resumeInfo, jobDescription } = req.body;
  let resumeText = "";

  if (req.file) {
    const pdfData = await pdf(req.file.buffer);
    resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      throw new ApiError(400, "The uploaded PDF is unreadable or too short.");
    }
  } else {
    if (typeof resumeInfo === "string") {
      resumeInfo = JSON.parse(resumeInfo);
    }

    if (!resumeInfo) {
      throw new ApiError(400, "Resume data is required.");
    }

    resumeText = `
Name: ${resumeInfo.firstName} ${resumeInfo.lastName}
Role: ${resumeInfo.jobTitle}
Summary: ${resumeInfo.summary}
Experience: ${JSON.stringify(resumeInfo.experience)}
Skills: ${JSON.stringify(resumeInfo.skills)}
`;
  }

  if (!jobDescription) {
    throw new ApiError(400, "Job Description is required for tailoring.");
  }

  try {
    const content = await chatCompletion({
      operation: "generate-cover-letter",
      messages: [
        {
          role: "system",
          content:
            "You are an executive career coach. Return only the cover letter body with no markdown or meta commentary.",
        },
        {
          role: "user",
          content: `Write a professional cover letter under 300 words.

Resume:
${resumeText}

Job Description:
${jobDescription}`,
        },
      ],
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { content }, "Cover letter forged successfully"));
  } catch (error) {
    logAiError("generate-cover-letter-route", error);
    throw new ApiError(502, "Failed to generate cover letter with AI", [], error.message);
  }
});

/**
 * @route   POST /api/ai/suggest-skills
 */
export const getSkillSuggestions = asyncHandler(async (req, res) => {
  const { jobTitle, jobDescription } = req.body;

  if (!jobTitle || !jobDescription) {
    throw new ApiError(400, "Job title and job description are required.");
  }

  try {
    const content = await chatCompletion({
      operation: "suggest-skills",
      jsonMode: true,
      messages: [
        {
          role: "system",
          content: "Return only a JSON array of skill strings. No markdown.",
        },
        {
          role: "user",
          content: `Identify the top 10 skills for a ${jobTitle} based on this job description:
${jobDescription}

Return JSON: { "skills": ["skill1", "skill2"] }`,
        },
      ],
    });

    const parsed = parseJsonFromResponse(content);
    const suggestions = Array.isArray(parsed) ? parsed : parsed.skills || [];

    // Decrement AI credits after successful request
    if (req.decrementCredits) {
      await req.decrementCredits();
    }

    return res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    logAiError("suggest-skills-route", error, { jobTitle });
    throw new ApiError(502, "Failed to fetch skill suggestions", [], error.message);
  }
});
