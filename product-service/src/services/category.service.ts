import { Types } from 'mongoose';

import { AppError } from '../errors/AppError';
import { categoryRepository, type CategoryDocument } from '../repositories/category.repository';
import { productRepository } from '../repositories/product.repository';
import type { CreateCategoryInput, UpdateCategoryInput } from '../validations/category.validation';

interface CategoryTreeNode {
  _id: Types.ObjectId;
  name: string;
  parentId: Types.ObjectId | null;
  children: CategoryTreeNode[];
}

async function assertValidParent(parentId: string): Promise<void> {
  const parent = await categoryRepository.findById(parentId);
  if (!parent) {
    throw new AppError(404, 'Không tìm thấy danh mục cha', 'CATEGORY_NOT_FOUND');
  }
  if (parent.parentId !== null) {
    throw new AppError(422, 'Danh mục chỉ được tối đa 2 cấp', 'CATEGORY_MAX_DEPTH_EXCEEDED');
  }
}

async function createCategory(input: CreateCategoryInput): Promise<CategoryDocument> {
  if (input.parentId) {
    await assertValidParent(input.parentId);
  }

  return categoryRepository.create({
    name: input.name,
    parentId: input.parentId ? new Types.ObjectId(input.parentId) : null,
  });
}

function buildTree(categories: CategoryDocument[]): CategoryTreeNode[] {
  const nodeMap = new Map<string, CategoryTreeNode>();
  for (const category of categories) {
    nodeMap.set(category._id.toString(), {
      _id: category._id,
      name: category.name,
      parentId: category.parentId,
      children: [],
    });
  }

  const roots: CategoryTreeNode[] = [];
  for (const category of categories) {
    const node = nodeMap.get(category._id.toString());
    if (!node) continue;
    if (category.parentId === null) {
      roots.push(node);
    } else {
      nodeMap.get(category.parentId.toString())?.children.push(node);
    }
  }

  return roots;
}

async function getCategoryTree(): Promise<CategoryTreeNode[]> {
  const categories = await categoryRepository.findAll();
  return buildTree(categories);
}

async function updateCategory(id: string, input: UpdateCategoryInput): Promise<CategoryDocument> {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new AppError(404, 'Không tìm thấy danh mục', 'CATEGORY_NOT_FOUND');
  }

  if (input.parentId !== undefined && input.parentId !== null) {
    await assertValidParent(input.parentId);

    // Không cho biến 1 danh mục đang có con thành con của danh mục khác — sẽ tạo cấp 3
    const childrenCount = await categoryRepository.countChildren(id);
    if (childrenCount > 0) {
      throw new AppError(
        422,
        'Danh mục đang có danh mục con, không thể chuyển làm con của danh mục khác',
        'CATEGORY_MAX_DEPTH_EXCEEDED',
      );
    }
  }

  const updated = await categoryRepository.updateById(id, {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.parentId !== undefined
      ? { parentId: input.parentId ? new Types.ObjectId(input.parentId) : null }
      : {}),
  });

  if (!updated) {
    throw new AppError(404, 'Không tìm thấy danh mục', 'CATEGORY_NOT_FOUND');
  }
  return updated;
}

async function deleteCategory(id: string): Promise<void> {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new AppError(404, 'Không tìm thấy danh mục', 'CATEGORY_NOT_FOUND');
  }

  const childrenCount = await categoryRepository.countChildren(id);
  if (childrenCount > 0) {
    throw new AppError(409, 'Không thể xóa — còn danh mục con', 'CATEGORY_HAS_CHILDREN');
  }

  const productCount = await productRepository.countByCategoryId(id);
  if (productCount > 0) {
    throw new AppError(409, 'Không thể xóa — còn sản phẩm thuộc danh mục này', 'CATEGORY_HAS_PRODUCTS');
  }

  await categoryRepository.deleteById(id);
}

export const categoryService = {
  createCategory,
  getCategoryTree,
  updateCategory,
  deleteCategory,
};
