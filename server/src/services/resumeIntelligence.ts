export interface SkillTaxonomy {
  category: string;
  skills: string[];
  inferredDomains: string[];
}

export const SKILL_TAXONOMY: Record<string, { domains: string[]; related: string[] }> = {
  // Frontend
  react: { domains: ['Frontend Development', 'Single Page Applications', 'UI Engineering'], related: ['react.js', 'redux', 'next.js', 'javascript', 'typescript', 'html5', 'css3'] },
  'react.js': { domains: ['Frontend Development', 'Single Page Applications'], related: ['react', 'next.js', 'redux'] },
  nextjs: { domains: ['Frontend Development', 'Server-Side Rendering (SSR)', 'Full-stack Development'], related: ['next.js', 'react', 'typescript'] },
  'next.js': { domains: ['Frontend Development', 'Server-Side Rendering (SSR)', 'Full-stack Development'], related: ['nextjs', 'react', 'typescript'] },
  vue: { domains: ['Frontend Development', 'UI Engineering'], related: ['vue.js', 'vuex', 'pinia', 'javascript'] },
  angular: { domains: ['Frontend Development', 'Enterprise Web'], related: ['typescript', 'rxjs'] },
  typescript: { domains: ['Frontend Development', 'Backend Development', 'Type Safety'], related: ['javascript', 'node.js'] },
  javascript: { domains: ['Frontend Development', 'Backend Development'], related: ['typescript', 'node.js', 'es6'] },
  tailwind: { domains: ['Frontend Development', 'UI Styling', 'Responsive Design'], related: ['tailwindcss', 'css', 'css3'] },
  tailwindcss: { domains: ['Frontend Development', 'UI Styling', 'Responsive Design'], related: ['tailwind', 'css3'] },
  html5: { domains: ['Frontend Development', 'Web Fundamentals'], related: ['html', 'css3'] },
  css3: { domains: ['Frontend Development', 'Web Styling'], related: ['css', 'sass', 'tailwind'] },

  // Backend
  node: { domains: ['Backend Development', 'REST API Development', 'Asynchronous Programming'], related: ['node.js', 'express', 'express.js', 'javascript'] },
  'node.js': { domains: ['Backend Development', 'REST API Development', 'Asynchronous Programming'], related: ['node', 'express', 'express.js'] },
  express: { domains: ['Backend Development', 'REST API Development', 'Middleware Architecture'], related: ['express.js', 'node.js'] },
  'express.js': { domains: ['Backend Development', 'REST API Development'], related: ['express', 'node.js'] },
  python: { domains: ['Backend Development', 'Data Engineering', 'AI & Machine Learning'], related: ['django', 'fastapi', 'flask', 'pandas'] },
  fastapi: { domains: ['Backend Development', 'REST API Development', 'Asynchronous Python'], related: ['python', 'pydantic'] },
  django: { domains: ['Backend Development', 'Full-stack Web', 'ORM Architecture'], related: ['python', 'postgresql'] },
  java: { domains: ['Backend Development', 'Enterprise Systems', 'Object-Oriented Design'], related: ['spring', 'spring boot', 'jvm'] },
  'spring boot': { domains: ['Backend Development', 'Microservices', 'Enterprise Systems'], related: ['spring', 'java', 'hibernate'] },
  golang: { domains: ['Backend Development', 'Distributed Systems', 'High Concurrency'], related: ['go', 'microservices'] },
  go: { domains: ['Backend Development', 'Distributed Systems', 'High Concurrency'], related: ['golang', 'docker'] },

  // Databases
  mongodb: { domains: ['Database Management', 'NoSQL', 'Document Store', 'Data Modeling'], related: ['mongoose', 'nosql'] },
  postgres: { domains: ['Database Management', 'Relational Database (RDBMS)', 'SQL', 'ACID Transactions'], related: ['postgresql', 'sql', 'prisma'] },
  postgresql: { domains: ['Database Management', 'Relational Database (RDBMS)', 'SQL'], related: ['postgres', 'sql'] },
  mysql: { domains: ['Database Management', 'Relational Database (RDBMS)', 'SQL'], related: ['sql', 'mariadb'] },
  redis: { domains: ['Database Management', 'In-Memory Cache', 'Key-Value Store', 'Session Management'], related: ['caching', 'pub/sub'] },
  sql: { domains: ['Database Management', 'Query Optimization', 'Relational Data Modeling'], related: ['postgresql', 'mysql', 'sqlite'] },

  // Auth & Security
  jwt: { domains: ['Authentication & Security', 'Stateless Session Handling', 'API Security'], related: ['json web token', 'oauth', 'auth0'] },
  oauth: { domains: ['Authentication & Security', 'Delegated Authorization', 'Identity Provider Integration'], related: ['oauth2', 'jwt', 'sso'] },
  bcrypt: { domains: ['Authentication & Security', 'Password Hashing & Cryptography'], related: ['argon2', 'security'] },

  // Systems & Languages
  'c++': { domains: ['Systems Programming', 'Core Software Engineering', 'High Performance'], related: ['cpp', 'c', 'c/c++', 'dsa', 'oop'] },
  cpp: { domains: ['Systems Programming', 'Core Software Engineering'], related: ['c++', 'c', 'c/c++'] },
  'c#': { domains: ['Enterprise Systems', 'Backend Development', 'Object-Oriented Design'], related: ['.net', 'asp.net', 'csharp', 'dotnet'] },
  '.net': { domains: ['Enterprise Web', 'Backend Development', 'Microsoft Stack'], related: ['c#', 'asp.net', 'dotnet', '.net core'] },
  'asp.net': { domains: ['Enterprise Web', 'Backend Development'], related: ['.net', 'c#', 'dotnet', 'asp.net core'] },

  // APIs & Architecture
  'rest api': { domains: ['API Engineering', 'Backend Development', 'System Integration'], related: ['restful apis', 'restful api', 'rest', 'apis', 'rest apis'] },
  'restful apis': { domains: ['API Engineering', 'Backend Development', 'System Integration'], related: ['rest api', 'rest', 'restful api', 'apis', 'rest apis'] },
  'rest apis': { domains: ['API Engineering', 'Backend Development', 'System Integration'], related: ['rest api', 'rest', 'restful apis', 'apis'] },
  rest: { domains: ['API Engineering', 'Backend Development'], related: ['rest api', 'restful apis', 'restful api', 'apis'] },
  dsa: { domains: ['Problem Solving', 'Data Structures & Algorithms'], related: ['data structures', 'algorithms', 'problem solving'] },
  oop: { domains: ['Software Architecture', 'Object-Oriented Design'], related: ['object-oriented programming', 'oops', 'design patterns'] },

  // Cloud & DevOps
  docker: { domains: ['DevOps & Cloud', 'Containerization', 'Microservices Architecture'], related: ['kubernetes', 'docker-compose', 'ci/cd'] },
  kubernetes: { domains: ['DevOps & Cloud', 'Container Orchestration', 'Scalability'], related: ['k8s', 'docker', 'helm'] },
  aws: { domains: ['DevOps & Cloud', 'Cloud Infrastructure', 'Serverless'], related: ['s3', 'ec2', 'lambda', 'cloud'] },
  cicd: { domains: ['DevOps & Cloud', 'Continuous Integration', 'Automated Delivery'], related: ['github actions', 'jenkins', 'gitlab'] },
  'github actions': { domains: ['DevOps & Cloud', 'Automated Workflows', 'CI/CD Pipelines'], related: ['cicd', 'git'] },
  git: { domains: ['Version Control', 'Collaborative Development'], related: ['github', 'git/github', 'gitlab'] },
  github: { domains: ['Version Control', 'Collaborative Development'], related: ['git', 'git/github', 'gitlab'] },
  'git/github': { domains: ['Version Control', 'Collaborative Development'], related: ['git', 'github', 'gitlab'] },

  // AI & ML
  ai: { domains: ['AI Integration', 'Intelligent Systems', 'LLM Application Development'], related: ['machine learning', 'openai', 'gemini', 'nlp'] },
  openai: { domains: ['AI Integration', 'Generative AI', 'Prompt Engineering'], related: ['llm', 'chatgpt', 'ai'] },
  gemini: { domains: ['AI Integration', 'Generative AI', 'Multimodal AI'], related: ['llm', 'google ai'] },
  nlp: { domains: ['Natural Language Processing', 'Text Analysis', 'Information Extraction'], related: ['ai', 'transformers'] },
};

