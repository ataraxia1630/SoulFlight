import {
  CalendarToday,
  EmojiEvents,
  ExpandLess,
  ExpandMore,
  TrendingUp,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ActivityCard from "./ActivityCard";

export default function ItineraryTimeline({
  itinerary,
  onActivityEdit,
  onActivityDelete,
  onActivityReplace,
  onActivityViewReviews,
  onActivityToggleComplete,
}) {
  const [expandedDays, setExpandedDays] = useState(itinerary.days.map((_, idx) => idx === 0));

  const toggleDay = (index) => {
    setExpandedDays((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const calculateDayStats = (day) => {
    const totalCost = day.activities.reduce((sum, act) => sum + (act.estimated_cost || 0), 0);
    const completedCount = day.activities.filter((act) => act.is_completed).length;
    const totalActivities = day.activities.length;

    return { totalCost, completedCount, totalActivities };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box>
      {/* Header Summary */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight={700} color="white">
                {itinerary.title || `${itinerary.destination} Trip`}
              </Typography>
              <Chip
                label={`${itinerary.days.length} ngày`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            </Stack>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                icon={<CalendarToday />}
                label={`${format(
                  new Date(itinerary.start_date),
                  "dd/MM/yyyy",
                )} - ${format(new Date(itinerary.end_date), "dd/MM/yyyy")}`}
                sx={{ bgcolor: "rgba(255,255,255,0.9)" }}
              />
              {itinerary.budget && (
                <Chip
                  icon={<TrendingUp />}
                  label={`Budget: ${formatCurrency(itinerary.budget)}`}
                  sx={{ bgcolor: "rgba(255,255,255,0.9)" }}
                />
              )}
            </Stack>

            {/* AI Summary */}
            {itinerary.ai_summary && (
              <Typography
                variant="body2"
                color="rgba(255,255,255,0.95)"
                sx={{ fontStyle: "italic" }}
              >
                "{itinerary.ai_summary}"
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Travel Tips */}
      {itinerary.ai_tips && itinerary.ai_tips.length > 0 && (
        <Alert severity="info" icon={<EmojiEvents />} sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            💡 Gợi ý từ AI:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {itinerary.ai_tips.map((tip) => (
              <li key={tip}>
                <Typography variant="body2">{tip}</Typography>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Days Timeline */}
      <Stack spacing={3}>
        {itinerary.days.map((day, dayIndex) => {
          const stats = calculateDayStats(day);
          const isExpanded = expandedDays[dayIndex];
          const progress =
            stats.totalActivities > 0 ? (stats.completedCount / stats.totalActivities) * 100 : 0;

          return (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: dayIndex * 0.1 }}
            >
              <Card elevation={3}>
                {/* Day Header */}
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${
                      progress === 100 ? "#4CAF50" : "#2196F3"
                    } 0%, ${progress === 100 ? "#66BB6A" : "#42A5F5"} 100%)`,
                    color: "white",
                    p: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => toggleDay(dayIndex)}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            bgcolor: "rgba(255,255,255,0.2)",
                            borderRadius: "50%",
                            width: 48,
                            height: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h6" fontWeight={700}>
                            {day.day_number}
                          </Typography>
                        </Box>

                        <Stack>
                          <Typography variant="h6" fontWeight={600}>
                            {day.theme || `Ngày ${day.day_number}`}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {format(new Date(day.date), "EEEE, dd MMMM yyyy", {
                              locale: vi,
                            })}
                          </Typography>
                        </Stack>
                      </Stack>

                      <IconButton sx={{ color: "white" }}>
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Stack>

                    {/* Stats */}
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Chip
                        label={`${stats.totalActivities} hoạt động`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                        }}
                      />
                      <Chip
                        label={`${stats.completedCount} hoàn thành`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                        }}
                      />
                      <Chip
                        label={formatCurrency(stats.totalCost)}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                        }}
                      />
                    </Stack>

                    {/* Progress Bar */}
                    {stats.totalActivities > 0 && (
                      <Box>
                        <Box
                          sx={{
                            width: "100%",
                            height: 6,
                            bgcolor: "rgba(255,255,255,0.3)",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                              height: "100%",
                              backgroundColor: "rgba(255,255,255,0.9)",
                              borderRadius: 3,
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ mt: 0.5, display: "block" }}>
                          {Math.round(progress)}% hoàn thành
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* Activities */}
                <Collapse in={isExpanded}>
                  <CardContent sx={{ p: 3 }}>
                    {day.notes && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Ghi chú ngày {day.day_number}:</strong> {day.notes}
                        </Typography>
                      </Alert>
                    )}

                    <Stack spacing={2}>
                      <AnimatePresence>
                        {day.activities.map((activity, actIndex) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                              duration: 0.3,
                              delay: actIndex * 0.05,
                            }}
                          >
                            <ActivityCard
                              activity={activity}
                              onEdit={onActivityEdit}
                              onDelete={onActivityDelete}
                              onReplace={onActivityReplace}
                              onViewReviews={onActivityViewReviews}
                              onToggleComplete={onActivityToggleComplete}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </Stack>

                    {/* Add Activity Button */}
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={() => {
                        /* TODO: Implement add activity */
                      }}
                    >
                      + Thêm hoạt động
                    </Button>
                  </CardContent>
                </Collapse>
              </Card>
            </motion.div>
          );
        })}
      </Stack>

      {/* Budget Summary */}
      {itinerary.budget_breakdown && (
        <Card elevation={2} sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              💰 Phân bổ ngân sách
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1.5}>
              {Object.entries(itinerary.budget_breakdown).map(([key, value]) => (
                <Stack key={key} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" textTransform="capitalize">
                    {key === "accommodation" && "🏨 Chỗ ở"}
                    {key === "food" && "🍜 Ăn uống"}
                    {key === "transport" && "🚗 Di chuyển"}
                    {key === "attractions" && "🎫 Tham quan"}
                    {key === "total" && "📊 Tổng cộng"}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={key === "total" ? 700 : 500}
                    color={key === "total" ? "primary" : "text.primary"}
                  >
                    {formatCurrency(value)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
