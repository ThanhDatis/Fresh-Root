'use client';

import type { SxProps, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { SystemStyleObject } from '@mui/system';
import * as React from 'react';

import { errorTextSx } from './Input.styles';

export interface InputProps {
  sx?: SxProps<Theme>;
  sxError?: SystemStyleObject<Theme>;

  label: string;
  name: string;
  value: string;
  isError: boolean;

  helperText?: string;
  errorText?: string;
  typeInput?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  defaultValue?: string;
  id?: string;
  disabled?: boolean;
  suffixIcon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  placeholder?: string;
  size?: 'small' | 'medium';

  multiline?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;

  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Callback khi nhấn Enter — tiện cho ô search / coupon / newsletter */
  handleEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  /** Dùng khi bạn cần ref nhưng KHÔNG qua React Hook Form (vd: focus thủ công) */
  inputRef?: React.Ref<HTMLInputElement>;
  autoComplete?: string;
}

/**
 * Input dùng chung cho toàn app — wrapper quanh MUI TextField.
 * forwardRef để tương thích `register()` của React Hook Form: RHF cần ref
 * trỏ thẳng vào thẻ <input> DOM thật, không phải vào wrapper TextField.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      value,
      isError,
      helperText,
      errorText = 'Đã có lỗi xảy ra',
      typeInput = 'text',
      defaultValue,
      id,
      disabled = false,
      suffixIcon,
      prefixIcon,
      placeholder,
      size = 'medium',
      multiline = false,
      rows,
      minRows = 1,
      maxRows,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      handleEnter,
      inputRef,
      autoComplete = 'off',
      sx,
      sxError,
    },
    ref,
  ) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && handleEnter) {
        event.preventDefault();
        handleEnter(event);
        return;
      }
      onKeyDown?.(event);
    };

    // Tránh truyền cùng lúc `rows` và `minRows/maxRows` — MUI sẽ warning nếu
    // Textarea nhận cả 2 nhóm prop kiểm soát chiều cao cùng lúc.
    const multilineProps = !multiline
      ? { multiline: false as const }
      : rows !== undefined
        ? { multiline: true as const, rows }
        : { multiline: true as const, minRows, maxRows };

    return (
      <>
        <TextField
          id={id}
          name={name}
          label={label}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          fullWidth
          size={size}
          error={isError}
          disabled={disabled}
          type={typeInput}
          autoComplete={autoComplete}
          {...multilineProps}
          helperText={!isError ? helperText : undefined}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          sx={sx}
          slotProps={{
            input: {
              startAdornment: prefixIcon,
              endAdornment: suffixIcon,
              ref: inputRef ?? ref,
            },
          }}
        />
        {isError && (
          <Typography
            variant="caption"
            sx={{
              color: (theme: Theme) => theme.palette.error.main,
              ...errorTextSx,
              ...sxError,
            }}
          >
            {errorText}
          </Typography>
        )}
      </>
    );
  },
);

Input.displayName = 'Input';

export default Input;
