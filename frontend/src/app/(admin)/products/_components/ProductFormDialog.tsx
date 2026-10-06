'use client';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import type { ZodError } from 'zod';

import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import {
  createProductFormSchema,
  updateProductFormSchema,
} from '@/lib/validators/product';
import {
  createProduct,
  getProductById,
  updateProduct,
  updateProductStatus,
} from '@/services/product.service';
import { useUIStore } from '@/stores/uiStore';
import type { ProductStatus, ProductUnit } from '@/types/product.types';
import { getApiErrorMessage } from '@/utils/apiError';
import type { FlattenedCategory } from '@/utils/category';

import ProductUnitsSection from './ProductUnitsSection';

export type ProductFormMode = 'create' | 'edit' | 'view';

interface ProductFormDialogProps {
  mode: ProductFormMode;
  productId?: string;
  categories: FlattenedCategory[];
  onClose: () => void;
  onSaved: () => void;
}

interface FormFields {
  name: string;
  description: string;
  categoryId: string;
  barcode: string;
  costPrice: string;
  sellPrice: string;
  lowStockThreshold: string;
  baseUnitName: string;
  initialStock: string;
  status: ProductStatus;
}

const EMPTY_FIELDS: FormFields = {
  name: '',
  description: '',
  categoryId: '',
  barcode: '',
  costPrice: '',
  sellPrice: '',
  lowStockThreshold: '0',
  baseUnitName: '',
  initialStock: '0',
  status: 'active',
};

const DIALOG_TITLE: Record<ProductFormMode, string> = {
  create: 'Add product',
  edit: 'Edit product',
  view: 'Product detail',
};

