import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useSubscription } from '../context/SubscriptionContext';
import PersonalInfoForm from '../components/PersonalInfoForm';
import EducationForm from '../components/EducationForm';
import ExperienceForm from '../components/ExperienceForm';
import ProjectsForm from '../components/ProjectsForm';
import SkillsForm from '../components/SkillsForm';
import ResumePreview from '../components/ResumePreview';
import AIOptimizer from '../components/AIOptimizer';
import PlanBadge from '../components/ui/PlanBadge';

// Beautiful Lucide Icons for dashboard actions
import { 
  Sparkles, Save, RotateCcw, Printer, LayoutTemplate, 
  CheckCircle2, AlertTriangle, RefreshCw, Download, Eye, EyeOff
} from 'lucide-react';

const ResumeBuilder = () => {
  const {
    resumeId,
    isSaving,
    error,
    saveSuccess,
    template,
    setTemplate,
    saveResume,
    resetResume,
    loadSampleData
  } = useResume();

  const { refreshSubscription, isPro, aiCredits } = useSubscription();

  // Load subscription data when the builder mounts
  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'work', 'education', 'projects', 'skills'

  const tabItems = [
    { id: 'personal', label: '1. Contact Info' },
    { id: 'work', label: '2. Experience' },
    { id: 'projects', label: '3. Projects' },
    { id: 'education', label: '4. Education' },
    { id: 'skills', label: '5. Skills' },
    { id: 'ai', label: '6. AI Optimizer ✨' },
  ];

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!resumeId) {
      alert("Please save your resume first to generate and download the PDF.");
      return;
    }
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const downloadUrl = `${apiBaseUrl}/api/resumes/download/${resumeId}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans select-none print:bg-white print:text-black landing-theme">
      {/* Premium Dashboard Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between flex-wrap gap-4 print:hidden shadow-sm">
        {/* Logo and branding */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-md bg-neutral-900 text-white text-xs font-semibold tracking-tight"
              aria-hidden
            >
              CF
            </span>
            <div>
              <h1 className="text-sm font-semibold text-neutral-900 tracking-tight leading-none font-bold">
                CareerForge Pro
              </h1>
              <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-semibold mt-1 leading-none">
                ATS Resume Generator SaaS
              </p>
            </div>
          </Link>
          <PlanBadge />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Preset Sample Data */}
          <button
            type="button"
            onClick={loadSampleData}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm"
            title="Pre-populate fields with polished template data"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Seed Sample Data
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={resetResume}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm"
            title="Wipe form contents"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          {/* Template Select */}
          <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 p-1 rounded-lg">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-2 flex items-center gap-1">
              <LayoutTemplate className="w-3 h-3 text-neutral-500" /> Style:
            </span>
            {['modern', 'minimal', 'classic'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemplate(t)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize transition-all duration-150 ${
                  template === t 
                    ? 'bg-neutral-900 text-white shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Save to Mongo */}
          <button
            type="button"
            onClick={saveResume}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all duration-200 ${
              isSaving
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                : saveSuccess 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-[0.98]'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Resume'}
          </button>

          {/* Print Preview */}
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg text-xs font-bold transition-all duration-200 shadow-sm active:scale-[0.98] ${
              isPreviewMode 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
            title="Toggle Fullscreen Print Preview Mode"
          >
            {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isPreviewMode ? 'Exit Preview' : 'Print Preview'}
          </button>

          {/* Print PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm active:scale-[0.98]"
            title="Print standard PDF resume"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-all duration-200 shadow-sm active:scale-[0.98]"
            title="Generate and Download PDF file"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </header>

      {/* Sync State Alert Bar */}
      <div className="bg-neutral-100/80 border-b border-neutral-200 px-6 py-2 flex items-center justify-between text-xs text-neutral-600 font-medium print:hidden">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${resumeId ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span>
            {resumeId 
              ? `Cloud Database Sync Active (ID: ${resumeId})` 
              : 'Local Sandbox - Click "Save Resume" to secure in database'}
          </span>
        </div>
        
        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-1 text-rose-600 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Workspace split screen */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Modular input Form */}
        {!isPreviewMode && (
          <section className="w-full lg:w-[48%] flex flex-col border-r border-neutral-200 bg-white print:hidden">
            {/* Tab Selection Row */}
            <div className="flex border-b border-neutral-200 bg-neutral-50 p-2 overflow-x-auto gap-1">
              {tabItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-white text-neutral-900 border border-neutral-200 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Form Scroll Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
              <div className="transition-all duration-300">
                {activeTab === 'personal' && <PersonalInfoForm />}
                {activeTab === 'work' && <ExperienceForm />}
                {activeTab === 'projects' && <ProjectsForm />}
                {activeTab === 'education' && <EducationForm />}
                {activeTab === 'skills' && <SkillsForm />}
                {activeTab === 'ai' && <AIOptimizer />}
              </div>
              
              {/* Seed callout guide */}
              <div className="p-4 bg-white border border-neutral-200 rounded-2xl flex gap-3 text-neutral-600 text-xs leading-relaxed shadow-sm">
                <Sparkles className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-900 mb-0.5">Want to see the output instantly?</p>
                  <p>Click <strong className="text-neutral-800 cursor-pointer hover:underline font-bold" onClick={loadSampleData}>Seed Sample Data</strong> at the top right to populate the form instantly with a professional senior developer profile!</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Right Side: High-fidelity print-preview sheet */}
        <section className={`flex-1 bg-neutral-100 overflow-y-auto p-8 flex flex-col justify-start items-center print:p-0 print:bg-white ${isPreviewMode ? 'w-full' : ''}`}>
          {isPreviewMode && (
            <div className="w-full max-w-[800px] flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Print Preview Mode</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Download PDF */}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-all duration-200 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
                {/* Print */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                {/* Close */}
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(false)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Exit Preview
                </button>
              </div>
            </div>
          )}
          <div className={`${isPreviewMode ? 'scale-100' : 'scale-[0.8] md:scale-[0.9] xl:scale-[0.95] 2xl:scale-100'} origin-top transition-transform duration-200`}>
            <ResumePreview />
          </div>
        </section>
        
      </main>
    </div>
  );
};

export default ResumeBuilder;
