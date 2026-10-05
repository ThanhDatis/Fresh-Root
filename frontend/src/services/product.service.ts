import type { ApiPaginatedResponse, ApiResponse } from '@/types/api.types';
import type {
  CreateProductPayload,
  CreateProductUnitPayload,
  ImportResult,
  ListProductsQuery,
  Product,
  ProductUnit,
  ProductWithUnits,
  UpdateProductPayload,
  UpdateProductUnitPayload,
} from '@/types/product.types';

import { productApi } from './axiosInstances';

export async function listProducts(
  query: ListProductsQuery,
): Promise<ApiPaginatedResponse<Product>> {
  const { data } = await productApi.get<ApiPaginatedResponse<Product>>(
    '/products',
    {
      params: query,
    },
  );
  return data;
}

export async function getProductById(
  id: string,
): Promise<ApiResponse<ProductWithUnits>> {
  const { data } = await productApi.get<ApiResponse<ProductWithUnits>>(
    `/products/${id}`,
  );
  return data;
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<ApiResponse<ProductWithUnits>> {
  const { data } = await productApi.post<ApiResponse<ProductWithUnits>>(
    '/products',
    payload,
  );
  return data;
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<ApiResponse<{ product: Product }>> {
  const { data } = await productApi.patch<ApiResponse<{ product: Product }>>(
    `/products/${id}`,
    payload,
  );
  return data;
}

export async function updateProductStatus(
  id: string,
  status: Product['status'],
): Promise<ApiResponse<{ product: Product }>> {
  const { data } = await productApi.patch<ApiResponse<{ product: Product }>>(
    `/products/${id}/status`,
    { status },
  );
  return data;
}

export async function deleteProduct(
  id: string,
): Promise<ApiResponse<{ product: Product }>> {
  const { data } = await productApi.delete<ApiResponse<{ product: Product }>>(
    `/products/${id}`,
  );
  return data;
}

export async function addProductUnit(
  productId: string,
  payload: CreateProductUnitPayload,
): Promise<ApiResponse<{ unit: ProductUnit }>> {
  const { data } = await productApi.post<ApiResponse<{ unit: ProductUnit }>>(
    `/products/${productId}/units`,
    payload,
  );
  return data;
}

export async function updateProductUnit(
  productId: string,
  unitId: string,
  payload: UpdateProductUnitPayload,
): Promise<ApiResponse<{ unit: ProductUnit }>> {
  const { data } = await productApi.patch<ApiResponse<{ unit: ProductUnit }>>(
    `/products/${productId}/units/${unitId}`,
    payload,
  );
  return data;
}

export async function deleteProductUnit(
  productId: string,
  unitId: string,
): Promise<ApiResponse<null>> {
  const { data } = await productApi.delete<ApiResponse<null>>(
    `/products/${productId}/units/${unitId}`,
  );
  return data;
}

export async function importProducts(
  file: File,
): Promise<ApiResponse<ImportResult>> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await productApi.post<ApiResponse<ImportResult>>(
    '/products/import',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

export async function exportProducts(
  query: ListProductsQuery,
  ids?: string[],
): Promise<Blob> {
  const { data } = await productApi.get<Blob>('/products/export', {
    params: { ...query, ...(ids?.length ? { ids: ids.join(',') } : {}) },
    responseType: 'blob',
  });
  return data;
}
