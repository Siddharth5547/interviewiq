import { IParsedResume } from '../models/Resume.js';
import { IParsedJobDescription } from './jobAnalyzer.js';
import { resumeIntelligence } from './resumeIntelligence.js';
import { ICategoryScore } from '../models/ATSAnalysis.js';
import { escapeRegExp } from '../utils/regexEscape.js';
import { normalizeText, matchKeywordInText } from '../utils/textNormalize.js';
export interface ATSAnalysisResult {
  overallScore: number;
  label: string;
  categoryScores: ICategoryScore[];
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
}

export class ATSEngineService {
  public computeATSScore(
    resume: IParsedResume,
    job: IParsedJobDescription,
    rawResumeText: string
  ): ATSAnalysisResult {
    const rawResume = rawResumeText || '';
    const normRawResume = normalizeText(rawResume);
    const candidateSkills = (resume?.skills?.all || []).map((s) => (s || '').trim()).filter(Boolean);

    // Deduplicate job keywords case-insensitively and clean up
    const rawJobKeywords = [...(job?.techKeywords || []), ...(job?.requiredSkills || [])];
    const seenKw = new Set<string>();
    const jobKeywords: string[] = [];
    for (const k of rawJobKeywords) {
      const trimmed = (k || '').trim();
      const lower = trimmed.toLowerCase();
      if (trimmed && !seenKw.has(lower)) {
        seenKw.add(lower);
        jobKeywords.push(trimmed);
      }
    }

    // 1. Keyword & Skills Match
    const matchingKeywords: string[] = [];
    const missingKeywords: string[] = [];
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];
    const partiallyMatchedSkills: Array<{ skill: string; relatedFound: string }> = [];

    for (const kw of jobKeywords) {
      const matchStatus = resumeIntelligence.matchSkillSemantics(candidateSkills, kw);
      if (matchStatus.matched) {
        matchingKeywords.push(kw);
        matchingSkills.push(kw);
      } else if (matchStatus.partial && matchStatus.related) {
        partiallyMatchedSkills.push({ skill: kw, relatedFound: matchStatus.related });
        matchingKeywords.push(kw);
      } else if (matchKeywordInText(kw, rawResume)) {
        // Safe normalized occurrence in raw resume text
        matchingKeywords.push(kw);
        matchingSkills.push(kw);
      } else {
        missingKeywords.push(kw);
        missingSkills.push(kw);
      }
    }

    const keywordRatio = jobKeywords.length > 0 ? matchingKeywords.length / jobKeywords.length : 0.8;
    const keywordScore = Math.round(keywordRatio * 20); // max 20

    const skillRatio =
      (job?.requiredSkills || []).length > 0
        ? matchingSkills.length / Math.max((job?.requiredSkills || []).length, 1)
        : 0.85;
    const skillsScore = Math.round(Math.min(skillRatio, 1) * 20); // max 20

