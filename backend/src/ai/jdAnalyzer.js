import { chatCompletion, logAiError, parseJsonFromResponse } from "./groqClient.js";

const JD_EXTRACTION_SCHEMA = `{
  "technicalSkills": ["string"],
  "softSkills": ["string"],
  "tools": ["string"],
  "frameworks": ["string"],
  "methodologies": ["string"],
  "roleTitle": "string",
  "seniority": "string",
  "allKeywords": ["string"]
}`;

/**
 * Job Description Analysis Agent — extracts structured hiring signals from raw JD text.
 */
export const extractJobDescription = async (jdText) => {
  try {
    const content = await chatCompletion({
      operation: "jd-analysis-agent",
      jsonMode: true,
      messages: [
        {
          role: "system",
          content:
            "You are a Job Description Analysis Agent for ATS systems. Extract exhaustive, deduplicated lists. Return only valid JSON.",
        },
        {
          role: "user",
          content: `Analyze this job description and return JSON matching this schema:
${JD_EXTRACTION_SCHEMA}

Rules:
- technicalSkills: programming languages, platforms, core technical competencies
- softSkills: communication, leadership, collaboration, etc.
- tools: software, cloud services, IDEs, DevOps tools
- frameworks: React, Django, Spring, etc.
- methodologies: Agile, Scrum, CI/CD practices, etc.
- allKeywords: union of the most ATS-relevant terms (max 40, no duplicates)

Job Description:
${jdText}`,
        },
      ],
    });

    const parsed = parseJsonFromResponse(content);

    return {
      technicalSkills: parsed.technicalSkills || [],
      softSkills: parsed.softSkills || [],
      tools: parsed.tools || [],
      frameworks: parsed.frameworks || [],
      methodologies: parsed.methodologies || [],
      roleTitle: parsed.roleTitle || "",
      seniority: parsed.seniority || "",
      allKeywords: parsed.allKeywords || [],
    };
  } catch (error) {
    logAiError("jd-analysis-agent", error, { jdLength: jdText?.length });
    throw error;
  }
};

/** @deprecated Use extractJobDescription — kept for backward compatibility */
export const analyzeJobDescriptionText = extractJobDescription;
