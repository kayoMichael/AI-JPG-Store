import { Request, Response } from 'express';

import UserModel, { UpdateUserSchema } from '../models/User.js';
import { excludePassword } from '../utils/password.js';

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(excludePassword(user));
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const data = await UpdateUserSchema.parseAsync(req.body);
    const user = await UserModel.findOne({ _id: data.id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.set(data);
    await user.save();

    return res.status(200).json(excludePassword(user));
  } catch (error) {
    console.error('Update user error:', error);

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
