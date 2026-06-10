import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Cpu, Badge, Plus, X } from 'lucide-react';

const SkillsForm = () => {
  const { resumeData, updateSkills } = useResume();
  const { skills } = resumeData;
  const [inputValue, setInputValue] = useState('');

  // Sync state if initial seed data is loaded
  useEffect(() => {
    if (skills && skills.length > 0) {
      setInputValue(skills.join(', '));
    } else {
      setInputValue('');
    }
  }, [skills]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    updateSkills(val);
  };

  // Extra UX: add a quick pill tag helper
  const handleQuickAdd = (skillName) => {
    const trimmedInput = inputValue.trim();
    let currentSkills = trimmedInput 
      ? trimmedInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    
    if (!currentSkills.includes(skillName)) {
      currentSkills.push(skillName);
      const newVal = currentSkills.join(', ');
      setInputValue(newVal);
      updateSkills(newVal);
    }
  };

  const handleClear = () => {
    setInputValue('');
    updateSkills('');
  };

  const suggestions = [
    'React.js', 'Node.js', 'Express.js', 'MongoDB Atlas', 'Tailwind CSS', 
    'JavaScript', 'TypeScript', 'RESTful APIs', 'Context API', 'Redux', 
    'Next.js', 'Mongoose', 'Docker', 'AWS S3', 'Git'
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/30">
      <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">Technical Skills</h3>
            <p className="text-xs text-slate-400">Enter technical tags to pass keyword ATS parsers</p>
          </div>
        </div>

        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] uppercase font-bold tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md hover:bg-rose-500/20 transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Comma input field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Skills list (separated by commas)</label>
          <textarea
            value={inputValue}
            onChange={handleChange}
            placeholder="e.g. React.js, Node.js, Express.js, MongoDB Atlas, Tailwind CSS..."
            rows={3}
            className="glass-input w-full p-4 rounded-xl text-sm leading-relaxed resize-y font-mono"
          />
        </div>

        {/* Real-time Dynamic Tags preview */}
        {skills.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Parsed tags count: {skills.length}
            </span>
            <div className="flex flex-wrap gap-2 p-3.5 bg-slate-900/40 rounded-xl border border-slate-800">
              {skills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-semibold select-none transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic click suggestion tags */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Popular Recommendations (Click to Add):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((sug, idx) => {
              const alreadyHas = skills.includes(sug);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickAdd(sug)}
                  disabled={alreadyHas}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 ${
                    alreadyHas 
                      ? 'bg-slate-800/40 text-slate-500 cursor-not-allowed border border-transparent' 
                      : 'bg-slate-800 text-slate-300 hover:text-indigo-400 border border-slate-700/60 hover:border-indigo-500/30'
                  }`}
                >
                  <Plus className="w-2.5 h-2.5" />
                  {sug}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
