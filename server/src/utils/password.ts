import bcrypt from 'bcrypt';

import { IUser } from '../models/User';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function excludePassword(user: IUser): Omit<IUser, 'password'> {
  const { password: _, ...rest } = user;
  return rest;
}
