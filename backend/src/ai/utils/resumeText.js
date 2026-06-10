/**
 * Flattens resume data (backend or frontend shape) into searchable plain text.
 */
export const flattenResumeToText = (resumeData = {}) => {
  const parts = [];

  const append = (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === "string") parts.push(item);
        else if (typeof item === "object") parts.push(JSON.stringify(item));
      });
      return;
    }
    if (typeof value === "object") {
      parts.push(JSON.stringify(value));
      return;
    }
    parts.push(String(value));
  };

  append(resumeData.summary);
  append(resumeData.jobTitle);
  append(resumeData.firstName);
  append(resumeData.lastName);
  append(resumeData.skills);

  if (resumeData.personalInfo) {
    append(resumeData.personalInfo.summary);
    append(resumeData.personalInfo.title);
    append(resumeData.personalInfo.fullName);
  }

  (resumeData.experience || []).forEach((exp) => {
    append(exp.title || exp.position);
    append(exp.companyName || exp.company);
    append(exp.workSummary || exp.description);
  });

  (resumeData.education || []).forEach((edu) => {
    append(edu.universityName || edu.school);
    append(edu.degree);
    append(edu.major || edu.fieldOfStudy);
    append(edu.description);
  });

  (resumeData.projects || []).forEach((project) => {
    append(project.title || project.name);
    append(project.description);
    append(project.technologies);
  });

  return parts.join(" ").toLowerCase();
};
