import { apiClient, AI_API } from '../api/client';
import { mapResumeToBackend } from '../api/resumeMapper';

const post = async (path, body) => {
  const response = await apiClient.post(`${AI_API}${path}`, body);
  if (!response.data?.success) {
    throw new Error(response.data?.message || 'AI request failed');
  }
  return response.data.data;
};

/**
 * Week 2: JD Analysis Agent + ATS scoring
 */
export const analyzeJobDescriptionApi = (resumeData, jobDescription) =>
  post('/analyze-jd', {
    resumeData: mapResumeToBackend(resumeData),
    jobDescription,
  });

/**
 * Week 2: Optimization suggestions (weak bullets, improvements)
 */
export const fetchSuggestionsApi = (resumeData, jobDescription, priorAnalysis = null) =>
  post('/suggestions', {
    resumeData: mapResumeToBackend(resumeData),
    jobDescription,
    priorAnalysis,
  });

/**
 * Week 2: ATS bullet rewriter
 */
export const rewriteBulletApi = ({
  bulletText,
  keyword,
  jobDescription,
  jdAnalysis,
}) =>
  post('/rewrite', {
    bulletText,
    keyword,
    jobDescription,
    jdAnalysis,
  });
