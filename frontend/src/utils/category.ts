import type { Category } from '@/types/product.types';

export interface FlattenedCategory {
  id: string;
  name: string;
  depth: number;
}

export function flattenCategoryTree(
  categories: Category[],
  depth = 0,
): FlattenedCategory[] {
  return categories.flatMap((category) => [
    { id: category._id, name: category.name, depth },
    ...flattenCategoryTree(category.children, depth + 1),
  ]);
}
