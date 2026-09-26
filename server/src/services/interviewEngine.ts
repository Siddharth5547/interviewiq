import { IParsedResume } from '../models/Resume.js';
import { IParsedJobDescription } from './jobAnalyzer.js';
import { IQuestionItem, IAnswerEvaluation, AnswerClassification, IInterview } from '../models/Interview.js';
import { aiProvider } from './aiProvider.js';

export class InterviewEngineService {
  /**
   * Generates the initial interview plan and question pipeline based on resume & job
   */
  public async generateInterviewPlan(
    resume: IParsedResume,
    job?: IParsedJobDescription,
    interviewType = 'Technical Interview',
    difficulty = 'Intermediate',
    durationMinutes = 20
  ): Promise<IQuestionItem[]> {
    const candidateSkills = (resume.skills?.all || []).slice(0, 8);
    const candidateProjects = (resume.projects || []).slice(0, 3);
    const targetTitle = job?.title || 'Software Engineer';

    const systemPrompt = `You are a Senior Technical Staff Interviewer conducting a realistic, rigorous ${interviewType} for a ${targetTitle} candidate.
Difficulty Level: ${difficulty}. Duration: ${durationMinutes} minutes.
Generate a structured pipeline of 5 to 7 high-impact interview questions tailored to the candidate's actual resume.
Rules:
- NEVER ask generic chatbot trivia like "What is programming?".
- Anchor questions in the candidate's explicit projects and stated stack.
- Include dedicated Project Deep-Dive questions (architecture, trade-offs, bugs, auth, scalability).
- Output valid JSON array according to this schema:
[
  {
    "id": "q1",
    "question": "Full professional interviewer question text",
    "topic": "Core topic name (e.g. React Architecture, REST API Security)",
    "difficulty": "beginner" | "intermediate" | "advanced",
    "reason": "Why this question tests their resume claims",
    "expectedConcepts": ["concept1", "concept2"],
    "followUpType": "deeper" | "clarification" | "new_topic",
    "isProjectDeepDive": true | false,
    "relatedProject": "Project title if applicable"
  }
]`;

    const userPrompt = `Candidate Profile:
- Skills: ${candidateSkills.join(', ')}
- Projects: ${candidateProjects.map((p) => `${p.title}: ${p.description} (Tech: ${p.technologies?.join(', ')})`).join(' | ')}
- Target Role: ${targetTitle}
${job ? `- Target Requirements: ${(job.requiredSkills || []).join(', ')}` : ''}`;

    return await aiProvider.generateJSON<IQuestionItem[]>(
      {
        systemPrompt,
        userPrompt,
        temperature: 0.3,
      },
      () => this.deterministicQuestionPlanner(resume, job, interviewType, difficulty)
    );
  }

