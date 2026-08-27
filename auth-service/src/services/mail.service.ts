import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
import { mailTransporter } from '../config/mailer.config';

async function sendResetPasswordEmail(
  email: string,
  rawToken: string,
): Promise<void> {
  if (!mailTransporter) {
    logger.warn(
      { email },
      'SMTP chưa được cấu hình — bỏ qua gửi email reset password',
    );
    return;
  }

  const resetLink = `${env.ADMIN_APP_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

  await mailTransporter.sendMail({
    from: env.SMTP_USER,
    to: email,
    subject: 'Đặt lại mật khẩu - FreshRoot POS',
    html: `
      <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản FreshRoot POS.</p>
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
