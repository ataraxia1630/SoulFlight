import { Button, Stack, Box, Divider, useTheme } from "@mui/material";
import GoogleIcon from "@/assets/google_icon";
import FacebookIcon from "@/assets/facebook_icon";
import XIcon from "@/assets/x_icon";
import { useTranslation } from "react-i18next";

const SocialLoginButtons = ({ onGoogleLogin, onFacebookLogin, onXLogin }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const socialButtons = [
    {
      icon: <GoogleIcon />,
      onClick: onGoogleLogin,
    },
    {
      icon: <FacebookIcon />,
      onClick: onFacebookLogin,
    },
    {
      icon: <XIcon />,
      onClick: onXLogin,
    },
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
        {socialButtons.map((button, index) => (
          <Button
            key={index}
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
