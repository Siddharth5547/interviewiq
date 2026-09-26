import crypto from 'crypto';

class MemoryStore {
  users: Map<string, any> = new Map();
  resumes: Map<string, any> = new Map();
  jobs: Map<string, any> = new Map();
  atsAnalyses: Map<string, any> = new Map();
  interviews: Map<string, any> = new Map();
  practiceSessions: Map<string, any> = new Map();
  opportunities: Map<string, any> = new Map();
  applications: Map<string, any> = new Map();
  candidatePreferences: Map<string, any> = new Map();

  generateId(): string {
    return crypto.randomUUID();
  }
}

export const memoryStore = new MemoryStore();
