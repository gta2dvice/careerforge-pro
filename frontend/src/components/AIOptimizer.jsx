import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Sparkles, RefreshCw } from 'lucide-react';
import JDAnalysisPanel from './ai/JDAnalysisPanel';
import ATSScoreCard from './ai/ATSScoreCard';
import MissingKeywordsPanel from './ai/MissingKeywordsPanel';
import SuggestionsPanel from './ai/SuggestionsPanel';

const AIOptimizer = () => {
  const {
    resumeData,
    jdText,
    setJdText,
    jdAnalysis,
    analysisSummary,
    atsScore,
    matchedKeywords,
    missingKeywords,
    weakBulletPoints,
    improvementSuggestions,
    isOptimizing,
    optimizeError,
    analyzeAndOptimizeResume,
    rewriteBulletPoint,
    applyRewrittenBullet,
  } = useResume();

  const [selectedExpIdx, setSelectedExpIdx] = useState(0);
  const [selectedBulletIdx, setSelectedBulletIdx] = useState(0);
  const [targetKeyword, setTargetKeyword] = useState('');
  const [customKeyword, setCustomKeyword] = useState('');
  const [rewrittenOutput, setRewrittenOutput] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteError, setRewriteError] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const getBulletsForExp = (expIdx) => {
    const exp = resumeData.experience[expIdx];
    if (!exp?.description) return [];
    return exp.description.split('\n').filter(Boolean);
  };

  const handleRewrite = async () => {
    setRewriteError(null);
    setApplySuccess(false);

    const bullets = getBulletsForExp(selectedExpIdx);
    const bulletToRewrite = bullets[selectedBulletIdx];
    const keywordToUse = targetKeyword === 'custom' ? customKeyword : targetKeyword;

    if (!bulletToRewrite) {
      setRewriteError('Please select a valid bullet point to rewrite.');
      return;
    }
    if (!keywordToUse?.trim()) {
      setRewriteError('Please select or enter a target keyword.');
      return;
    }

    setIsRewriting(true);
    try {
      const result = await rewriteBulletPoint(bulletToRewrite, keywordToUse);
      setRewrittenOutput(result);
    } catch (err) {
      setRewriteError(err.message || 'Error occurred while rewriting bullet.');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleApplyRewrite = () => {
    if (!rewrittenOutput) return;
    applyRewrittenBullet(selectedExpIdx, selectedBulletIdx, rewrittenOutput);
    setApplySuccess(true);
    setRewrittenOutput('');
    setTimeout(() => setApplySuccess(false), 3000);
  };

  const hasResults = atsScore !== null;

  return (
    <div className="flex flex-col gap-6">
      {/* Job Description Input */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">Week 2 — AI Resume Optimizer</h3>
            <p className="text-xs text-slate-400">
              JD Analysis Agent · ATS Scoring · Keyword Rewrite · Groq AI
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            Job Description
            {isOptimizing && (
              <span className="text-[10px] text-indigo-400 animate-pulse">Running JD Analysis Agent...</span>
            )}
          </label>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={7}
            className="glass-input w-full p-4 rounded-xl text-xs leading-relaxed resize-y"
            disabled={isOptimizing}
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between mt-4">
          {optimizeError ? (
            <span className="text-xs text-rose-400 font-medium max-w-md">{optimizeError}</span>
          ) : (
            <span className="text-[11px] text-slate-500">Analyze to extract skills, score ATS match, and get suggestions.</span>
          )}

          <button
            type="button"
            onClick={() => analyzeAndOptimizeResume()}
            disabled={isOptimizing || !jdText.trim()}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isOptimizing || !jdText.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98]'
            }`}
          >
            {isOptimizing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {isOptimizing ? 'Analyzing...' : 'Analyze Job Description'}
          </button>
        </div>
      </div>

      {hasResults && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          <ATSScoreCard
            atsScore={atsScore}
            matchedKeywords={matchedKeywords}
            missingKeywords={missingKeywords}
            analysis={analysisSummary}
          />

          <JDAnalysisPanel jdAnalysis={jdAnalysis} />

          <MissingKeywordsPanel
            matchedKeywords={matchedKeywords}
            missingKeywords={missingKeywords}
            onSelectKeyword={(kw) => {
              setTargetKeyword(kw);
              setRewrittenOutput('');
            }}
          />

          {/* Bullet Rewriter */}
          {resumeData.experience?.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800/80 bg-gradient-to-br from-[#0a0d16] to-[#0e1424]">
              <h4 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Rewrite Resume Bullet (ATS-Optimized)
              </h4>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">Experience entry</label>
                  <select
                    value={selectedExpIdx}
                    onChange={(e) => {
                      setSelectedExpIdx(parseInt(e.target.value, 10));
                      setSelectedBulletIdx(0);
                      setRewrittenOutput('');
                    }}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                  >
                    {resumeData.experience.map((exp, idx) => (
                      <option key={idx} value={idx}>
                        {exp.position} at {exp.company || 'Company'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">Bullet to rewrite</label>
                  {getBulletsForExp(selectedExpIdx).length === 0 ? (
                    <p className="text-xs text-rose-400/80 border border-dashed border-rose-500/20 p-2.5 rounded-xl text-center">
                      Add achievement bullets to this role first.
                    </p>
                  ) : (
                    <select
                      value={selectedBulletIdx}
                      onChange={(e) => {
                        setSelectedBulletIdx(parseInt(e.target.value, 10));
                        setRewrittenOutput('');
                      }}
                      className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                    >
                      {getBulletsForExp(selectedExpIdx).map((bullet, idx) => (
                        <option key={idx} value={idx}>
                          {bullet.substring(0, 80)}...
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">Target keyword</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {missingKeywords.slice(0, 8).map((kw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setTargetKeyword(kw);
                          setRewrittenOutput('');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          targetKeyword === kw
                            ? 'bg-indigo-600 text-white border border-indigo-500'
                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {kw}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setTargetKeyword('custom')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        targetKeyword === 'custom'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-900 border border-slate-800 text-slate-300'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                  {targetKeyword === 'custom' && (
                    <input
                      type="text"
                      value={customKeyword}
                      onChange={(e) => setCustomKeyword(e.target.value)}
                      placeholder="Enter keyword..."
                      className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                    />
                  )}
                </div>

                {rewriteError && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                    {rewriteError}
                  </p>
                )}
                {applySuccess && (
                  <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                    Bullet applied to your resume.
                  </p>
                )}

                {rewrittenOutput && (
                  <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Rewritten</p>
                    <p className="text-xs text-slate-200 leading-relaxed">&quot;{rewrittenOutput}&quot;</p>
                    <button
                      type="button"
                      onClick={handleApplyRewrite}
                      className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                    >
                      Apply to Resume
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRewrite}
                  disabled={
                    isRewriting ||
                    !targetKeyword ||
                    (targetKeyword === 'custom' && !customKeyword.trim())
                  }
                  className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold ${
                    isRewriting
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                  }`}
                >
                  {isRewriting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  {isRewriting ? 'Rewriting...' : 'Rewrite Resume Bullet'}
                </button>
              </div>
            </div>
          )}

          <SuggestionsPanel
            weakBulletPoints={weakBulletPoints}
            improvementSuggestions={improvementSuggestions}
          />
        </div>
      )}
    </div>
  );
};

export default AIOptimizer;
