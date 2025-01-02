import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { env } from './config/env';
import UserModel from './models/UserModel';
import { hashPassword } from './utils/password';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

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

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
