'use client';

import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Button from '@/components/ui/Button';
import { sage } from '@/constants/colors';

interface ProductBulkActionBarProps {
  selectedCount: number;
  onDeleteSelected: () => void;
  onExportSelected: () => void;
  onCancel: () => void;
}

export default function ProductBulkActionBar({
  selectedCount,
  onDeleteSelected,
  onExportSelected,
  onCancel,
}: ProductBulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 16,
        zIndex: 10,
        mt: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 1.5,
        borderRadius: 2,
        bgcolor: sage[900],
        color: '#fff',
        boxShadow: 4,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {selectedCount} rows selected
      </Typography>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
          onClick={onExportSelected}
          sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
        >
          Export selected
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<DeleteOutlineIcon fontSize="small" />}
          onClick={onDeleteSelected}
        >
          Delete selected
        </Button>
        <Button
          variant="text"
          size="small"
          startIcon={<CloseIcon fontSize="small" />}
          onClick={onCancel}
          sx={{ color: '#fff' }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}
