import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const envSchema = z.object({
  MONGO_DB_CONNECTION_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
