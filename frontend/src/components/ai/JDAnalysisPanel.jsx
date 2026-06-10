import React from 'react';
import { Briefcase, Brain, Wrench, Layers, GitBranch } from 'lucide-react';

const KeywordGroup = ({ title, icon: Icon, items, colorClass }) => {
  if (!items?.length) return null;

  return (
    <div>
      <div className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${colorClass}`}>
        <Icon className="w-3.5 h-3.5" />
        {title} ({items.length})
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={`${title}-${i}`}
            className="px-2 py-0.5 bg-slate-900/80 border border-slate-700/80 text-slate-300 rounded-md text-[10px] font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const JDAnalysisPanel = ({ jdAnalysis }) => {
  if (!jdAnalysis) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800">
      <h4 className="font-bold text-sm text-slate-200 mb-1 flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-violet-400" />
        Job Description Analysis
      </h4>
      {(jdAnalysis.roleTitle || jdAnalysis.seniority) && (
        <p className="text-[11px] text-slate-400 mb-4">
          {jdAnalysis.roleTitle}
          {jdAnalysis.seniority ? ` · ${jdAnalysis.seniority}` : ''}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <KeywordGroup
          title="Technical Skills"
          icon={Brain}
          items={jdAnalysis.technicalSkills}
          colorClass="text-cyan-400"
        />
        <KeywordGroup
          title="Soft Skills"
          icon={Briefcase}
          items={jdAnalysis.softSkills}
          colorClass="text-pink-400"
        />
        <KeywordGroup
          title="Tools"
          icon={Wrench}
          items={jdAnalysis.tools}
          colorClass="text-amber-400"
        />
        <KeywordGroup
          title="Frameworks"
          icon={Layers}
          items={jdAnalysis.frameworks}
          colorClass="text-indigo-400"
        />
        <KeywordGroup
          title="Methodologies"
          icon={GitBranch}
          items={jdAnalysis.methodologies}
          colorClass="text-emerald-400"
        />
      </div>
    </div>
  );
};

export default JDAnalysisPanel;