  /**
   * Deterministic question generator when external AI is unavailable
   */
  public deterministicQuestionPlanner(
    resume: IParsedResume,
    job?: IParsedJobDescription,
    interviewType = 'Technical Interview',
    difficulty = 'Intermediate'
  ): IQuestionItem[] {
    const questions: IQuestionItem[] = [];
    const primaryProject = resume.projects?.[0] || {
      title: 'Full Stack Application',
      description: 'Web application with React, Node.js and MongoDB.',
      technologies: ['React', 'Node.js', 'MongoDB'],
    };
    const skills = resume.skills?.all || ['JavaScript', 'React', 'Node.js'];
    const diff = difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';

    // 1. Icebreaker / Architecture overview grounded in their top project
    questions.push({
      id: 'q1',
      question: `I see from your resume that you built "${primaryProject.title}". Could you walk me through the high-level architecture of this application, why you selected ${(primaryProject.technologies || []).slice(0, 2).join(' and ')}, and what core problem it solves?`,
      topic: 'System Architecture & Tech Selection',
      difficulty: diff,
      reason: 'Validates candidate ownership, architecture awareness, and rationale for technology choices.',
      expectedConcepts: ['Component hierarchy', 'Client-server communication', 'Database schema rationale', 'Problem definition'],
      followUpType: 'deeper',
      isProjectDeepDive: true,
      relatedProject: primaryProject.title,
    });

    // 2. Technical implementation & API design
    const backendTech = skills.find((s) => /node|express|python|django|fastapi|java|spring/i.test(s)) || 'Node.js';
    questions.push({
      id: 'q2',
      question: `In your backend implementation with ${backendTech}, how did you design your API endpoints and handle authentication and state management across user sessions?`,
      topic: 'API Design & Authentication',
      difficulty: diff,
      reason: 'Evaluates backend fundamentals, security practices, and RESTful contract design.',
      expectedConcepts: ['REST principles', 'JWT / Token-based auth', 'Middleware error handling', 'Stateless sessions'],
      followUpType: 'deeper',
      isProjectDeepDive: true,
      relatedProject: primaryProject.title,
    });

    // 3. Database & Performance / Concurrency
    const dbTech = skills.find((s) => /mongo|postgres|sql|redis/i.test(s)) || 'MongoDB';
    questions.push({
      id: 'q3',
      question: `You worked with ${dbTech}. Can you explain how you structured your data models, and what measures you took or would take to optimize queries when the dataset grows to millions of records?`,
      topic: 'Database Optimization & Indexing',
      difficulty: diff,
      reason: 'Assesses database scaling, indexing strategies, and schema trade-offs.',
      expectedConcepts: ['Indexing (B-Tree/Compound)', 'Query execution plan (explain)', 'Normalization vs Denormalization', 'Caching'],
      followUpType: 'deeper',
    });

    // 4. Debugging & Challenge (STAR format)
    questions.push({
      id: 'q4',
      question: `Tell me about the most difficult technical bug or edge case you encountered while developing "${primaryProject.title}". How did you isolate the root cause, and how did you resolve it?`,
      topic: 'Troubleshooting & Problem Solving',
      difficulty: diff,
      reason: 'Probes real-world problem solving methodology and resilience.',
      expectedConcepts: ['Root-cause analysis', 'Systematic logging/debugging', 'Preventative testing', 'Post-mortem understanding'],
      followUpType: 'clarification',
      isProjectDeepDive: true,
      relatedProject: primaryProject.title,
    });

    // 5. Job-specific or Frontend State Deep Dive
    const feTech = skills.find((s) => /react|vue|next|angular/i.test(s)) || 'React';
    questions.push({
      id: 'q5',
      question: `Working with ${feTech}, how do you prevent unnecessary component re-renders, and how do you manage asynchronous side effects and loading/error states in production?`,
      topic: 'Frontend Performance & State Management',
      difficulty: diff,
      reason: 'Validates frontend depth and optimization techniques beyond basic UI markup.',
      expectedConcepts: ['Memoization (useMemo/useCallback/React.memo)', 'Lifecycle/useEffect dependencies', 'State isolation', 'Optimistic UI'],
      followUpType: 'new_topic',
    });

    // 6. Production Readiness & Security
    questions.push({
      id: 'q6',
      question: `Before deploying code to a production environment, what security vulnerabilities (such as injection, XSS, or CORS misconfigurations) do you safeguard against, and how do you ensure code reliability?`,
      topic: 'Security & Production Readiness',
      difficulty: diff,
      reason: 'Tests security posture, defensive programming, and deployment readiness.',
      expectedConcepts: ['Input sanitization', 'CORS / CSP policies', 'Automated testing (unit/integration)', 'Environment secrets management'],
      followUpType: 'new_topic',
    });

    return questions;
  }

  /**
   * Evaluates candidate answer dynamically, classifies correctness, and adapts difficulty
   */
  public async evaluateAnswer(
    question: IQuestionItem,
    candidateAnswer: string,
    resume: IParsedResume,
    interviewState: IInterview
  ): Promise<IAnswerEvaluation> {
    const sanitizedAnswer = aiProvider.sanitizeInput(candidateAnswer);

    const systemPrompt = `You are a Principal Engineering Interviewer evaluating a candidate's live response.
Question: "${question.question}"
Topic: "${question.topic}"
Expected Concepts: ${question.expectedConcepts.join(', ')}

Analyze the candidate's answer and return a structured JSON response matching this schema:
{
  "classification": "Correct" | "Mostly correct" | "Partially correct" | "Incorrect" | "Too vague" | "Off-topic" | "Doesn't know",
  "score": 0 to 100,
  "feedback": "Concise, professional assessment of their answer",
  "whatWasGood": "Specific strong points in what they demonstrated",
  "whatWasMissing": "Key concepts or architectural depth that was absent",
  "suggestedImprovement": "How the candidate can communicate this answer with higher technical impact",
  "strongerExample": "A high-scoring answer grounded in candidate's actual resume",
  "testedConceptsCovered": ["concept1"],
  "testedConceptsMissed": ["concept2"],
  "difficultyAdjustment": "increase" | "maintain" | "decrease" | "advanced"
}
Rules:
- If candidate says "I don't know", classify as "Doesn't know" with constructive fundamentals advice.
- If answer is short or evasive, classify as "Too vague".
- Keep feedback encouraging, professional, and objective.`;

    const userPrompt = `Candidate Answer:\n"${sanitizedAnswer}"`;

    return await aiProvider.generateJSON<IAnswerEvaluation>(
      {
        systemPrompt,
        userPrompt,
        temperature: 0.2,
      },
      () => this.deterministicAnswerEvaluator(question, sanitizedAnswer, resume)
    );
  }

