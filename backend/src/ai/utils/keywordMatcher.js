/**
 * Normalizes and deduplicates keyword lists from JD analysis.
 */
export const collectJdKeywords = (jdAnalysis = {}) => {
  const buckets = [
    jdAnalysis.technicalSkills,
    jdAnalysis.softSkills,
    jdAnalysis.tools,
    jdAnalysis.frameworks,
    jdAnalysis.methodologies,
    jdAnalysis.allKeywords,
    jdAnalysis.keywords,
    jdAnalysis.requiredSkills,
    jdAnalysis.preferredSkills,
  ];

  const seen = new Set();
  const keywords = [];

  for (const bucket of buckets) {
    if (!Array.isArray(bucket)) continue;
    for (const raw of bucket) {
      const term = String(raw || "").trim();
      if (!term) continue;
      const key = term.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      keywords.push(term);
    }
  }

  return keywords;
};

/**
 * Deterministic ATS keyword match: resume text vs JD keyword list.
 */
export const computeAtsScore = (resumeText, jdKeywords = []) => {
  const normalizedResume = (resumeText || "").toLowerCase();
  const matchedKeywords = [];
  const missingKeywords = [];

  for (const keyword of jdKeywords) {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (!normalizedKeyword) continue;

    const isMatch =
      normalizedResume.includes(normalizedKeyword) ||
      normalizedKeyword.split(/\s+/).every((token) => normalizedResume.includes(token));

    if (isMatch) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  const total = jdKeywords.length;
  const atsScore =
    total === 0 ? 0 : Math.round((matchedKeywords.length / total) * 100);

  return {
    atsScore,
    matchPercentage: atsScore,
    matchedKeywords,
    missingKeywords,
    totalKeywords: total,
  };
};