    // 2. Job Title Match
    const targetTitle = job?.title || 'Software Engineer';
    const jobTitleWords = targetTitle
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => !['the', 'and', 'or', 'a', 'of', 'in', 'at', 'for'].includes(w));
    let titleMatchCount = 0;
    for (const word of jobTitleWords) {
      if (matchKeywordInText(word, rawResume)) titleMatchCount++;
    }
    const titleRatio = jobTitleWords.length > 0 ? titleMatchCount / jobTitleWords.length : 1;
    const titleScore = Math.round(titleRatio * 10); // max 10

    // 3. Experience Relevance
    const relevantExpList: string[] = [];
    let expScoreVal = 5;
    if (resume?.experience && resume.experience.length > 0) {
      expScoreVal = 8;
      for (const exp of resume.experience) {
        const expDesc = `${exp.role || ''} ${exp.company || ''} ${exp.description || ''}`;
        if (jobKeywords.some((k) => matchKeywordInText(k, expDesc))) {
          relevantExpList.push(`${exp.role || 'Role'} at ${exp.company || 'Company'}`);
          expScoreVal = 10;
        }
      }
    }
    const experienceScore = expScoreVal; // max 10

    // 4. Project Relevance
    let projectScoreVal = 4;
    if (resume?.projects && resume.projects.length > 0) {
      projectScoreVal = 7;
      const matchedProjects = resume.projects.filter((p) => {
        const projTech = (p.technologies || []).join(' ');
        const projDesc = `${p.title || ''} ${p.description || ''}`;
        return jobKeywords.some((k) => matchKeywordInText(k, projTech) || matchKeywordInText(k, projDesc));
      });
      if (matchedProjects.length >= 2) projectScoreVal = 10;
      else if (matchedProjects.length === 1) projectScoreVal = 9;
    }
    const projectScore = projectScoreVal; // max 10

    // 5. Education Match
    let educationScore = 7;
    if (resume?.education && resume.education.length > 0) {
      const hasCS = resume.education.some((e) =>
        /computer|engineering|software|technology|science|it|cse|b\.?tech|b\.?e/i.test(
          `${e.degree || ''} ${e.field || ''}`
        )
      );
      educationScore = hasCS ? 10 : 8;
    }

    // 6. Resume Structure & Section Completeness
    const missingSections: string[] = [];
    if (!resume?.summary || resume.summary.length < 20) missingSections.push('Professional Summary');
    if (!resume?.skills?.all || resume.skills.all.length === 0) missingSections.push('Technical Skills');
    if (!resume?.projects || resume.projects.length === 0) missingSections.push('Projects');
    if (!resume?.experience || resume.experience.length === 0) missingSections.push('Experience');
    if (!resume?.education || resume.education.length === 0) missingSections.push('Education');

    const structureScore = missingSections.length === 0 ? 10 : Math.max(3, 10 - missingSections.length * 2);

    // 7. Formatting Compatibility
    const formattingIssues: string[] = [];
    if (rawResumeText.includes('\t\t\t') || rawResumeText.includes('| |')) {
      formattingIssues.push('Complex nested tables or multi-column layouts detected. Modern ATS parsers prefer simple single-column hierarchies.');
    }
    if (rawResumeText.length < 200) {
      formattingIssues.push('Low character density: content may be embedded in graphics or scanned images.');
    }
    if (formattingIssues.length === 0) {
      formattingIssues.push('Clean plain-text hierarchy with standard bullet conventions.');
    }
    const formattingScore = formattingIssues.length <= 1 ? 10 : 6;

    // Overall Score Calculation (out of 100)
    const overallScore = Math.min(
      100,
      Math.max(
        0,
        keywordScore +
          skillsScore +
          titleScore +
          experienceScore +
          projectScore +
          educationScore +
          structureScore +
          formattingScore
      )
    );

    // Categories breakdown
    const categoryScores: ICategoryScore[] = [
      {
        name: 'Keyword Match',
        score: keywordScore,
        maxScore: 20,
        status: keywordScore >= 16 ? 'good' : keywordScore >= 11 ? 'warning' : 'critical',
        details: `${matchingKeywords.length} of ${jobKeywords.length} key terms identified.`,
      },
      {
        name: 'Skills Match',
        score: skillsScore,
        maxScore: 20,
        status: skillsScore >= 16 ? 'good' : skillsScore >= 11 ? 'warning' : 'critical',
        details: `${matchingSkills.length} core competencies matched against job requirements.`,
      },
      {
        name: 'Job Title Match',
        score: titleScore,
        maxScore: 10,
        status: titleScore >= 8 ? 'good' : 'warning',
        details: `Alignment with target role "${job.title}".`,
      },
      {
        name: 'Experience Relevance',
        score: experienceScore,
        maxScore: 10,
        status: experienceScore >= 8 ? 'good' : 'warning',
        details: `${relevantExpList.length} relevant professional role(s) found.`,
      },
      {
        name: 'Project Relevance',
        score: projectScore,
        maxScore: 10,
        status: projectScore >= 8 ? 'good' : 'warning',
        details: `${resume.projects?.length || 0} technical project(s) evaluated for stack alignment.`,
      },
      {
        name: 'Education Match',
        score: educationScore,
        maxScore: 10,
        status: educationScore >= 8 ? 'good' : 'warning',
        details: 'Academic qualification credentials verified.',
      },
      {
        name: 'Resume Structure',
        score: structureScore,
        maxScore: 10,
        status: structureScore >= 8 ? 'good' : 'warning',
        details: missingSections.length === 0 ? 'All essential sections present.' : `Missing: ${missingSections.join(', ')}`,
      },
      {
        name: 'Formatting Compatibility',
        score: formattingScore,
        maxScore: 10,
        status: formattingScore >= 8 ? 'good' : 'warning',
        details: 'File readability and layout compatibility for ATS scanners.',
      },
    ];

    // Actionable Suggestions
    const actionableSuggestions: Array<{
      category: string;
      issue: string;
      suggestion: string;
      impact: 'high' | 'medium' | 'low';
    }> = [];

    if (missingSkills.length > 0) {
      actionableSuggestions.push({
        category: 'Skills Alignment',
        issue: `Missing required keywords: ${missingSkills.slice(0, 4).join(', ')}`,
        suggestion: `If you have worked with these technologies in your projects or internships, explicitly mention them in your technical skills or project descriptions without fabricating experience.`,
        impact: 'high',
      });
    }

    if (partiallyMatchedSkills.length > 0) {
      actionableSuggestions.push({
        category: 'Skill Terminology',
        issue: `Terminology differences detected: ${partiallyMatchedSkills.map((p) => `${p.skill} vs ${p.relatedFound}`).join('; ')}`,
        suggestion: `Use standard industry naming conventions identical to the job description (e.g. use "React.js" if requested).`,
        impact: 'medium',
      });
    }

    if (missingSections.length > 0) {
      actionableSuggestions.push({
        category: 'Completeness',
        issue: `Missing sections: ${missingSections.join(', ')}`,
        suggestion: `Add the missing sections to ensure the automated scanner does not categorize your profile as incomplete.`,
        impact: 'high',
      });
    }

    if (titleScore < 8) {
      actionableSuggestions.push({
        category: 'Headline & Summary',
        issue: `Target title "${job.title}" is not clearly emphasized in your summary.`,
        suggestion: `Align your professional headline or summary statement with the target role title.`,
        impact: 'medium',
      });
    }

    return {
      overallScore,
      label: 'Estimated ATS Compatibility',
      categoryScores,
      matchingKeywords,
      missingKeywords,
      matchingSkills,
      missingSkills,
      partiallyMatchedSkills,
      relevantExperience: relevantExpList,
      missingSections,
      formattingIssues,
      actionableSuggestions,
      disclaimer:
        'Estimated ATS Compatibility score is an algorithmic approximation for career preparation and practice purposes. It does not guarantee passing an employer’s applicant tracking system.',
    };
  }
}

export const atsEngine = new ATSEngineService();
