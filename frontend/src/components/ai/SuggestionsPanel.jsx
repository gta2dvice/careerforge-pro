import React from 'react';
import { FileText, AlertCircle, ChevronRight } from 'lucide-react';

const SuggestionsPanel = ({ weakBulletPoints = [], improvementSuggestions = [] }) => {
  if (!weakBulletPoints?.length && !improvementSuggestions?.length) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800">
      <h4 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-1.5">
        <FileText className="w-4 h-4 text-pink-400" />
        Optimization Suggestions
      </h4>

      {weakBulletPoints.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-400 mb-2">Weak Bullet Points</div>
          <div className="flex flex-col gap-3">
            {weakBulletPoints.map((item, i) => (
              <div key={i} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                <div className="text-rose-400/80 font-bold flex items-center gap-1 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  &quot;{(item.original || '').substring(0, 60)}...&quot;
                </div>
                <p className="text-slate-400 mb-1">
                  <strong className="text-slate-300">Why:</strong> {item.reason}
                </p>
                <p className="text-slate-400">
                  <strong className="text-emerald-400/90">Fix:</strong> {item.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {improvementSuggestions.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-2">Recommended Improvements</div>
          <ul className="flex flex-col gap-2 pl-1">
            {improvementSuggestions.map((item, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SuggestionsPanel;
