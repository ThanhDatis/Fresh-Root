import swaggerJSDoc from 'swagger-jsdoc';

import { env } from './env.config';

const apiGlob =
  env.NODE_ENV === 'production' ? './dist/routes/*.js' : './src/routes/*.ts';

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FreshRoot Auth Service API',
      version: '1.0.0',
      description:
        'API documentation cho auth-service (đăng ký, đăng nhập, JWT, quản lý profile...)',
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    tags: [
      { name: 'Auth', description: 'Đăng ký / đăng nhập / JWT / profile' },
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
        RegisterRequest: {
          type: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            fullName: { type: 'string', minLength: 2, example: 'Nguyen Van A' },
            email: { type: 'string', format: 'email', example: 'a@test.com' },
            password: { type: 'string', minLength: 8, example: 'password123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'a@test.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        GoogleLoginRequest: {
          type: 'object',
          required: ['idToken'],
          properties: {
            idToken: {
              type: 'string',
              description:
                'Google ID Token lấy từ FE (Google Identity Services)',
            },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'a@test.com' },
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
        SafeUser: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            fullName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['customer', 'admin'] },
            authProvider: { type: 'string', enum: ['local', 'google'] },
            isActive: { type: 'boolean' },
            emailVerified: { type: 'boolean' },
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
                user: { $ref: '#/components/schemas/SafeUser' },
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
                user: { $ref: '#/components/schemas/SafeUser' },
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
