import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryScore {
  name: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'critical';
  details: string;
}

export interface IATSAnalysis extends Document {
  userId: string;
  resumeId: string;
  jobDescriptionId: string;
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
  createdAt: Date;
}

const ATSAnalysisSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    resumeId: { type: String, required: true, index: true },
    jobDescriptionId: { type: String, required: true, index: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    label: { type: String, default: 'Estimated ATS Compatibility' },
    categoryScores: [
      {
        name: String,
        score: Number,
        maxScore: Number,
        status: String,
        details: String,
      },
    ],
    matchingKeywords: [String],
    missingKeywords: [String],
    matchingSkills: [String],
    missingSkills: [String],
    partiallyMatchedSkills: [
      {
        skill: String,
        relatedFound: String,
      },
    ],
    relevantExperience: [String],
    missingSections: [String],
    formattingIssues: [String],
    actionableSuggestions: [
      {
        category: String,
        issue: String,
        suggestion: String,
        impact: String,
      },
    ],
    disclaimer: {
      type: String,
      default:
        'Estimated ATS Compatibility score is an algorithmic approximation for career preparation and practice purposes. It does not guarantee passing an employer’s applicant tracking system.',
    },
  },
  { timestamps: true }
);

ATSAnalysisSchema.index({ userId: 1, createdAt: -1 });
ATSAnalysisSchema.index({ resumeId: 1, jobDescriptionId: 1 });

export const ATSAnalysisModel =
  mongoose.models.ATSAnalysis || mongoose.model<IATSAnalysis>('ATSAnalysis', ATSAnalysisSchema);

