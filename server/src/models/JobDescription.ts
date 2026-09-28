import mongoose, { Schema, Document } from 'mongoose';

export interface IJobDescription extends Document {
  userId: string;
  title: string;
  company: string;
  rawText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  experienceRequirements: string;
  techKeywords: string[];
  softSkills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobDescriptionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, default: 'Target Company', trim: true },
    rawText: { type: String, required: true },
    requiredSkills: [String],
    preferredSkills: [String],
    responsibilities: [String],
    qualifications: [String],
    experienceRequirements: { type: String, default: '' },
    techKeywords: [String],
    softSkills: [String],
  },
  { timestamps: true }
);

JobDescriptionSchema.index({ userId: 1, createdAt: -1 });

export const JobDescriptionModel =
  mongoose.models.JobDescription || mongoose.model<IJobDescription>('JobDescription', JobDescriptionSchema);

