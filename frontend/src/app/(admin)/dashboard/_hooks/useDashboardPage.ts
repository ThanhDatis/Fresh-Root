'use client';

import { useEffect, useMemo, useState } from 'react';

import { getDashboardStats } from '@/services/dashboard.service';
import type { DashboardStats, RevenueRange } from '@/types/dashboard.types';

export function useDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [revenueRange, setRevenueRange] = useState<RevenueRange>('day');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    getDashboardStats().then((data) => {
      if (active) {
        setStats(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const paginatedOrders = useMemo(() => {
    if (!stats) return [];
    const start = page * rowsPerPage;
    return stats.recentOrders.slice(start, start + rowsPerPage);
  }, [stats, page, rowsPerPage]);

  function handleRowsPerPageChange(nextRowsPerPage: number) {
    setRowsPerPage(nextRowsPerPage);
    setPage(0);
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAllOnPage() {
    const allSelected = paginatedOrders.every((o) => selectedIds.has(o.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      paginatedOrders.forEach((o) => {
        if (allSelected) {
          next.delete(o.id);
        } else {
          next.add(o.id);
        }
      });
      return next;
    });
  }

  return {
    stats,
    loading,
    revenueRange,
    setRevenueRange,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage: handleRowsPerPageChange,
    selectedIds,
    paginatedOrders,
    toggleRow,
    toggleAllOnPage,
  };
}
