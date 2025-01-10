import { RedisStore } from 'connect-redis';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import mongoose from 'mongoose';

import { env } from './config/env.js';
import UserModel from './models/UserModel.js';
import { comparePassword, hashPassword } from './utils/password.js';

console.log('Starting server with environment:', {
  NODE_ENV: env.NODE_ENV,
  CLIENT_HOST: env.CLIENT_HOST,
  REDIS_HOST: env.REDIS_HOST,
  REDIS_PORT: env.REDIS_PORT,
});

const app = express();

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  retryStrategy: function (times) {
    console.log(`Redis retry attempt ${times}`);
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
  console.log('Redis client connected successfully');
});

redisClient.on('ready', () => {
  console.log('Redis client ready for operations');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
  setTimeout(() => {
    console.error('Shutting down due to Redis connection error');
    process.exit(1);
  }, 5000);
});

console.log('Configuring session middleware');
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

app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: {
      origin: req.headers.origin,
      'content-type': req.headers['content-type'],
      cookie: req.headers.cookie ? 'present' : 'absent',
    },
    timestamp: new Date().toISOString(),
  });
  next();
});

console.log('Configuring CORS with origin:', env.CLIENT_HOST);
app.use(
  cors({
    credentials: true,
    origin: env.CLIENT_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

console.log('Attempting MongoDB connection...');
mongoose.connect(env.MONGO_DB_CONNECTION_KEY);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes with detailed logging
app.post('/auth/register', async (req, res) => {
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
});

app.post('/auth/signin', async (req, res) => {
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
});

app.get('/auth/check', (req, res) => {
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
});

app.post('/auth/logout', (req, res) => {
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
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', {
    error: err,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers,
  });
  res.status(500).json({
    message: 'An unexpected error occurred',
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', {
    reason,
    promise,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

const PORT = env.NODE_ENV == 'production' ? 8080 : 3000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}, environment: ${env.NODE_ENV}`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', {
    error,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  console.log('Initiating graceful shutdown...');
  server.close(() => {
    console.log('Server closed. Exiting process...');
    process.exit(1);
  });
});
