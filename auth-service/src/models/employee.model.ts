import { Schema, model, type Types } from 'mongoose';

export interface IEmployee {
  _id: Types.ObjectId;

  // Identity
  employeeCode: string; // Auto-gen, VD: "NV0001" — unique, index
  fullName: string;
  username: string; // unique, lowercase — dùng để đăng nhập
  email?: string; // optional — dùng cho forgot-password nếu có khai báo
  phone?: string;
  avatar?: string;

  // Authentication
  password: string; // select: false — bcrypt hash

  // Authorization
  role: 'admin' | 'cashier';

  // Employment
  employmentStatus: 'active' | 'resigned'; // default: 'active'
  startDate?: Date;
  baseSalary?: number; // placeholder cho module Bảng lương sau này

  // Security
  refreshTokenVersion: number; // default: 0
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employeeCode: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: { type: String, sparse: true, lowercase: true, trim: true },
    phone: { type: String },
    avatar: { type: String },

    password: { type: String, required: true, select: false },

    role: { type: String, enum: ['admin', 'cashier'], required: true },

    employmentStatus: {
      type: String,
      enum: ['active', 'resigned'],
      default: 'active',
    },
    startDate: { type: Date },
    baseSalary: { type: Number },

    refreshTokenVersion: { type: Number, default: 0 },
    resetPasswordTokenHash: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

export const EmployeeModel = model<IEmployee>('Employee', employeeSchema);
