import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingState from "../../../../shared/components/LoadingState";
import WalletConnect from "../../../../shared/components/WalletConnect";
import useWallet from "../../../../shared/hooks/useWallet";
import blockchainService from "../../../../shared/services/blockchain.service";
import { bookingAPI } from "../../../../shared/services/booking.service";
import { paymentAPI } from "../../../../shared/services/payment.service";
import toast from "../../../../shared/utils/toast";
import BookingContact from "../../components/BookingContact";
import OrderSummary from "../../components/Checkout/OrderSummary";
import PaymentMethodSelector from "../../components/Checkout/PaymentMethodSelector";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    walletConnected,
    walletAddress,
    walletBalance,
    loading: walletLoading,
    error: walletError,
    connectWallet,
    refreshBalance,
    setError: _setWalletError,
  } = useWallet();

  const bookingIds = useMemo(() => {
    const param = searchParams.get("bookingIds");
    return param ? param.split(",") : [];
  }, [searchParams]);

  const [activeStep, setActiveStep] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    idCard: "",
    phone: "",
    email: "",
  });

  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    idCard: "",
  });

  const [isBookerStaying, setIsBookerStaying] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("VNPAY");

  const steps = ["Thông tin liên hệ", "Phương thức thanh toán", "Xác nhận & Thanh toán"];

  useEffect(() => {
    if (bookingIds.length === 0) {
      setError("Không tìm thấy thông tin đặt chỗ");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const promises = bookingIds.map((id) => bookingAPI.getBookingDetail(id));
        const results = await Promise.all(promises);

        const fetchedBookings = results.map((res) => res.data);
        setBookings(fetchedBookings);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin đặt chỗ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [bookingIds]);

  const totalAmountVND = useMemo(() => {
    return bookings.reduce((total, booking) => {
      return total + (booking.finalAmount || booking.totalAmount || 0);
    }, 0);
  }, [bookings]);

  // 2. Quy đổi ra TPT để hiển thị ở UI (Tỷ giá 1 TPT = 1000 VND)
  const totalTPT = totalAmountVND / 1000;

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast.success("Kết nối ví thành công");
    } catch (err) {
      setError(err.message || "Không thể kết nối ví");
      toast.error(err.message || "Không thể kết nối ví");
    }
  };

  // Countdown renderer
  const countdownRenderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return (
        <Typography variant="h6" color="error" fontWeight="bold">
          Đã hết thời gian giữ chỗ!
        </Typography>
      );
    }
    return (
      <Typography variant="h6" color="error.dark" fontWeight="bold">
        Thời gian giữ chỗ còn lại: {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </Typography>
    );
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const packedGuestInfo = {
        contactInfo,
        guestInfo,
        isBookerStaying,
      };

      const updatePromises = bookings.map(
        (booking) => bookingAPI.saveGuestInfo(booking.id, packedGuestInfo) || Promise.resolve(),
      );
      await Promise.all(updatePromises);

      console.log({
        bookingIds: bookingIds,
        method: paymentMethod,
      });

      const paymentResult = await paymentAPI.createPayment(bookingIds, paymentMethod);
      console.log("\n💡 Payment Result:", paymentResult);

      const payment = paymentResult.data.strategyResult;
      console.log("\n💳 Payment Created:", payment);

      if (paymentMethod === "BLOCKCHAIN") {
        // Blockchain payment flow
        if (!walletConnected) {
          throw new Error("Vui lòng kết nối ví MetaMask trước");
        }

        const paymentData = payment.paymentData;
        console.log("\n🔷 Blockchain Payment Data:", paymentData);

        console.log("\n💰 Checking balance...");
        console.log("├─ Required:", paymentData.totalTPT, "TPT");
        console.log("└─ Available:", walletBalance.tpt, "TPT");

        // Check balance
        if (walletBalance.tpt < paymentData.totalTPT) {
          throw new Error(
            `Số dư không đủ. Cần: ${
              paymentData.totalTPT
            } TPT, Hiện có: ${walletBalance.tpt.toFixed(2)} TPT`,
          );
        }

        // Execute blockchain payment
        console.log("\n🚀 Executing blockchain payment...");
        const txResult = await blockchainService.payBooking(paymentData);
        console.log("✅ Transaction successful:", txResult.transactionHash);
        // Navigate to success page
        setTimeout(() => {
          navigate(
            `/payment/result?paymentId=${payment.id}&success=true&txHash=${txResult.transactionHash}&method=blockchain`,
          );
        }, 2000);
      } else {
        // Traditional payment (VNPAY, etc.)
        if (payment.paymentUrl) {
          window.location.href = payment.paymentUrl;
        } else {
          navigate(`/payment/result?paymentId=${payment.id}&success=true`);
        }
      }
    } catch (err) {
      setError(err.message || "Thanh toán thất bại");
      toast.error(err.message || "Thanh toán thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && bookings.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ fontSize: "1.1rem" }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 3 }}>
          Quay lại
        </Button>
      </Container>
    );
  }

  const expiryTime = bookings[0]?.expiryTime;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        Hoàn tất đặt chỗ
      </Typography>

      {expiryTime && (
        <Box textAlign="center" my={4}>
          <Countdown date={new Date(expiryTime)} renderer={countdownRenderer} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Vui lòng hoàn tất thanh toán trước khi thời gian giữ chỗ kết thúc
          </Typography>
        </Box>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Alert severity="error" sx={{ mt: 4, mb: 4 }}>
                  {error}
                </Alert>
              )}

              {activeStep === 0 && (
                <BookingContact
                  contactInfo={contactInfo}
                  setContactInfo={setContactInfo}
                  guestInfo={guestInfo}
                  setGuestInfo={setGuestInfo}
                  isBookerStaying={isBookerStaying}
                  setIsBookerStaying={setIsBookerStaying}
                />
              )}

              {activeStep === 1 && (
                <>
                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onChange={setPaymentMethod}
                  />
                  {paymentMethod === "BLOCKCHAIN" && (
                    <Box mt={3}>
                      <WalletConnect
                        walletConnected={walletConnected}
                        walletAddress={walletAddress}
                        walletBalance={walletBalance}
                        loading={walletLoading}
                        error={walletError}
                        onConnect={handleConnectWallet}
                        onRefresh={refreshBalance}
                        showDisconnect={false}
                        compact={true}
                      />

                      {!walletConnected ? (
                        <Alert
                          severity={walletBalance.tpt >= totalTPT ? "success" : "warning"}
                          sx={{ mt: 2 }}
                        >
                          {walletBalance.tpt >= totalTPT ? (
                            <>Số dư đủ để thanh toán</>
                          ) : (
                            <>
                              Số dư không đủ. Cần thêm {(totalTPT - walletBalance.tpt).toFixed(2)}{" "}
                              TPT
                            </>
                          )}
                        </Alert>
                      ) : (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Địa chỉ ví
                          </Typography>
                          <Typography variant="body1" fontFamily="monospace" gutterBottom>
                            {walletAddress.slice(0, 10)}...
                            {walletAddress.slice(-8)}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Số dư hiện tại
                          </Typography>
                          <Typography variant="h6" color="primary">
                            {walletBalance.tpt.toFixed(2)} TPT
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ≈ {walletBalance.vnd.toLocaleString("vi-VN")} VND
                          </Typography>

                          <Alert
                            severity={walletBalance.tpt >= totalTPT ? "success" : "warning"}
                            sx={{ mt: 2 }}
                          >
                            {walletBalance.tpt >= totalTPT ? (
                              <>Số dư đủ để thanh toán</>
                            ) : (
                              <>
                                Số dư không đủ. Cần thêm {(totalTPT - walletBalance.tpt).toFixed(2)}{" "}
                                TPT
                              </>
                            )}
                          </Alert>
                        </Box>
                      )}
                    </Box>
                  )}
                </>
              )}

              {activeStep === 2 && (
                <Box>
                  <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Thông tin liên hệ
                    </Typography>
                    <Typography>
                      <strong>Họ tên:</strong> {contactInfo.fullName}
                    </Typography>
                    <Typography>
                      <strong>CCCD/CMND:</strong> {contactInfo.idCard}
                    </Typography>
                    <Typography>
                      <strong>Số điện thoại:</strong> {contactInfo.phone}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {contactInfo.email}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Thông tin khách lưu trú
                    </Typography>
                    <Typography>
                      <strong>Họ tên:</strong> {guestInfo.fullName}
                    </Typography>
                    <Typography>
                      <strong>CCCD/CMND:</strong> {guestInfo.idCard}
                    </Typography>
                    <Typography>
                      <strong>Là người đặt phòng?</strong> {isBookerStaying ? "Có" : "Không"}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Phương thức thanh toán
                    </Typography>
                    <Typography>{paymentMethod}</Typography>
                  </Paper>

                  <Alert severity="info" sx={{ mt: 3 }}>
                    Vui lòng kiểm tra kỹ thông tin trước khi xác nhận thanh toán
                  </Alert>
                </Box>
              )}

              <Box display="flex" justifyContent="space-between" mt={5}>
                <Button disabled={activeStep === 0 || submitting} onClick={handleBack}>
                  Quay lại
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleConfirmPayment}
                    disabled={
                      submitting ||
                      !contactInfo.fullName ||
                      !contactInfo.phone ||
                      !guestInfo.fullName ||
                      (paymentMethod === "BLOCKCHAIN" && !walletConnected)
                    }
                  >
                    {submitting ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Đang xử lý...
                      </>
                    ) : (
                      "Xác nhận thanh toán"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 &&
                        (!contactInfo.fullName || !contactInfo.phone || !guestInfo.fullName)) ||
                      (activeStep === 1 &&
                        paymentMethod === "BLOCKCHAIN" &&
                        (!walletConnected || walletBalance.tpt < totalTPT))
                    }
                  >
                    Tiếp tục
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <OrderSummary bookings={bookings} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
