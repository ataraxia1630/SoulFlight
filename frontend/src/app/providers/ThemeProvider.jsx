import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1E9BCD",
      light: "#2f9ecaff",
      dark: "#0284c7",
      darker: "#136687",
      darkest: "#1d556bff",
    },
    secondary: {
      main: "#0074a3",
    },
    third: {
      main: "#1ABFC3",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
      input: "#f8f9fa",
      ocean: {
        light: "#a0e1ff",
        dark: "#0074a3",
      },
    },
    text: {
      primary: "#000000",
      secondary: "#868b96ff",
      tertiary: "#3f4145ff",
      contrast: "#ffffff",
    },
    border: {
      light: "#e1e5e9",
      main: "#d1d6dbff",
      dark: "#8b9094ff",
      divider: "#e0e0e0",
    },
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#4CAF50",
    },
    disabled: {
      main: "#94a3b8",
    },
  },
  typography: {
    fontFamily: "Be Vietnam Pro, sans-serif",
    h1: { fontSize: "32px", fontWeight: 700 },
    h2: { fontSize: "28px", fontWeight: 600 },
    h3: { fontSize: "24px", fontWeight: 600 },
    h4: { fontSize: "20px", fontWeight: 500 },
    h5: { fontSize: "18px", fontWeight: 500 },
    body1: { fontSize: "16px", fontWeight: 400 },
    body2: { fontSize: "14px", fontWeight: 400 },
    button: {
      textTransform: "none",
      fontSize: "14px",
      fontWeight: 600,
    },
  },
});

const CustomThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default CustomThemeProvider;
