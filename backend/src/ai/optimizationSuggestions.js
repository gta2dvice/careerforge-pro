import { chatCompletion, logAiError, parseJsonFromResponse } from "./groqClient.js";

/**
 * AI-powered resume optimization suggestions (weak bullets + improvements).
 */
export const generateOptimizationSuggestions = async (
  resumeData,
  jobDescription,
  jdAnalysis,
  atsResult
) => {
  try {
    const content = await chatCompletion({
      operation: "optimization-suggestions",
      jsonMode: true,
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS resume coach. Return only valid JSON. Use action verbs and measurable outcomes in recommendations.",
        },
        {
          role: "user",
          content: `Review this resume against the job description.

Resume:
${JSON.stringify(resumeData)}

Job Description:
${jobDescription}

JD Analysis:
${JSON.stringify(jdAnalysis)}

ATS Results (matched/missing):
${JSON.stringify({
  atsScore: atsResult.atsScore,
  matchedKeywords: atsResult.matchedKeywords,
  missingKeywords: atsResult.missingKeywords,
})}

Return JSON:
{
  "missingKeywords": ["string"],
  "missingSkills": ["string"],
  "weakBulletPoints": [
    {
      "original": "string",
      "reason": "string",
      "recommendation": "string"
    }
  ],
  "improvementSuggestions": ["string"]
}`,
        },
      ],
    });

    const parsed = parseJsonFromResponse(content);

    return {
      missingKeywords: parsed.missingKeywords || atsResult.missingKeywords || [],
      missingSkills: parsed.missingSkills || [],
      weakBulletPoints: parsed.weakBulletPoints || [],
      improvementSuggestions: parsed.improvementSuggestions || [],
    };
  } catch (error) {
    logAiError("optimization-suggestions", error);
    throw error;
  }
};
