import React from 'react';

const getScoreColorClass = (score) => {
  if (score >= 80) return 'text-emerald-400 stroke-emerald-500';
  if (score >= 50) return 'text-amber-400 stroke-amber-500';
  return 'text-rose-400 stroke-rose-500';
};

const getScoreBgClass = (score) => {
  if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
  if (score >= 50) return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
  return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
};

const ATSScoreCard = ({ atsScore, matchedKeywords = [], missingKeywords = [], analysis }) => {
  if (atsScore === null || atsScore === undefined) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" className="stroke-slate-800" strokeWidth="8" fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r="40"
            className={`transition-all duration-1000 ${getScoreColorClass(atsScore)}`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - atsScore / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-black tracking-tight">{atsScore}%</span>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">ATS Score</span>
        </div>
      </div>

      <div className="flex-1 text-center md:text-left">
        <h4 className="font-bold text-base text-slate-100 mb-1.5 flex items-center justify-center md:justify-start gap-2 flex-wrap">
          ATS Match Rate
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getScoreBgClass(atsScore)}`}>
            {atsScore >= 80 ? 'Excellent' : atsScore >= 50 ? 'Moderate' : 'Needs Work'}
          </span>
        </h4>
        {analysis && (
          <p className="text-xs text-slate-400 leading-relaxed mb-3">{analysis}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-xs text-emerald-400 font-bold">{matchedKeywords.length}</div>
            <div className="text-[10px] text-slate-500 font-medium">Matched Keywords</div>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-xs text-rose-400 font-bold">{missingKeywords.length}</div>
            <div className="text-[10px] text-slate-500 font-medium">Missing Keywords</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreCard;
