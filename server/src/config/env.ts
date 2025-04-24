import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const envSchema = z.object({
  MONGO_DB_CONNECTION_KEY: z.string(),
  SESSION_SECRET_KEY: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number()
  ),
  REDIS_PASSWORD: z.string(),
  REDIS_USERNAME: z.string(),
  CLIENT_HOST: z.string(),
  NODE_ENV: z.string(),
  GCS_SERVICE_ACCOUNT: z.string(),
  GCS_PROJECT_ID: z.string(),
  GCS_BUCKET_NAME: z.string(),
  OPENAI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
