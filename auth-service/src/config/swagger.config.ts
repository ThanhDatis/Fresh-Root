import swaggerJSDoc from 'swagger-jsdoc';

import { env } from './env.config';

const apiGlob =
  env.NODE_ENV === 'production'
    ? './dist/routes/**/*.js'
    : './src/routes/**/*.ts';

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FreshRoot POS — Auth Service API',
      version: '1.0.0',
      description:
        'API documentation cho auth-service (đăng nhập nhân viên, JWT, quản lý tài khoản Nhân viên...)',
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    tags: [
      { name: 'Auth', description: 'Đăng nhập / JWT / profile nhân viên' },
      {
        name: 'Employee Admin',
        description: 'Quản lý tài khoản Nhân viên — chỉ Admin',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'admin' },
            password: { type: 'string', example: 'Admin@123' },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'nhanvien@freshroot.vn',
            },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['email', 'token', 'newPassword'],
          properties: {
            email: { type: 'string', format: 'email' },
            token: {
              type: 'string',
              description: 'Token thô lấy từ link trong email',
            },
            newPassword: { type: 'string', minLength: 8 },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: {
            oldPassword: { type: 'string' },
            newPassword: { type: 'string', minLength: 8 },
          },
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            fullName: { type: 'string', minLength: 2 },
            phone: { type: 'string' },
            avatar: { type: 'string', format: 'uri' },
          },
        },
        CreateEmployeeRequest: {
          type: 'object',
          required: ['fullName', 'username', 'password', 'role'],
          properties: {
            fullName: { type: 'string', minLength: 2, example: 'Nguyễn Văn A' },
            username: { type: 'string', minLength: 3, example: 'nva' },
            password: { type: 'string', minLength: 8, example: 'password123' },
            role: { type: 'string', enum: ['admin', 'cashier'] },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            baseSalary: { type: 'number', minimum: 0 },
          },
        },
        UpdateEmployeeRequest: {
          type: 'object',
          description: 'Không cho sửa username',
          properties: {
            fullName: { type: 'string', minLength: 2 },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            avatar: { type: 'string', format: 'uri' },
            role: { type: 'string', enum: ['admin', 'cashier'] },
            startDate: { type: 'string', format: 'date' },
            baseSalary: { type: 'number', minimum: 0 },
          },
        },
        UpdateEmploymentStatusRequest: {
          type: 'object',
          required: ['employmentStatus'],
          properties: {
            employmentStatus: { type: 'string', enum: ['active', 'resigned'] },
          },
        },
        SafeEmployee: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            employeeCode: { type: 'string', example: 'NV0001' },
            fullName: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'cashier'] },
            employmentStatus: { type: 'string', enum: ['active', 'resigned'] },
            startDate: { type: 'string', format: 'date-time' },
            baseSalary: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/SafeEmployee' },
                accessToken: { type: 'string' },
              },
            },
          },
        },
        RefreshSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
              },
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/SafeEmployee' },
              },
            },
          },
        },
        EmployeeResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                employee: { $ref: '#/components/schemas/SafeEmployee' },
              },
            },
          },
        },
        EmployeeListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/SafeEmployee' },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                totalItems: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        MessageOnlyResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { nullable: true, example: null },
          },
        },
        ApiErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                  code: { type: 'string' },
                },
              },
            },
            requestId: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [apiGlob],
});

export default swaggerSpec;
