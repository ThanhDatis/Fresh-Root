// ─────────────────────────────────────────────
// COLOR SCALES
// ─────────────────────────────────────────────

export const gray = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};

/** Sage Green — màu brand chính của FreshRoot */
export const sage = {
  50: '#f2f8f5',
  100: '#e0f0e8',
  200: '#bce7d4', // primary.light
  300: '#98d4bb',
  400: '#74c1a3',
  500: '#90b6a5', // primary.main
  600: '#6e9a8a',
  700: '#4e7d6e',
  800: '#366055',
  900: '#1f382d', // primary.dark
};

export const brown = {
  50: '#efebe9',
  100: '#d7ccc8',
  200: '#bcaaa4',
  300: '#a1887f',
  400: '#8d6e63', // secondary.main
  500: '#795548',
  600: '#6d4c41',
  700: '#5d4037', // secondary.dark
  800: '#4e342e',
  900: '#3e2723',
};

export const green = {
  50: '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a', // success.main
  500: '#4caf50',
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
};

export const red = {
  50: '#ffebee',
  100: '#ffcdd2',
  200: '#ef9a9a',
  300: '#e57373',
  400: '#ef5350', // error.main
  500: '#f44336',
  600: '#e53935',
  700: '#d32f2f',
  800: '#c62828',
  900: '#b71c1c',
};

export const orange = {
  50: '#fff3e0',
  100: '#ffe0b2',
  200: '#ffcc80',
  300: '#ffb74d',
  400: '#ffa726', // warning.main
  500: '#ff9800',
  600: '#fb8c00',
  700: '#f57c00',
  800: '#ef6c00',
  900: '#e65100',
};

export const blue = {
  50: '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#2196f3',
  600: '#1e88e5',
  700: '#1976d2',
  800: '#1565c0',
  900: '#0d47a1',
};

export const yellow = {
  50: '#fffde7',
  100: '#fff9c4',
  200: '#fff59d',
  300: '#fff176',
  400: '#ffee58',
  500: '#ffeb3b',
  600: '#fdd835',
  700: '#fbc02d',
  800: '#f9a825',
  900: '#f57f17',
};

export const purple = {
  50: '#f3e5f5',
  100: '#e1bee7',
  200: '#ce93d8',
  300: '#ba68c8',
  400: '#ab47bc',
  500: '#9c27b0',
  600: '#8e24aa',
  700: '#7b1fa2',
  800: '#6a1b9a',
  900: '#4a148c',
};

export const teal = {
  50: '#e0f2f1',
  100: '#b2dfdb',
  200: '#80cbc4',
  300: '#4db6ac',
  400: '#26a69a',
  500: '#009688',
  600: '#00897b',
  700: '#00796b',
  800: '#00695c',
  900: '#004d40',
};

export const cyan = {
  50: '#e0f7fa',
  100: '#b2ebf2',
  200: '#80deea',
  300: '#4dd0e1',
  400: '#26c6da',
  500: '#00bcd4',
  600: '#00acc1',
  700: '#0097a7',
  800: '#00838f',
  900: '#006064',
};

export const pink = {
  50: '#fce4ec',
  100: '#f8bbd0',
  200: '#f48fb1',
  300: '#f06292',
  400: '#ec407a',
  500: '#e91e63',
  600: '#d81b60',
  700: '#c2185b',
  800: '#ad1457',
  900: '#880e4f',
};

export const indigo = {
  50: '#e8eaf6',
  100: '#c5cae9',
  200: '#9fa8da',
  300: '#7986cb',
  400: '#5c6bc0',
  500: '#3f51b5',
  600: '#3949ab',
  700: '#303f9f',
  800: '#283593',
  900: '#1a237e',
};

// ─────────────────────────────────────────────
// SEMANTIC TOKENS — Text
// ─────────────────────────────────────────────

export const primaryTextColor = sage[900]; // #1C2B1E — dark green
export const secondaryTextColor = sage[700]; // #4A6741 — mid green
export const disabledTextColor = gray[500];
export const placeholderTextColor = gray[500];
export const hintTextColor = gray[600];
export const labelColor = gray[600];
export const inverseTextColor = '#ffffff';

// ─────────────────────────────────────────────
// SEMANTIC TOKENS — Status colors
// ─────────────────────────────────────────────

export const errorColor = red[400];
export const successColor = green[400];
export const warningColor = orange[400];
export const infoColor = blue[500];

