import React from 'react';
import { useResume } from '../context/ResumeContext';
import { Briefcase, Plus, Trash2, Calendar, MapPin, AlignLeft } from 'lucide-react';

const ExperienceForm = () => {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();
  const { experience } = resumeData;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/30">
      <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">Work Experience</h3>
            <p className="text-xs text-slate-400">Manage professional employment details & ATS bullet points</p>
          </div>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-700 rounded-xl bg-slate-800/10 text-center">
          <Briefcase className="w-8 h-8 text-slate-500 mb-2 opacity-50" />
          <p className="text-sm text-slate-400 font-medium">No experience added yet</p>
          <p className="text-xs text-slate-500 mt-0.5">Click the "Add" button above to insert professional history.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {experience.map((exp, idx) => (
            <div 
              key={idx} 
              className="relative p-5 rounded-xl border border-slate-700/60 bg-slate-900/20 transition-all duration-200 hover:bg-slate-900/40 hover:border-slate-600/50"
            >
              {/* Index & Delete */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                  Experience #{idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeExperience(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-150"
                  title="Remove this experience entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Company / Organization <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    placeholder="e.g. Vertex Scale Tech"
                    className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Job Position */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Position / Job Title <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(idx, 'position', e.target.value)}
                    placeholder="e.g. Lead Full Stack Developer"
                    className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Job Location */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Location (City, State / Remote)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                      placeholder="e.g. San Francisco, CA or Remote"
                      className="glass-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Start Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                      placeholder="e.g. Aug 2021 or 2021-08"
                      className="glass-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* End Date / Present */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    End Date 
                    <span className="flex items-center gap-1 text-slate-400 font-normal">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(idx, 'current', e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0 focus:ring-offset-0"
                      />
                      Currently Working Here
                    </span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                      disabled={exp.current}
                      placeholder={exp.current ? 'Present' : 'e.g. Jun 2023 or 2023-06'}
                      className={`glass-input w-full pl-9 pr-4 py-2 rounded-xl text-sm ${exp.current ? 'opacity-40 select-none pointer-events-none' : ''}`}
                    />
                  </div>
                </div>

                {/* Job Description (ATS bullet list helper) */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Roles, Achievements & Responsibilities
                    </span>
                    <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-normal">
                      Pro Tip: Enter one achievement per line
                    </span>
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                    placeholder="Spearheaded migration of application backend to Express clusters, optimizing performance by 35%.&#10;Mentored a team of 4 junior developers.&#10;Integrated third-party APIs for secure checkout workflows."
                    rows={4}
                    className="glass-input w-full p-4 rounded-xl text-sm leading-relaxed resize-y font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
