import cors from 'cors';
import express from 'express';

import corsConfig from './config/cors.js';
import { connectDB } from './config/database.js';
import { env } from './config/env.js';
import requireAuth from './middleware/auth.js';
import sessionMiddleware from './middleware/session.middleware.js';
import authRouter from './routes/auth.routes.js';
import imageRouter from './routes/image.routes.js';
import likeRouter from './routes/like.routes.js';
import userRouter from './routes/user.routes.js';

/**
 * Express application instance.
 */
const app: express.Application = express();

// Initialize middleware stack
app.set('trust proxy', 1);
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
app.use('/user', userRouter);

/**
 * Image Routes
 * Handles Image CRUD operations
 * Base path: /images
 * @see {@link ./routes/image.routes.js}
 */
app.use('/images', imageRouter);

/**
 * Like Routes
 * Handles Image Like operations
 * Base path: /likes
 * @see {@link ./routes/like.routes.js}
 */
app.use('/likes', requireAuth, likeRouter);

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
