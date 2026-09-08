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
  redact: ['req.headers.authorization'],
  autoLogging: {
    ignore: (req) => (req.url ?? '').startsWith('/docs'),
  },
});