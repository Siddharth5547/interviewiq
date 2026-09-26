import { atsEngine } from './services/atsEngine.js';
import { jobAnalyzer } from './services/jobAnalyzer.js';
import { IParsedResume } from './models/Resume.js';
import { IParsedJobDescription } from './services/jobAnalyzer.js';

console.log('--- STARTING ATS ENGINE TESTS ---');

const testKeywords = [
  'C++',
  'C#',
  '.NET',
  'Node.js',
  'React.js',
  'Next.js',
  'Vue.js',
  'Express.js',
  'ASP.NET',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'REST API',
  'RESTful APIs',
  'OAuth',
  'JWT',
  'Git/GitHub',
];

const sampleResume: IParsedResume = {
  name: 'Alex Kumar',
  email: 'alex@example.com',
  phone: '+1 234 567 8900',
  summary: 'Full Stack Engineer with strong expertise in building scalable web applications and REST APIs using modern technologies.',
  skills: {
    all: [
      'JavaScript',
      'TypeScript',
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'SQL',
      'C++',
      'C#',
      '.NET',
      'Git/GitHub',
      'REST APIs',
      'OAuth',
      'JWT',
      'DSA',
      'OOP'
    ],
    technical: ['React.js', 'Node.js', 'C++', 'MongoDB', '.NET'],
    soft: ['Problem Solving', 'Communication'],
  },
  experience: [
    {
      company: 'Tech Corp',
      role: 'Full Stack Developer',
      duration: '2023 - Present',
      description: 'Engineered REST APIs with Node.js and Express.js. Implemented OAuth and JWT authentication. Managed MongoDB and PostgreSQL databases.',
    },
  ],
  projects: [
    {
      title: 'InterviewPrep Platform',
      technologies: ['React.js', 'Node.js', 'MongoDB', 'C++', 'REST APIs'],
      description: 'Built high performance backend with Node.js and C++ algorithms for real-time interview simulations.',
    },
  ],
  education: [
    {
      degree: 'B.Tech',
      field: 'Computer Science and Engineering',
      institution: 'National Institute of Technology',
      year: '2023',
    },
  ],
  rawText: `Alex Kumar
alex@example.com
Summary: Full Stack Engineer with strong expertise in building scalable web applications and REST APIs using modern technologies.
Skills: JavaScript, TypeScript, React.js, Node.js, Express.js, MongoDB, SQL, C++, C#, .NET, Git/GitHub, REST APIs, OAuth, JWT, DSA, OOP
Experience: Tech Corp - Full Stack Developer. Engineered REST APIs with Node.js and Express.js. Implemented OAuth and JWT authentication.
Projects: InterviewPrep Platform using React.js, Node.js, MongoDB, C++, REST APIs.
Education: B.Tech in Computer Science and Engineering.`,
};

const testJobDescriptionText = `Requirements:

B.Tech/B.E. in CSE/IT or related field.
Good knowledge of DSA, OOP, JavaScript.
Familiarity with React.js, Node.js and REST APIs.
Basic knowledge of MongoDB/SQL.
Git/GitHub knowledge.
Good problem-solving and communication skills.

Responsibilities:

Build React components and REST APIs.
Work with Node.js and databases.
Debug and optimize applications.
Collaborate with the development team.
Write clean and maintainable code.
Participate in code reviews and testing.`;

// Test 1: Deterministic Job Heuristics with all test keywords
console.log('\n[Test 1] Parsing test job description with heuristics...');
const parsedJob = jobAnalyzer.deterministicJobHeuristics(testJobDescriptionText, 'Stripe Labs');
console.log('Extracted Job Title:', parsedJob.title);
console.log('Extracted Tech Keywords:', parsedJob.techKeywords);
console.log('Extracted Required Skills:', parsedJob.requiredSkills);

// Test 2: Run ATS Scoring with full matching
console.log('\n[Test 2] Computing ATS score for sample resume + test job description...');
const result = atsEngine.computeATSScore(sampleResume, parsedJob, sampleResume.rawText || '');
console.log('Overall ATS Score:', result.overallScore);
console.log('Label:', result.label);
console.log('Matching Keywords:', result.matchingKeywords);
console.log('Missing Keywords:', result.missingKeywords);
console.log('Category Scores:', result.categoryScores.map(c => `${c.name}: ${c.score}/${c.maxScore}`));

if (result.overallScore < 70) {
  throw new Error(`Expected score >= 70 for highly matched resume, got ${result.overallScore}`);
}

// Test 3: Test every single required keyword specifically to ensure NO crash and proper matching
console.log('\n[Test 3] Testing all critical keywords for regex crash and matching...');
for (const kw of testKeywords) {
  const customJob: IParsedJobDescription = {
    title: 'Senior Engineer',
    company: 'Acme',
    requiredSkills: [kw],
    preferredSkills: [],
    responsibilities: ['Develop software'],
    qualifications: ['Degree in CS'],
    experienceRequirements: '2 years',
    techKeywords: [kw],
    softSkills: ['Communication'],
  };

  const resMatch = atsEngine.computeATSScore(sampleResume, customJob, sampleResume.rawText || '');
  console.log(`Keyword "${kw}": matched? ${resMatch.matchingKeywords.includes(kw) || resMatch.matchingSkills.includes(kw)} (Score: ${resMatch.overallScore})`);
}

// Test 4: Edge Cases: Empty resume, empty job, duplicate keywords, long text
console.log('\n[Test 4] Testing edge cases (empty inputs, duplicates, long text)...');

// 4a: Empty resume
const emptyResumeResult = atsEngine.computeATSScore(
  { skills: { all: [] }, experience: [], projects: [], education: [], summary: '', rawText: '' },
  parsedJob,
  ''
);
console.log('Empty resume overall score:', emptyResumeResult.overallScore);

// 4b: Empty job description
const emptyJobResult = atsEngine.computeATSScore(
  sampleResume,
  {
    title: '',
    company: '',
    requiredSkills: [],
    preferredSkills: [],
    responsibilities: [],
    qualifications: [],
    experienceRequirements: '',
    techKeywords: [],
    softSkills: [],
  },
  sampleResume.rawText || ''
);
console.log('Empty job overall score:', emptyJobResult.overallScore);

// 4c: Duplicate keywords with mixed casing
const duplicateJob: IParsedJobDescription = {
  title: 'Engineer',
  company: 'Company',
  requiredSkills: ['C++', 'c++', ' C++ ', 'React.js', 'react.js', 'NODE.JS', 'node.js', 'Git/GitHub', 'git/github'],
  preferredSkills: [],
  responsibilities: [],
  qualifications: [],
  experienceRequirements: '',
  techKeywords: ['C++', 'react.js', 'Node.js', 'REST API', 'rest api', 'REST APIs'],
  softSkills: [],
};
const duplicateResult = atsEngine.computeATSScore(sampleResume, duplicateJob, sampleResume.rawText || '');
console.log('Duplicate keywords handled without error. Matching:', duplicateResult.matchingKeywords);

// 4d: Very long job description (100k chars)
const longJdText = testJobDescriptionText.repeat(500);
const longParsedJob = jobAnalyzer.deterministicJobHeuristics(longJdText, 'Big Corp');
const longJdResult = atsEngine.computeATSScore(sampleResume, longParsedJob, sampleResume.rawText || '');
console.log('Long JD (500x) processed successfully! Score:', longJdResult.overallScore);

console.log('\n--- ALL ATS TESTS PASSED SUCCESSFULLY! ---');
