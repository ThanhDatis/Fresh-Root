import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// z.coerce.boolean() biến mọi chuỗi khác rỗng (kể cả "false") thành true — phải parse chuỗi tường minh
const booleanString = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3003),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  SWAGGER_ENABLED: booleanString.default(true),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),

  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),

  ADMIN_APP_URL: z.string().min(1).default('http://localhost:3000'),

  PRODUCT_SERVICE_URL: z.url('PRODUCT_SERVICE_URL must be a valid URL'),
  PRODUCT_SERVICE_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
