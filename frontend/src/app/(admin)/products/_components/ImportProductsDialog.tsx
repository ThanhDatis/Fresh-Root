'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import EmptyState from '@/components/shared/EmptyState';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { green, red } from '@/constants/colors';
import { importProducts } from '@/services/product.service';
import { useUIStore } from '@/stores/uiStore';
import type { ImportResult } from '@/types/product.types';
import { getApiErrorMessage } from '@/utils/apiError';

interface ImportProductsDialogProps {
  onClose: () => void;
  onImported: () => void;
}

type Step = 'upload' | 'result';

export default function ImportProductsDialog({
  onClose,
  onImported,
}: ImportProductsDialogProps) {
  const showToast = useUIStore((state) => state.showToast);

  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) setFile(acceptedFiles[0]);
    },
  });

  async function handleImport() {
    if (!file) return;
    setSubmitting(true);
    try {
      const res = await importProducts(file);
      setResult(res.data);
      setStep('result');
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Import thất bại'), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function handleDone() {
    onImported();
    onClose();
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title="Import products"
      maxWidth="sm"
      actions={
        step === 'upload' ? (
          <>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!file}
              loading={submitting}
              onClick={handleImport}
            >
              Import
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={handleDone}>
            Done
          </Button>
        )
      }
    >
      {step === 'upload' ? (
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              bgcolor: green[50],
              color: green[800],
              borderRadius: 2,
              px: 1.5,
              py: 1,
            }}
          >
            <InfoOutlinedIcon fontSize="small" sx={{ mt: 0.25 }} />
            <Typography variant="caption">
              Dòng có &quot;Mã sản phẩm&quot; khớp sẽ cập nhật, để trống sẽ tạo
              mới.{' '}
              <a href="/product-import-template.xlsx" download>
                Tải file mẫu
              </a>
            </Typography>
          </Box>

          <Box
            {...getRootProps()}
            sx={{
              border: '1.5px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input {...getInputProps()} />
            <InsertDriveFileOutlinedIcon
              sx={{ fontSize: 32, color: 'text.disabled' }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500, mt: 1 }}>
              {file ? file.name : 'Kéo thả file .xlsx vào đây'}
            </Typography>
            {!file && (
              <Typography variant="caption" color="text.secondary">
                hoặc chọn file — tối đa 5MB
              </Typography>
            )}
          </Box>
        </Stack>
      ) : (
        result && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5}>
              <Box
                sx={{ flex: 1, bgcolor: green[50], borderRadius: 2, p: 1.5 }}
              >
                <Typography variant="caption" sx={{ color: green[800] }}>
                  Thành công
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: green[800] }}
                >
                  {result.successCount}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, bgcolor: red[50], borderRadius: 2, p: 1.5 }}>
                <Typography variant="caption" sx={{ color: red[800] }}>
                  Lỗi
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: red[800] }}
                >
                  {result.failedRows.length}
                </Typography>
              </Box>
            </Stack>

            {result.failedRows.length > 0 ? (
              <Box
                sx={{
                  maxHeight: 220,
                  overflow: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                {result.failedRows.map((failedRow) => (
                  <Stack
                    key={failedRow.row}
                    direction="row"
                    spacing={1}
                    sx={{
                      justifyContent: 'space-between',
                      px: 1.5,
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption">
                      Row {failedRow.row}
                    </Typography>
                    <Typography variant="caption" color="error">
                      {failedRow.message}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            ) : (
              <EmptyState
                size="compact"
                title="Tất cả dòng đã import thành công"
              />
            )}
          </Stack>
        )
      )}
    </Dialog>
  );
}
