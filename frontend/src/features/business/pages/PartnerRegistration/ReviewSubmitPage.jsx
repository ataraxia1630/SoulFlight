import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormData } from "@/features/business/context/FormDataContext";
import PartnerRegistrationAPI from "../../../../shared/services/partnerRegistration.service";

export default function ReviewSubmitPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { services = [], resetServices } = useFormData();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAnotherService = () => {
    navigate("/business/partner-registration");
  };

  const handleReviewService = (index) => {
    const service = services[index];
    navigate(`/business/partner-registration/${service.data.model.toLowerCase()}?edit=${index}`);
  };

  const handleSaveDraft = async () => {
    if (services.length === 0) return;

    try {
      setIsLoading(true);
      // Gọi API lưu nháp
      await PartnerRegistrationAPI.saveDraft(services);
      alert("Đã lưu bản nháp thành công!");
    } catch (error) {
      console.error("Save draft error:", error);
      const msg = error.response?.data?.message || "Lỗi khi lưu bản nháp";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    if (services.length === 0) return;

    try {
      setIsLoading(true);
      console.log("SUBMIT ALL SERVICES:", services);

      await PartnerRegistrationAPI.submitApplicant(services);

      alert("Đã gửi đơn đăng ký thành công! Vui lòng chờ duyệt.");

      resetServices();

      navigate("/business/partner-registration/applications");
    } catch (error) {
      console.error("Submit error:", error);
      const msg = error.response?.data?.message || "Gửi đơn thất bại. Vui lòng thử lại.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" py={4}>
      <Typography variant="h5" fontWeight={600} mb={4}>
        Partner Registration
      </Typography>

      <Stack spacing={3} mb={2}>
        {services.map((svc, index) => (
          <Card key={svc.id} variant="outlined">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" fontWeight={500}>
                    {svc.data.serviceName || "Untitled Service"}
                  </Typography>
                </Box>
                <Button
                  startIcon={<VisibilityIcon />}
                  variant="outlined"
                  onClick={() => handleReviewService(index)}
                  disabled={isLoading}
                >
                  Review
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}

        <Card variant="outlined" sx={{ borderStyle: "dashed" }}>
          <CardContent
            sx={{
              "&:last-child": {
                pb: 2,
              },
              p: 2,
            }}
          >
            <Button
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleAddAnotherService}
              disabled={isLoading}
            >
              Add another service
            </Button>
          </CardContent>
        </Card>
      </Stack>

      <Box bgcolor="primary.50" borderRadius={3} p={4} textAlign="center" mb={4}>
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.dark,
            fontWeight: 600,
            textAlign: "center",
            mb: 2,
          }}
        >
          Your Application is Ready!
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Please review all sections one last time. Once confirmed, your application will be
          submitted for approval.
          <br />
          If you want to provide other services, you should add them right now, it would save time
          for being reviewed.
        </Typography>

        <Box
          bgcolor="#EFF6FF"
          borderRadius={2}
          p={3}
          textAlign="left"
          sx={{ marginX: { sm: "200px", xs: "20px" } }}
          border="solid #BFDBFE 0.1px"
        >
          <Typography
            variant="subtitle1"
            color={theme.palette.primary.main}
            fontWeight={600}
            mb={2}
            sx={{ pl: { sm: "20px", xs: "0" } }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
              <span>Next Step: Waiting Approval</span>
            </Stack>
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{
              paddingX: { xs: 0, sm: "30px" },
              "& li": {
                marginBottom: "8px",
                lineHeight: 1.8,
                fontSize: "14px",
              },
              "& .highlight": {
                color: "#16A34A",
                fontWeight: 600,
              },
            }}
          >
            <ul>
              <li>
                <strong>Processing Time:</strong> Your application will be reviewed by our team
                within
                <span className="highlight"> 1–3 business days.</span>
              </li>
              <li>
                <strong>Result Notification:</strong> We will send detailed information about the
                approval status via your registered email.
              </li>
              <li>
                <strong>Application Status:</strong> After submission, you can track your
                application status on your Dashboard.
              </li>
            </ul>
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="outlined" size="large" onClick={handleSaveDraft}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Draft"}
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={onSubmit}
          disabled={services.length === 0 || isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Confirm and Submit"}
        </Button>
      </Box>
    </Box>
  );
}
