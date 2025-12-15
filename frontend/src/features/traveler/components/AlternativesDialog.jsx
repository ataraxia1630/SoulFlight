import {
  AttachMoney,
  AutoAwesome,
  CheckCircle,
  Close,
  LocationOn,
  TrendingUp,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useActivity } from "../hooks/useItinerary";

export default function AlternativesDialog({ open, onClose, activity, onReplace }) {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [replacing, setReplacing] = useState(false);
  const { getAlternatives, replaceActivity } = useActivity();

  const loadAlternatives = useCallback(async () => {
    setLoading(true);
    setSelectedIndex(null);
    try {
      const alts = await getAlternatives(activity.id);
      setAlternatives(alts);
    } catch (error) {
      console.error("Load alternatives error:", error);
    } finally {
      setLoading(false);
    }
  }, [activity, getAlternatives]);

  useEffect(() => {
    if (open && activity) {
      loadAlternatives();
    }
  }, [open, activity, loadAlternatives]);

  const handleReplace = async (alternative, index) => {
    setReplacing(true);
    setSelectedIndex(index);
    try {
      await replaceActivity(activity.id, alternative);
      onReplace(alternative);
      onClose();
    } catch (error) {
      console.error("Replace error:", error);
    } finally {
      setReplacing(false);
      setSelectedIndex(null);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              Gợi ý thay thế
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Địa điểm hiện tại: <strong>{activity?.title}</strong>
            </Typography>
          </Stack>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress size={48} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              AI đang tìm kiếm các lựa chọn thay thế tốt nhất...
            </Typography>
          </Box>
        ) : alternatives.length === 0 ? (
          <Alert severity="info">
            Không tìm thấy gợi ý thay thế phù hợp. Vui lòng thử lại sau.
          </Alert>
        ) : (
          <Stack spacing={3}>
            <AnimatePresence>
              {alternatives.map((alt, index) => (
                <motion.div
                  key={alt}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      position: "relative",
                      overflow: "visible",
                      border: selectedIndex === index ? "2px solid" : "1px solid",
                      borderColor: selectedIndex === index ? "primary.main" : "divider",
                      "&:hover": {
                        boxShadow: 4,
                        borderColor: "primary.light",
                      },
                    }}
                  >
                    {/* Comparison Badge */}
                    {alt.estimatedRating > activity.estimated_rating && (
                      <Chip
                        icon={<TrendingUp />}
                        label="Rating cao hơn"
                        color="success"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -12,
                          right: 16,
                          zIndex: 1,
                        }}
                      />
                    )}

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      {/* Photo */}
                      {alt.photo?.url && (
                        <CardMedia
                          component="img"
                          sx={{
                            width: { xs: "100%", sm: 200 },
                            height: { xs: 200, sm: "auto" },
                            objectFit: "cover",
                            borderRadius: {
                              xs: "12px 12px 0 0",
                              sm: "12px 0 0 12px",
                            },
                          }}
                          image={alt.photo.url}
                          alt={alt.title}
                        />
                      )}

                      {/* Content */}
                      <CardContent sx={{ flex: 1, p: 2.5 }}>
                        <Stack spacing={2}>
                          {/* Title & Rating */}
                          <Stack spacing={1}>
                            <Typography variant="h6" fontWeight={600}>
                              {alt.title}
                            </Typography>

                            <Stack direction="row" spacing={1} alignItems="center">
                              <Rating
                                value={alt.estimatedRating}
                                precision={0.1}
                                size="small"
                                readOnly
                              />
                              <Typography variant="body2" color="text.secondary">
                                {alt.estimatedRating}
                              </Typography>
                            </Stack>
                          </Stack>

                          {/* Address */}
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {alt.exactAddress}
                            </Typography>
                          </Stack>

                          {/* Description */}
                          <Typography variant="body2">{alt.description}</Typography>

                          {/* Meta Info */}
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip
                              icon={<AttachMoney />}
                              label={formatCurrency(alt.estimatedCost)}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                            {alt.distanceFromOriginal && (
                              <Chip
                                label={`${alt.distanceFromOriginal} từ địa điểm hiện tại`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {alt.priceLevel && (
                              <Chip
                                label={Array(alt.priceLevel).fill("₫").join("")}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Stack>

                          {/* AI Insights */}
                          {alt.whyBetter && (
                            <Alert
                              severity="info"
                              icon={<AutoAwesome />}
                              sx={{ bgcolor: "rgba(33, 150, 243, 0.08)" }}
                            >
                              <Typography variant="body2">
                                <strong>✨ AI gợi ý:</strong> {alt.whyBetter}
                              </Typography>
                              {alt.bestFor && (
                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                  <strong>Phù hợp với:</strong> {alt.bestFor}
                                </Typography>
                              )}
                            </Alert>
                          )}

                          {/* Local Tips */}
                          {alt.localTips && alt.localTips.length > 0 && (
                            <Box
                              sx={{
                                bgcolor: "rgba(255, 152, 0, 0.08)",
                                p: 1.5,
                                borderRadius: 2,
                              }}
                            >
                              <Typography variant="caption" fontWeight={600} color="warning.dark">
                                💡 Tips:
                              </Typography>
                              <ul style={{ margin: "4px 0 0 0", paddingLeft: 20 }}>
                                {alt.localTips.slice(0, 2).map((tip) => (
                                  <li key={tip}>
                                    <Typography variant="caption">{tip}</Typography>
                                  </li>
                                ))}
                              </ul>
                            </Box>
                          )}

                          {/* Replace Button */}
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={
                              replacing && selectedIndex === index ? (
                                <CircularProgress size={16} />
                              ) : (
                                <CheckCircle />
                              )
                            }
                            onClick={() => handleReplace(alt, index)}
                            disabled={replacing}
                            sx={{ mt: 1 }}
                          >
                            {replacing && selectedIndex === index
                              ? "Đang thay thế..."
                              : "Chọn địa điểm này"}
                          </Button>
                        </Stack>
                      </CardContent>
                    </Stack>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
