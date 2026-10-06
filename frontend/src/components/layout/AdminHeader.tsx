'use client';

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useState } from 'react';

import { sage, borderLine } from '@/constants/colors';
import { ROUTES } from '@/constants/routes';

const SEARCH_PLACEHOLDER = 'Search, orders, products,...';

export default function AdminHeader() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: 3,
        py: 1.5,
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${borderLine}`,
      }}
    >
      <Box sx={{ position: 'relative', width: 300, maxWidth: '40vw' }}>
        <TextField
          size="small"
          fullWidth
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
        {!searchValue && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              pl: '40px',
              pr: 1.5,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <Typography
              component="span"
              noWrap
              sx={{
                display: 'inline-block',
                color: 'text.secondary',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                animation: 'admin-header-marquee 9s linear infinite',
                '@keyframes admin-header-marquee': {
                  '0%': { transform: 'translateX(100%)' },
                  '100%': { transform: 'translateX(-100%)' },
                },
              }}
            >
              {SEARCH_PLACEHOLDER}
            </Typography>
          </Box>
        )}
      </Box>

      <Switch
        size="small"
        checked={darkMode}
        onChange={(e) => setDarkMode(e.target.checked)}
        aria-label="Toggle theme"
      />

      <IconButton size="small">
        <NotificationsNoneOutlinedIcon />
      </IconButton>

      <Stack
        component={Link}
        href={ROUTES.SALE}
        direction="row"
        spacing={0.75}
        sx={{
          alignItems: 'center',
          px: 2,
          py: 0.75,
          borderRadius: 999,
          bgcolor: sage[900],
          color: '#ffffff',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          '&:hover': { bgcolor: sage[800] },
        }}
      >
        <OpenInNewOutlinedIcon fontSize="small" />
        <span>POS</span>
      </Stack>
    </Stack>
  );
}
