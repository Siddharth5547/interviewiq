import mongoose, { Schema, Document } from 'mongoose';

export interface IPracticeSession extends Document {
  userId: string;
  topic: string;
  targetSkill: string;
  questions: Array<{
    id: string;
    question: string;
    difficulty: string;
    expectedConcepts: string[];
  }>;
  answers: Array<{
    questionId: string;
    question: string;
    candidateAnswer: string;
    score: number;
    feedback: string;
    whatWasGood: string;
    whatWasMissing: string;
    strongerExample: string;
  }>;
  overallScore: number;
  improvementNotes: string[];
  status: 'active' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

const PracticeSessionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    targetSkill: { type: String, default: '' },
    questions: [
      {
        id: String,
        question: String,
        difficulty: String,
        expectedConcepts: [String],
      },
    ],
    answers: [
      {
        questionId: String,
        question: String,
        candidateAnswer: String,
        score: Number,
        feedback: String,
        whatWasGood: String,
        whatWasMissing: String,
        strongerExample: String,
      },
    ],
    overallScore: { type: Number, default: 0 },
    improvementNotes: [String],
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    completedAt: Date,
  },
  { timestamps: true }
);

export const PracticeSessionModel =
  mongoose.models.PracticeSession || mongoose.model<IPracticeSession>('PracticeSession', PracticeSessionSchema);
