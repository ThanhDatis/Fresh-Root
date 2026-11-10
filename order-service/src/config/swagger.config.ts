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
      title: 'FreshRoot POS — Order Service API',
      version: '1.0.0',
      description:
        'API documentation cho order-service (Hóa đơn POS, Trả hàng, Khách hàng).',
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    tags: [
      { name: 'Order', description: 'Hóa đơn nháp, xác nhận thanh toán, hủy' },
      { name: 'Return', description: 'Trả hàng theo hóa đơn gốc' },
      { name: 'Customer', description: 'Khách hàng, import/export' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
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
        Pagination: {
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
  },
  apis: [apiGlob],
});

export default swaggerSpec;
