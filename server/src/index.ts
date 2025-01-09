import { RedisStore } from 'connect-redis';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import mongoose from 'mongoose';

import { env } from './config/env.js';
import UserModel from './models/UserModel.js';
import { comparePassword, hashPassword } from './utils/password.js';

const app = express();

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  retryStrategy: function (times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
  setTimeout(() => {
    process.exit(1);
  }, 5000);
});

app.use(
  session({
    name: 'session',
    store: new RedisStore({
      client: redisClient,
    }),
    secret: env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: env.CLIENT_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

mongoose.connect(env.MONGO_DB_CONNECTION_KEY);

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.create({ name, email, password: await hashPassword(password) });
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    res.status(402).json({ message: 'Login failed. Please try again.' });
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
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/auth/check', (req, res) => {
  if (req.session.userId) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Could not log out' });
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'An unexpected error occurred',
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = 3000;
const server = app.listen(PORT, () => {});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Gracefully shutdown
  server.close(() => {
    process.exit(1);
  });
});
