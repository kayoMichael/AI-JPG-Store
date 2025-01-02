import path from 'path';

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const envSchema = z.object({
  MONGO_DB_CONNECTION_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
