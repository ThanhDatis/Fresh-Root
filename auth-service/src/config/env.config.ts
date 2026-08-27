import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Shared (backend-architecture.md mục 6.2)
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3001),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  SWAGGER_ENABLED: z.coerce.boolean().default(true),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),

  // JWT (auth-service.md mục 3, 8)
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Admin Web & Reset Password (auth-service.md mục 5.5, 8)
  ADMIN_APP_URL: z.string().min(1).default('http://localhost:3000'),
  RESET_PASSWORD_TOKEN_EXPIRY_MINUTES: z.coerce.number().default(15),

  // SMTP / Nodemailer — optional, chỉ cần khi dùng forgot-password (auth-service.md mục 8)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Seed Admin đầu tiên — chỉ dùng bởi `npm run seed:admin`, KHÔNG bắt buộc cho server chính
  // (có thể xoá khỏi .env sau khi seed xong, nên phải optional ở đây)
  SEED_ADMIN_USERNAME: z.string().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
