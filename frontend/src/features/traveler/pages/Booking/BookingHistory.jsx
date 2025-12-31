import { ReceiptLong } from "@mui/icons-material";
import { Container, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import BookingCard from "@/features/traveler/components/Booking/BookingCard";
import LoadingState from "@/shared/components/LoadingState";
import { bookingAPI } from "@/shared/services/booking.service";
import toast from "@/shared/utils/toast";

const STATUS_TABS = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ thanh toán", value: "PENDING" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Đang diễn ra", value: "IN_PROGRESS" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

const BookingHistory = () => {
  const [tabValue, setTabValue] = useState("ALL");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        status: tabValue === "ALL" ? undefined : tabValue,
        page: 1,
        limit: 20,
      };
      const res = await bookingAPI.getMyBookings(params);
      console.log("Fetched bookings:", res.data);
      setBookings(res.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [tabValue]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "error";
      case "COMPLETED":
        return "info";
      default:
        return "default";
    }
  };

  if (loading) return <LoadingState />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Lịch sử đặt chỗ
      </Typography>

      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {STATUS_TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Paper>

      <Stack spacing={2}>
        {bookings.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: "center" }}>
            <ReceiptLong sx={{ fontSize: 60, color: "grey.300", mb: 2 }} />
            <Typography color="text.secondary">
              Không có đơn đặt chỗ nào ở trạng thái này.
            </Typography>
          </Paper>
        ) : (
          bookings?.map((booking) => (
            <BookingCard key={booking.id} booking={booking} getStatusColor={getStatusColor} />
          ))
        )}
      </Stack>
    </Container>
  );
};

export default BookingHistory;