  public deterministicAnswerEvaluator(
    question: IQuestionItem,
    answer: string,
    resume: IParsedResume
  ): IAnswerEvaluation {
    const text = answer.trim().toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);

    // Classification heuristics
    let classification: AnswerClassification = 'Partially correct';
    let score = 65;
    let difficultyAdjustment: 'increase' | 'maintain' | 'decrease' | 'advanced' = 'maintain';

    if (words.length < 5 || /don't know|not sure|no idea|skip/i.test(text)) {
      classification = "Doesn't know";
      score = 25;
      difficultyAdjustment = 'decrease';
    } else if (words.length < 15) {
      classification = 'Too vague';
      score = 48;
      difficultyAdjustment = 'decrease';
    } else {
      // Concept coverage check
      const covered: string[] = [];
      const missed: string[] = [];

      for (const concept of question.expectedConcepts) {
        const cTerms = concept.toLowerCase().split(/[\s\(\)\/]+/).filter((w) => w.length > 2);
        if (cTerms.some((t) => text.includes(t))) {
          covered.push(concept);
        } else {
          missed.push(concept);
        }
      }

      const coverageRatio = question.expectedConcepts.length > 0 ? covered.length / question.expectedConcepts.length : 0.5;

      if (coverageRatio >= 0.75 && words.length >= 35) {
        classification = 'Correct';
        score = 92;
        difficultyAdjustment = 'increase';
      } else if (coverageRatio >= 0.5) {
        classification = 'Mostly correct';
        score = 80;
        difficultyAdjustment = 'maintain';
      } else if (coverageRatio >= 0.25) {
        classification = 'Partially correct';
        score = 64;
        difficultyAdjustment = 'maintain';
      } else {
        classification = 'Incorrect';
        score = 42;
        difficultyAdjustment = 'decrease';
      }

      return {
        classification,
        score,
        feedback: `Candidate demonstrated ${covered.length > 0 ? 'good awareness of ' + covered.join(', ') : 'basic familiarity'} with the topic, but lacked depth in ${missed.slice(0, 2).join(' and ') || 'systematic edge cases'}.`,
        whatWasGood: covered.length > 0 ? `Explicitly addressed ${covered.join(', ')}.` : 'Articulated general workflow steps clearly.',
        whatWasMissing: missed.length > 0 ? `Missed critical aspects: ${missed.join(', ')}.` : 'Could elaborate more on production trade-offs.',
        suggestedImprovement: 'Structure your response using the Rule of Three: state the architectural pattern, provide the concrete implementation example, and finish with the trade-off or metric.',
        strongerExample: `In ${question.relatedProject || 'my project'}, we addressed this by decoupling state updates, applying indexing to hot query paths, and verifying with synthetic load tests.`,
        testedConceptsCovered: covered,
        testedConceptsMissed: missed,
        difficultyAdjustment,
      };
    }

