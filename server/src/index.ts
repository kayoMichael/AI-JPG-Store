import cors from 'cors';
import express from 'express';

import corsConfig from './config/cors.js';
import { connectDB } from './config/database.js';
import { env } from './config/env.js';
import requireAuth from './middleware/auth.js';
import sessionMiddleware from './middleware/session.middleware.js';
import authRouter from './routes/auth.routes.js';
import useRouter from './routes/user.routes.js';

/**
 * Express application instance.
 */
const app: express.Application = express();

// Initialize middleware stack
app.use(sessionMiddleware);
app.use(cors(corsConfig));
app.use(express.json());

// Initialize database connection
connectDB();

/**
 * Authentication routes
 * Handles user registration, login, logout, and session validation
 * Base path: /auth
 * @see {@link ./routes/auth.routes.js}
 */
app.use('/auth', authRouter);

/**
 * User Routes
 * Handles User CRUD operations
 * Base path: /users
 * @see {@link ./routes/user.routes.js}
 */
app.use('/user', requireAuth, useRouter);

/**
 * Start the Express server
 * @type {http.Server}
 */
const PORT: number = env.NODE_ENV == 'production' ? 8080 : 3000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}, environment: ${env.NODE_ENV}`);
});

/**
 * Global error handler for uncaught exceptions
 * Implements graceful shutdown of the server
 * @param {Error} error - The uncaught error
 */
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', {
    error,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  server.close(() => {
    process.exit(1);
  });
});
