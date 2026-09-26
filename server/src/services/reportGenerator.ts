import { IInterview, IFinalReport, IRealityCheckItem } from '../models/Interview.js';
import { IParsedResume } from '../models/Resume.js';
import { aiProvider } from './aiProvider.js';

export class ReportGeneratorService {
  public async generateReport(interview: IInterview, resume: IParsedResume): Promise<IFinalReport> {
    const candidateAnswers = interview.conversation.filter((c) => c.sender === 'candidate');
    const evaluations = candidateAnswers.map((c) => c.evaluation).filter(Boolean);

    // Calculate aggregated scores
    const avgScore = evaluations.length > 0
      ? Math.round(evaluations.reduce((acc, curr) => acc + (curr?.score || 50), 0) / evaluations.length)
      : 70;

    // Detect weak topics and concepts
    const weakTopicsSet = new Set<string>();
    for (const msg of candidateAnswers) {
      if (msg.evaluation && msg.evaluation.score < 70) {
        const qItem = interview.questionList.find((q) => q.id === msg.questionId);
        if (qItem) {
          weakTopicsSet.add(qItem.topic);
        }
        (msg.evaluation.testedConceptsMissed || []).forEach((c) => weakTopicsSet.add(c));
      }
    }

    const weakTopicsList = Array.from(weakTopicsSet).slice(0, 5);
    if (weakTopicsList.length === 0) {
      weakTopicsList.push('System Architecture Scaling', 'Edge-Case Concurrency');
    }

    // Compute 7 category scores
    const technicalKnowledge = Math.min(100, Math.max(30, Math.round(avgScore * 0.95 + 4)));
    const projectUnderstanding = Math.min(100, Math.max(30, Math.round(avgScore * 1.02)));
    const problemSolving = Math.min(100, Math.max(30, Math.round(avgScore * 0.92)));
    const communication = Math.min(100, Math.max(30, Math.round(avgScore * 1.05 - 2)));
    const conceptClarity = Math.min(100, Math.max(30, Math.round(avgScore * 0.96)));
    const resumeKnowledge = Math.min(100, Math.max(30, Math.round(avgScore * 1.01)));
    const answerRelevance = Math.min(100, Math.max(30, Math.round(avgScore * 0.98 + 1)));

    // Generate Resume Reality Check
    const realityCheck: IRealityCheckItem[] = [];

    // Analyze first project claim
    const firstProject = resume.projects?.[0];
    if (firstProject) {
      const projMsgs = candidateAnswers.filter((c) => {
        const q = interview.questionList.find((item) => item.id === c.questionId);
        return q?.isProjectDeepDive;
      });
      const avgProjScore = projMsgs.length > 0
        ? projMsgs.reduce((a, b) => a + (b.evaluation?.score || 60), 0) / projMsgs.length
        : 75;

      realityCheck.push({
        resumeClaim: `Built "${firstProject.title}" with ${(firstProject.technologies || []).slice(0, 3).join(', ')}`,
        interviewObservation: avgProjScore >= 75
          ? `Demonstrated solid architectural recall, explained technology choices, and clearly articulated system workflows.`
          : `Candidate understands the high-level purpose of "${firstProject.title}" but showed hesitation when explaining granular backend data flow and edge-case handling.`,
        assessment: avgProjScore >= 80 ? 'strongly demonstrated' : avgProjScore >= 60 ? 'partially demonstrated' : 'needs practice',
        recommendation: `Be prepared to draw and step through the data pipeline of ${firstProject.title} end-to-end, including database constraints and failure recovery.`,
      });
    }

    // Analyze key technical skill claim
    const topSkill = resume.skills?.all?.[0] || 'Modern Web Stack';
    const topSkillMsgs = candidateAnswers.filter((c) =>
      c.text.toLowerCase().includes(topSkill.toLowerCase())
    );
    realityCheck.push({
      resumeClaim: `Proficiency in ${topSkill}`,
      interviewObservation: evaluations.some((e) => (e?.score || 0) < 65)
        ? `Candidate demonstrates working familiarity with ${topSkill} fundamentals, but struggled with performance tuning and production trade-offs.`
        : `Candidate effectively articulated core mechanisms of ${topSkill} and how it solves real-world engineering constraints.`,
      assessment: evaluations.some((e) => (e?.score || 0) < 65) ? 'partially demonstrated' : 'strongly demonstrated',
      recommendation: `Deepen grasp of ${topSkill} internal execution lifecycle and optimization techniques.`,
    });

    const report: IFinalReport = {
      overallScore: avgScore,
      categories: {
        technicalKnowledge,
        projectUnderstanding,
        problemSolving,
        communication,
        conceptClarity,
        resumeKnowledge,
        answerRelevance,
      },
      summary: `Candidate demonstrated ${avgScore >= 80 ? 'strong' : avgScore >= 65 ? 'competent' : 'developing'} preparation across core software engineering competencies. Best performance observed in project narrative, with concrete room for growth in production edge-cases and deeper systems fundamentals.`,
      strengths: [
        'Clear, structured communication when introducing project background and team contributions.',
        'Good grasp of primary language and framework fundamentals.',
        'Demonstrates genuine ownership of stated portfolio projects.',
      ],
      weaknesses: [
        `Could provide deeper quantification of performance trade-offs in ${weakTopicsList[0] || 'system design'}.`,
        'Tendency to keep answers at an introductory level unless prompted for deeper architectural specifics.',
      ],
      weakTopics: weakTopicsList,
      realityCheck,
      disclaimer:
        'This evaluation is an AI-generated practice assessment designed to guide career preparation. It does not represent an objective hiring decision or guarantee employment outcomes.',
    };

    return report;
  }
}

export const reportGenerator = new ReportGeneratorService();
