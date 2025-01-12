import { RedisStore } from 'connect-redis';
import { RequestHandler } from 'express';
import session from 'express-session';

import { env } from '../config/env.js';
import redisClient from '../config/redis.js';

const sessionMiddleware: RequestHandler = session({
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
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    ...(process.env.NODE_ENV === 'production' ? { domain: '.run.app' } : {}),
  },
});

export default sessionMiddleware;