export const errorLightColor = red[50];
export const successLightColor = green[50];
export const warningLightColor = orange[50];
export const infoLightColor = blue[50];

export const errorDarkColor = red[700];
export const successDarkColor = green[700];
export const warningDarkColor = orange[700];
export const infoDarkColor = blue[700];

// ─────────────────────────────────────────────
// SEMANTIC TOKENS — Background
// ─────────────────────────────────────────────

export const primaryBackground = '#FFFFFF'; // background.default
export const paperBackground = '#ffffff'; // background.paper
export const secondaryBackground = sage[50];
export const cardBackground = '#ffffff';
export const hoverBackground = sage[50];
export const selectedBackground = sage[100];
export const disabledBackground = gray[200];
export const overlayBackground = 'rgba(0, 0, 0, 0.5)';
export const tooltipBackground = gray[900];
export const primaryBackgroundSidebar = sage[50];

export const errorBackground = errorLightColor;
export const successBackground = successLightColor;
export const warningBackground = warningLightColor;
export const infoBackground = infoLightColor;

// ─────────────────────────────────────────────
// SEMANTIC TOKENS — Border
// ─────────────────────────────────────────────

export const borderLine = gray[300];
export const borderLight = gray[200];
export const borderDark = gray[400];
export const borderFocus = sage[500];
export const borderError = errorColor;
export const borderSuccess = successColor;
export const borderWarning = warningColor;

// ─────────────────────────────────────────────
// SEMANTIC TOKENS — Shadow
// ─────────────────────────────────────────────

export const shadowLight = 'rgba(0, 0, 0, 0.12)';
export const shadowMedium = 'rgba(0, 0, 0, 0.16)';
export const shadowDark = 'rgba(0, 0, 0, 0.28)';
export const shadowBrand = 'rgba(144, 182, 165, 0.5)'; // sage tint shadow

// ─────────────────────────────────────────────
// SEMANTIC TOKENS — Link
// ─────────────────────────────────────────────

export const linkColor = sage[600];
export const linkHoverColor = sage[800];
export const linkVisitedColor = purple[600];

// ─────────────────────────────────────────────
// SEMANTIC TOKENS — Button
// ─────────────────────────────────────────────

export const buttonPrimaryBackground = sage[500];
export const buttonPrimaryHover = sage[700];
export const buttonSecondaryBackground = gray[200];
export const buttonSecondaryHover = gray[300];
export const buttonDangerBackground = errorColor;
export const buttonDangerHover = errorDarkColor;
export const buttonSuccessBackground = successColor;
export const buttonSuccessHover = successDarkColor;

// ─────────────────────────────────────────────
// SEMANTIC TOKENS — Input
// ─────────────────────────────────────────────

export const inputBackground = '#ffffff';
export const inputBorder = gray[400];
export const inputFocusBorder = sage[500];
export const inputErrorBorder = errorColor;
export const inputDisabledBackground = gray[100];
export const inputPlaceholder = gray[500];

// ─────────────────────────────────────────────
// SEMANTIC TOKENS — Table
// ─────────────────────────────────────────────

export const tableHeaderBackground = sage[50];
export const tableRowHoverBackground = sage[50];
export const tableRowSelectedBackground = sage[100];
export const tableBorderColor = gray[200];

// ─────────────────────────────────────────────
// SEMANTIC TOKENS — Misc
// ─────────────────────────────────────────────

export const dividerColor = gray[300];
export const scrollbarThumb = gray[400];
export const scrollbarTrack = gray[200];
export const focusRing = sage[500];
export const selectionBackground = sage[100];
export const highlightColor = yellow[200];

// ─────────────────────────────────────────────
// CHART COLORS
// ─────────────────────────────────────────────

export const chartColors = [
  sage[500],
  green[400],
  teal[500],
  blue[500],
  orange[400],
  purple[500],
  pink[400],
  indigo[500],
  cyan[500],
  yellow[700],
];

// ─────────────────────────────────────────────
// PALETTE MAP (dùng khi cần dynamic access)
// ─────────────────────────────────────────────

export const colorPalettes = {
  sage,
  brown,
  gray,
  green,
  red,
  orange,
  blue,
  yellow,
  purple,
  teal,
  cyan,
  pink,
  indigo,
};

// ─────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────

/** Convert hex color sang rgba với alpha tùy chỉnh */
export const withAlpha = (color: string, alpha: number): string => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
