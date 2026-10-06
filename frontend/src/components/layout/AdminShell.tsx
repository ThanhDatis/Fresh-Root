'use client';

import Box from '@mui/material/Box';
import { useState, type ReactNode } from 'react';

import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar
        width={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          ml: `${collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH}px`,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <AdminHeader />
        <Box component="main" sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
