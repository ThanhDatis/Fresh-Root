import { createTheme } from '@mui/material/styles';

import {
  sage,
  brown,
  green,
  red,
  orange,
  primaryBackground,
  paperBackground,
  primaryTextColor,
  secondaryTextColor,
  shadowBrand,
  borderLine,
  shadowLight,
  inputFocusBorder,
  inputBackground,
  gray,
} from '@/constants/colors';

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      light: sage[200],
      main: sage[500],
      dark: sage[900],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: brown[400],
      light: brown[200],
      dark: brown[700],
      contrastText: '#FFFFFF',
    },
    success: {
      main: green[400],
    },
    warning: {
      main: orange[400],
    },
    error: {
      main: red[400],
    },
    background: {
      default: primaryBackground,
      paper: paperBackground,
    },
    text: {
      primary: primaryTextColor,
      secondary: secondaryTextColor,
    },
  },
  typography: {
    fontFamily: [
      'var(--font-geist-sans)',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          // borderRadius: 8,
          padding: '8px 20px',
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 14px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: `0 0 5px ${shadowBrand}`,
          borderRadius: 12,
          border: `1px solid ${borderLine}`,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          // padding: 20,
          '&:last-child': {
            paddingBottom: 20,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // tắt overlay gradient mặc định của MUI dark elevation
        },
        elevation1: {
          boxShadow: `0 0 5px ${shadowLight}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
        label: {
          paddingLeft: 10,
          paddingRight: 10,
          display: 'flex',
          alignItems: 'center',
          // lineHeight: 1,
        },
        sizeSmall: {
          fontSize: '0.6875rem',
          height: 22,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // borderRadius: 8,
          backgroundColor: inputBackground,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: borderLine,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: sage[400],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: inputFocusBorder,
            borderWidth: 1.5,
          },
          '& textarea::placeholder': {
            fontSize: '14px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // fontSize: '0.9rem',
          '&.Mui-focused': {
            color: sage[700],
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: sage[50],
          color: primaryTextColor,
        },
        root: {
          borderBottom: `1px solid ${borderLine}`,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: sage[50],
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: borderLine,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: gray[900],
          fontSize: '0.75rem',
          // borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