export default function ProductFormDialog({
  mode,
  productId,
  categories,
  onClose,
  onSaved,
}: ProductFormDialogProps) {
  const showToast = useUIStore((state) => state.showToast);

  const [fields, setFields] = useState<FormFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormFields, string>>
  >({});
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [productCode, setProductCode] = useState('');
  const [originalStatus, setOriginalStatus] = useState<ProductStatus>('active');

  const [loadingDetail, setLoadingDetail] = useState(mode !== 'create');
  const [submitting, setSubmitting] = useState(false);

  const readOnly = mode === 'view';

  // Dialog này luôn được mount MỚI mỗi lần mở (parent render có điều kiện
  // `{dialogState && <ProductFormDialog .../>}`), nên state khởi tạo qua
  // useState(...) ở trên đã đúng ngay từ đầu cho mode="create" — effect dưới
  // đây chỉ còn việc fetch dữ liệu cho mode="edit"/"view", không cần
  // nhánh nào gọi setState đồng bộ nữa (tránh vi phạm rule set-state-in-effect).
  useEffect(() => {
    if (mode === 'create' || !productId) return;

    let active = true;

    getProductById(productId).then((res) => {
      if (!active) return;
      const { product, units: productUnits } = res.data;
      setFields({
        name: product.name,
        description: product.description ?? '',
        categoryId: product.categoryId,
        barcode: product.barcode ?? '',
        costPrice: String(product.costPrice),
        sellPrice: String(product.sellPrice),
        lowStockThreshold: String(product.lowStockThreshold),
        baseUnitName: '',
        initialStock: String(product.stockQuantity),
        status: product.status,
      });
      setUnits(productUnits);
      setProductCode(product.productCode);
      setOriginalStatus(product.status);
      setErrors({});
      setLoadingDetail(false);
    });

    return () => {
      active = false;
    };
  }, [mode, productId]);

  function setField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function applyValidationErrors(error: ZodError) {
    const nextErrors: Partial<Record<keyof FormFields, string>> = {};
    for (const issue of error.issues) {
      const field = issue.path[0] as keyof FormFields;
      if (!nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    }
    setErrors(nextErrors);
  }

  async function handleSubmit() {
    if (mode === 'create') {
      const parsed = createProductFormSchema.safeParse({
        name: fields.name,
        description: fields.description || undefined,
        categoryId: fields.categoryId,
        barcode: fields.barcode || undefined,
        costPrice: fields.costPrice,
        sellPrice: fields.sellPrice,
        baseUnitName: fields.baseUnitName,
        lowStockThreshold: fields.lowStockThreshold,
        initialStock: fields.initialStock,
      });

      if (!parsed.success) {
        applyValidationErrors(parsed.error);
        return;
      }

      setSubmitting(true);
      try {
        const res = await createProduct(parsed.data);
        showToast(res.message, 'success');
        onSaved();
      } catch (error) {
        showToast(getApiErrorMessage(error, 'Tạo sản phẩm thất bại'), 'error');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (mode === 'edit' && productId) {
      const parsed = updateProductFormSchema.safeParse({
        name: fields.name,
        description: fields.description || undefined,
        categoryId: fields.categoryId,
        barcode: fields.barcode || undefined,
        costPrice: fields.costPrice,
        sellPrice: fields.sellPrice,
        lowStockThreshold: fields.lowStockThreshold,
      });

      if (!parsed.success) {
        applyValidationErrors(parsed.error);
        return;
      }

      setSubmitting(true);
      try {
        const [updateRes] = await Promise.all([
          updateProduct(productId, parsed.data),
          fields.status !== originalStatus
            ? updateProductStatus(productId, fields.status)
            : Promise.resolve(null),
        ]);
        showToast(updateRes.message, 'success');
        onSaved();
      } catch (error) {
        showToast(
          getApiErrorMessage(error, 'Cập nhật sản phẩm thất bại'),
          'error',
        );
      } finally {
        setSubmitting(false);
      }
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={DIALOG_TITLE[mode]}
      maxWidth="md"
      actions={
        <>
          <Button variant="outlined" onClick={onClose}>
            {readOnly ? 'Close' : 'Cancel'}
          </Button>
          {!readOnly && (
            <Button
              variant="contained"
              loading={submitting}
              onClick={handleSubmit}
            >
              Save
            </Button>
          )}
        </>
      }
    >
      {loadingDetail ? (
        <Typography variant="body2" color="text.secondary">
          Đang tải...
        </Typography>
      ) : (
        <Stack spacing={2.5}>
          <Grid container spacing={2}>
            {mode !== 'create' && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  name="productCode"
                  label="Product Code"
                  value={productCode}
                  isError={false}
                  disabled
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                name="name"
                label="Product Name"
                value={fields.name}
                isError={!!errors.name}
                errorText={errors.name}
                disabled={readOnly}
                onChange={(event) => setField('name', event.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                name="barcode"
                label="Barcode"
                value={fields.barcode}
                isError={!!errors.barcode}
                errorText={errors.barcode}
                disabled={readOnly}
                onChange={(event) => setField('barcode', event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                error={!!errors.categoryId}
                disabled={readOnly}
              >
                <Select
                  displayEmpty
                  value={fields.categoryId}
                  onChange={(event: SelectChangeEvent) =>
                    setField('categoryId', event.target.value)
                  }
                >
                  <MenuItem value="" disabled>
                    Select category
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem
                      key={category.id}
                      value={category.id}
                      sx={{ pl: 2 + category.depth * 2 }}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.categoryId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                name="costPrice"
                label="Cost Price"
                typeInput="number"
                value={fields.costPrice}
                isError={!!errors.costPrice}
                errorText={errors.costPrice}
                disabled={readOnly}
                onChange={(event) => setField('costPrice', event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                name="sellPrice"
                label="Sell Price"
                typeInput="number"
                value={fields.sellPrice}
                isError={!!errors.sellPrice}
                errorText={errors.sellPrice}
                disabled={readOnly}
                onChange={(event) => setField('sellPrice', event.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                name="initialStock"
                label="Stock quantity"
                typeInput="number"
                value={fields.initialStock}
                isError={!!errors.initialStock}
                errorText={errors.initialStock}
                disabled={readOnly || mode === 'edit'}
                helperText={
                  mode === 'edit' ? 'Điều chỉnh qua Stock Take' : undefined
                }
                onChange={(event) =>
                  setField('initialStock', event.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                name="lowStockThreshold"
                label="Low-stock threshold"
                typeInput="number"
                value={fields.lowStockThreshold}
                isError={!!errors.lowStockThreshold}
                errorText={errors.lowStockThreshold}
                disabled={readOnly}
                onChange={(event) =>
                  setField('lowStockThreshold', event.target.value)
                }
              />
            </Grid>
          </Grid>

          {mode !== 'create' && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.5,
                borderRadius: 2,
                bgcolor: 'action.hover',
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Status
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active products are sellable at the POS terminal.
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={fields.status === 'active'}
                    disabled={readOnly}
                    onChange={(event) =>
                      setField(
                        'status',
                        event.target.checked ? 'active' : 'inactive',
                      )
                    }
                  />
                }
                label={fields.status === 'active' ? 'Active' : 'Inactive'}
                labelPlacement="start"
              />
            </Box>
          )}

          {mode === 'create' ? (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Units
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                Multi-unit support — base unit plus conversions and their own
                prices.
              </Typography>
              <Input
                name="baseUnitName"
                label="Base unit name"
                placeholder="kg"
                value={fields.baseUnitName}
                isError={!!errors.baseUnitName}
                errorText={errors.baseUnitName}
                onChange={(event) =>
                  setField('baseUnitName', event.target.value)
                }
              />
            </Box>
          ) : (
            productId && (
              <ProductUnitsSection
                productId={productId}
                units={units}
                onUnitsChange={setUnits}
                productSellPrice={Number(fields.sellPrice) || 0}
                readOnly={readOnly}
              />
            )
          )}
        </Stack>
      )}
    </Dialog>
  );
}
