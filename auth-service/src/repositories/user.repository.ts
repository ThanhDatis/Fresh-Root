import type { HydratedDocument, Types } from 'mongoose';

import { UserModel, type IUser } from '../models/user.model';

export type UserDocument = HydratedDocument<IUser>;

async function findByEmail(
  email: string,
  withPassword = false,
): Promise<UserDocument | null> {
  const query = UserModel.findOne({ email: email.toLowerCase() });
  return withPassword ? query.select('+password') : query;
}

async function findById(
  id: string | Types.ObjectId,
  withPassword = false,
): Promise<UserDocument | null> {
  const query = UserModel.findById(id);
  return withPassword ? query.select('+password') : query;
}

async function findByGoogleId(googleId: string): Promise<UserDocument | null> {
  return UserModel.findOne({ googleId });
}

async function create(data: Partial<IUser>): Promise<UserDocument> {
  return UserModel.create(data);
}

async function updateById(
  id: string | Types.ObjectId,
  update: Partial<IUser>,
): Promise<UserDocument | null> {
  return UserModel.findByIdAndUpdate(id, update, { new: true });
}

async function incrementRefreshTokenVersion(
  id: string | Types.ObjectId,
): Promise<void> {
  await UserModel.updateOne({ _id: id }, { $inc: { refreshTokenVersion: 1 } });
}

async function clearResetPasswordToken(
  id: string | Types.ObjectId,
): Promise<void> {
  await UserModel.updateOne(
    { _id: id },
    { $unset: { resetPasswordTokenHash: '', resetPasswordExpires: '' } },
  );
}

export const userRepository = {
  findByEmail,
  findById,
  findByGoogleId,
  create,
  updateById,
  incrementRefreshTokenVersion,
  clearResetPasswordToken,
};
