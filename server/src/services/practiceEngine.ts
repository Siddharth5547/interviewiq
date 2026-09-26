import { IPracticeSession, PracticeSessionModel } from '../models/PracticeSession.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';
import { aiProvider } from './aiProvider.js';

export interface PracticeQuestion {
  id: string;
  question: string;
  difficulty: string;
  expectedConcepts: string[];
}

export class PracticeEngineService {
  /**
   * Generates targeted practice drill for a weak topic
   */
  public async generateDrill(topic: string, targetSkill: string): Promise<PracticeQuestion[]> {
    const systemPrompt = `You are a Technical Interview Practice Coach.
The candidate struggled with the topic "${topic}" (Skill: "${targetSkill || topic}").
Generate exactly 3 focused, progressive practice interview questions targeting this exact concept.
Question 1: Core mechanical fundamentals.
Question 2: Real-world engineering scenario / trade-offs.
Question 3: Edge cases, performance optimization, or failure recovery.

Return output strictly as a JSON array matching:
[
  {
    "id": "drill-1",
    "question": "Question text",
    "difficulty": "beginner | intermediate | advanced",
    "expectedConcepts": ["concept1", "concept2"]
  }
]`;

    const userPrompt = `Target Topic: ${topic}\nSkill: ${targetSkill}`;

    return await aiProvider.generateJSON<PracticeQuestion[]>(
      {
        systemPrompt,
        userPrompt,
        temperature: 0.3,
      },
      () => this.deterministicDrillQuestions(topic, targetSkill)
    );
  }

  public deterministicDrillQuestions(topic: string, targetSkill: string): PracticeQuestion[] {
    const term = targetSkill || topic || 'Key Engineering Concept';
    return [
      {
        id: 'drill-1',
        question: `How does ${term} work under the hood, and what core problem does it solve in a production backend or frontend application?`,
        difficulty: 'beginner',
        expectedConcepts: ['Fundamental mechanics', 'Lifecycle / execution context', 'Core benefit'],
      },
      {
        id: 'drill-2',
        question: `Walk me through a real-world scenario where you had to debug or optimize ${term}. What tools and metrics did you monitor to verify the fix?`,
        difficulty: 'intermediate',
        expectedConcepts: ['Diagnostic approach', 'Profiling / logs / metrics', 'Measurable outcome'],
      },
      {
        id: 'drill-3',
        question: `What are the primary performance bottlenecks, security risks, or scalability limitations associated with ${term} when handling high concurrency?`,
        difficulty: 'advanced',
        expectedConcepts: ['Concurrency handling', 'Security boundaries', 'Scalability mitigation'],
      },
    ];
  }

  /**
   * Evaluates candidate's practice response with constructive feedback
   */
  public async evaluatePracticeAnswer(
    question: string,
    expectedConcepts: string[],
    candidateAnswer: string
  ): Promise<{
    score: number;
    feedback: string;
    whatWasGood: string;
    whatWasMissing: string;
    strongerExample: string;
  }> {
    const sanitized = aiProvider.sanitizeInput(candidateAnswer);

    const systemPrompt = `You are an expert Technical Practice Coach.
Evaluate this practice response to: "${question}"
Expected Concepts: ${expectedConcepts.join(', ')}

Return JSON:
{
  "score": 0 to 100,
  "feedback": "Encouraging, constructive feedback",
  "whatWasGood": "What the candidate nailed",
  "whatWasMissing": "What to add for full points",
  "strongerExample": "Exemplary production-grade answer"
}`;

    const userPrompt = `Candidate Answer: "${sanitized}"`;

    return await aiProvider.generateJSON(
      {
        systemPrompt,
        userPrompt,
        temperature: 0.2,
      },
      () => {
        const words = sanitized.split(/\s+/).filter(Boolean);
        const covered = expectedConcepts.filter((c) => sanitized.toLowerCase().includes(c.toLowerCase()));
        const score = words.length < 10 ? 40 : covered.length > 0 ? 85 : 70;
        return {
          score,
          feedback: score >= 80 ? 'Solid grasp of core mechanisms!' : 'Good starting point; try adding more concrete implementation steps.',
          whatWasGood: covered.length > 0 ? `Covered ${covered.join(', ')}.` : 'Addressed the question clearly.',
          whatWasMissing: `Focus on: ${expectedConcepts.filter((c) => !covered.includes(c)).join(', ') || 'production trade-offs'}.`,
          strongerExample: `In production, we define explicit boundaries for this, verify via unit tests, and instrument latency histograms to catch regressions.`,
        };
      }
    );
  }
}

export const practiceEngine = new PracticeEngineService();
