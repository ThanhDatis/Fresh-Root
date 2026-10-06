'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, type MouseEvent } from 'react';

import type { Product } from '@/types/product.types';

interface ProductActionsMenuProps {
  product: Product;
  onEdit: () => void;
  onView: () => void;
  onToggleStatus: () => void;
  onDeleteRequest: () => void;
}

export default function ProductActionsMenu({
  product,
  onEdit,
  onView,
  onToggleStatus,
  onDeleteRequest,
}: ProductActionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isActive = product.status === 'active';

  function handleOpen(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function runAndClose(action: () => void) {
    handleClose();
    action();
  }

  return (
    <>
      <IconButton size="small" onClick={handleOpen} aria-label="More">
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => runAndClose(onEdit)}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => runAndClose(onView)}>
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => runAndClose(onToggleStatus)}>
          <ListItemIcon>
            <PowerSettingsNewOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{isActive ? 'Deactivate' : 'Activate'}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => runAndClose(onDeleteRequest)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
