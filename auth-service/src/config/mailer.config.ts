import nodemailer from 'nodemailer';

import { env } from './env.config';

// SMTP là optional (auth-service.md mục 8) — nếu chưa cấu hình, mailTransporter là null
// và mail.service.ts sẽ bỏ qua việc gửi thay vì crash.
export const mailTransporter =
  env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT ?? 587,
        secure: (env.SMTP_PORT ?? 587) === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      })
    : null;
