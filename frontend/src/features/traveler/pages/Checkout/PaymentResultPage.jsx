import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, CircularProgress, Container, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paymentAPI } from "@/shared/services/payment.service";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Lấy params từ URL
        const success = searchParams.get("success");
        const paymentId = searchParams.get("paymentId");
        const resultMessage = searchParams.get("message");

        if (!paymentId) {
          setStatus("failed");
          setMessage("Không tìm thấy thông tin giao dịch.");
          return;
        }

        // Option 1: Tin tưởng params từ URL (đơn giản, nhanh)
        if (success === "true") {
          setStatus("success");
          setMessage(decodeURIComponent(resultMessage) || "Thanh toán thành công!");

          // Fetch payment details để hiển thị thêm thông tin
          try {
            const paymentData = await paymentAPI.getPayment(paymentId);
            setPaymentDetails(paymentData.data?.payment);
          } catch (err) {
            console.error("Error fetching payment details:", err);
          }
        } else {
          setStatus("failed");
          setMessage(decodeURIComponent(resultMessage) || "Thanh toán thất bại!");
        }

        // Option 2: Verify lại với backend (an toàn hơn, chậm hơn)
        // Uncomment phần này nếu muốn verify lại
        /*
        try {
          const verification = await paymentAPI.verifyPaymentStatus(paymentId);
          
          if (verification.success) {
            setStatus("success");
            setMessage("Thanh toán thành công! Vé của bạn đã được xác nhận.");
            setPaymentDetails(verification.payment);
          } else {
            setStatus("failed");
            setMessage(
              verification.status === 'PENDING' 
                ? "Thanh toán đang được xử lý..." 
                : "Thanh toán thất bại."
            );
          }
        } catch (verifyError) {
          console.error("Verification error:", verifyError);
          // Fallback to URL params if verification fails
          if (success === 'true') {
            setStatus("success");
            setMessage(decodeURIComponent(resultMessage) || "Thanh toán thành công!");
          } else {
            setStatus("failed");
            setMessage(decodeURIComponent(resultMessage) || "Thanh toán thất bại!");
          }
        }
        */
      } catch (error) {
        console.error("Payment Verify Error:", error);
        setStatus("failed");
        setMessage("Có lỗi xảy ra khi xác thực giao dịch.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleViewBookings = () => {
    navigate("/booking/history");
  };

  const handleRetry = () => {
    navigate("/booking/history");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ py: 8, minHeight: "60vh", display: "flex", alignItems: "center" }}
    >
      <Paper elevation={3} sx={{ p: 5, width: "100%", textAlign: "center", borderRadius: 2 }}>
        {status === "loading" && (
          <Box>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">
              {message}
            </Typography>
          </Box>
        )}

        {status === "success" && (
          <Box>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color="success.main">
              Thanh toán thành công
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {message}
            </Typography>

            {/* Hiển thị thông tin payment nếu có */}
            {paymentDetails && (
              <Box
                sx={{
                  mt: 3,
                  mb: 4,
                  p: 2,
                  bgcolor: "success.50",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Mã giao dịch
                </Typography>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  {paymentDetails.id}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Số tiền
                </Typography>
                <Typography variant="h6" color="success.main">
                  {Number(paymentDetails.amount).toLocaleString("vi-VN")} VNĐ
                </Typography>

                {paymentDetails.transaction_id && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Mã giao dịch VNPay
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace">
                      {paymentDetails.transaction_id}
                    </Typography>
                  </>
                )}
              </Box>
            )}

            <Box display="flex" justifyContent="center" gap={2}>
              <Button variant="outlined" onClick={handleBackToHome}>
                Về trang chủ
              </Button>
              <Button variant="contained" onClick={handleViewBookings}>
                Xem đơn hàng
              </Button>
            </Box>
          </Box>
        )}

        {status === "failed" && (
          <Box>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color="error.main">
              Thanh toán thất bại
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {message}
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button variant="outlined" onClick={handleBackToHome}>
                Về trang chủ
              </Button>
              <Button variant="contained" color="primary" onClick={handleRetry}>
                Kiểm tra đơn hàng
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PaymentResultPage;
