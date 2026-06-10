import React from 'react';
import { useResume } from '../context/ResumeContext';
import { GraduationCap, Plus, Trash2, Calendar, BookOpen, AlertCircle } from 'lucide-react';

const EducationForm = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();
  const { education } = resumeData;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/30">
      <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">Education</h3>
            <p className="text-xs text-slate-400">Add degrees, certifications, and academic background</p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {education.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-700 rounded-xl bg-slate-800/10 text-center">
          <GraduationCap className="w-8 h-8 text-slate-500 mb-2 opacity-50" />
          <p className="text-sm text-slate-400 font-medium">No education added yet</p>
          <p className="text-xs text-slate-500 mt-0.5">Click the "Add" button above to insert academic history.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {education.map((edu, idx) => (
            <div 
              key={idx} 
              className="relative p-5 rounded-xl border border-slate-700/60 bg-slate-900/20 transition-all duration-200 hover:bg-slate-900/40 hover:border-slate-600/50"
            >
              {/* Index indicator & delete button */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                  Degree #{idx + 1}
                </span>
                
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-150"
                  title="Remove this education entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* School */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">School / University <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                    placeholder="e.g. University of California, Berkeley"
                    className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Degree */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Degree Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Field of Study */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Field of Study</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(idx, 'fieldOfStudy', e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                  />
                </div>

                {/* Start Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                      placeholder="e.g. Sep 2018 or 2018-09"
                      className="glass-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* End Date / Current */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    End Date 
                    <span className="flex items-center gap-1 text-slate-400 font-normal">
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => updateEducation(idx, 'current', e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0 focus:ring-offset-0"
                      />
                      Present
                    </span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                      disabled={edu.current}
                      placeholder={edu.current ? 'Current' : 'e.g. Jun 2022 or 2022-06'}
                      className={`glass-input w-full pl-9 pr-4 py-2 rounded-xl text-sm ${edu.current ? 'opacity-40 select-none pointer-events-none' : ''}`}
                    />
                  </div>
                </div>

                {/* Academic Description */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Description / Key Details
                  </label>
                  <textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(idx, 'description', e.target.value)}
                    placeholder="e.g. Major GPA: 3.9/4.0. Completed senior design project. Relevant coursework..."
                    rows={3}
                    className="glass-input w-full p-4 rounded-xl text-sm resize-y"
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

export default EducationForm;
