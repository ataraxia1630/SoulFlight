import { Box, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        textAlign: "center",
        borderTop: 1,
        borderColor: "divider",
        mt: 7,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        © {currentYear} SoulFlight. Nền tảng du lịch cộng đồng toàn cầu.
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
          Điều khoản
        </Link>

        <Link
          component="button"
          underline="hover"
          onClick={() => navigate("/privacy")}
          color="text.secondary"
          variant="body2"
        >
          Quyền riêng tư
        </Link>

        <Link
          href="mailto:contact@soulflight.com"
          underline="hover"
          color="text.secondary"
          variant="body2"
        >
          Liên hệ
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
