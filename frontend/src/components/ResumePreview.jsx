import React from 'react';
import { useResume } from '../context/ResumeContext';
import { Mail, Phone, Globe, MapPin, ExternalLink } from 'lucide-react';

const ResumePreview = () => {
  const { resumeData, template } = useResume();
  const { personalInfo, education, experience, projects, skills } = resumeData;
  const { fullName, title, email, phone, website, linkedin, github, location, summary } = personalInfo;

  // Formatting description lines into standard bullet points
  const formatBullets = (descriptionText) => {
    if (!descriptionText) return [];
    return descriptionText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  // Safe checks for arrays
  const hasEducation = education && education.length > 0;
  const hasExperience = experience && experience.length > 0;
  const hasProjects = projects && projects.length > 0;
  const hasSkills = skills && skills.length > 0;

  // Template custom typography & layout configurations
  const getTemplateStyles = () => {
    switch (template) {
      case 'minimal':
        return {
          container: 'font-sans max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm',
          headerSection: 'text-center border-b border-slate-200 pb-5 mb-5',
          headerName: 'text-3xl font-light uppercase tracking-widest text-slate-900 font-sans',
          headerTitle: 'text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1',
          contactRow: 'flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-3 font-sans',
          sectionHeading: 'text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3.5',
          companyTitle: 'font-semibold text-slate-900',
          dates: 'text-slate-500 text-xs italic font-medium',
          tag: 'px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded'
        };
      case 'classic':
        return {
          container: 'font-serif max-w-[800px] mx-auto text-stone-900 leading-normal text-sm',
          headerSection: 'border-b-2 border-stone-800 pb-4 mb-5',
          headerName: 'text-3xl font-bold text-stone-900 font-serif',
          headerTitle: 'text-sm font-semibold italic text-stone-700 mt-1',
          contactRow: 'flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-700 mt-2 font-serif',
          sectionHeading: 'text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-800 pb-0.5 mb-3',
          companyTitle: 'font-bold text-stone-950',
          dates: 'text-stone-700 text-xs font-semibold',
          tag: 'text-stone-800 font-mono text-[11px]'
        };
      case 'modern':
      default:
        return {
          container: 'font-sans max-w-[800px] mx-auto text-slate-700 leading-relaxed text-sm',
          headerSection: 'border-l-4 border-indigo-600 pl-4 py-1 mb-6',
          headerName: 'text-3xl font-black tracking-tight text-slate-900 font-sans',
          headerTitle: 'text-sm font-bold uppercase tracking-wide text-indigo-600 mt-0.5',
          contactRow: 'flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 mt-2.5 font-sans',
          sectionHeading: 'text-xs font-extrabold uppercase tracking-widest text-slate-950 flex items-center gap-2 border-b border-slate-200 pb-1.5 mb-4',
          companyTitle: 'font-bold text-slate-900',
          dates: 'text-slate-500 text-xs font-semibold bg-slate-100/80 px-2 py-0.5 rounded',
          tag: 'px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-md'
        };
    }
  };

  const style = getTemplateStyles();

  return (
    <div id="resume-preview" className="resume-paper shadow-2xl mx-auto rounded-md overflow-hidden relative">
      {/* Accent color top bar for modern template */}
      {template === 'modern' && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
      )}

      {/* Header Info */}
      <div className={style.headerSection}>
        <h1 className={style.headerName}>
          {fullName || 'Your Name'}
        </h1>
        {title && (
          <p className={style.headerTitle}>
            {title}
          </p>
        )}

        {/* Contact Strip */}
        <div className={style.contactRow}>
          {email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 select-none print:hidden" />
              {email}
            </span>
          )}
          {phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 select-none print:hidden" />
              {phone}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 select-none print:hidden" />
              {location}
            </span>
          )}
          {website && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400 select-none print:hidden" />
              {website}
            </span>
          )}
          {linkedin && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 select-none print:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              {linkedin}
            </span>
          )}
          {github && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 select-none print:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              {github}
            </span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className={style.sectionHeading}>
            {template === 'modern' && <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />}
            Professional Summary
          </h2>
          <p className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-line">
            {summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {hasExperience && (
        <div className="mb-6">
          <h2 className={style.sectionHeading}>
            {template === 'modern' && <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />}
            Professional Experience
          </h2>
          <div className="flex flex-col gap-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="group">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <span className={style.companyTitle}>{exp.company || 'Company'}</span>
                    {exp.position && (
                      <span className="text-slate-700 font-medium">
                        {' '}— {exp.position}
                      </span>
                    )}
                    {exp.location && (
                      <span className="text-slate-400 text-xs ml-2">
                        ({exp.location})
                      </span>
                    )}
                  </div>
                  {(exp.startDate || exp.endDate || exp.current) && (
                    <span className={style.dates}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  )}
                </div>

                {exp.description && (
                  <ul className="list-disc pl-5 text-[12.5px] leading-relaxed text-slate-600 flex flex-col gap-1 mt-1.5">
                    {formatBullets(exp.description).map((bullet, bIdx) => (
                      <li key={bIdx} className="pl-0.5">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {hasProjects && (
        <div className="mb-6">
          <h2 className={style.sectionHeading}>
            {template === 'modern' && <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />}
            Projects
          </h2>
          <div className="flex flex-col gap-4">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{proj.name || 'Project'}</span>
                    <div className="flex gap-1.5 text-[10px] text-slate-400 font-sans print:hidden">
                      {proj.githubLink && <span className="underline">{proj.githubLink}</span>}
                      {proj.liveLink && <span className="underline">{proj.liveLink}</span>}
                    </div>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.slice(0, 4).map((tech, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {proj.description && (
                  <p className="text-[12.5px] text-slate-600 leading-relaxed mt-1">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {hasEducation && (
        <div className="mb-6">
          <h2 className={style.sectionHeading}>
            {template === 'modern' && <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />}
            Education
          </h2>
          <div className="flex flex-col gap-4">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex items-start justify-between gap-4 mb-0.5">
                  <div>
                    <span className="font-bold text-slate-900">{edu.school || 'School'}</span>
                    {edu.degree && (
                      <span className="text-slate-700 font-medium">
                        {' '}— {edu.degree}
                      </span>
                    )}
                    {edu.fieldOfStudy && (
                      <span className="text-slate-500 font-medium text-xs ml-1.5">
                        in {edu.fieldOfStudy}
                      </span>
                    )}
                  </div>
                  {(edu.startDate || edu.endDate || edu.current) && (
                    <span className={style.dates}>
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </span>
                  )}
                </div>

                {edu.description && (
                  <p className="text-[12.5px] text-slate-600 leading-relaxed mt-1">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {hasSkills && (
        <div>
          <h2 className={style.sectionHeading}>
            {template === 'modern' && <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />}
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {skills.map((skill, idx) => (
              <span key={idx} className={style.tag}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
