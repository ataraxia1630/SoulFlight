import { Box, Button, Divider, Stack, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import FacebookIcon from "@/assets/facebook_icon";
import GoogleIcon from "@/assets/google_icon";
import XIcon from "@/assets/x_icon";

const SocialLoginButtons = ({ onGoogleLogin, onFacebookLogin, onXLogin }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const socialButtons = [
    { name: "google", icon: <GoogleIcon />, onClick: onGoogleLogin },
    { name: "facebook", icon: <FacebookIcon />, onClick: onFacebookLogin },
    { name: "x", icon: <XIcon />, onClick: onXLogin },
  ];

  return (
    <Box>
      <Divider
        sx={{
          "&::before, &::after": {
            borderTopWidth: "1.2px",
            borderColor: theme.palette.text.secondary,
          },
          mb: 2,
          color: theme.palette.text.secondary,
          fontSize: "13px",
        }}
      >
        {t("or")}
      </Divider>

      <Stack direction="row" spacing={2} justifyContent="center">
        {socialButtons.map((button) => (
          <Button
            key={button.name}
            variant="outlined"
            onClick={button.onClick}
            disableRipple
            sx={{
              width: "100px",
              height: "43px",
              borderRadius: "30px",
              border: `1px solid ${theme.palette.border.main}`,
              backgroundColor: theme.palette.background.default,
              "&:hover": {
                color: "white",
                border: `1px solid ${theme.palette.border.dark}`,
              },
            }}
          >
            {button.icon}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default SocialLoginButtons;
