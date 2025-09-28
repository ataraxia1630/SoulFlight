import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";

const theme = createTheme({
  typography: {
    fontFamily: "Manrope, Arial, sans-serif",
    h1: { fontSize: "32px", fontWeight: 700 },
    h2: { fontSize: "28px", fontWeight: 600 },
    h3: { fontSize: "24px", fontWeight: 600 },
    h4: { fontSize: "20px", fontWeight: 500 },
    h5: { fontSize: "18px", fontWeight: 500 },
    body1: { fontSize: "16px", fontWeight: 400 },
    body2: { fontSize: "14px", fontWeight: 400 },
    body3: { fontSize: "12px", fontWeight: 400 },
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