import React from 'react';
import { CheckCircle2, AlertCircle, ListChecks } from 'lucide-react';

const MissingKeywordsPanel = ({ matchedKeywords = [], missingKeywords = [], onSelectKeyword }) => (
  <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800">
    <h4 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-1.5">
      <ListChecks className="w-4 h-4 text-indigo-400" />
      Keyword Alignment
    </h4>

    <div className="mb-4">
      <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        Matched ({matchedKeywords.length})
      </div>
      {matchedKeywords.length === 0 ? (
        <p className="text-[11px] text-slate-500 italic">No matches yet — use Rewrite to add keywords.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {matchedKeywords.map((kw, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-medium"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>

    <div>
      <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
        Missing ({missingKeywords.length})
      </div>
      {missingKeywords.length === 0 ? (
        <p className="text-[11px] text-emerald-400 font-medium">All tracked keywords are present.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {missingKeywords.map((kw, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectKeyword?.(kw)}
              className="px-2 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-md text-[10px] font-medium transition-all"
              title="Use in rewriter"
            >
              + {kw}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default MissingKeywordsPanel;
