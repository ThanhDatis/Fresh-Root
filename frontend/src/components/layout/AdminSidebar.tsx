'use client';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type MouseEvent, type ReactNode } from 'react';

import Avatar from '@/components/ui/Avatar';
import { sage, borderLine, red } from '@/constants/colors';
import { ROUTES } from '@/constants/routes';
import { logoutApi } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Products',
    href: ROUTES.PRODUCTS,
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
  {
    label: 'Orders',
    href: ROUTES.ORDERS,
    icon: <ShoppingCartOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Customers',
    href: ROUTES.CUSTOMERS,
    icon: <PeopleAltOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Employees',
    href: ROUTES.EMPLOYEES,
    icon: <BadgeOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Report',
    href: ROUTES.REPORTS,
    icon: <AssessmentOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Purchasing',
    href: ROUTES.PURCHASING,
    icon: <LocalShippingOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Cashbook',
    href: ROUTES.CASHBOOK,
    icon: <AccountBalanceWalletOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Tax',
    href: ROUTES.TAX,
    icon: <PercentOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Settings',
    href: ROUTES.SETTINGS,
    icon: <SettingsOutlinedIcon fontSize="small" />,
  },
];

interface AdminSidebarProps {
  width: number;
  collapsedWidth: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({
  width,
  collapsedWidth,
  collapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [hovered, setHovered] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const expanded = !collapsed || hovered;
  const isOverlaying = collapsed && hovered;

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleProfile = () => {
    handleCloseMenu();
    router.push(ROUTES.PROFILE);
  };

  const handleLogout = async () => {
    handleCloseMenu();
    try {
      await logoutApi();
    } finally {
      logout();
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <Box
      component="aside"
      onMouseEnter={() => collapsed && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: isOverlaying ? 1300 : 1100,
        height: '100vh',
        width: expanded ? width : collapsedWidth,
        bgcolor: 'background.paper',
        borderRight: `1px solid ${borderLine}`,
        boxShadow: isOverlaying ? 4 : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          px: expanded ? 2.5 : 1,
          py: 2.5,
        }}
      >
        {expanded && (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', minWidth: 0, overflow: 'hidden' }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: sage[100],
                color: sage[700],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SpaOutlinedIcon fontSize="small" />
            </Box>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontWeight: 700, letterSpacing: 0.5 }}
            >
              LOGO
            </Typography>
          </Stack>
        )}
        <IconButton
          size="small"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Stack
        component="nav"
        spacing={0.5}
        sx={{ px: expanded ? 1.5 : 1, flex: 1, overflowY: 'auto' }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Box
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: expanded ? 'flex-start' : 'center',
                gap: expanded ? 1.5 : 0,
                px: expanded ? 2 : 0,
                py: 1.25,
                borderRadius: 2,
                textDecoration: 'none',
                color: isActive ? '#ffffff' : 'text.primary',
                bgcolor: isActive ? sage[900] : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'background-color 0.15s ease',
                '&:hover': {
                  bgcolor: isActive ? sage[900] : sage[50],
                },
              }}
            >
              {item.icon}
              {expanded && (
                <Typography
                  component="span"
                  noWrap
                  sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}
                >
                  {item.label}
                </Typography>
              )}
            </Box>
          );
        })}
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          px: expanded ? 2 : 1,
          py: 2,
          borderTop: `1px solid ${borderLine}`,
        }}
      >
        <Avatar name={user?.fullName ?? 'Admin'} size="medium" />
        {expanded && (
          <>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {user?.fullName ?? 'Name Admin'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                System Admin
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleOpenMenu} aria-label="More">
              <MoreVertIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </IconButton>
          </>
        )}
      </Stack>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: red[600] }}>
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" sx={{ color: red[600] }} />
          </ListItemIcon>
          <ListItemText>Log Out</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
