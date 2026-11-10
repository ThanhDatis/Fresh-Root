import mongoose from 'mongoose';

import { env } from './env.config';
import { logger } from './logger.config';

export async function connectDB(): Promise<void> {
  mongoose.connection.on('error', (error) => {
    logger.error({ error }, 'MongoDB connection error');
  });

  await mongoose.connect(env.MONGO_URI);
  // Chỉ log tên database — MONGO_URI có thể chứa username/password
  logger.info({ database: mongoose.connection.name }, 'MongoDB connected');
}
