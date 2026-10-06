'use client';

import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { blue, inverseTextColor, orange } from '@/constants/colors';
import type { FlattenedCategory } from '@/utils/category';

interface ProductToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  categories: FlattenedCategory[];
  status: string;
  onStatusChange: (value: string) => void;
  onAddProduct: () => void;
  onImportExcel: () => void;
  onExportExcel: () => void;
}

export default function ProductToolbar({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  categories,
  status,
  onStatusChange,
  onAddProduct,
  onImportExcel,
  onExportExcel,
}: ProductToolbarProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      sx={{ mb: 2, alignItems: { xs: 'stretch', md: 'center' } }}
    >
      <Stack direction="row" spacing={1.5} sx={{ flex: 1 }}>
        <Input
          name="search"
          label=""
          placeholder="Search by name, code, barcode..."
          value={search}
          isError={false}
          size="small"
          prefixIcon={<SearchIcon fontSize="small" />}
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{ minWidth: 220 }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            displayEmpty
            value={categoryId}
            onChange={(event: SelectChangeEvent) =>
              onCategoryChange(event.target.value)
            }
          >
            <MenuItem value="">Category: All</MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                value={category.id}
                sx={{ pl: 2 + category.depth * 2 }}
              >
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            displayEmpty
            value={status}
            onChange={(event: SelectChangeEvent) =>
              onStatusChange(event.target.value)
            }
          >
            <MenuItem value="">Status: All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="outlined"
          startIcon={<FileUploadOutlinedIcon fontSize="small" />}
          onClick={onImportExcel}
          sx={{
            backgroundColor: blue[600],
            border: 'none',
            color: inverseTextColor,
          }}
        >
          Import Excel
        </Button>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
          onClick={onExportExcel}
          sx={{
            backgroundColor: orange[600],
            border: 'none',
            color: inverseTextColor,
          }}
        >
          Export Excel
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon fontSize="small" />}
          onClick={onAddProduct}
        >
          Add Product
        </Button>
      </Stack>
    </Stack>
  );
}
