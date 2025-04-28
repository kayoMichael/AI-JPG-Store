import { Request, Response } from 'express';

import UserModel from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.create({
      name,
      email,
      password: await hashPassword(password),
      createdAt: new Date(),
      limit: 3,
    });
    res.status(201).json({ userId: user._id, email: user.email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(402).json({ message: 'Login failed. Please try again.' });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const isValidPassword = await comparePassword(password, user.password);

      if (isValidPassword) {
        req.session.userId = String(user._id);
        req.session.user = {
          name: user.name,
          email: user.email,
        };
        res.status(200).json({
          name: user.name,
          email: user.email,
          id: user._id,
        });
      } else {
        res.status(400).json({ error: 'Invalid email or password' });
      }
    }
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const authCheck = (req: Request, res: Response) => {
  if (req.session.userId) {
    res.json({ user: { ...req.session.user, id: req.session.userId }, sessionExists: true });
  } else {
    res.json({ error: 'Not authenticated', sessionExists: false });
  }
};

export const signOut = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Could not log out' });
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  });
};

export const changePassword = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { previousPassword, password } = req.body;

  try {
    const user = await UserModel.findById(req.session.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const isValidPassword = await comparePassword(previousPassword, user.password);
    if (!isValidPassword) {
      res.status(400).json({ error: 'Invalid previous password' });
      return;
    } else {
      user.password = await hashPassword(password);
      user.set({ password: user.password });
      await user.save();
      res.status(200).json({ message: 'Password changed successfully' });
    }
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
