import { chatCompletion, logAiError, parseJsonFromResponse } from "./groqClient.js";

/**
 * Rewrite a resume bullet with ATS-friendly, quantified, action-verb language.
 */
export const rewriteBullet = async ({
  bulletText,
  keyword,
  jobDescription = "",
  jdKeywords = [],
}) => {
  const keywordList =
    jdKeywords.length > 0
      ? jdKeywords.slice(0, 12).join(", ")
      : keyword;

  try {
    const content = await chatCompletion({
      operation: "resume-rewriter",
      jsonMode: true,
      messages: [
        {
          role: "system",
          content: `You are an ATS Resume Rewriter. Use strong action verbs (Led, Built, Optimized, Delivered).
Include quantified impact where reasonable. Naturally weave target keywords. Return only JSON.`,
        },
        {
          role: "user",
          content: `Rewrite this resume bullet for ATS optimization.

Original bullet:
${bulletText}

Primary keyword to include: ${keyword}
Additional JD keywords (if natural): ${keywordList}

${jobDescription ? `Job Description context:\n${jobDescription.slice(0, 1500)}` : ""}

Return JSON:
{
  "rewrittenText": "string",
  "originalText": "string"
}`,
        },
      ],
    });

    const parsed = parseJsonFromResponse(content);

    return {
      rewrittenText: parsed.rewrittenText || parsed.content || bulletText,
      originalText: parsed.originalText || bulletText,
    };
  } catch (error) {
    logAiError("resume-rewriter", error, {
      keyword,
      bulletLength: bulletText?.length,
    });
    throw error;
  }
};

/**
 * Generate summary or bullet content (legacy generate-content support).
 */
export const rewriteResumeContent = async (promptType, context) => {
  if (promptType === "bullets" && context.includes("keyword")) {
    const match = context.match(/keyword "([^"]+)"/i);
    const bulletMatch = context.match(/:\s*(.+)$/s);
    const keyword = match?.[1] || "";
    const bullet = bulletMatch?.[1]?.trim() || context;
    const result = await rewriteBullet({ bulletText: bullet, keyword });
    return { content: result.rewrittenText };
  }

  const taskLabel =
    promptType === "summary"
      ? "a professional summary"
      : "one high-impact resume bullet point";

  const content = await chatCompletion({
    operation: "resume-content-generator",
    jsonMode: true,
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume writer. Return only valid JSON with no markdown.",
      },
      {
        role: "user",
        content: `Generate ${taskLabel} based on: ${context}
Return JSON: { "content": "string" }`,
      },
    ],
  });

  return parseJsonFromResponse(content);
};
