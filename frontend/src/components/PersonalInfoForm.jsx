import React from 'react';
import { useResume } from '../context/ResumeContext';
import { User, Mail, Phone, Globe, MapPin, AlignLeft } from 'lucide-react';

const PersonalInfoForm = () => {
  const { resumeData, updatePersonalInfo } = useResume();
  const { fullName, title, email, phone, website, linkedin, github, location, summary } = resumeData.personalInfo;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updatePersonalInfo(name, value);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/30">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-100">Personal Information</h3>
          <p className="text-xs text-slate-400">Your core contact and identification details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={handleChange}
              placeholder="e.g. Divye Kartike"
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              required
            />
          </div>
        </div>

        {/* Professional Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Professional Title</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 opacity-50" />
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="e.g. Full Stack "
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="e.g. kartikedivye@example.com"
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={handleChange}
              placeholder="e.g. +91 (555) 019-2834"
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-300">Location (City, State / Country)</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="location"
              value={location}
              onChange={handleChange}
              placeholder="e.g. Noida, India"
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Personal Website */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Portfolio Website</label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="url"
              name="website"
              value={website}
              onChange={handleChange}
              placeholder="e.g. https://kartikedivye.dev"
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* LinkedIn Profile */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">LinkedIn URL</label>
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            <input
              type="text"
              name="linkedin"
              value={linkedin}
              onChange={handleChange}
              placeholder="e.g. linkedin.com/in/divye"
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* GitHub Profile */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-300">GitHub Profile</label>
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <input
              type="text"
              name="github"
              value={github}
              onChange={handleChange}
              placeholder="e.g. github.com/divyekartike-dev"
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Professional Summary
          </label>
          <textarea
            name="summary"
            value={summary}
            onChange={handleChange}
            placeholder="Write a concise overview of your background, technical skills, and key achievements..."
            rows={4}
            className="glass-input w-full p-4 rounded-xl text-sm leading-relaxed resize-y"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
