import React from 'react';
import { useResume } from '../context/ResumeContext';
import { FolderGit2, Plus, Trash2, Link, Code2, AlignLeft } from 'lucide-react';

const ProjectsForm = () => {
  const { resumeData, addProject, updateProject, removeProject } = useResume();
  const { projects } = resumeData;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/30">
      <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">Projects</h3>
            <p className="text-xs text-slate-400">Highlight key applications, packages, and web repositories</p>
          </div>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-700 rounded-xl bg-slate-800/10 text-center">
          <FolderGit2 className="w-8 h-8 text-slate-500 mb-2 opacity-50" />
          <p className="text-sm text-slate-400 font-medium">No projects added yet</p>
          <p className="text-xs text-slate-500 mt-0.5">Click the "Add" button above to insert building milestones.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {projects.map((proj, idx) => (
            <div 
              key={idx} 
              className="relative p-5 rounded-xl border border-slate-700/60 bg-slate-900/20 transition-all duration-200 hover:bg-slate-900/40 hover:border-slate-600/50"
            >
              {/* Index & Delete */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                  Project #{idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-150"
                  title="Remove this project entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project Name */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Project Title <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => updateProject(idx, 'name', e.target.value)}
                    placeholder="e.g. Apex Analytics Engine"
                    className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Technologies */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-slate-400" /> Technologies / Core Stack
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                    placeholder="e.g. React.js, Node.js, Express, MongoDB Atlas, Tailwind (comma separated)"
                    className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                  />
                </div>

                {/* GitHub link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg> GitHub Link (Repository)
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <input
                      type="text"
                      value={proj.githubLink}
                      onChange={(e) => updateProject(idx, 'githubLink', e.target.value)}
                      placeholder="e.g. github.com/username/project"
                      className="glass-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Live Link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Link className="w-3 h-3" /> Live Production URL
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={proj.liveLink}
                      onChange={(e) => updateProject(idx, 'liveLink', e.target.value)}
                      placeholder="e.g. project-telemetry.io"
                      className="glass-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Brief Description
                  </label>
                  <textarea
                    value={proj.description}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    placeholder="Describe what the application does, key challenges solved, or performance benchmarks achieved..."
                    rows={3}
                    className="glass-input w-full p-4 rounded-xl text-sm resize-y leading-relaxed"
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

export default ProjectsForm;
