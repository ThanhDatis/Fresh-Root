'use client';

import { Box, type SxProps, type Theme } from '@mui/material';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
  type GridColumnVisibilityModel,
  type GridDensity,
  type GridPaginationModel,
  type GridRowClassNameParams,
  type GridRowParams,
  type GridRowSelectionModel,
  type GridSortModel,
  type GridValidRowModel,
  type MuiEvent,
} from '@mui/x-data-grid';
import type { MouseEvent, ReactNode } from 'react';

import EmptyState from '../EmptyState';

export interface CustomTableProps<T extends GridValidRowModel> {
  items: T[];
  columnHeaders: GridColDef<T>[];
  totalCount: number;
  currentPage: number;
  maxPageSize?: number;
  onPageChange: (page: number, pageSize: number) => void;

  isLoading?: boolean;
  checkboxSelection?: boolean;
  rowSelectionModel?: GridRowSelectionModel;
  onRowSelectionModelChange?: (ids: GridRowSelectionModel) => void;
  isRowSelectable?: (row: T) => boolean;
  preventActiveCheckBoxFields?: string[];
  sortModel?: GridSortModel;
  onSortModelChange?: (model: GridSortModel) => void;
  columnVisibilityModel?: GridColumnVisibilityModel;
  onColumnVisibilityModelChange?: (model: GridColumnVisibilityModel) => void;
  rowHeight?: number;
  density?: GridDensity;
  sx?: SxProps<Theme>;
  className?: (row: T) => string;
  hideFooterPagination?: boolean;
  getRowId?: (row: T) => string | number;
  onRowClick?: (params: GridRowParams<T>) => void;
  onCellClick?: (
    params: GridCellParams<T>,
    event: MuiEvent<MouseEvent<HTMLElement>>,
  ) => void;
  noDataMessage?: string;
  renderNoRows?: () => ReactNode;
}

export default function CustomTable<T extends GridValidRowModel>({
  items,
  columnHeaders,
  totalCount,
  currentPage,
  maxPageSize = 10,
  onPageChange,
  isLoading = false,
  checkboxSelection = false,
  rowSelectionModel,
  onRowSelectionModelChange,
  isRowSelectable,
  preventActiveCheckBoxFields = [],
  sortModel,
  onSortModelChange,
  columnVisibilityModel,
  onColumnVisibilityModelChange,
  rowHeight,
  density = 'standard',
  sx,
  className,
  hideFooterPagination = false,
  getRowId,
  onRowClick,
  onCellClick,
  noDataMessage = 'No data to display',
  renderNoRows,
}: CustomTableProps<T>) {
  const handleCellClick = (
    params: GridCellParams<T>,
    event: MuiEvent<MouseEvent<HTMLElement>>,
  ) => {
    if (preventActiveCheckBoxFields.includes(params.field)) {
      event.stopPropagation();
    }
    onCellClick?.(params, event);
  };

  const noRowsOverlay =
    renderNoRows ?? (() => <EmptyState title={noDataMessage} size="compact" />);

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        '& .MuiDataGrid-root': {
          maxWidth: '100%',
          overflow: 'auto',
        },
        ...sx,
      }}
    >
      <DataGrid
        rows={items}
        rowHeight={rowHeight}
        rowCount={totalCount}
        getRowId={getRowId ?? ((row) => row.id)}
        columns={columnHeaders}
        loading={isLoading}
        checkboxSelection={checkboxSelection}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        isRowSelectable={
          isRowSelectable ? (params) => isRowSelectable(params.row) : undefined
        }
        paginationMode="server"
        paginationModel={{ page: currentPage, pageSize: maxPageSize }}
        onPaginationModelChange={(model: GridPaginationModel) =>
          onPageChange(model.page, model.pageSize)
        }
        hideFooterPagination={hideFooterPagination}
        pageSizeOptions={[10, 20, 50]}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={onColumnVisibilityModelChange}
        onRowClick={onRowClick}
        onCellClick={handleCellClick}
        getRowClassName={
          className
            ? (params: GridRowClassNameParams<T>) => className(params.row)
            : undefined
        }
        localeText={{
          footerRowSelected: (count) =>
            checkboxSelection ? `Selected ${count} rows` : '',
          noRowsLabel: noDataMessage,
          paginationDisplayedRows: ({ from, to, count }) =>
            `${from}–${to} of ${count !== -1 ? count : `0`}`,
        }}
        slots={{
          noRowsOverlay,
          noResultsOverlay: noRowsOverlay,
        }}
        slotProps={{
          loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' },
        }}
        density={density}
        disableColumnResize
        initialState={{
          pagination: {
            paginationModel: { pageSize: maxPageSize, page: currentPage },
          },
        }}
      />
    </Box>
  );
}
