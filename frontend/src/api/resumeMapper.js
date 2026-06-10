const splitFullName = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
};

export const mapResumeToBackend = (resumeData, resumeId = null) => {
  const { personalInfo, education, experience, projects, skills } = resumeData;
  const { firstName, lastName } = splitFullName(personalInfo?.fullName || '');

  return {
    ...(resumeId ? {} : {}),
    title: personalInfo?.title || personalInfo?.fullName || 'My Resume',
    themeColor: '#9333ea',
    templateName: 'ModernTemplate',
    firstName,
    lastName,
    jobTitle: personalInfo?.title || '',
    email: personalInfo?.email || '',
    phone: personalInfo?.phone || '',
    address: personalInfo?.location || '',
    summary: personalInfo?.summary || '',
    jobDescription: '',
    experience: (experience || []).map((exp) => ({
      title: exp.position || '',
      companyName: exp.company || '',
      city: exp.location || '',
      state: '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      currentlyWorking: Boolean(exp.current),
      workSummary: exp.description || '',
    })),
    education: (education || []).map((edu) => ({
      universityName: edu.school || '',
      degree: edu.degree || '',
      major: edu.fieldOfStudy || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      description: edu.description || '',
    })),
    projects: (projects || []).map((project) => ({
      title: project.name || '',
      description: project.description || '',
      link: project.liveLink || project.githubLink || '',
    })),
    skills: (skills || []).map((skill) =>
      typeof skill === 'string'
        ? { name: skill, rating: 0 }
        : { name: skill.name || '', rating: skill.rating || 0 }
    ),
  };
};

export const mapResumeFromBackend = (doc) => {
  if (!doc) return { resumeData: null, resumeId: null };

  const fullName = [doc.firstName, doc.lastName].filter(Boolean).join(' ').trim();

  const resumeData = {
    personalInfo: {
      fullName,
      title: doc.jobTitle || '',
      email: doc.email || '',
      phone: doc.phone || '',
      website: '',
      linkedin: '',
      github: '',
      location: doc.address || '',
      summary: doc.summary || '',
    },
    education: (doc.education || []).map((edu) => ({
      school: edu.universityName || '',
      degree: edu.degree || '',
      fieldOfStudy: edu.major || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      current: false,
      description: edu.description || '',
    })),
    experience: (doc.experience || []).map((exp) => ({
      company: exp.companyName || '',
      position: exp.title || '',
      location: exp.city || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: Boolean(exp.currentlyWorking),
      description: exp.workSummary || '',
    })),
    projects: (doc.projects || []).map((project) => ({
      name: project.title || '',
      description: project.description || '',
      technologies: [],
      githubLink: '',
      liveLink: project.link || '',
    })),
    skills: (doc.skills || []).map((skill) =>
      typeof skill === 'string' ? skill : skill.name || ''
    ),
  };

  return { resumeData, resumeId: doc._id };
};
