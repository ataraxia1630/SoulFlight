import { Alert, Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import LoadingState from "@/shared/components/LoadingState";
import PageHeaderWithAdd from "@/shared/components/PageHeaderWithAdd";
import CustomTable from "@/shared/components/Table";
import { bookingAPI } from "@/shared/services/booking.service";
import toast from "@/shared/utils/toast";
import { columns } from "./columns";
import DetailDialog from "./components/DetailDialog";

export default function Booking({ userRole }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (userRole === "ADMIN") {
        res = await bookingAPI.getAdminBookings();
      } else {
        res = await bookingAPI.getProviderBookings();
      }
      const dataList = Array.isArray(res.data) ? res.data : res.data?.bookings || [];
      setBookings(dataList);
    } catch (err) {
      console.error(err);
      setError(err.message || "Lỗi tải danh sách booking.");
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleViewDetail = async (row) => {
    try {
      let res;
      if (userRole === "ADMIN") {
        res = await bookingAPI.getAdminBookingDetail(row.id);
      } else {
        res = await bookingAPI.getProviderBookingDetail(row.id);
      }
      setSelectedBooking(res.data);
      setOpenDetailDialog(true);
    } catch (_err) {
      toast.error("Không thể tải chi tiết booking");
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus, note) => {
    try {
      if (userRole === "ADMIN") {
        await bookingAPI.adminForceUpdateStatus(bookingId, newStatus, note);
      } else {
        await bookingAPI.updateBookingStatus(bookingId, newStatus, note);
      }
      toast.success("Cập nhật trạng thái thành công!");
      setOpenDetailDialog(false);
      fetchBookings();
    } catch (err) {
      toast.error(err.message || "Lỗi cập nhật trạng thái");
    }
  };

  if (loading) return <LoadingState />;

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
      <PageHeaderWithAdd title="Quản lý Booking" />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columns}
        data={bookings}
        onEdit={handleViewDetail}
        onView={handleViewDetail}
      />

      {openDetailDialog && (
        <DetailDialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          booking={selectedBooking}
          onUpdateStatus={handleUpdateStatus}
          canEdit={userRole === "ADMIN" || userRole === "PROVIDER"}
        />
      )}
    </Box>
  );
}
