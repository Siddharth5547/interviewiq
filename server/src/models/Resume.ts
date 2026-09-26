import mongoose, { Schema, Document } from 'mongoose';

export interface IParsedResume {
  name: string;
  contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    location?: string;
  };
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear?: string;
    endYear?: string;
    gpa?: string;
  }>;
  skills: {
    programmingLanguages: string[];
    frameworks: string[];
    libraries: string[];
    databases: string[];
    tools: string[];
    all: string[];
  };
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    highlights: string[];
    link?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
    highlights: string[];
  }>;
  internships?: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
    highlights: string[];
  }>;
  certifications: string[];
  achievements: string[];
}

export interface IResume extends Document {
  userId: string;
  filename: string;
  fileType: string;
  rawText: string;
  parsedData: IParsedResume;
  intelligenceTags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    fileType: { type: String, default: 'pdf' },
    rawText: { type: String, required: true },
    parsedData: {
      name: { type: String, default: '' },
      contact: {
        email: String,
        phone: String,
        linkedin: String,
        github: String,
        location: String,
      },
      summary: { type: String, default: '' },
      education: [
        {
          institution: String,
          degree: String,
          field: String,
          startYear: String,
          endYear: String,
          gpa: String,
        },
      ],
      skills: {
        programmingLanguages: [String],
        frameworks: [String],
        libraries: [String],
        databases: [String],
        tools: [String],
        all: [String],
      },
      projects: [
        {
          title: String,
          description: String,
          technologies: [String],
          highlights: [String],
          link: String,
        },
      ],
      experience: [
        {
          company: String,
          role: String,
          duration: String,
          description: String,
          highlights: [String],
        },
      ],
      internships: [
        {
          company: String,
          role: String,
          duration: String,
          description: String,
          highlights: [String],
        },
      ],
      certifications: [String],
      achievements: [String],
    },
    intelligenceTags: [String],
  },
  { timestamps: true }
);

export const ResumeModel = mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
