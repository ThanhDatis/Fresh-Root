'use client';

import type {
  GridColumnVisibilityModel,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { getCategoryTree } from '@/services/category.service';
import { deleteProduct, listProducts } from '@/services/product.service';
import { useUIStore } from '@/stores/uiStore';
import type { Product, ProductStatus } from '@/types/product.types';
import { flattenCategoryTree, type FlattenedCategory } from '@/utils/category';

const PAGE_SIZE_DEFAULT = 10;
const COLUMN_VISIBILITY_STORAGE_KEY = 'products-column-visibility';
const DEFAULT_COLUMN_VISIBILITY: GridColumnVisibilityModel = {};

function readStoredColumnVisibility(): GridColumnVisibilityModel {
  if (typeof window === 'undefined') return DEFAULT_COLUMN_VISIBILITY;
  try {
    const raw = window.localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
    return raw
      ? (JSON.parse(raw) as GridColumnVisibilityModel)
      : DEFAULT_COLUMN_VISIBILITY;
  } catch {
    return DEFAULT_COLUMN_VISIBILITY;
  }
}

function writeStoredColumnVisibility(model: GridColumnVisibilityModel) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    COLUMN_VISIBILITY_STORAGE_KEY,
    JSON.stringify(model),
  );
}

interface ProductListResult {
  key: string;
  data: Product[];
  totalItems: number;
}

interface StatCountsResult {
  key: number;
  total: number;
  active: number;
  lowStock: number;
}

