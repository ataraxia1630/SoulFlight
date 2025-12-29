import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

export default function BookingContact({
  contactInfo,
  setContactInfo,
  guestInfo,
  setGuestInfo,
  isBookerStaying,
  setIsBookerStaying,
}) {
  const handleContactChange = (field) => (event) => {
    const value = event.target.value;
    const newContactInfo = { ...contactInfo, [field]: value };

    setContactInfo(newContactInfo);

    if (isBookerStaying) {
      if (field === "fullName" || field === "idCard") {
        setGuestInfo((prev) => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleGuestChange = (field) => (event) => {
    setGuestInfo({ ...guestInfo, [field]: event.target.value });
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;

    setIsBookerStaying(checked);

    if (checked) {
      setGuestInfo({
        fullName: contactInfo.fullName,
        idCard: contactInfo.idCard,
      });
    } else {
      setGuestInfo({
        fullName: "",
        idCard: "",
      });
    }
  };

  return (
    <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 800,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
            <PermIdentityOutlinedIcon fontSize="medium" color="action" />
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Thông tin người đặt
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="medium"
                label="Họ và tên"
                placeholder="VD: Nguyen Van A"
                required
                value={contactInfo.fullName}
                onChange={handleContactChange("fullName")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PermIdentityOutlinedIcon fontSize="small" color="disabled" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Số CCCD / CMND"
                required
                value={contactInfo.idCard}
                onChange={handleContactChange("idCard")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardOutlinedIcon fontSize="small" color="disabled" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Số điện thoại"
                required
                value={contactInfo.phone}
                onChange={handleContactChange("phone")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphoneOutlinedIcon fontSize="small" color="disabled" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                value={contactInfo.email}
                onChange={handleContactChange("email")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineOutlinedIcon fontSize="small" color="disabled" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isBookerStaying}
                  onChange={handleCheckboxChange}
                  color="default" // Màu xám đen mặc định thay vì xanh
                  sx={{
                    "&.Mui-checked": {
                      color: "text.primary",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Tôi cũng là khách lưu trú (Tự động điền thông tin bên dưới)
                </Typography>
              }
            />
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
            <PersonPinOutlinedIcon fontSize="medium" color="action" />
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Thông tin khách nhận phòng
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Họ và tên khách"
                required
                value={guestInfo.fullName}
                onChange={handleGuestChange("fullName")}
                disabled={isBookerStaying}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PermIdentityOutlinedIcon fontSize="small" color="disabled" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  bgcolor: isBookerStaying ? "action.hover" : "transparent",
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Số CCCD / CMND khách"
                required
                value={guestInfo.idCard}
                onChange={handleGuestChange("idCard")}
                disabled={isBookerStaying}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardOutlinedIcon fontSize="small" color="disabled" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  bgcolor: isBookerStaying ? "action.hover" : "transparent",
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
