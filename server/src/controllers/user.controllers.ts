import { Request, Response } from 'express';

import UserModel, { UpdateUserSchema } from '../models/User.js';
import { excludePassword } from '../utils/password.js';

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(excludePassword(user));
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const data = await UpdateUserSchema.parseAsync(req.body);
    const user = await UserModel.findOne({ _id: data.id });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.set(data);
    await user.save();

    res.status(200).json(excludePassword(user));
  } catch (error) {
    console.error('Update user error:', error);

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUserProfileImage = async (req: Request, res: Response) => {
  console.log(req);
  res.status(200).json({ message: 'Profile image updated' });
};
