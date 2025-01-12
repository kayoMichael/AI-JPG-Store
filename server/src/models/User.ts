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
});

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
