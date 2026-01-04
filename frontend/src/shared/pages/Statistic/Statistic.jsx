import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCallback, useEffect, useState } from "react";
import LoadingState from "@/shared/components/LoadingState";
import { statisticAPI } from "@/shared/services/statistic.service";
import toast from "@/shared/utils/toast";

export default function Statistic({ userRole = "provider" }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await statisticAPI.getStatistics({ year, month });
      setStats(res.data);
    } catch (err) {
      toast.error(err.message || "Lấy dữ liệu thống kê thất bại");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <LoadingState />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Thống kê {userRole === "ADMIN" ? "Hệ thống" : "Provider"}
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Năm</InputLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)}>
              {[2025, 2026, 2027].map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Tháng (tùy chọn)</InputLabel>
            <Select value={month} onChange={(e) => setMonth(e.target.value)}>
              <MenuItem value="">Toàn năm</MenuItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {stats && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Tổng doanh thu</Typography>
              <Typography variant="h4" color="error.main">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(stats.totalRevenue)}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Số booking</Typography>
              <Typography variant="h4">{stats.totalBookings}</Typography>
            </Paper>
          </Grid>

          {!month && stats.monthlyRevenue.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>
                  Doanh thu theo tháng
                </Typography>
                <LineChart
                  xAxis={[
                    {
                      data: stats.monthlyRevenue.map((m) => m.month),
                      scaleType: "point",
                    },
                  ]}
                  series={[{ data: stats.monthlyRevenue.map((m) => m.revenue) }]}
                  height={300}
                />
              </Paper>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" mb={2}>
                Top dịch vụ nổi bật
              </Typography>
              <Box>
                {stats.topServices.map((s) => (
                  <Box key={s} display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{s.name}</Typography>
                    <Typography>
                      {s.count} bookings -{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(s.revenue)}{" "}
                      - Rating: {s.avg_rating}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
