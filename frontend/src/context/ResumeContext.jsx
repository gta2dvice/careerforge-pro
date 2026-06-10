import React, { createContext, useState, useContext } from 'react';
import { apiClient, RESUME_API } from '../api/client';
import { mapResumeToBackend, mapResumeFromBackend } from '../api/resumeMapper';
import {
  analyzeJobDescriptionApi,
  fetchSuggestionsApi,
  rewriteBulletApi,
} from '../services/aiService';
import { seedData } from '../data/seedData';

const ResumeContext = createContext();

const initialResumeState = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    location: '',
    summary: ''
  },
  education: [],
  experience: [],
  projects: [],
  skills: []
};

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(initialResumeState);
  const [resumeId, setResumeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Setup template selection in local state for live preview (Week 1 bonus)
  const [template, setTemplate] = useState('modern'); // 'modern', 'minimal', 'classic'

  // Week 2 — AI Optimization States
  const [jdText, setJdText] = useState('');
  const [jdAnalysis, setJdAnalysis] = useState(null);
  const [analysisSummary, setAnalysisSummary] = useState('');
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [weakBulletPoints, setWeakBulletPoints] = useState([]);
  const [improvementSuggestions, setImprovementSuggestions] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeError, setOptimizeError] = useState(null);

  const applyAnalysisPayload = (payload) => {
    setJdAnalysis(payload.jdAnalysis || null);
    setAnalysisSummary(payload.analysis || '');
    setAtsScore(payload.atsScore ?? payload.matchPercentage ?? null);
    setMatchedKeywords(payload.matchedKeywords || []);
    setMissingKeywords(payload.missingKeywords || []);
    setMissingSkills(payload.missingSkills || payload.missingKeywords || []);
    setWeakBulletPoints(payload.weakBulletPoints || []);
    setImprovementSuggestions(payload.improvementSuggestions || []);
    setLastAnalysis(payload);
  };

  // Update Personal Info
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // Education Actions
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...prev.education];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index)
    }));
  };

  // Experience Actions
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ]
    }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index)
    }));
  };

  // Project Actions
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: '',
          description: '',
          technologies: [],
          githubLink: '',
          liveLink: ''
        }
      ]
    }));
  };

  const updateProject = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...prev.projects];
      if (field === 'technologies') {
        // Handle skills comma list conversion to array
        const techArray = typeof value === 'string' 
          ? value.split(',').map(tech => tech.trim()).filter(Boolean)
          : value;
        updated[index] = { ...updated[index], technologies: techArray };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== index)
    }));
  };

  // Skills Actions (Accepts flat array)
  const updateSkills = (skillsInput) => {
    const skillsArray = typeof skillsInput === 'string'
      ? skillsInput.split(',').map(skill => skill.trim()).filter(Boolean)
      : skillsInput;
    setResumeData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const saveResume = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const payload = mapResumeToBackend(resumeData, resumeId, jdText, atsScore);
      let response;

      if (resumeId) {
        response = await apiClient.put(`${RESUME_API}?id=${resumeId}`, payload);
      } else {
        const createResponse = await apiClient.post(RESUME_API, {
          title: payload.title,
          themeColor: payload.themeColor,
        });

        if (!createResponse.data?.success) {
          setError(createResponse.data?.message || 'Failed to create resume.');
          return;
        }

        const newId = createResponse.data.data._id;
        response = await apiClient.put(`${RESUME_API}?id=${newId}`, payload);
      }

      if (response.data?.success) {
        const { resumeData: savedResume, resumeId: savedId } = mapResumeFromBackend(
          response.data.data
        );
        setResumeData(savedResume);
        setResumeId(savedId);
        
        if (response.data.data.jobDescription !== undefined) {
          setJdText(response.data.data.jobDescription || '');
        }
        if (response.data.data.atsScore !== undefined) {
          setAtsScore(response.data.data.atsScore || 0);
        }
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(response.data?.message || 'Failed to save resume.');
      }
    } catch (err) {
      console.error('Error saving resume to API:', err);
      setError(err.response?.data?.message || 'Error communicating with server.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadResume = async (id) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`${RESUME_API}/single`, { params: { id } });
      if (response.data?.success) {
        const { resumeData: loadedResume, resumeId: loadedId } = mapResumeFromBackend(
          response.data.data
        );
        setResumeData(loadedResume);
        setResumeId(loadedId);
        
        if (response.data.data.jobDescription !== undefined) {
          setJdText(response.data.data.jobDescription || '');
        }
        if (response.data.data.atsScore !== undefined) {
          setAtsScore(response.data.data.atsScore || 0);
        }
      } else {
        setError(response.data?.message || 'Failed to load resume.');
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
      setError(err.response?.data?.message || 'Failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to initial empty state
  const resetResume = () => {
    setResumeData(initialResumeState);
    setResumeId(null);
    setError(null);
    setSaveSuccess(false);
  };

  // Pre-load with student profile data
  const loadSampleData = () => {
    setResumeData(seedData);
  };

  /** Week 2: JD Analysis Agent + ATS score */
  const analyzeJobDescriptionOnly = async (customJdText = jdText) => {
    if (!customJdText?.trim()) {
      setOptimizeError('Please enter a Job Description.');
      return null;
    }
    const analysis = await analyzeJobDescriptionApi(resumeData, customJdText);
    applyAnalysisPayload(analysis);
    return analysis;
  };

  /** Week 2: Full optimize — analyze JD + fetch AI suggestions */
  const analyzeAndOptimizeResume = async (customJdText = jdText) => {
    if (!customJdText?.trim()) {
      setOptimizeError('Please enter a Job Description.');
      return;
    }
    setIsOptimizing(true);
    setOptimizeError(null);
    try {
      const analysis = await analyzeJobDescriptionApi(resumeData, customJdText);
      applyAnalysisPayload(analysis);

      const suggestions = await fetchSuggestionsApi(resumeData, customJdText, analysis);
      applyAnalysisPayload(suggestions);
    } catch (err) {
      console.error('AI optimization error:', err);
      setOptimizeError(err.response?.data?.message || err.message || 'Error communicating with AI server.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const rewriteBulletPoint = async (bulletText, keyword) => {
    try {
      const result = await rewriteBulletApi({
        bulletText,
        keyword,
        jobDescription: jdText,
        jdAnalysis,
      });
      return result.rewrittenText || bulletText;
    } catch (err) {
      console.error('Error rewriting bullet point:', err);
      throw new Error(err.response?.data?.message || err.message || 'Error communicating with AI server.');
    }
  };

  const applyRewrittenBullet = (experienceIndex, bulletIndex, newText) => {
    setResumeData(prev => {
      const updatedExperience = [...prev.experience];
      const exp = { ...updatedExperience[experienceIndex] };
      
      const lines = exp.description.split('\n');
      lines[bulletIndex] = newText;
      exp.description = lines.join('\n');
      
      updatedExperience[experienceIndex] = exp;
      
      return {
        ...prev,
        experience: updatedExperience
      };
    });
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      resumeId,
      isLoading,
      isSaving,
      error,
      saveSuccess,
      template,
      setTemplate,
      jdText,
      setJdText,
      jdAnalysis,
      analysisSummary,
      atsScore,
      matchedKeywords,
      missingKeywords,
      missingSkills,
      weakBulletPoints,
      improvementSuggestions,
      isOptimizing,
      optimizeError,
      analyzeJobDescriptionOnly,
      analyzeAndOptimizeResume,
      rewriteBulletPoint,
      applyRewrittenBullet,
      updatePersonalInfo,
      addEducation,
      updateEducation,
      removeEducation,
      addExperience,
      updateExperience,
      removeExperience,
      addProject,
      updateProject,
      removeProject,
      updateSkills,
      saveResume,
      loadResume,
      resetResume,
      loadSampleData
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
