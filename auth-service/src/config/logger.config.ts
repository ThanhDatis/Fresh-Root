import { randomUUID } from 'crypto';
import pino from 'pino';
import pinoHttp from 'pino-http';

import { env } from './env.config';

export const logger = pino({
  level: env.LOG_LEVEL,
});

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
  redact: [
    'req.headers.authorization',
    'req.headers.cookie',
    'req.body.password',
    'req.body.oldPassword',
    'req.body.newPassword',
    'req.body.token',
    'req.body.idToken',
  ],
  // Bỏ qua log cho static assets của Swagger UI (/docs/*), tránh spam log
  // và tránh link bị dính trailing '"}' khi bấm từ terminal
  autoLogging: {
    ignore: (req) => (req.url ?? '').startsWith('/docs'),
  },
});
