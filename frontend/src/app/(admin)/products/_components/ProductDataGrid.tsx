'use client';

import AddIcon from '@mui/icons-material/Add';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type {
  GridColDef,
  GridColumnVisibilityModel,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { useMemo } from 'react';

import { CustomTable } from '@/components/shared/DataTable';
import EmptyState from '@/components/shared/EmptyState';
import Button from '@/components/ui/Button';
import { gray, green, orange, red } from '@/constants/colors';
import type { Product } from '@/types/product.types';
import { formatVND } from '@/utils/currency';

import ProductActionsMenu from './ProductActionsMenu';

interface ProductDataGridProps {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  loading: boolean;
  categoryNameById: Map<string, string>;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  columnVisibilityModel: GridColumnVisibilityModel;
  onColumnVisibilityModelChange: (model: GridColumnVisibilityModel) => void;
  rowSelectionModel: GridRowSelectionModel;
  onRowSelectionModelChange: (model: GridRowSelectionModel) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onEditProduct: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onDeleteRequest: (product: Product) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onAddProduct: () => void;
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <Box
      sx={{
        px: 1.25,
        py: 0.25,
        borderRadius: 999,
        fontSize: '0.75rem',
        fontWeight: 700,
        bgcolor: active ? green[50] : gray[100],
        color: active ? green[800] : gray[700],
      }}
    >
      {active ? 'Active' : 'Inactive'}
    </Box>
  );
}

function StockPill({
  label,
  bg,
  color,
}: {
  label: string;
  bg: string;
  color: string;
}) {
  return (
    <Box
      sx={{
        px: 1.25,
        py: 0.25,
        borderRadius: 999,
        fontSize: '0.75rem',
        fontWeight: 700,
        bgcolor: bg,
        color,
      }}
    >
      {label}
    </Box>
  );
}

export default function ProductDataGrid({
  products,
  totalCount,
  page,
  pageSize,
  loading,
  categoryNameById,
  sortModel,
  onSortModelChange,
  columnVisibilityModel,
  onColumnVisibilityModelChange,
  rowSelectionModel,
  onRowSelectionModelChange,
  onPageChange,
  onEditProduct,
  onViewProduct,
  onToggleStatus,
  onDeleteRequest,
  hasActiveFilters,
  onClearFilters,
  onAddProduct,
}: ProductDataGridProps) {
  const columnHeaders: GridColDef<Product>[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Product',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 200,
        sortingOrder: ['asc', 'desc'],
        renderCell: (params) => (
          <Box
            sx={{
              // py: 0,
              height: '100%',
              // display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.productCode}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'categoryId',
        headerName: 'Category',
        headerAlign: 'center',
        align: 'center',
        flex: 0.9,
        sortable: false,
        renderCell: (params) =>
          categoryNameById.get(params.row.categoryId) ?? '—',
      },
      {
        field: 'barcode',
        headerName: 'Barcode',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        sortable: false,
        renderCell: (params) => params.row.barcode ?? '—',
      },
      {
        field: 'costPrice',
        headerName: 'Cost Price',
        headerAlign: 'center',
        align: 'center',
        flex: 0.8,
        sortingOrder: ['asc', 'desc'],
        valueFormatter: (value: number) => formatVND(value),
      },
      {
        field: 'sellPrice',
        headerName: 'Sell Price',
        headerAlign: 'center',
        align: 'center',
        flex: 0.8,
        sortingOrder: ['asc', 'desc'],
        valueFormatter: (value: number) => formatVND(value),
      },
      {
        field: 'stockQuantity',
        headerName: 'Stock',
        headerAlign: 'center',
        align: 'center',
        flex: 0.7,
        sortingOrder: ['asc', 'desc'],
        renderCell: (params) => {
          const { stockQuantity, lowStockThreshold } = params.row;
          if (stockQuantity === 0) {
            return (
              <StockPill label="Out of stock" bg={red[50]} color={red[700]} />
            );
          }
          if (lowStockThreshold > 0 && stockQuantity <= lowStockThreshold) {
            return (
              <StockPill
                label={`${stockQuantity} left`}
                bg={orange[50]}
                color={orange[800]}
              />
            );
          }
          return <Typography variant="body2">{stockQuantity}</Typography>;
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        headerAlign: 'center',
        align: 'center',
        flex: 0.6,
        sortable: false,
        renderCell: (params) => (
          <StatusPill active={params.row.status === 'active'} />
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 56,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: 'right',
        renderCell: (params) => (
          <ProductActionsMenu
            product={params.row}
            onEdit={() => onEditProduct(params.row)}
            onView={() => onViewProduct(params.row)}
            onToggleStatus={() => onToggleStatus(params.row)}
            onDeleteRequest={() => onDeleteRequest(params.row)}
          />
        ),
      },
    ],
    [
      categoryNameById,
      onEditProduct,
      onViewProduct,
      onToggleStatus,
      onDeleteRequest,
    ],
  );

  function renderNoRows() {
    if (hasActiveFilters) {
      return (
        <EmptyState
          icon={<Inventory2OutlinedIcon />}
          title="No products found"
          description="Không có sản phẩm nào khớp với bộ lọc hiện tại."
          action={
            <Button
              variant="outlined"
              size="small"
              onClick={onClearFilters}
              sx={{ mt: 1.5 }}
            >
              Clear filters
            </Button>
          }
        />
      );
    }
    return (
      <EmptyState
        icon={<Inventory2OutlinedIcon />}
        title="No products yet"
        description="Bắt đầu bằng cách thêm sản phẩm đầu tiên vào kho hàng."
        action={
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon fontSize="small" />}
            onClick={onAddProduct}
            sx={{ mt: 1.5 }}
          >
            Add Product
          </Button>
        }
      />
    );
  }

  return (
    <CustomTable<Product>
      items={products}
      columnHeaders={columnHeaders}
      totalCount={totalCount}
      currentPage={page}
      maxPageSize={pageSize}
      onPageChange={onPageChange}
      isLoading={loading}
      rowHeight={64}
      checkboxSelection
      rowSelectionModel={rowSelectionModel}
      onRowSelectionModelChange={onRowSelectionModelChange}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={onColumnVisibilityModelChange}
      getRowId={(row) => row._id}
      noDataMessage="No products found"
      renderNoRows={renderNoRows}
    />
  );
}
