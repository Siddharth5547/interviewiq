export interface User {
  id: string;
  email: string;
  fullName: string;
  targetRole?: string;
}

export interface ParsedResume {
  name: string;
  contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    location?: string;
  };
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear?: string;
    endYear?: string;
    gpa?: string;
  }>;
  skills: {
    programmingLanguages: string[];
    frameworks: string[];
    libraries: string[];
    databases: string[];
    tools: string[];
    all: string[];
  };
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    highlights: string[];
    link?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
    highlights: string[];
  }>;
  certifications: string[];
  achievements: string[];
}

export interface Resume {
  _id: string;
  id?: string;
  userId: string;
  filename: string;
  fileType: string;
  rawText: string;
  parsedData: ParsedResume;
  intelligenceTags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JobDescription {
  _id: string;
  id?: string;
  userId: string;
  title: string;
  company: string;
  rawText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  experienceRequirements: string;
  techKeywords: string[];
  softSkills: string[];
  createdAt: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'critical';
  details: string;
}

export interface ATSAnalysis {
  _id: string;
  id?: string;
  userId: string;
  resumeId: string;
  jobDescriptionId: string;
  overallScore: number;
  label: string;
  categoryScores: CategoryScore[];
  matchingKeywords: string[];
  missingKeywords: string[];
  matchingSkills: string[];
  missingSkills: string[];
  partiallyMatchedSkills: Array<{ skill: string; relatedFound: string }>;
  relevantExperience: string[];
  missingSections: string[];
  formattingIssues: string[];
  actionableSuggestions: Array<{
    category: string;
    issue: string;
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  disclaimer: string;
  createdAt: string;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  category: 'action_verbs' | 'quantification' | 'keyword_alignment' | 'conciseness';
  explanation: string;
  actionVerbUsed: string;
  groundedVerification: string;
}

export interface ATSBeforeAfterComparison {
  beforeScore: number;
  afterScore: number;
  delta: number;
  changes: Array<{
    category: string;
    points: string;
    rationale: string;
  }>;
  explanation: string;
}

export interface ResumeImprovementResult {
  improvedSummary: string;
  bulletImprovements: BulletImprovement[];
  suggestedAdditionsWithoutFabrication: string[];
  comparison: ATSBeforeAfterComparison;
  enhancedResumeData: ParsedResume;
}

export interface QuestionItem {
  id: string;
  question: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reason: string;
  expectedConcepts: string[];
  followUpType: 'deeper' | 'clarification' | 'new_topic';
  isProjectDeepDive?: boolean;
  relatedProject?: string;
}

export interface AnswerEvaluation {
  classification:
    | 'Correct'
    | 'Mostly correct'
    | 'Partially correct'
    | 'Incorrect'
    | 'Too vague'
    | 'Off-topic'
    | "Doesn't know";
  score: number;
  feedback: string;
  whatWasGood: string;
  whatWasMissing: string;
  suggestedImprovement: string;
  strongerExample: string;
  testedConceptsCovered: string[];
  testedConceptsMissed: string[];
  difficultyAdjustment: 'increase' | 'maintain' | 'decrease' | 'advanced';
}

export interface ConversationMessage {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  spokenText?: string;
  timestamp: string;
  questionId?: string;
  evaluation?: AnswerEvaluation;
}

export type RealityCheckAssessment =
  | 'strongly demonstrated'
  | 'partially demonstrated'
  | 'needs practice'
  | 'not demonstrated in this interview'
  | 'demonstrated'
  | 'partial'
  | 'gap';

export interface RealityCheckItem {
  resumeClaim: string;
  interviewObservation: string;
  assessment: RealityCheckAssessment;
  recommendation: string;
}

export interface FinalReport {
  overallScore: number;
  categories: {
    technicalKnowledge: number;
    projectUnderstanding: number;
    problemSolving: number;
    communication: number;
    conceptClarity: number;
    resumeKnowledge: number;
    answerRelevance: number;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  weakTopics: string[];
  realityCheck: RealityCheckItem[];
  disclaimer: string;
}

export interface Interview {
  _id: string;
  id?: string;
  userId: string;
  resumeId: string;
  jobDescriptionId?: string;
  targetRole?: string;
  type: string;
  difficulty: string;
  durationMinutes: number;
  mode: 'Text' | 'Voice';
  personalityMode?: 'Professional' | 'Friendly' | 'Technical' | 'Strict' | 'HR';
  status: 'in_progress' | 'completed' | 'abandoned';
  state: string;
  questionList: QuestionItem[];
  currentQuestionIndex: number;
  conversation: ConversationMessage[];
  antiRepetition: {
    askedQuestions: string[];
    coveredTopics: string[];
    testedConcepts: string[];
  };
  finalReport?: FinalReport;
  startedAt: string;
  completedAt?: string;
}

export interface WeakAreaItem {
  topic: string;
  frequency: number;
  lowestScore: number;
}

export interface PracticeSession {
  _id: string;
  id?: string;
  userId: string;
  topic: string;
  targetSkill: string;
  questions: Array<{
    id: string;
    question: string;
    difficulty: string;
    expectedConcepts: string[];
  }>;
  answers: Array<{
    questionId: string;
    question: string;
    candidateAnswer: string;
    score: number;
    feedback: string;
    whatWasGood: string;
    whatWasMissing: string;
    strongerExample: string;
  }>;
  overallScore: number;
  improvementNotes: string[];
  status: 'active' | 'completed';
}

export interface DashboardData {
  hasData?: boolean;
  resume: {
    exists: boolean;
    filename: string;
    lastAnalyzed: string | null;
    skillsCount: number;
    intelligenceDomains: string[];
  };
  ats: {
    score: number;
    label: string;
    matchingKeywordsCount: number;
    missingKeywordsCount: number;
  } | null;
  targetJob: {
    title: string;
    company: string;
    matchPercentage: number | null;
    missingSkills: string[];
  } | null;
  interview: {
    totalCompleted: number;
    latestScore: number | null;
    averageScore: number | null;
    weakestTopic: string | null;
    strongestTopic: string | null;
  };
  progressTrend: Array<{
    session: string;
    date: string;
    score: number;
    ats: number;
    technical: number;
    communication: number;
  }>;
}

export interface OpportunityMatchResult {
  score: number;
  label: string;
  matchingSkills: string[];
  missingSkills: string[];
  relevantProjects: string[];
  recommendation: {
    matchingHighlights: string[];
    improvementSuggestions: string[];
  };
  disclaimer: string;
}

export interface Opportunity {
  _id?: string;
  id?: string;
  externalId: string;
  source: string;
  company: string;
  title: string;
  description: string;
  location: string;
  employmentType: 'Full-time' | 'Internship' | 'Contract' | 'Part-time';
  remoteType: 'Remote' | 'Hybrid' | 'On-site';
  salary?: string;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  deadline?: string;
  applicationUrl: string;
  discoveredAt: string;
  match?: OpportunityMatchResult | null;
}

export type ApplicationStatus =
  | 'Saved'
  | 'Interested'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface Application {
  _id?: string;
  id?: string;
  userId: string;
  opportunityId?: string;
  company: string;
  role: string;
  employmentType: 'Full-time' | 'Internship' | 'Contract' | 'Part-time';
  appliedAt: string;
  status: ApplicationStatus;
  resumeVersionId?: string;
  applicationUrl: string;
  source: string;
  notes: string;
  nextAction?: string;
  interviewDate?: string;
  salary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationAnalytics {
  totalApplications: number;
  uniqueCompanies: number;
  internshipCount: number;
  fulltimeCount: number;
  interviewsReached: number;
  offersCount: number;
  funnel: {
    saved: number;
    applied: number;
    assessment: number;
    interview: number;
    offer: number;
  };
}

export interface CandidatePreferences {
  preferredRole: string;
  preferredLocation: string;
  remotePreference: 'Remote' | 'Hybrid' | 'On-site' | 'Any';
  employmentType: 'Full-time' | 'Internship' | 'Any';
  preferredIndustries: string[];
  minimumSalary: string;
}

