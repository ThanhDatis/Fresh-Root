'use client';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import EmptyState from '@/components/shared/EmptyState';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { sage } from '@/constants/colors';
import { productUnitFormSchema } from '@/lib/validators/product';
import {
  addProductUnit,
  deleteProductUnit,
  updateProductUnit,
} from '@/services/product.service';
import { useUIStore } from '@/stores/uiStore';
import type { ProductUnit } from '@/types/product.types';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatVND } from '@/utils/currency';

interface UnitDraft {
  unitName: string;
  conversionRate: string;
  sellPrice: string;
}

const EMPTY_DRAFT: UnitDraft = {
  unitName: '',
  conversionRate: '',
  sellPrice: '',
};

interface ProductUnitsSectionProps {
  productId: string;
  units: ProductUnit[];
  onUnitsChange: (units: ProductUnit[]) => void;
  productSellPrice: number;
  readOnly?: boolean;
}

export default function ProductUnitsSection({
  productId,
  units,
  onUnitsChange,
  productSellPrice,
  readOnly = false,
}: ProductUnitsSectionProps) {
  const showToast = useUIStore((state) => state.showToast);

  const baseUnit = units.find((unit) => unit.isBaseUnit);
  const extraUnits = units.filter((unit) => !unit.isBaseUnit);

  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<UnitDraft>(EMPTY_DRAFT);
  const [editError, setEditError] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<UnitDraft>(EMPTY_DRAFT);
  const [addError, setAddError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  function startEdit(unit: ProductUnit) {
    setEditingUnitId(unit._id);
    setEditDraft({
      unitName: unit.unitName,
      conversionRate: String(unit.conversionRate),
      sellPrice: String(unit.sellPrice),
    });
    setEditError(null);
  }

  function cancelEdit() {
    setEditingUnitId(null);
    setEditError(null);
  }

  async function confirmEdit(unitId: string) {
    const parsed = productUnitFormSchema.safeParse(editDraft);
    if (!parsed.success) {
      setEditError(parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ');
      return;
    }

    setSaving(true);
    try {
      const res = await updateProductUnit(productId, unitId, parsed.data);
      onUnitsChange(
        units.map((unit) => (unit._id === unitId ? res.data.unit : unit)),
      );
      setEditingUnitId(null);
      showToast(res.message, 'success');
    } catch (error) {
      setEditError(getApiErrorMessage(error, 'Cập nhật đơn vị tính thất bại'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(unitId: string) {
    setSaving(true);
    try {
      const res = await deleteProductUnit(productId, unitId);
      onUnitsChange(units.filter((unit) => unit._id !== unitId));
      showToast(res.message, 'success');
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Xóa đơn vị tính thất bại'), 'error');
    } finally {
      setSaving(false);
    }
  }

  function startAdd() {
    setIsAdding(true);
    setAddDraft(EMPTY_DRAFT);
    setAddError(null);
  }

  function cancelAdd() {
    setIsAdding(false);
    setAddError(null);
  }

  async function confirmAdd() {
    const parsed = productUnitFormSchema.safeParse(addDraft);
    if (!parsed.success) {
      setAddError(parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ');
      return;
    }

    setSaving(true);
    try {
      const res = await addProductUnit(productId, parsed.data);
      onUnitsChange([...units, res.data.unit]);
      setIsAdding(false);
      showToast(res.message, 'success');
    } catch (error) {
      setAddError(getApiErrorMessage(error, 'Thêm đơn vị tính thất bại'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        Units
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 1.5 }}
      >
        Multi-unit support — base unit plus conversions and their own prices.
      </Typography>

      {baseUnit && (
        <Table size="small" sx={{ mb: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Unit</TableCell>
              <TableCell>Conversion rate</TableCell>
              <TableCell>Sell price</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ bgcolor: sage[50] }}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 999,
                      bgcolor: sage[200],
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    Base
                  </Box>
                  {baseUnit.unitName}
                </Box>
              </TableCell>
              <TableCell>1</TableCell>
              <TableCell>{formatVND(productSellPrice)}</TableCell>
              <TableCell align="right" />
            </TableRow>

            {extraUnits.map((unit) =>
              editingUnitId === unit._id ? (
                <TableRow key={unit._id}>
                  <TableCell>
                    <Input
                      name="unitName"
                      label=""
                      size="small"
                      value={editDraft.unitName}
                      isError={false}
                      onChange={(event) =>
                        setEditDraft((draft) => ({
                          ...draft,
                          unitName: event.target.value,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      name="conversionRate"
                      label=""
                      size="small"
                      typeInput="number"
                      value={editDraft.conversionRate}
                      isError={false}
                      onChange={(event) =>
                        setEditDraft((draft) => ({
                          ...draft,
                          conversionRate: event.target.value,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      name="sellPrice"
                      label=""
                      size="small"
                      typeInput="number"
                      value={editDraft.sellPrice}
                      isError={false}
                      onChange={(event) =>
                        setEditDraft((draft) => ({
                          ...draft,
                          sellPrice: event.target.value,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => confirmEdit(unit._id)}
                      disabled={saving}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={cancelEdit}
                      disabled={saving}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    {editError && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: 'block' }}
                      >
                        {editError}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={unit._id}>
                  <TableCell>{unit.unitName}</TableCell>
                  <TableCell>{unit.conversionRate}</TableCell>
                  <TableCell>{formatVND(unit.sellPrice)}</TableCell>
                  <TableCell align="right">
                    {!readOnly && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => startEdit(unit)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(unit._id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ),
            )}

            {isAdding && (
              <TableRow>
                <TableCell>
                  <Input
                    name="unitName"
                    label=""
                    size="small"
                    placeholder="Box"
                    value={addDraft.unitName}
                    isError={false}
                    onChange={(event) =>
                      setAddDraft((draft) => ({
                        ...draft,
                        unitName: event.target.value,
                      }))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="conversionRate"
                    label=""
                    size="small"
                    typeInput="number"
                    placeholder="10"
                    value={addDraft.conversionRate}
                    isError={false}
                    onChange={(event) =>
                      setAddDraft((draft) => ({
                        ...draft,
                        conversionRate: event.target.value,
                      }))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="sellPrice"
                    label=""
                    size="small"
                    typeInput="number"
                    placeholder="165000"
                    value={addDraft.sellPrice}
                    isError={false}
                    onChange={(event) =>
                      setAddDraft((draft) => ({
                        ...draft,
                        sellPrice: event.target.value,
                      }))
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={confirmAdd}
                    disabled={saving}
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={cancelAdd}
                    disabled={saving}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  {addError && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ display: 'block' }}
                    >
                      {addError}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {!readOnly && !isAdding && extraUnits.length === 0 && (
        <EmptyState
          size="compact"
          title="Chưa có đơn vị tính phụ"
          action={
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon fontSize="small" />}
              onClick={startAdd}
              sx={{ mt: 1 }}
            >
              Add unit
            </Button>
          }
        />
      )}

      {!readOnly && !isAdding && extraUnits.length > 0 && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon fontSize="small" />}
          onClick={startAdd}
        >
          Add unit
        </Button>
      )}
    </Box>
  );
}
