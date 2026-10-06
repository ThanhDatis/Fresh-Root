'use client';

import Stack from '@mui/material/Stack';
import { useState } from 'react';

import Breadcrumb from '@/components/shared/Breadcrumb';
import PageTitle from '@/components/shared/PageTitle';
import { ROUTES } from '@/constants/routes';
import {
  deleteProduct,
  exportProducts,
  updateProductStatus,
} from '@/services/product.service';
import { useUIStore } from '@/stores/uiStore';
import type { Product } from '@/types/product.types';
import { getApiErrorMessage } from '@/utils/apiError';
import { downloadBlob } from '@/utils/downloadBlob';

import { useAdminProductsPage } from '../_hooks/useAdminProductsPage';

import DeleteProductDialog from './DeleteProductDialog';
import ImportProductsDialog from './ImportProductsDialog';
import ProductBulkActionBar from './ProductBulkActionBar';
import ProductDataGrid from './ProductDataGrid';
import ProductFormDialog, { type ProductFormMode } from './ProductFormDialog';
import ProductStatCards from './ProductStatCards';
import ProductToolbar from './ProductToolbar';

interface DialogState {
  mode: ProductFormMode;
  productId?: string;
}

interface DeleteTarget {
  ids: string[];
  singleName?: string;
}

export default function ProductsView() {
  const showToast = useUIStore((state) => state.showToast);

  const {
    products,
    totalItems,
    loading,
    statCounts,
    statsLoading,

    page,
    pageSize,
    onPageChange,

    search,
    setSearch,
    categoryId,
    setCategoryId,
    status,
    setStatus,

    sortModel,
    setSortModel,

    categories,
    categoryNameById,

    columnVisibilityModel,
    onColumnVisibilityModelChange,

    selectedIds,
    rowSelectionModel,
    onRowSelectionModelChange,
    clearSelection,
    bulkDeleteSelected,

    refetch,
  } = useAdminProductsPage();

  const [dialogState, setDialogState] = useState<DialogState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  function closeDialog() {
    setDialogState(null);
  }

  function handleSaved() {
    closeDialog();
    refetch();
  }

  async function handleToggleStatus(product: Product) {
    const nextStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      await updateProductStatus(product._id, nextStatus);
      showToast(
        nextStatus === 'active'
          ? 'Đã kích hoạt sản phẩm'
          : 'Đã vô hiệu hóa sản phẩm',
        'success',
      );
      refetch();
    } catch (error) {
      showToast(
        getApiErrorMessage(error, 'Cập nhật trạng thái thất bại'),
        'error',
      );
    }
  }

  function handleDeleteRequest(product: Product) {
    setDeleteTarget({ ids: [product._id], singleName: product.name });
  }

  function handleBulkDeleteRequest() {
    setDeleteTarget({ ids: Array.from(selectedIds) });
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    if (deleteTarget.ids.length === 1) {
      const res = await deleteProduct(deleteTarget.ids[0]);
      showToast(res.message, 'success');
      refetch();
      return;
    }

    await bulkDeleteSelected(deleteTarget.ids);
  }

  async function handleExportExcel() {
    try {
      const blob = await exportProducts({
        ...(search ? { search } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(status ? { status } : {}),
      });
      downloadBlob(blob, 'products.xlsx');
      showToast('Đã tải xuống products.xlsx', 'success');
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Export thất bại'), 'error');
    }
  }

  function handleClearFilters() {
    setSearch('');
    setCategoryId('');
    setStatus('');
  }

  async function handleExportSelected() {
    // Backend /products/export chưa hỗ trợ lọc theo danh sách id đã chọn —
    // tạm export theo filter hiện tại, có toast báo rõ phạm vi
    showToast(
      'Export theo bộ lọc hiện tại (chưa hỗ trợ theo từng dòng đã chọn)',
      'info',
    );
    await handleExportExcel();
  }

  return (
    <Stack spacing={3}>
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Products' },
        ]}
      />
      <PageTitle
        title="Product Management"
        count={totalItems}
        countLabel="products"
      />

      <ProductStatCards counts={statCounts} loading={statsLoading} />

      <Stack sx={{ mt: 2 }}>
        <ProductToolbar
          search={search}
          onSearchChange={setSearch}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          categories={categories}
          status={status}
          onStatusChange={(value) => setStatus(value as typeof status)}
          onAddProduct={() => setDialogState({ mode: 'create' })}
          onImportExcel={() => setShowImportDialog(true)}
          onExportExcel={handleExportExcel}
        />

        <ProductDataGrid
          products={products}
          totalCount={totalItems}
          page={page}
          pageSize={pageSize}
          loading={loading}
          categoryNameById={categoryNameById}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={onRowSelectionModelChange}
          onPageChange={onPageChange}
          onEditProduct={(product) =>
            setDialogState({ mode: 'edit', productId: product._id })
          }
          onViewProduct={(product) =>
            setDialogState({ mode: 'view', productId: product._id })
          }
          onToggleStatus={handleToggleStatus}
          onDeleteRequest={handleDeleteRequest}
          hasActiveFilters={Boolean(search || categoryId || status)}
          onClearFilters={handleClearFilters}
          onAddProduct={() => setDialogState({ mode: 'create' })}
        />

        <ProductBulkActionBar
          selectedCount={selectedIds.size}
          onDeleteSelected={handleBulkDeleteRequest}
          onExportSelected={handleExportSelected}
          onCancel={clearSelection}
        />
      </Stack>

      {dialogState && (
        <ProductFormDialog
          mode={dialogState.mode}
          productId={dialogState.productId}
          categories={categories}
          onClose={closeDialog}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <DeleteProductDialog
          productIds={deleteTarget.ids}
          singleProductName={deleteTarget.singleName}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showImportDialog && (
        <ImportProductsDialog
          onClose={() => setShowImportDialog(false)}
          onImported={refetch}
        />
      )}
    </Stack>
  );
}
