import { Link, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

const BackLogin = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Link
      variant="body2"
      align="center"
      sx={{
        mt: 2,
        color: theme.palette.text.secondary,
        textDecoration: "none",
        "&:hover": { fontWeight: 600 },
      }}
      component={RouterLink}
      to="/login"
    >
      {t("auth.back login")}
    </Link>
  );
};

export default BackLogin;
