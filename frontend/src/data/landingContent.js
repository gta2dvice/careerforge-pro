export const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
];

export const hero = {
  eyebrow: 'ATS resume tooling',
  headline: 'Build ATS-Optimized Resumes That Match Real Job Descriptions',
  subheadline:
    'Analyze job descriptions, identify missing keywords, improve ATS scores, and generate professional resumes with AI.',
  primaryCta: 'Get Started',
  secondaryCta: 'View Demo',
};

export const productPreviews = [
  {
    title: 'Resume Builder',
    description:
      'Structured sections with live preview. Edit experience, projects, and skills in one place.',
    mockup: 'resume',
  },
  {
    title: 'ATS Score Analysis',
    description:
      'Match percentage, matched terms, and gaps—computed from your resume and the pasted JD.',
    mockup: 'ats',
  },
  {
    title: 'Job Description Matching',
    description:
      'Extract technical skills, tools, frameworks, and methodologies from any listing.',
    mockup: 'jd',
  },
];

export const features = [
  {
    title: 'Resume Builder',
    description:
      'Contact, experience, projects, education, and skills in a consistent schema with live preview.',
    icon: 'file',
  },
  {
    title: 'ATS Score Analysis',
    description:
      'Compare your resume against a job description and get a clear match percentage with keyword breakdown.',
    icon: 'chart',
  },
  {
    title: 'AI Resume Rewriter',
    description:
      'Rewrite individual bullets with target keywords—action verbs and measurable outcomes.',
    icon: 'pen',
  },
  {
    title: 'Keyword Extraction',
    description:
      'Pull technical skills, soft skills, tools, frameworks, and methodologies from pasted job descriptions.',
    icon: 'tags',
  },
  {
    title: 'PDF Export',
    description:
      'Print-ready output from your preview. Same layout you reviewed before applying.',
    icon: 'download',
  },
];

export const howItWorksSteps = [
  {
    step: '01',
    title: 'Build Resume',
    description: 'Fill in experience, projects, education, and skills using the structured builder.',
  },
  {
    step: '02',
    title: 'Paste Job Description',
    description: 'Copy the JD from the role you are applying to—no manual keyword spreadsheets.',
  },
  {
    step: '03',
    title: 'Optimize with AI',
    description: 'Review ATS score, missing terms, and rewrite bullets to close the gap.',
  },
  {
    step: '04',
    title: 'Export PDF',
    description: 'Download or print a clean PDF aligned with what you reviewed in the app.',
  },
];

export const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Try the builder and run a few job-description analyses.',
    features: [
      'Resume builder with live preview',
      'Limited JD analyses per month',
      'ATS score and keyword breakdown',
      'PDF export',
    ],
    cta: 'Start free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹999',
    period: 'per month',
    description: 'For active searches when you need unlimited optimization.',
    features: [
      'Unlimited JD analysis',
      'AI bullet rewriting',
      'Full keyword extraction',
      'Optimization suggestions',
      'PDF export',
    ],
    cta: 'Get Pro',
    highlighted: true,
  },
];

export const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ],
  App: [
    { label: 'Resume builder', to: '/app' },
    { label: 'AI optimizer', to: '/app' },
  ],
};
