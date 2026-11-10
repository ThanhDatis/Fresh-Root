import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

import { connectDB } from './config/db.config';
import { env } from './config/env.config';
import { httpLogger, logger } from './config/logger.config';
import swaggerSpec from './config/swagger.config';
import { AppError } from './errors/AppError';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { verifyToken } from './middlewares/verifyToken.middleware';
import { sendSuccess } from './utils/apiResponse';

async function bootstrap(): Promise<void> {
  await connectDB();

  const app = express();

  app.use(cors({ origin: env.ADMIN_APP_URL, credentials: true }));
  app.use(express.json());
  app.use(httpLogger);

  if (env.SWAGGER_ENABLED) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'OK', data: null });
  });

  // TẠM THỜI (Phase 0): kiểm tra verifyToken đọc đúng userId/role/fullName — xóa khi có route thật ở Phase 2
  app.get('/debug/whoami', verifyToken, (req, res) => {
    sendSuccess(res, 200, 'OK', req.user);
  });

  app.use((_req, _res, next) => {
    next(new AppError(404, 'Không tìm thấy endpoint', 'ROUTE_NOT_FOUND'));
  });

  app.use(errorHandler);

  app.listen(env.PORT, () => {
    const baseUrl = `http://localhost:${env.PORT}`;
    logger.info(`order-service đang chạy tại ${baseUrl}`);
    if (env.SWAGGER_ENABLED) {
      logger.info(`Swagger UI: ${baseUrl}/docs`);
    }
  });
}

bootstrap().catch((error: unknown) => {
  logger.error({ error }, 'Failed to start order-service');
  process.exit(1);
});