export class ResumeIntelligenceEngine {
  /**
   * Infer higher-level domain competencies from explicit tools and frameworks
   */
  public inferDomains(skills: string[], projects: Array<{ technologies?: string[]; title?: string; description?: string }>): string[] {
    const domainSet = new Set<string>();
    const normalizedSkills = skills.map((s) => s.toLowerCase().trim());

    // Check direct skill taxonomy
    for (const skill of normalizedSkills) {
      for (const [key, meta] of Object.entries(SKILL_TAXONOMY)) {
        if (skill === key || skill.includes(key) || meta.related.includes(skill)) {
          meta.domains.forEach((d) => domainSet.add(d));
        }
      }
    }

    // Check project technologies and descriptions
    for (const proj of projects) {
      const projTech = (proj.technologies || []).map((t) => t.toLowerCase().trim());
      for (const t of projTech) {
        for (const [key, meta] of Object.entries(SKILL_TAXONOMY)) {
          if (t === key || t.includes(key) || meta.related.includes(t)) {
            meta.domains.forEach((d) => domainSet.add(d));
          }
        }
      }

      // Check full-stack synergy
      const hasFrontend = projTech.some((t) => ['react', 'vue', 'angular', 'next', 'html', 'css'].some((fe) => t.includes(fe)));
      const hasBackend = projTech.some((t) => ['node', 'express', 'python', 'fastapi', 'django', 'java', 'go'].some((be) => t.includes(be)));
      const hasDB = projTech.some((t) => ['mongo', 'postgres', 'sql', 'redis'].some((db) => t.includes(db)));

      if (hasFrontend && hasBackend) {
        domainSet.add('Full-stack Development');
      }
      if (hasBackend && hasDB) {
        domainSet.add('Database Integration & Data Modeling');
      }
      if (projTech.some((t) => ['jwt', 'oauth', 'bcrypt', 'auth'].some((a) => t.includes(a)))) {
        domainSet.add('Authentication & Authorization');
      }
      if (projTech.some((t) => ['ai', 'llm', 'gemini', 'openai', 'nlp'].some((a) => t.includes(a)))) {
        domainSet.add('AI Integration');
      }
    }

    // Default if sparse
    if (domainSet.size === 0) {
      domainSet.add('Software Engineering');
      domainSet.add('Application Development');
    }

    return Array.from(domainSet);
  }

  /**
   * Find partial and semantic matches between candidate skills and job requirements
   */
  public matchSkillSemantics(candidateSkills: string[], requiredSkill: string): { matched: boolean; partial: boolean; related?: string } {
    const target = requiredSkill.toLowerCase().trim();
    const candidateNorm = candidateSkills.map((s) => s.toLowerCase().trim());

    // 1. Exact match
    if (candidateNorm.includes(target)) {
      return { matched: true, partial: false };
    }

    // 2. Substring match
    for (const c of candidateNorm) {
      if (c.includes(target) || target.includes(c)) {
        return { matched: true, partial: false, related: c };
      }
    }

    // 3. Taxonomy related match
    const entry = SKILL_TAXONOMY[target];
    if (entry) {
      for (const rel of entry.related) {
        const found = candidateNorm.find((c) => c === rel || c.includes(rel));
        if (found) {
          return { matched: false, partial: true, related: `${found} (related to ${requiredSkill})` };
        }
      }
    }

    return { matched: false, partial: false };
  }
}

export const resumeIntelligence = new ResumeIntelligenceEngine();
