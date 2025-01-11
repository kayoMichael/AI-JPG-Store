import { env } from './env.js';

interface CorsConfig {
  credentials: boolean;
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => void;
  methods: string[];
  allowedHeaders: string[];
}

const corsConfig: CorsConfig = {
  credentials: true,
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (env.CLIENT_HOST === 'run.app') {
      const pattern = new RegExp('.*\\.run\\.app$');
      if (!origin || pattern.test(origin)) {
        callback(null, true);
        return;
      }
    } else if (!origin || origin === env.CLIENT_HOST) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsConfig;