    return {
      classification,
      score,
      feedback: 'Response was too brief to demonstrate deep conceptual understanding.',
      whatWasGood: 'Acknowledged the question directly.',
      whatWasMissing: `Candidate did not cover key concepts: ${question.expectedConcepts.join(', ')}.`,
      suggestedImprovement: 'Take 5-10 seconds to formulate thoughts, then state definitions, steps, and concrete tools you have used.',
      strongerExample: `A structured response should define the core mechanism, how it integrates with ${resume.skills?.all?.[0] || 'the stack'}, and how you debug errors in runtime.`,
      testedConceptsCovered: [],
      testedConceptsMissed: question.expectedConcepts,
      difficultyAdjustment,
    };
  }

  /**
   * Generates dynamic adaptive follow-up question based on candidate's answer
   */
  public async generateAdaptiveFollowUp(
    currentQuestion: IQuestionItem,
    evaluation: IAnswerEvaluation,
    antiRepetition: { askedQuestions: string[]; coveredTopics: string[] }
  ): Promise<IQuestionItem | null> {
    // If answer was strong, ask deeper/advanced follow-up
    if (evaluation.difficultyAdjustment === 'increase' || evaluation.classification === 'Correct') {
      return {
        id: `fu-${Date.now()}`,
        question: `Building on your point regarding ${evaluation.testedConceptsCovered[0] || currentQuestion.topic}, how would you scale that approach if traffic increased by 100x and latency SLAs dropped to sub-50ms?`,
        topic: `${currentQuestion.topic} (High Scale)`,
        difficulty: 'advanced',
        reason: 'Candidate exhibited strong fundamentals; testing high-scale production readiness.',
        expectedConcepts: ['Caching / Redis', 'Horizontal scaling / Load balancing', 'Asynchronous processing / Queues', 'Database read replicas'],
        followUpType: 'deeper',
      };
    }

    // If answer was weak or vague, ask a clarifying fundamentals question
    if (evaluation.difficultyAdjustment === 'decrease' || evaluation.classification === 'Too vague' || evaluation.classification === "Doesn't know") {
      const missedConcept = evaluation.testedConceptsMissed[0] || 'the fundamental workflow';
      return {
        id: `fu-${Date.now()}`,
        question: `Let's break that down into basics. Could you explain the foundational concept of ${missedConcept} and how you would verify it works in a local development environment?`,
        topic: `${currentQuestion.topic} (Fundamentals)`,
        difficulty: 'beginner',
        reason: 'Candidate struggled with the high-level question; providing a chance to demonstrate core mechanics.',
        expectedConcepts: ['Basic definition', 'Local testing / verification', 'Common error case'],
        followUpType: 'clarification',
      };
    }

    return null; // Move to next scheduled question in pipeline
  }

  /**
   * Generates a natural spoken dialogue line separating AI reasoning from conversational speech
   */
  public generateConversationalSpokenLine(
    questionText: string,
    evaluation?: IAnswerEvaluation,
    personalityMode: string = 'Professional'
  ): string {
    if (!evaluation) {
      return questionText;
    }

    const { classification } = evaluation;

    // Acknowledgements according to personality mode
    const friendlyPrefixes = {
      strong: ["That's a fantastic breakdown!", "Nice explanation, that makes a lot of sense.", "Great insights there!"],
      average: ["Got it, thank you for walking through that.", "Understood! That's a good perspective.", "Okay, I see your line of reasoning."],
      weak: ["No worries, let's take a closer look.", "Fair enough, let's explore that from another angle.", "That's a good attempt—let's break it down."],
      vague: ["Thanks for sharing, though could you help me unpack that a bit more?", "I see the direction, let's add some detail."],
    };

    const technicalPrefixes = {
      strong: ["Solid technical accuracy on that point.", "Good architectural rationale.", "Precise analysis."],
      average: ["Noted. The high-level pattern is clear.", "Understood on the primary workflow."],
      weak: ["Let's step back to the core mechanics.", "That overlooks a key constraint—let's review the fundamentals."],
      vague: ["That's somewhat high-level. Let's get specific on the implementation."],
    };

    const strictPrefixes = {
      strong: ["Fair. Let's see if that holds under higher scrutiny.", "Acceptable rationale."],
      average: ["Understood, though there are missing edge cases.", "Noted, but let's push for deeper rigor."],
      weak: ["That answer lacks the necessary depth.", "Let's test if you understand the underlying principles."],
      vague: ["That was too brief. I need concrete technical substance."],
    };

    const hrPrefixes = {
      strong: ["Thank you, that demonstrates great clarity and ownership!", "Appreciate that thoughtful explanation."],
      average: ["Thank you for sharing that context.", "Got it, that gives good background on your workflow."],
      weak: ["Thank you. It's completely fine if that wasn't your primary focus.", "Appreciate your honesty."],
      vague: ["Could you elaborate a bit more on your specific personal contribution?"],
    };

    const professionalPrefixes = {
      strong: ["Good explanation, that's well articulated.", "Understood, strong technical framing.", "Got it, that's clear."],
      average: ["Understood. Moving forward...", "Thank you for clarifying.", "Noted."],
      weak: ["Fair enough. Let's focus on the essentials.", "Let's look at the foundational concepts."],
      vague: ["Understood, though let's dive into more concrete specifics.", "Could you elaborate further on that?"],
    };

    let bank: Record<string, string[]> = professionalPrefixes;
    if (personalityMode === 'Friendly') bank = friendlyPrefixes;
    else if (personalityMode === 'Technical') bank = technicalPrefixes;
    else if (personalityMode === 'Strict') bank = strictPrefixes;
    else if (personalityMode === 'HR') bank = hrPrefixes;

    let chosenCategory = 'average';
    if (classification === 'Correct' || classification === 'Mostly correct') chosenCategory = 'strong';
    else if (classification === 'Too vague') chosenCategory = 'vague';
    else if (classification === 'Incorrect' || classification === "Doesn't know") chosenCategory = 'weak';

    const options = bank[chosenCategory] || professionalPrefixes.average;
    const randomPrefix = options[Math.floor(Math.random() * options.length)];

    return `${randomPrefix} ${questionText}`;
  }
}

export const interviewEngine = new InterviewEngineService();
