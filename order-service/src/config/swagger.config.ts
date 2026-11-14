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

        // ---------- Customer ----------
        Customer: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            customerCode: { type: 'string', example: 'KH0001' },
            name: { type: 'string' },
            phone: { type: 'string', example: '0912345678' },
            email: { type: 'string' },
            address: { type: 'string' },
            customerGroup: {
              type: 'string',
              enum: ['retail', 'wholesale', 'vip'],
            },
            note: { type: 'string' },
            status: { type: 'string', enum: ['active', 'blocked'] },
            totalSpent: { type: 'number' },
            orderCount: { type: 'integer' },
            lastPurchaseAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CustomerCreateRequest: {
          type: 'object',
          required: ['name', 'phone'],
          properties: {
            name: { type: 'string', example: 'Nguyễn Văn A' },
            phone: {
              type: 'string',
              example: '+84 912 345 678',
              description: 'Được chuẩn hóa về dạng 0xxxxxxxxx trước khi lưu',
            },
            email: { type: 'string', description: '"" = bỏ trống' },
            address: { type: 'string' },
            customerGroup: {
              type: 'string',
              enum: ['retail', 'wholesale', 'vip'],
              default: 'retail',
            },
            note: { type: 'string' },
          },
        },
        CustomerUpdateRequest: {
          type: 'object',
          description:
            'Gửi ít nhất 1 field. email/address/note = "" để xóa giá trị cũ',
          properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
            customerGroup: {
              type: 'string',
              enum: ['retail', 'wholesale', 'vip'],
            },
            note: { type: 'string' },
          },
        },
        CustomerSearchItem: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            customerCode: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            customerGroup: {
              type: 'string',
              enum: ['retail', 'wholesale', 'vip'],
            },
          },
        },
        CustomerResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                customer: { $ref: '#/components/schemas/Customer' },
              },
            },
          },
        },
        CustomerListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Customer' },
            },
            pagination: { $ref: '#/components/schemas/Pagination' },
          },
        },
      },
    },
  },
  apis: [apiGlob],
});

export default swaggerSpec;
