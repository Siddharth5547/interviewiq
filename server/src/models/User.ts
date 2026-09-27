import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  fullName: string;
  targetRole?: string;
  authProvider: 'local' | 'google' | 'apple';
  googleId?: string;
  appleId?: string;
  avatarUrl?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: false },
    fullName: { type: String, required: true, trim: true },
    targetRole: { type: String, default: 'Software Engineer' },
    authProvider: { type: String, enum: ['local', 'google', 'apple'], default: 'local' },
    googleId: { type: String, sparse: true },
    appleId: { type: String, sparse: true },
    avatarUrl: { type: String },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

