import cors from 'cors';
import express from 'express';
import Jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { env } from './config/env.js';
import UserModel from './models/UserModel.js';
import { comparePassword, hashPassword } from './utils/password.js';

const app = express();
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

mongoose.connect(env.MONGO_DB_CONNECTION_KEY);

app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.create({ name, email, password: await hashPassword(password) });
    res.status(201).json({ user });
  } catch (error) {
    res.status(402).json({ error });
  }
});

app.post('/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const isValidPassword = await comparePassword(password, user.password);
      if (isValidPassword) {
        Jwt.sign({ email: user.email, id: user._id }, env.JWT_SECRET_KEY, {}, (err, token) => {
          if (err) throw err;
          res.status(200).cookie('token', token).json({ user });
        });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    }
  } catch (error) {
    res.status(402).json({ error });
  }
});

const PORT = 8000;
app.listen(PORT, () => {});
