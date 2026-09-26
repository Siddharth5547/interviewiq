import mongoose, { Schema, Document } from 'mongoose';

export interface IOpportunity extends Document {
  externalId: string;
  source: string;
  company: string;
  title: string;
  description: string;
  location: string;
  employmentType: 'Full-time' | 'Internship' | 'Contract' | 'Part-time';
  remoteType: 'Remote' | 'Hybrid' | 'On-site';
  salary?: string;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  deadline?: string;
  applicationUrl: string;
  discoveredAt: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema: Schema = new Schema(
  {
    externalId: { type: String, required: true, unique: true, index: true },
    source: { type: String, required: true, default: 'Official Career Portal' },
    company: { type: String, required: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    location: { type: String, default: 'Remote / Global' },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Contract', 'Part-time'],
      default: 'Full-time',
    },
    remoteType: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Remote',
    },
    salary: { type: String },
    skills: [{ type: String }],
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    deadline: { type: String },
    applicationUrl: { type: String, required: true },
    discoveredAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

OpportunitySchema.index({ company: 1, title: 1 });
OpportunitySchema.index({ skills: 1 });

export const OpportunityModel =
  mongoose.models.Opportunity || mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
