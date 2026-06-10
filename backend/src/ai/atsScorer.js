import { flattenResumeToText } from "./utils/resumeText.js";
import { collectJdKeywords, computeAtsScore } from "./utils/keywordMatcher.js";
import { extractJobDescription } from "./jdAnalyzer.js";

/**
 * Runs deterministic ATS scoring: resume keywords vs JD-extracted keywords.
 */
export const scoreResumeAgainstJd = (resumeData, jdAnalysis) => {
  const resumeText = flattenResumeToText(resumeData);
  const jdKeywords = collectJdKeywords(jdAnalysis);
  return {
    ...computeAtsScore(resumeText, jdKeywords),
    resumeTextLength: resumeText.length,
    jdKeywordCount: jdKeywords.length,
  };
};

/**
 * Full pipeline: extract JD → score resume.
 */
export const analyzeAndScore = async (resumeData, jobDescription) => {
  const jdAnalysis = await extractJobDescription(jobDescription);
  const atsResult = scoreResumeAgainstJd(resumeData, jdAnalysis);

  return {
    jdAnalysis,
    ...atsResult,
    analysis: buildAnalysisSummary(jdAnalysis, atsResult),
  };
};

const buildAnalysisSummary = (jdAnalysis, atsResult) => {
  const role = jdAnalysis.roleTitle || "the target role";
  const seniority = jdAnalysis.seniority ? ` (${jdAnalysis.seniority})` : "";

  if (atsResult.atsScore >= 80) {
    return `Strong alignment for ${role}${seniority}. Your resume covers most critical ATS keywords.`;
  }
  if (atsResult.atsScore >= 50) {
    return `Moderate alignment for ${role}${seniority}. Add missing keywords to experience bullets and skills.`;
  }
  return `Low alignment for ${role}${seniority}. Prioritize missing technical skills and tools in your summary and recent roles.`;
};
