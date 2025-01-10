import { Request, Response } from 'express';

import UserModel from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';

export const register = async (req: Request, res: Response) => {
  console.log('Register attempt for email:', req.body.email);
  const { name, email, password } = req.body;
  try {
    console.log('Attempting to create user in database');
    const user = await UserModel.create({ name, email, password: await hashPassword(password) });
    console.log('User created successfully:', { userId: user._id, email: user.email });
    res.status(201).json({ user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(402).json({ message: 'Login failed. Please try again.' });
  }
};

export const signIn = async (req: Request, res: Response) => {
  console.log('Signin attempt for email:', req.body.email);
  const { email, password } = req.body;
  try {
    console.log('Looking up user in database');
    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log('User not found for email:', email);
      res.status(404).json({ error: 'User not found' });
    } else {
      console.log('User found, validating password');
      const isValidPassword = await comparePassword(password, user.password);

      if (isValidPassword) {
        console.log('Password valid, creating session');
        req.session.userId = String(user._id);
        req.session.user = {
          name: user.name,
          email: user.email,
        };
        console.log('Session created:', {
          sessionId: req.session.id,
          userId: req.session.userId,
        });
        res.status(200).json({
          name: user.name,
          email: user.email,
          id: user._id,
        });
      } else {
        console.log('Invalid password attempt for email:', email);
        res.status(400).json({ error: 'Invalid email or password' });
      }
    }
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const authCheck = (req: Request, res: Response) => {
  console.log('Auth check request:', {
    sessionPresent: !!req.session,
    userId: req.session?.userId,
    sessionId: req.session?.id,
  });

  if (req.session.userId) {
    console.log('User is authenticated:', req.session.user);
    res.json({ user: req.session.user });
  } else {
    console.log('User is not authenticated');
    res.status(401).json({ error: 'Not authenticated' });
  }
};

export const signOut = (req: Request, res: Response) => {
  console.log('Logout request for session:', req.session.id);
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Could not log out' });
    } else {
      console.log('Logout successful');
      res.json({ message: 'Logged out successfully' });
    }
  });
};
