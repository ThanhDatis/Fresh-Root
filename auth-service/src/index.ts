import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { connectDB } from './config/db.config';
import { env } from './config/env.config';
import { httpLogger, logger } from './config/logger.config';
import swaggerSpec from './config/swagger.config';
import { errorHandler } from './middlewares/errorHandler.middleware';
import authRoutes from './routes/auth.route';

async function bootstrap(): Promise<void> {
  await connectDB();

  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_BASE_URL,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(httpLogger);

  if (env.SWAGGER_ENABLED) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  app.use('/auth', authRoutes);

  app.use(errorHandler);

  app.listen(env.PORT, () => {
    const baseUrl = `http://localhost:${env.PORT}`;
    logger.info(`auth-service đang chạy tại ${baseUrl}`);
    if (env.SWAGGER_ENABLED) {
      logger.info(`Swagger UI: ${baseUrl}/docs`);
    }
  });
}

bootstrap().catch((error: unknown) => {
  logger.error({ error }, 'Failed to start auth-service');
  process.exit(1);
});