export function useAdminProductsPage() {
  const showToast = useUIStore((state) => state.showToast);

  // page: 0-based để khớp trực tiếp với convention của DataGrid (CustomTable)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  const [search, setSearchState] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [categoryId, setCategoryIdState] = useState('');
  const [status, setStatusState] = useState<ProductStatus | ''>('');

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [categories, setCategories] = useState<FlattenedCategory[]>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(readStoredColumnVisibility);

  // refreshKey không mang ý nghĩa gì cả — chỉ dùng để "ép" các effect fetch
  // bên dưới chạy lại khi gọi refetch(), dù page/filter không đổi
  // (vd: sau khi save 1 sản phẩm ở Phase 3)
  const [refreshKey, setRefreshKey] = useState(0);
  const refetch = useCallback(() => setRefreshKey((key) => key + 1), []);

  // Đổi search/category/status thì luôn quay về trang đầu. Reset ngay trong
  // setter (chạy lúc user gõ/chọn) thay vì dùng 1 effect riêng theo dõi
  // debouncedSearch/categoryId/status rồi gọi setPage(0) — ESLint rule
  // react-hooks/set-state-in-effect cấm setState đồng bộ ngay trong effect,
  // và đây đúng kiểu "derived state" nên xử lý lúc có sự kiện là hợp lý hơn.
  function setSearch(value: string) {
    setSearchState(value);
    setPage(0);
  }
  function setCategoryId(value: string) {
    setCategoryIdState(value);
    setPage(0);
  }
  function setStatus(value: ProductStatus | '') {
    setStatusState(value);
    setPage(0);
  }

  // Load danh mục 1 lần khi mount
  useEffect(() => {
    let active = true;
    getCategoryTree().then((res) => {
      if (active) {
        setCategories(flattenCategoryTree(res.data.categories));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // "Chữ ký" của query hiện tại — loading được SUY RA bằng cách so sánh key
  // này với key của kết quả đang lưu trong state, thay vì gọi setLoading(true)
  // đồng bộ ngay trong effect (bị ESLint rule set-state-in-effect cấm).
  const queryKey = useMemo(
    () =>
      JSON.stringify({
        page,
        pageSize,
        debouncedSearch,
        categoryId,
        status,
        refreshKey,
      }),
    [page, pageSize, debouncedSearch, categoryId, status, refreshKey],
  );

  const [listResult, setListResult] = useState<ProductListResult | null>(null);
  const loading = listResult?.key !== queryKey;

  useEffect(() => {
    let active = true;

    listProducts({
      page: page + 1, // API 1-based, state của mình 0-based
      limit: pageSize,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(status ? { status } : {}),
    }).then((res) => {
      if (!active) return;
      setListResult({
        key: queryKey,
        data: res.data,
        totalItems: res.pagination.totalItems,
      });
    });

    return () => {
      active = false;
    };
  }, [queryKey, page, pageSize, debouncedSearch, categoryId, status]);

  const products = listResult?.data ?? [];
  const totalItems = listResult?.totalItems ?? 0;

  // Stat card: 3 request song song, không phụ thuộc filter/search hiện tại —
  // chỉ refetch khi refreshKey đổi (mount lần đầu + sau mutation)
  const [statResult, setStatResult] = useState<StatCountsResult | null>(null);
  const statsLoading = statResult?.key !== refreshKey;

  useEffect(() => {
    let active = true;

    Promise.all([
      listProducts({ page: 1, limit: 1 }),
      listProducts({ page: 1, limit: 1, status: 'active' }),
      listProducts({ page: 1, limit: 1, lowStock: true }),
    ]).then(([totalRes, activeRes, lowStockRes]) => {
      if (!active) return;
      setStatResult({
        key: refreshKey,
        total: totalRes.pagination.totalItems,
        active: activeRes.pagination.totalItems,
        lowStock: lowStockRes.pagination.totalItems,
      });
    });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const statCounts = statResult
    ? {
        total: statResult.total,
        active: statResult.active,
        lowStock: statResult.lowStock,
      }
    : null;

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const rowSelectionModel: GridRowSelectionModel = useMemo(
    () => ({ type: 'include', ids: selectedIds }),
    [selectedIds],
  );

  function handlePageChange(nextPage: number, nextPageSize: number) {
    setPage(nextPage);
    setPageSize(nextPageSize);
  }

  function handleRowSelectionModelChange(model: GridRowSelectionModel) {
    setSelectedIds(new Set(model.ids as Set<string>));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  // Backend chưa có endpoint xóa hàng loạt — gọi DELETE /:id song song cho
  // từng id bằng Promise.allSettled, để 1 request lỗi không làm hỏng các
  // request còn lại (khác Promise.all — sẽ dừng ngay khi có 1 cái reject).
  async function bulkDeleteSelected(ids: string[]) {
    const results = await Promise.allSettled(
      ids.map((id) => deleteProduct(id)),
    );
    const succeeded = results.filter(
      (result) => result.status === 'fulfilled',
    ).length;
    const failed = results.length - succeeded;

    if (failed === 0) {
      showToast(`Đã vô hiệu hóa ${succeeded} sản phẩm`, 'success');
    } else {
      showToast(
        `Đã vô hiệu hóa ${succeeded}/${results.length} sản phẩm, ${failed} thất bại`,
        succeeded > 0 ? 'warning' : 'error',
      );
    }

    clearSelection();
    refetch();
  }

  function handleColumnVisibilityModelChange(model: GridColumnVisibilityModel) {
    setColumnVisibilityModel(model);
    writeStoredColumnVisibility(model);
  }

  function resetColumnVisibility() {
    setColumnVisibilityModel(DEFAULT_COLUMN_VISIBILITY);
    writeStoredColumnVisibility(DEFAULT_COLUMN_VISIBILITY);
  }

  return {
    products,
    totalItems,
    loading,
    statCounts,
    statsLoading,

    page,
    pageSize,
    onPageChange: handlePageChange,

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
    onColumnVisibilityModelChange: handleColumnVisibilityModelChange,
    resetColumnVisibility,

    selectedIds,
    rowSelectionModel,
    onRowSelectionModelChange: handleRowSelectionModelChange,
    clearSelection,
    bulkDeleteSelected,

    refetch,
  };
}
