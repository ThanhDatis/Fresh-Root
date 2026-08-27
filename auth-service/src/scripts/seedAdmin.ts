import mongoose from 'mongoose';

import { connectDB } from '../config/db.config';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
import { employeeRepository } from '../repositories/employee.repository';
import { generateNextEmployeeCode } from '../utils/employeeCode';
import { hashPassword } from '../utils/hash';

async function seedAdmin(): Promise<void> {
  if (!env.SEED_ADMIN_USERNAME || !env.SEED_ADMIN_PASSWORD) {
    logger.error(
      'SEED_ADMIN_USERNAME và SEED_ADMIN_PASSWORD phải được khai báo trong .env để chạy seed',
    );
    process.exit(1);
  }

  await connectDB();

  const existing = await employeeRepository.findByUsername(
    env.SEED_ADMIN_USERNAME,
  );
  if (existing) {
    logger.info(
      `Tài khoản admin "${env.SEED_ADMIN_USERNAME}" đã tồn tại — bỏ qua seed`,
    );
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await hashPassword(env.SEED_ADMIN_PASSWORD);
  const lastEmployee = await employeeRepository.findLastByEmployeeCode();
  const employeeCode = generateNextEmployeeCode(lastEmployee?.employeeCode);

  const admin = await employeeRepository.create({
    employeeCode,
    fullName: 'Administrator',
    username: env.SEED_ADMIN_USERNAME,
    password: hashedPassword,
    role: 'admin',
    employmentStatus: 'active',
  });

  logger.info(
    `Đã tạo tài khoản admin đầu tiên: ${admin.username} (${admin.employeeCode})`,
  );

  await mongoose.disconnect();
}

seedAdmin().catch((error: unknown) => {
  logger.error({ error }, 'Seed admin thất bại');
  process.exit(1);
});
