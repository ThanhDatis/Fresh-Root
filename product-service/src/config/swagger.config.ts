import swaggerJSDoc from 'swagger-jsdoc';

import { env } from './env.config';

const apiGlob =
  env.NODE_ENV === 'production' ? './dist/routes/**/*.js' : './src/routes/**/*.ts';

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FreshRoot POS — Product Service API',
      version: '1.0.0',
      description: 'API documentation cho product-service (Hàng hóa, Danh mục, Tồn kho, Kiểm kho, Thiết lập giá).',
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    tags: [
      { name: 'Category', description: 'Danh mục cha/con' },
      { name: 'Product', description: 'Hàng hóa, đơn vị quy đổi, giá, import/export' },
      { name: 'Stock', description: 'Điều chỉnh tồn kho — nội bộ liên service' },
      { name: 'Stock Take', description: 'Kiểm kho' },
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

        // ---------- Category ----------
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            parentId: { type: 'string', nullable: true },
            children: {
              type: 'array',
              items: { $ref: '#/components/schemas/Category' },
            },
          },
        },
        CategoryCreateRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Đồ uống' },
            parentId: { type: 'string', nullable: true },
          },
        },
        CategoryUpdateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            parentId: { type: 'string', nullable: true },
          },
        },

        // ---------- Product ----------
        ProductUnit: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            productId: { type: 'string' },
            unitName: { type: 'string', example: 'Thùng' },
            conversionRate: { type: 'number', example: 24 },
            sellPrice: { type: 'number' },
            isBaseUnit: { type: 'boolean' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            productCode: { type: 'string', example: 'SP0001' },
            name: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'string' },
            barcode: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            costPrice: { type: 'number' },
            sellPrice: { type: 'number' },
            stockQuantity: { type: 'number' },
            lowStockThreshold: { type: 'number' },
            status: { type: 'string', enum: ['active', 'inactive'] },
          },
        },
        ProductCreateRequest: {
          type: 'object',
          required: ['name', 'categoryId', 'costPrice', 'sellPrice', 'baseUnitName'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'string' },
            barcode: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            costPrice: { type: 'number' },
            sellPrice: { type: 'number' },
            baseUnitName: { type: 'string', example: 'Lon' },
            lowStockThreshold: { type: 'number', default: 0 },
            initialStock: { type: 'number', default: 0 },
          },
        },
        ProductUpdateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'string' },
            barcode: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            costPrice: { type: 'number' },
            sellPrice: { type: 'number' },
            lowStockThreshold: { type: 'number' },
          },
        },
        ProductStatusUpdateRequest: {
          type: 'object',
          required: ['status'],
          properties: { status: { type: 'string', enum: ['active', 'inactive'] } },
        },
        ProductWithUnitsResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                product: { $ref: '#/components/schemas/Product' },
                units: { type: 'array', items: { $ref: '#/components/schemas/ProductUnit' } },
              },
            },
          },
        },
        ProductListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
            pagination: { $ref: '#/components/schemas/Pagination' },
          },
        },
        ProductUnitCreateRequest: {
          type: 'object',
          required: ['unitName', 'conversionRate', 'sellPrice'],
          properties: {
            unitName: { type: 'string' },
            conversionRate: { type: 'number', minimum: 1, exclusiveMinimum: true },
            sellPrice: { type: 'number' },
          },
        },
        ProductUnitUpdateRequest: {
          type: 'object',
          properties: {
            unitName: { type: 'string' },
            conversionRate: { type: 'number' },
            sellPrice: { type: 'number' },
          },
        },
        PriceHistoryResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                history: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      productId: { type: 'string' },
                      unitId: { type: 'string' },
                      unitNameSnapshot: { type: 'string' },
                      oldSellPrice: { type: 'number' },
                      newSellPrice: { type: 'number' },
                      changeType: {
                        type: 'string',
                        enum: ['manual_edit', 'bulk_update', 'purchase_import', 'unit_price_edit'],
                      },
                      changedBy: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
        BulkUpdatePriceRequest: {
          type: 'object',
          required: ['adjustType', 'value'],
          properties: {
            productIds: { type: 'array', items: { type: 'string' } },
            categoryId: { type: 'string' },
            adjustType: { type: 'string', enum: ['percent', 'fixed'] },
            value: { type: 'number', example: 10 },
          },
        },

        // ---------- Stock ----------
        BulkAdjustRequest: {
          type: 'object',
          required: ['type', 'items'],
          properties: {
            type: { type: 'string', enum: ['sale', 'sale_return', 'purchase', 'purchase_return'] },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  unitName: { type: 'string' },
                  quantity: { type: 'number' },
                },
              },
            },
          },
        },

        // ---------- Stock Take ----------
        StockTake: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            stockTakeCode: { type: 'string', example: 'PK0001' },
            scope: { type: 'string', enum: ['all', 'category'] },
            categoryId: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'confirmed'] },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  productNameSnapshot: { type: 'string' },
                  systemQuantity: { type: 'number' },
                  countedQuantity: { type: 'number', nullable: true },
                },
              },
            },
            note: { type: 'string' },
            createdBy: { type: 'string' },
            confirmedBy: { type: 'string' },
            confirmedAt: { type: 'string', format: 'date-time' },
          },
        },
        StockTakeCreateRequest: {
          type: 'object',
          required: ['scope'],
          properties: {
            scope: { type: 'string', enum: ['all', 'category'] },
            categoryId: { type: 'string' },
            note: { type: 'string' },
          },
        },
        StockTakeUpdateRequest: {
          type: 'object',
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  countedQuantity: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [apiGlob],
});

export default swaggerSpec;
