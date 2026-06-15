import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import ResumePreview from './ResumePreview';

const PrintableResume = () => {
  const { resume_id } = useParams();
  const { loadResume, isLoading, resumeData } = useResume();

  useEffect(() => {
    if (resume_id) {
      loadResume(resume_id);
    }
  }, [resume_id]);

  useEffect(() => {
    // Set the window.resumeReady flag for Puppeteer once data is loaded
    if (!isLoading && resumeData && resumeData.personalInfo && resumeData.personalInfo.fullName) {
      const timer = setTimeout(() => {
        window.resumeReady = true;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, resumeData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
          <p className="text-sm font-semibold">Loading Printable Resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white print:bg-white flex justify-center items-start py-8 print:py-0">
      <ResumePreview />
    </div>
  );
};

export default PrintableResume;
