import mongoose, { Schema, Document } from 'mongoose';

export type ApplicationStatus =
  | 'Saved'
  | 'Interested'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface IApplication extends Document {
  userId: string;
  opportunityId?: string;
  company: string;
  role: string;
  employmentType: 'Full-time' | 'Internship' | 'Contract' | 'Part-time';
  appliedAt: Date;
  status: ApplicationStatus;
  resumeVersionId?: string;
  applicationUrl: string;
  source: string;
  notes: string;
  nextAction?: string;
  interviewDate?: Date;
  salary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    opportunityId: { type: String, default: null, index: true },
    company: { type: String, required: true, index: true },
    role: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Contract', 'Part-time'],
      default: 'Full-time',
    },
    appliedAt: { type: Date, default: Date.now, index: true },
    status: {
      type: String,
      enum: [
        'Saved',
        'Interested',
        'Applied',
        'Assessment',
        'Interview',
        'Offer',
        'Rejected',
        'Withdrawn',
      ],
      default: 'Saved',
      index: true,
    },
    resumeVersionId: { type: String, default: null },
    applicationUrl: { type: String, default: '' },
    source: { type: String, default: 'Direct Application' },
    notes: { type: String, default: '' },
    nextAction: { type: String, default: '' },
    interviewDate: { type: Date },
    salary: { type: String },
  },
  { timestamps: true }
);

ApplicationSchema.index({ userId: 1, status: 1 });
ApplicationSchema.index({ userId: 1, company: 1 });

export const ApplicationModel =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
