import mongoose from 'mongoose';
import { z } from 'zod';
const { Schema } = mongoose;

export interface IUser {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
  bio?: string;
  urls?: { value: string }[];
  favourites?: string[];
  limit: number;
  lastLimitReset: Date;
  checkAndResetLimit(): Promise<boolean>;
  useLimit(): Promise<boolean>;
  getTimeUntilReset(): number;
}

export interface IImageUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  profileImage?: string;
}

const UserSchema = new Schema<IUser>({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImage: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  bio: { type: String, required: false },
  urls: { type: [{ value: String }], required: false },
  favourites: { type: [String], required: false },
  limit: { type: Number, default: 3 },
  lastLimitReset: { type: Date, default: Date.now },
});

UserSchema.methods.checkAndResetLimit = async function () {
  const now = new Date();
  const lastReset = this.lastLimitReset || new Date(0);
  const timeSinceReset = now.getTime() - lastReset;
  const dayInMilliseconds = 24 * 60 * 60 * 1000;

  if (timeSinceReset >= dayInMilliseconds) {
    this.limit = 3;
    this.lastLimitReset = now;
    await this.save();
    return true;
  }
  return false;
};

UserSchema.methods.useLimit = async function () {
  await this.checkAndResetLimit();

  if (this.limit <= 0) {
    return false;
  }

  this.limit -= 1;
  await this.save();
  return true;
};

UserSchema.methods.getTimeUntilReset = function () {
  const now = new Date();
  const lastReset = this.lastLimitReset || new Date(0);
  const timeSinceReset = now.getTime() - lastReset;
  const dayInMilliseconds = 24 * 60 * 60 * 1000;

  if (timeSinceReset >= dayInMilliseconds) {
    return 0;
  }

  return dayInMilliseconds - timeSinceReset;
};

export const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  profileImage: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  bio: z.string().optional(),
  urls: z.array(z.object({ value: z.string() })).optional(),
  favourites: z.array(z.string()).optional(),
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
