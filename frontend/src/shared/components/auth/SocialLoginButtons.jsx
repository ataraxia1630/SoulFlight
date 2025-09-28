import { Button, Stack, Box, Divider } from "@mui/material";
import GoogleIcon from "@/assets/google_icon";
import FacebookIcon from "@/assets/facebook_icon";
import XIcon from "@/assets/x_icon";
import { useTranslation } from "react-i18next";

const SocialLoginButtons = ({ onGoogleLogin, onFacebookLogin, onXLogin }) => {
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

  const { t } = useTranslation();

  return (
    <Box>
      <Divider
        sx={{
          "&::before, &::after": {
            borderTopWidth: "1.2px",
            borderColor: "#6b7280",
          },
          mb: 2,
          color: "#6b7280",
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
              border: "1px solid #d1d6dbff",
              backgroundColor: "white",
              "&:hover": {
                color: "white",
                border: "1px solid #8b9094ff",
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
