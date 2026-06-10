import { extractJobDescription } from "../jdAnalyzer.js";
import { scoreResumeAgainstJd } from "../atsScorer.js";
import { generateOptimizationSuggestions } from "../optimizationSuggestions.js";
import { logAiError } from "../groqClient.js";

/**
 * Week 2 Job Description Analysis Agent
 * Orchestrates JD extraction, ATS scoring, and optional optimization insights.
 */
export class JdAnalysisAgent {
  /**
   * Phase 1: Analyze JD + score resume (no weak-bullet AI pass).
   */
  async analyze(resumeData, jobDescription) {
    const jdAnalysis = await extractJobDescription(jobDescription);
    const atsResult = scoreResumeAgainstJd(resumeData, jdAnalysis);

    return {
      jdAnalysis,
      atsScore: atsResult.atsScore,
      matchPercentage: atsResult.matchPercentage,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      missingSkills: atsResult.missingKeywords,
      totalKeywords: atsResult.totalKeywords,
      analysis: this.#buildSummary(jdAnalysis, atsResult),
    };
  }

  /**
   * Phase 2: Full optimization suggestions (weak bullets + improvements).
   */
  async suggest(resumeData, jobDescription, priorAnalysis = null) {
    const base =
      priorAnalysis || (await this.analyze(resumeData, jobDescription));

    try {
      const suggestions = await generateOptimizationSuggestions(
        resumeData,
        jobDescription,
        base.jdAnalysis,
        base
      );

      return {
        ...base,
        ...suggestions,
        missingKeywords: suggestions.missingKeywords?.length
          ? suggestions.missingKeywords
          : base.missingKeywords,
      };
    } catch (error) {
      logAiError("jd-analysis-agent-suggest", error);
      return {
        ...base,
        weakBulletPoints: [],
        improvementSuggestions: [
          "Add quantified metrics to your top 3 experience bullets.",
          `Incorporate missing keywords: ${base.missingKeywords.slice(0, 5).join(", ")}`,
        ],
      };
    }
  }

  #buildSummary(jdAnalysis, atsResult) {
    const role = jdAnalysis.roleTitle || "this position";
    const score = atsResult.atsScore;

    if (score >= 80) {
      return `Excellent ATS match (${score}%) for ${role}.`;
    }
    if (score >= 50) {
      return `Moderate ATS match (${score}%) for ${role}. Address ${atsResult.missingKeywords.length} missing keywords.`;
    }
    return `Low ATS match (${score}%) for ${role}. Refocus skills and bullets on required technical skills and tools.`;
  }
}

export const jdAnalysisAgent = new JdAnalysisAgent();
