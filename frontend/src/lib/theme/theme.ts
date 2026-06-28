import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      light: "#BCE7D4",
      main: "#90B6A5",
      dark: "#1F382D",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#8D6E63",
      light: "#BCAAA4",
      dark: "#5D4037",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#66BB6A",
    },
    warning: {
      main: "#FFA726",
    },
    error: {
      main: "#EF5350",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1C2B1E",
      secondary: "#4A6741",
    },
  },
  typography: {
    fontFamily: [
      "var(--font-geist-sans)",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 12px rgba(46, 125, 50, 0.08)",
        },
      },
    },
  },
});

export default theme;