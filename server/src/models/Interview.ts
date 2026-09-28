import mongoose, { Schema, Document } from 'mongoose';

export type AnswerClassification =
  | 'Correct'
  | 'Mostly correct'
  | 'Partially correct'
  | 'Incorrect'
  | 'Too vague'
  | 'Off-topic'
  | 'Doesn\'t know';

export interface IQuestionItem {
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

export interface IAnswerEvaluation {
  classification: AnswerClassification;
  score: number; // 0 - 100
  feedback: string;
  whatWasGood: string;
  whatWasMissing: string;
  suggestedImprovement: string;
  strongerExample: string;
  testedConceptsCovered: string[];
  testedConceptsMissed: string[];
  difficultyAdjustment: 'increase' | 'maintain' | 'decrease' | 'advanced';
}

export interface IConversationMessage {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  spokenText?: string;
  timestamp: Date;
  questionId?: string;
  evaluation?: IAnswerEvaluation;
}

export type RealityCheckAssessment =
  | 'strongly demonstrated'
  | 'partially demonstrated'
  | 'needs practice'
  | 'not demonstrated in this interview'
  | 'demonstrated'
  | 'partial'
  | 'gap';

export interface IRealityCheckItem {
  resumeClaim: string;
  interviewObservation: string;
  assessment: RealityCheckAssessment;
  recommendation: string;
}

export interface IFinalReport {
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
  realityCheck: IRealityCheckItem[];
  disclaimer: string;
}

export interface IInterview extends Document {
  userId: string;
  resumeId: string;
  jobDescriptionId?: string;
  type: string;
  difficulty: string;
  durationMinutes: number;
  mode: 'Text' | 'Voice';
  personalityMode?: 'Professional' | 'Friendly' | 'Technical' | 'Strict' | 'HR';
  status: 'in_progress' | 'completed' | 'abandoned';
  state: string;
  questionList: IQuestionItem[];
  currentQuestionIndex: number;
  conversation: IConversationMessage[];
  antiRepetition: {
    askedQuestions: string[];
    coveredTopics: string[];
    testedConcepts: string[];
  };
  finalReport?: IFinalReport;
  startedAt: Date;
  completedAt?: Date;
}

const InterviewSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    resumeId: { type: String, required: true },
    jobDescriptionId: { type: String, default: null },
    type: { type: String, default: 'Technical Interview' },
    difficulty: { type: String, default: 'Intermediate' },
    durationMinutes: { type: Number, default: 20 },
    mode: { type: String, enum: ['Text', 'Voice'], default: 'Text' },
    personalityMode: {
      type: String,
      enum: ['Professional', 'Friendly', 'Technical', 'Strict', 'HR'],
      default: 'Professional',
    },
    status: { type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' },
    state: { type: String, default: 'INTERVIEW_START' },
    questionList: [
      {
        id: String,
        question: String,
        topic: String,
        difficulty: String,
        reason: String,
        expectedConcepts: [String],
        followUpType: String,
        isProjectDeepDive: Boolean,
        relatedProject: String,
      },
    ],
    currentQuestionIndex: { type: Number, default: 0 },
    conversation: [
      {
        id: String,
        sender: String,
        text: String,
        timestamp: { type: Date, default: Date.now },
        questionId: String,
        evaluation: {
          classification: String,
          score: Number,
          feedback: String,
          whatWasGood: String,
          whatWasMissing: String,
          suggestedImprovement: String,
          strongerExample: String,
          testedConceptsCovered: [String],
          testedConceptsMissed: [String],
          difficultyAdjustment: String,
        },
      },
    ],
    antiRepetition: {
      askedQuestions: [String],
      coveredTopics: [String],
      testedConcepts: [String],
    },
    finalReport: {
      overallScore: Number,
      categories: {
        technicalKnowledge: Number,
        projectUnderstanding: Number,
        problemSolving: Number,
        communication: Number,
        conceptClarity: Number,
        resumeKnowledge: Number,
        answerRelevance: Number,
      },
      summary: String,
      strengths: [String],
      weaknesses: [String],
      weakTopics: [String],
      realityCheck: [
        {
          resumeClaim: String,
          interviewObservation: String,
          assessment: String,
          recommendation: String,
        },
      ],
      disclaimer: {
        type: String,
        default:
          'This evaluation is an AI-generated practice assessment designed to guide career preparation. It does not represent an objective hiring decision or guarantee employment outcomes.',
      },
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

InterviewSchema.index({ userId: 1, createdAt: -1 });
InterviewSchema.index({ userId: 1, status: 1 });

export const InterviewModel =
  mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);

