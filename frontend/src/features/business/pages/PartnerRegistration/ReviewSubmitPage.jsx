// src/features/business/pages/PartnerRegistration/ReviewSubmitPage.jsx

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormData } from "@/features/business/context/FormDataContext";

export default function ReviewSubmitPage() {
  const navigate = useNavigate();
  const { services = [], resetServices } = useFormData(); // LẤY TỪ CONTEXT

  const handleAddAnotherService = () => {
    navigate("/business/partner-registration");
  };

  const handleReviewService = (index) => {
    const service = services[index];
    // Chuyển đến wizard với model đúng + edit index
    navigate(`/business/partner-registration/${service.model.toLowerCase()}?edit=${index}`);
  };

  const onSubmit = () => {
    console.log("SUBMIT ALL SERVICES:", services);
    alert("Đã gửi đơn đăng ký thành công!");

    // GỌI API Ở ĐÂY
    // await api.submitPartnerApplication(services);

    // XÓA DỮ LIỆU SAU KHI SUBMIT
    resetServices();

    // Chuyển về dashboard hoặc thông báo
    // navigate('/business/dashboard');
  };

  return (
    <Box maxWidth="lg" mx="auto" py={4}>
      {/* Header */}
      <Typography variant="h5" fontWeight={600} mb={4}>
        Partner Registration
      </Typography>

      {/* Danh sách service */}
      <Stack spacing={3} mb={5}>
        {services.map((svc, index) => (
          <Card key={svc.id} variant="outlined">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" fontWeight={500}>
                    {svc.name || "Untitled Service"}
                  </Typography>
                  <Chip label={svc.model} size="small" sx={{ mt: 1 }} />
                </Box>
                <Button
                  startIcon={<VisibilityIcon />}
                  variant="outlined"
                  onClick={() => handleReviewService(index)}
                >
                  Review
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Add another service */}
        <Card variant="outlined" sx={{ borderStyle: "dashed" }}>
          <CardContent>
            <Button
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleAddAnotherService}
              sx={{ py: 2 }}
            >
              Add another service
            </Button>
          </CardContent>
        </Card>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Thông báo sẵn sàng */}
      <Box bgcolor="primary.50" borderRadius={3} p={4} textAlign="center" mb={4}>
        <Typography variant="h5" color="primary" fontWeight={600} mb={2}>
          Your Application is Ready!
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Please review all sections one last time. Once confirmed, your application will be
          submitted for approval.
          <br />
          If you want to provide other services, you should add them right now, it would save time
          for being reviewed.
        </Typography>

        <Box bgcolor="info.50" borderRadius={2} p={3} textAlign="left" mb={3}>
          <Typography variant="subtitle1" color="info.main" fontWeight={500} mb={2}>
            Next Step: Waiting Approval
          </Typography>
          <Typography variant="body2" component="div">
            <ul>
              <li>
                <strong>Processing Time:</strong> Your application will be reviewed by our team
                within 1-3 business days.
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

      {/* Nút hành động */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="outlined" size="large">
          Save Draft
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={onSubmit}
          disabled={services.length === 0}
        >
          Confirm and Submit
        </Button>
      </Box>
    </Box>
  );
}
