import mongoose from 'mongoose';

import { env } from './env.js';

export const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });

    await mongoose.connect(env.MONGO_DB_CONNECTION_KEY);
  } catch (error) {
    console.error('Could not connect to MongoDB:', error);
    process.exit(1);
  }
};
