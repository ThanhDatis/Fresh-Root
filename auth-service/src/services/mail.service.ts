import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
import { mailTransporter } from '../config/mailer.config';

async function sendResetPasswordEmail(
  email: string,
  rawToken: string,
): Promise<void> {
  const resetLink = `${env.FRONTEND_BASE_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

  await mailTransporter.sendMail({
    from: env.SMTP_USER,
    to: email,
    subject: 'Đặt lại mật khẩu - FreshRoot',
    html: `
      <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản FreshRoot.</p>
      <p>Link có hiệu lực trong ${env.RESET_PASSWORD_TOKEN_EXPIRY_MINUTES} phút:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
    `,
  });

  logger.info({ email }, 'Reset password email sent');
}

export const mailService = {
  sendResetPasswordEmail,
};
