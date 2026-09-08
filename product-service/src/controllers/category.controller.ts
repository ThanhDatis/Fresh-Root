import type { Request, Response } from 'express';

import { categoryService } from '../services/category.service';
import { sendSuccess } from '../utils/apiResponse';
import type { CreateCategoryInput, UpdateCategoryInput } from '../validations/category.validation';

async function createCategory(req: Request, res: Response): Promise<void> {
  const category = await categoryService.createCategory(req.body as CreateCategoryInput);
  sendSuccess(res, 201, 'Tạo danh mục thành công', { category });
}

async function getCategoryTree(_req: Request, res: Response): Promise<void> {
  const categories = await categoryService.getCategoryTree();
  sendSuccess(res, 200, 'Lấy cây danh mục thành công', { categories });
}

async function updateCategory(req: Request, res: Response): Promise<void> {
  const category = await categoryService.updateCategory(
    req.params.id as string,
    req.body as UpdateCategoryInput,
  );
  sendSuccess(res, 200, 'Sửa danh mục thành công', { category });
}

async function deleteCategory(req: Request, res: Response): Promise<void> {
  await categoryService.deleteCategory(req.params.id as string);
  sendSuccess(res, 200, 'Xóa danh mục thành công', null);
}

export const categoryController = {
  createCategory,
  getCategoryTree,
  updateCategory,
  deleteCategory,
};