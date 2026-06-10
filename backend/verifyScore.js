const { calculateATSScore } = require('./src/ai/atsScorer');

const mockResume = {
  skills: ['React', 'Node.js', 'MongoDB', 'Express'],
  experience: [
    { description: 'Worked on React and Node.js backend. Collaborated with teams using Agile.' }
  ],
  projects: [
    { technologies: ['React', 'Express', 'MongoDB'] }
  ]
};

const mockJdAnalysis = {
  technicalSkills: ['React.js', 'Node.js', 'MongoDB', 'REST APIs'],
  softSkills: ['Leadership', 'Team Collaboration'],
  tools: ['Git', 'Docker'],
  frameworks: ['Express'],
  methodologies: ['Agile']
};

const result = calculateATSScore(mockResume, mockJdAnalysis);
console.log('--- ATS Scorer Verification ---');
console.log('Matched Keywords:', result.matchedKeywords);
console.log('Missing Keywords:', result.missingKeywords);
console.log('ATS Score:', result.score + '%');

if (result.score === 50 && result.matchedKeywords.includes('React.js') && result.matchedKeywords.includes('Agile')) {
  console.log('\nATS Scorer Verification: SUCCESSFUL! ✅');
  process.exit(0);
} else {
  console.error('\nATS Scorer Verification: FAILED! ❌');
  process.exit(1);
}
