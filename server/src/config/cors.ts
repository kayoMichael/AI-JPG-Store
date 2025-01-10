import { env } from './env';

const corsConfig = {
  credentials: true,
  origin: env.CLIENT_HOST,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsConfig;
