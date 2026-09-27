import axios from 'axios';
import {
  Resume,
  JobDescription,
  ATSAnalysis,
  ResumeImprovementResult,
  Interview,
  PracticeSession,
  WeakAreaItem,
  DashboardData,
  User,
  Opportunity,
  Application,
  ApplicationAnalytics,
  CandidatePreferences,
} from '../types/index.js';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('interviewiq_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  register: (data: { email: string; password: string; fullName: string; targetRole?: string }) =>
    apiClient.post<{ success: boolean; token: string; user: User }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post<{ success: boolean; token: string; user: User }>('/auth/login', data),
  getMe: () => apiClient.get<{ success: boolean; user: User }>('/auth/me'),
  quickDemoLogin: () =>
    apiClient.post<{ success: boolean; token: string; user: User }>('/auth/demo-login'),
  getOAuthStatus: () =>
    apiClient.get<{ success: boolean; google: any; apple: any }>('/auth/oauth/status'),
  getOAuthUrl: (provider: string) =>
    apiClient.get<{ success: boolean; url?: string; error?: string; requiredEnv?: string[] }>(
      `/auth/oauth/${provider}/url`
    ),


  // Resumes
  uploadResume: (formData: FormData) =>
    apiClient.post<{ success: boolean; resume: Resume }>('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getLatestResume: () => apiClient.get<{ success: boolean; resume: Resume }>('/resumes/latest'),
  getResumeById: (id: string) => apiClient.get<{ success: boolean; resume: Resume }>(`/resumes/${id}`),
  updateResumeParsedData: (id: string, parsedData: any) =>
    apiClient.put<{ success: boolean; resume: Resume }>(`/resumes/${id}`, { parsedData }),
  loadDemoResume: () => apiClient.post<{ success: boolean; resume: Resume }>('/resumes/demo'),

  // Jobs
  createJob: (data: { rawText: string; title?: string; company?: string }) =>
    apiClient.post<{ success: boolean; job: JobDescription }>('/jobs', data),
  getLatestJob: () => apiClient.get<{ success: boolean; job: JobDescription }>('/jobs/latest'),
  loadDemoJob: () => apiClient.post<{ success: boolean; job: JobDescription }>('/jobs/demo'),

  // ATS
  analyzeATS: (resumeId: string, jobDescriptionId: string) =>
    apiClient.post<{ success: boolean; analysis: ATSAnalysis }>('/ats/analyze', {
      resumeId,
      jobDescriptionId,
    }),
  getLatestATS: () => apiClient.get<{ success: boolean; analysis: ATSAnalysis }>('/ats/latest'),

  // Improve
  generateImprovements: (resumeId: string, jobDescriptionId: string) =>
    apiClient.post<{ success: boolean; result: ResumeImprovementResult }>('/improve/generate', {
      resumeId,
      jobDescriptionId,
    }),
  applyEnhancedResume: (resumeId: string, enhancedResumeData: any) =>
    apiClient.post<{ success: boolean }>('/improve/apply', {
      resumeId,
      enhancedResumeData,
    }),

  // Interviews
  startInterview: (config: {
    resumeId: string;
    jobDescriptionId?: string;
    type: string;
    difficulty: string;
    durationMinutes: number;
    mode: 'Text' | 'Voice';
    personalityMode?: string;
  }) => apiClient.post<{ success: boolean; interview: Interview }>('/interviews/start', config),
  submitAnswer: (interviewId: string, candidateAnswer: string) =>
    apiClient.post<{
      success: boolean;
      interview: Interview;
      evaluation: any;
      isComplete: boolean;
      nextQuestion: any;
    }>('/interviews/answer', { interviewId, candidateAnswer }),
  finishInterviewEarly: (interviewId: string) =>
    apiClient.post<{ success: boolean; interview: Interview }>(`/interviews/${interviewId}/finish`),
  getInterviewById: (id: string) =>
    apiClient.get<{ success: boolean; interview: Interview }>(`/interviews/${id}`),
  listInterviews: () =>
    apiClient.get<{ success: boolean; interviews: Interview[] }>('/interviews'),

  // Practice
  getWeakAreas: () =>
    apiClient.get<{ success: boolean; weakAreas: WeakAreaItem[] }>('/practice/weak-areas'),
  startPractice: (topic: string, targetSkill?: string) =>
    apiClient.post<{ success: boolean; session: PracticeSession }>('/practice/start', {
      topic,
      targetSkill,
    }),
  submitPracticeAnswer: (sessionId: string, questionId: string, candidateAnswer: string) =>
    apiClient.post<{
      success: boolean;
      evaluation: any;
      session: PracticeSession;
      isComplete: boolean;
    }>('/practice/answer', { sessionId, questionId, candidateAnswer }),

  // Analytics
  getDashboardData: () =>
    apiClient.get<{ success: boolean; data: DashboardData }>('/analytics/dashboard'),

  // Opportunities
  getOpportunities: (params?: { employmentType?: string; remoteType?: string; search?: string }) =>
    apiClient.get<{
      success: boolean;
      opportunities: Opportunity[];
      totalCount: number;
      hasResume: boolean;
    }>('/opportunities', { params }),

  getOpportunityDetails: (id: string) =>
    apiClient.get<{
      success: boolean;
      opportunity: Opportunity;
      match: any;
      resumeId?: string;
    }>(`/opportunities/${id}`),

  getPreferences: () =>
    apiClient.get<{ success: boolean; preferences: CandidatePreferences }>('/opportunities/preferences'),

  updatePreferences: (data: Partial<CandidatePreferences>) =>
    apiClient.put<{ success: boolean; preferences: CandidatePreferences }>('/opportunities/preferences', data),

  // Applications
  listApplications: (params?: { status?: string; employmentType?: string; search?: string }) =>
    apiClient.get<{ success: boolean; applications: Application[]; count: number }>('/applications', { params }),

  createApplication: (data: Partial<Application>) =>
    apiClient.post<{ success: boolean; message: string; application: Application }>('/applications', data),

  updateApplication: (id: string, data: Partial<Application>) =>
    apiClient.put<{ success: boolean; message: string; application: Application }>(`/applications/${id}`, data),

  deleteApplication: (id: string) =>
    apiClient.delete<{ success: boolean; message: string }>(`/applications/${id}`),

  getApplicationAnalytics: () =>
    apiClient.get<{ success: boolean; analytics: ApplicationAnalytics }>('/applications/analytics'),
};

