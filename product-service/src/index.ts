import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

import { connectDB } from './config/db.config';
import { env } from './config/env.config';
import { httpLogger, logger } from './config/logger.config';
import swaggerSpec from './config/swagger.config';
import categoryRoutes from './routes/category.route';
import productRoutes from './routes/product.route';
import stockRoutes from './routes/stock.route';
import stockTakeRoutes from './routes/stockTake.route';
import { errorHandler } from './middlewares/errorHandler.middleware';

async function bootstrap(): Promise<void> {
  await connectDB();

  const app = express();

  app.use(cors({ origin: env.ADMIN_APP_URL, credentials: true }));
  app.use(express.json());
  app.use(httpLogger);

  if (env.SWAGGER_ENABLED) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  app.use('/categories', categoryRoutes);
  app.use('/products', productRoutes);
  app.use('/products/stock', stockRoutes);
  app.use('/stock-takes', stockTakeRoutes);

  app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'OK', data: null });
  });

  app.use(errorHandler);

  app.listen(env.PORT, () => {
    const baseUrl = `http://localhost:${env.PORT}`;
    logger.info(`product-service đang chạy tại ${baseUrl}`);
    if (env.SWAGGER_ENABLED) {
      logger.info(`Swagger UI: ${baseUrl}/docs`);
    }
  });
}

bootstrap().catch((error: unknown) => {
  logger.error({ error }, 'Failed to start product-service');
  process.exit(1);
});