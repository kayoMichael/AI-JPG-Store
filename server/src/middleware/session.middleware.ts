import { RedisStore } from 'connect-redis';
import { RequestHandler } from 'express';
import session from 'express-session';

import { env } from '../config/env';
import redisClient from '../config/redis';

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
  },
});

export default sessionMiddleware;
