import { Schema, model, type Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;

  // Identity
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;

  // Authentication
  password?: string; // select: false — không có nếu authProvider = 'google'
  authProvider: 'local' | 'google';
  googleId?: string;

  // Authorization
  role: 'customer' | 'admin';

  // Account Status
  isActive: boolean;
  emailVerified: boolean;

  // Security
  refreshTokenVersion: number;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String },
    avatar: { type: String },

    password: { type: String, select: false },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: { type: String, unique: true, sparse: true },

    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },

    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },

    refreshTokenVersion: { type: Number, default: 0 },
    resetPasswordTokenHash: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

export const UserModel = model<IUser>('User', userSchema);
