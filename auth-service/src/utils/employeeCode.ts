import {
  EMPLOYEE_CODE_PAD_LENGTH,
  EMPLOYEE_CODE_PREFIX,
} from '../constants/auth.constants';

// Sinh employeeCode tăng dần (NV0001, NV0002...) dựa trên employeeCode cuối cùng trong DB.
export function generateNextEmployeeCode(
  lastEmployeeCode: string | undefined,
): string {
  const lastNumber = lastEmployeeCode
    ? parseInt(lastEmployeeCode.replace(EMPLOYEE_CODE_PREFIX, ''), 10)
    : 0;
  const nextNumber = (Number.isNaN(lastNumber) ? 0 : lastNumber) + 1;
  return `${EMPLOYEE_CODE_PREFIX}${String(nextNumber).padStart(EMPLOYEE_CODE_PAD_LENGTH, '0')}`;
}
