import { jdAnalysisAgent } from "../ai/agents/jdAnalysisAgent.js";
import { rewriteBullet } from "../ai/resumeRewriter.js";
import { collectJdKeywords } from "../ai/utils/keywordMatcher.js";

/**
 * Service layer for Week 2 AI optimization features.
 */
export const aiOptimizationService = {
  async analyzeJobDescription(resumeData, jobDescription) {
    return jdAnalysisAgent.analyze(resumeData, jobDescription);
  },

  async getSuggestions(resumeData, jobDescription, priorAnalysis = null) {
    return jdAnalysisAgent.suggest(resumeData, jobDescription, priorAnalysis);
  },

  async rewriteBulletPoint({
    bulletText,
    keyword,
    jobDescription = "",
    jdAnalysis = null,
  }) {
    const jdKeywords = jdAnalysis ? collectJdKeywords(jdAnalysis) : [];

    return rewriteBullet({
      bulletText,
      keyword,
      jobDescription,
      jdKeywords: keyword ? [keyword, ...jdKeywords] : jdKeywords,
    });
  },
};
