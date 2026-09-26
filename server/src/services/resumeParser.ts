import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { IParsedResume } from '../models/Resume.js';
import { aiProvider } from './aiProvider.js';
import { resumeIntelligence } from './resumeIntelligence.js';
import { matchKeywordInText } from '../utils/textNormalize.js';

export class ResumeParserService {
  /**
   * Extract raw text from file buffer based on extension / MIME type
   */
  public async extractRawText(fileBuffer: Buffer, originalFilename: string, mimeType: string): Promise<string> {
    const ext = originalFilename.toLowerCase().split('.').pop() || '';

    try {
      if (ext === 'pdf' || mimeType === 'application/pdf') {
        const data = await pdfParse(fileBuffer);
        return data.text || '';
      }

      if (ext === 'docx' || mimeType.includes('openxmlformats-officedocument')) {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value || '';
      }

      // TXT or other text-readable fallback
      return fileBuffer.toString('utf-8');
    } catch (error: any) {
      console.warn(`[ResumeParser] Raw buffer extraction error for ${originalFilename}:`, error.message);
      // Fallback: try raw utf-8 string extraction
      return fileBuffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    }
  }

  /**
   * Parse extracted raw text into structured resume fields
   */
  public async parseResumeText(rawText: string): Promise<{ parsedData: IParsedResume; intelligenceTags: string[] }> {
    const sanitizedText = aiProvider.sanitizeInput(rawText);

    // Prepare system prompt for structured JSON extraction
    const systemPrompt = `You are an expert ATS resume parsing engine.
Extract all structured data accurately into this exact JSON schema:
{
  "name": "Full Name",
  "contact": { "email": "", "phone": "", "linkedin": "", "github": "", "location": "" },
  "summary": "Professional summary or objective",
  "education": [ { "institution": "", "degree": "", "field": "", "startYear": "", "endYear": "", "gpa": "" } ],
  "skills": {
    "programmingLanguages": [],
    "frameworks": [],
    "libraries": [],
    "databases": [],
    "tools": [],
    "all": []
  },
  "projects": [ { "title": "", "description": "", "technologies": [], "highlights": [], "link": "" } ],
  "experience": [ { "company": "", "role": "", "duration": "", "description": "", "highlights": [] } ],
  "certifications": [],
  "achievements": []
}
Output valid JSON only. Do not invent any data not present in the text.`;

    const userPrompt = `Parse this resume text:\n\n${sanitizedText.slice(0, 10000)}`;

    const parsedData = await aiProvider.generateJSON<IParsedResume>(
      {
        systemPrompt,
        userPrompt,
        temperature: 0.1,
      },
      () => this.deterministicHeuristicParser(sanitizedText)
    );

    // Ensure all skills list is populated
    const allSkillsSet = new Set<string>();
    (parsedData.skills?.programmingLanguages || []).forEach((s) => allSkillsSet.add(s));
    (parsedData.skills?.frameworks || []).forEach((s) => allSkillsSet.add(s));
    (parsedData.skills?.libraries || []).forEach((s) => allSkillsSet.add(s));
    (parsedData.skills?.databases || []).forEach((s) => allSkillsSet.add(s));
    (parsedData.skills?.tools || []).forEach((s) => allSkillsSet.add(s));
    (parsedData.skills?.all || []).forEach((s) => allSkillsSet.add(s));

    parsedData.skills.all = Array.from(allSkillsSet);

    // Compute semantic intelligence tags
    const intelligenceTags = resumeIntelligence.inferDomains(parsedData.skills.all, parsedData.projects || []);

    return { parsedData, intelligenceTags };
  }

  /**
   * Deterministic regex & heuristic parser when external AI is unavailable or offline
   */
  public deterministicHeuristicParser(text: string): IParsedResume {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    // Contact extraction regexes
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);

