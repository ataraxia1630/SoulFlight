import { Box, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        textAlign: "center",
        mt: 5,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {t("footer.copyright", { currentYear })}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          component="button"
          underline="hover"
          onClick={() => navigate("/terms")}
          color="text.secondary"
          variant="body2"
        >
          {t("footer.terms")}
        </Link>

        <Link
          component="button"
          underline="hover"
          onClick={() => navigate("/privacy")}
          color="text.secondary"
          variant="body2"
        >
          {t("privacy")}
        </Link>

        <Link
          href="mailto:contact@soulflight.com"
          underline="hover"
          color="text.secondary"
          variant="body2"
        >
          {t("header.contact")}
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
