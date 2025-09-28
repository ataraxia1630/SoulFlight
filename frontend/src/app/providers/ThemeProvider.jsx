import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    h1: { fontSize: "2rem", fontWeight: 700 },      // 32px
    h2: { fontSize: "1.75rem", fontWeight: 600 },   // 28px
    h3: { fontSize: "1.5rem", fontWeight: 600 },    // 24px
    h4: { fontSize: "1.25rem", fontWeight: 500 },   // 20px
    h5: { fontSize: "1.125rem", fontWeight: 500 },  // 18px
    body1: { fontSize: "1rem", fontWeight: 400 },   // 16px
    body2: { fontSize: "0.875rem", fontWeight: 400 }, // 14px
    button: {
      textTransform: "none",
      fontSize: "0.875rem",
      fontWeight: 500,
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