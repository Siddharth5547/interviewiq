import { aiProvider } from './aiProvider.js';
import { matchKeywordInText } from '../utils/textNormalize.js';

export interface IParsedJobDescription {
  title: string;
  company: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  experienceRequirements: string;
  techKeywords: string[];
  softSkills: string[];
}

export class JobAnalyzerService {
  public async analyzeJobText(rawText: string, defaultCompany = 'Target Company'): Promise<IParsedJobDescription> {
    const sanitized = aiProvider.sanitizeInput(rawText);

    const systemPrompt = `You are an expert Job Description Analyzer.
Analyze the provided job description and extract detailed structured insights according to this exact JSON schema:
{
  "title": "Target Job Title",
  "company": "Company Name",
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill1", "skill2"],
  "responsibilities": ["bullet1", "bullet2"],
  "qualifications": ["degree, years of experience"],
  "experienceRequirements": "e.g. 2+ years of experience in fullstack development",
  "techKeywords": ["react", "node", "sql", "aws", "docker"],
  "softSkills": ["communication", "mentorship", "problem solving"]
}
Strictly output valid JSON. Do not invent details not present in the job description.`;

    const userPrompt = `Job Description:\n\n${sanitized.slice(0, 10000)}`;

    return await aiProvider.generateJSON<IParsedJobDescription>(
      {
        systemPrompt,
        userPrompt,
        temperature: 0.1,
      },
      () => this.deterministicJobHeuristics(sanitized, defaultCompany)
    );
  }

  public deterministicJobHeuristics(text: string, defaultCompany: string): IParsedJobDescription {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    // Job title heuristic
    let title = 'Software Engineer';
    const firstLines = lines.slice(0, 4).join(' ');
    const titleMatch = firstLines.match(
      /(frontend|backend|fullstack|full-stack|software|lead|senior|junior|staff|devops|data|ai|ml|mobile|cloud)\s+(engineer|developer|architect|specialist)/i
    );
    if (titleMatch) {
      title = titleMatch[0].replace(/\b\w/g, (c) => c.toUpperCase());
    } else if (lines.length > 0 && lines[0].length < 60 && !/^(requirements|responsibilities|overview|about|role|summary|job description|qualifications):?/i.test(lines[0])) {
      title = lines[0];
    }

    // Technology keywords dictionary
    const techDict = [
      'react', 'react.js', 'node', 'node.js', 'javascript', 'typescript', 'python', 'java', 'c++', 'golang',
      'go', 'c#', '.net', 'asp.net', 'sql', 'postgresql', 'postgres', 'mysql', 'mongodb', 'nosql', 'redis', 'aws',
      'azure', 'gcp', 'docker', 'kubernetes', 'graphql', 'rest api', 'restful apis', 'rest', 'restful', 'ci/cd',
      'git', 'github', 'git/github', 'linux', 'tailwind', 'next.js', 'vue.js', 'express', 'express.js',
      'django', 'fastapi', 'spring boot', 'kafka', 'microservices', 'oauth', 'jwt', 'dsa', 'oop'
    ];

    const softDict = [
      'communication', 'collaboration', 'problem solving', 'leadership', 'team player', 'critical thinking',
      'agile', 'scrum', 'time management', 'adaptability', 'mentorship'
    ];

    const textLower = text.toLowerCase();
    const techFound = techDict.filter((t) => matchKeywordInText(t, text));
    const softFound = softDict.filter((s) => textLower.includes(s));

    // Experience match
    const expMatch = text.match(/(\d+[\+]?\s*(?:to\s*\d+\s*)?years?(?:\s*of)?\s*(?:relevant\s*)?experience)/i);
    const experienceRequirements = expMatch ? expMatch[0] : '2+ years of relevant engineering experience';

    // Responsibilities heuristic
    const bulletLines = lines.filter((l) => /^[-*•\d\.]\s+/.test(l) || /responsible|develop|architect|maintain|lead|design/i.test(l));
    const responsibilities = bulletLines.slice(0, 6).map((l) => l.replace(/^[-*•\d\.]\s*/, ''));

    const requiredSkills = techFound.slice(0, Math.ceil(techFound.length * 0.7));
    const preferredSkills = techFound.slice(Math.ceil(techFound.length * 0.7));

    return {
      title,
      company: defaultCompany,
      requiredSkills: requiredSkills.length > 0 ? requiredSkills : ['JavaScript', 'React', 'Node.js', 'REST APIs'],
      preferredSkills: preferredSkills.length > 0 ? preferredSkills : ['Docker', 'AWS', 'TypeScript'],
      responsibilities: responsibilities.length > 0
        ? responsibilities
        : [
            'Design, develop, and maintain responsive web applications.',
            'Collaborate with cross-functional teams to define and implement new features.',
            'Write clean, testable, and efficient code adhering to engineering best practices.',
          ],
      qualifications: [
        experienceRequirements,
        "Bachelor's degree in Computer Science, Engineering, or equivalent practical experience.",
      ],
      experienceRequirements,
      techKeywords: techFound.length > 0 ? techFound : ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      softSkills: softFound.length > 0 ? softFound : ['Communication', 'Problem Solving', 'Team Collaboration'],
    };
  }
}

export const jobAnalyzer = new JobAnalyzerService();
