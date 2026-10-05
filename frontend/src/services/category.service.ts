import type { ApiResponse } from '@/types/api.types';
import type { Category } from '@/types/product.types';

import { productApi } from './axiosInstances';

export async function getCategoryTree(): Promise<
  ApiResponse<{ categories: Category[] }>
> {
  const { data } =
    await productApi.get<ApiResponse<{ categories: Category[] }>>(
      '/categories',
    );
  return data;
}