    // Extract potential name (usually top 1-3 lines before contacts)
    let candidateName = 'Candidate';
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      if (
        line.length > 2 &&
        line.length < 40 &&
        !line.includes('@') &&
        !line.includes('http') &&
        !/resume|curriculum|cv|summary|objective/i.test(line)
      ) {
        candidateName = line;
        break;
      }
    }

    // Known common tech keywords list for heuristic matching
    const knownLangs = ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', '.net', 'asp.net', 'go', 'golang', 'ruby', 'php', 'swift', 'kotlin', 'rust', 'sql', 'html', 'css'];
    const knownFrameworks = ['react', 'react.js', 'next.js', 'vue', 'vue.js', 'angular', 'node.js', 'express', 'express.js', 'django', 'fastapi', 'flask', 'spring boot', 'tailwind'];
    const knownDatabases = ['mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'dynamodb', 'cassandra', 'firebase'];
    const knownTools = ['git', 'github', 'git/github', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'linux', 'postman', 'jest', 'vite', 'webpack', 'figma', 'rest api', 'restful apis', 'oauth', 'jwt'];

    const foundLangs = knownLangs.filter((k) => matchKeywordInText(k, text));
    const foundFrameworks = knownFrameworks.filter((k) => matchKeywordInText(k, text));
    const foundDatabases = knownDatabases.filter((k) => matchKeywordInText(k, text));
    const foundTools = knownTools.filter((k) => matchKeywordInText(k, text));

    // Basic section chunking
    const sections: Record<string, string[]> = {
      summary: [],
      experience: [],
      internships: [],
      projects: [],
      education: [],
      skills: [],
      certifications: [],
      achievements: [],
    };

    let currentSection = 'summary';
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (/^(summary|professional summary|objective|about me|profile)/i.test(lower)) {
        currentSection = 'summary';
        continue;
      } else if (/^(internships?|intern experience)/i.test(lower)) {
        currentSection = 'internships';
        continue;
      } else if (/^(experience|work experience|employment|professional experience)/i.test(lower)) {
        currentSection = 'experience';
        continue;
      } else if (/^(projects|personal projects|technical projects|academic projects)/i.test(lower)) {
        currentSection = 'projects';
        continue;
      } else if (/^(education|academic background|academics|qualifications)/i.test(lower)) {
        currentSection = 'education';
        continue;
      } else if (/^(skills|technical skills|technologies|core competencies)/i.test(lower)) {
        currentSection = 'skills';
        continue;
      } else if (/^(certifications?|certificates?|licenses?)/i.test(lower)) {
        currentSection = 'certifications';
        continue;
      } else if (/^(achievements?|honors?|awards?)/i.test(lower)) {
        currentSection = 'achievements';
        continue;
      }

      if (sections[currentSection]) {
        sections[currentSection].push(line);
      }
    }

    const summaryText = sections.summary.join(' ').trim();

    // Education heuristic — ONLY include if genuine academic markers exist
    const educationItems: Array<{
      institution: string;
      degree: string;
      field: string;
      startYear?: string;
      endYear?: string;
      gpa?: string;
    }> = [];

    const eduLines = sections.education.join(' ');
    const degreeMatch = eduLines.match(/(bachelor|master|b\.tech|b\.e|b\.s|m\.s|m\.tech|phd|diploma|associate)[^,.\n]*/i);
    const institutionMatch = eduLines.match(/([a-zA-Z\s]+(university|institute|college|school|academy)[a-zA-Z\s]*)/i);
    const yearMatches = eduLines.match(/\b(20\d{2}|19\d{2})\b/g);

    if (degreeMatch || institutionMatch) {
      educationItems.push({
        institution: institutionMatch ? institutionMatch[0].trim() : 'Academic Institution',
        degree: degreeMatch ? degreeMatch[0].trim() : 'Degree / Program',
        field: /computer|software|data|electronics|information|engineering/i.test(eduLines)
          ? 'Computer Science / Engineering'
          : '',
        startYear: yearMatches && yearMatches[0] ? yearMatches[0] : undefined,
        endYear: yearMatches && yearMatches[1] ? yearMatches[1] : undefined,
      });
    }

    // Projects heuristic — ONLY extract projects explicitly listed
    const projectItems: Array<{ title: string; description: string; technologies: string[]; highlights: string[]; link?: string }> = [];
    const projLines = sections.projects;
    for (let i = 0; i < projLines.length; i += 2) {
      if (projLines[i] && projLines[i].length > 3) {
        const title = projLines[i].replace(/^[-*•]\s*/, '').trim();
        const desc = projLines[i + 1] ? projLines[i + 1].trim() : title;
        const projTech = [...foundLangs, ...foundFrameworks, ...foundDatabases, ...foundTools].filter((t) =>
          desc.toLowerCase().includes(t.toLowerCase()) || title.toLowerCase().includes(t.toLowerCase())
        );
        projectItems.push({
          title,
          description: desc,
          technologies: projTech,
          highlights: [desc],
        });
      }
    }

    // Experience heuristic — ONLY extract if experience section exists
    const expItems: Array<{ company: string; role: string; duration: string; description: string; highlights: string[] }> = [];
    const expLines = sections.experience;
    for (let i = 0; i < expLines.length; i += 2) {
      if (expLines[i] && expLines[i].length > 3) {
        const role = expLines[i].replace(/^[-*•]\s*/, '').trim();
        const desc = expLines[i + 1] ? expLines[i + 1].trim() : role;
        expItems.push({
          company: 'Professional Organization',
          role,
          duration: '',
          description: desc,
          highlights: [desc],
        });
      }
    }

    // Internships heuristic
    const internItems: Array<{ company: string; role: string; duration: string; description: string; highlights: string[] }> = [];
    const internLines = sections.internships;
    for (let i = 0; i < internLines.length; i += 2) {
      if (internLines[i] && internLines[i].length > 3) {
        const role = internLines[i].replace(/^[-*•]\s*/, '').trim();
        const desc = internLines[i + 1] ? internLines[i + 1].trim() : role;
        internItems.push({
          company: 'Host Company',
          role,
          duration: '',
          description: desc,
          highlights: [desc],
        });
      }
    }

    // Certifications & Achievements — strictly what was found
    const certItems: string[] = sections.certifications
      .map((l) => l.replace(/^[-*•]\s*/, '').trim())
      .filter((l) => l.length > 3);

    const achieveItems: string[] = sections.achievements
      .map((l) => l.replace(/^[-*•]\s*/, '').trim())
      .filter((l) => l.length > 3);

    return {
      name: candidateName,
      contact: {
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
        github: githubMatch ? githubMatch[0] : undefined,
        location: undefined,
      },
      summary: summaryText,
      education: educationItems,
      skills: {
        programmingLanguages: foundLangs,
        frameworks: foundFrameworks,
        libraries: [],
        databases: foundDatabases,
        tools: foundTools,
        all: [...new Set([...foundLangs, ...foundFrameworks, ...foundDatabases, ...foundTools])],
      },
      projects: projectItems,
      experience: expItems,
      internships: internItems,
      certifications: certItems,
      achievements: achieveItems,
    };
  }
}

export const resumeParser = new ResumeParserService();
