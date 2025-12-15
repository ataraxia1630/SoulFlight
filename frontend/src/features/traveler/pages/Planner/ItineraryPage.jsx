import {
  ArrowBack,
  Delete,
  Favorite,
  FavoriteBorder,
  KeyboardArrowUp,
  Share,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlternativesDialog from "../../components/AlternativesDialog";
import ItineraryForm from "../../components/ItineraryForm";
import ItineraryTimeline from "../../components/ItineraryTimeline";
import LoadingScreen from "../../components/LoadingScreen";
import ReviewsDialog from "../../components/ReviewsDialog";
import { useActivity, useItinerary } from "../../hooks/useItinerary";

export default function ItineraryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const timelineId = useId();

  const { itinerary, loading, generateItinerary, updateItinerary, deleteItinerary, setItinerary } =
    useItinerary(id);

  const { updateActivity, deleteActivity: deleteActivityAPI } = useActivity();

  // Dialog states
  const [alternativesDialog, setAlternativesDialog] = useState({
    open: false,
    activity: null,
  });
  const [reviewsDialog, setReviewsDialog] = useState({
    open: false,
    activity: null,
  });
  const [editDialog, setEditDialog] = useState({ open: false, activity: null });
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    activity: null,
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll
  useState(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle form submit
  const handleGenerateItinerary = async (formData) => {
    try {
      const _result = await generateItinerary(formData);
      enqueueSnackbar("Tạo lịch trình thành công! 🎉", { variant: "success" });
      // Scroll to timeline
      setTimeout(() => {
        document.getElementById("itinerary-timeline")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 500);
    } catch (error) {
      console.error("Generate itinerary error:", error);
    }
  };

  // Handle activity actions
  const handleActivityEdit = (activity) => {
    setEditDialog({ open: true, activity });
  };

  const handleActivityDelete = (activity) => {
    setDeleteConfirm({ open: true, activity });
  };

  const confirmDelete = async () => {
    try {
      await deleteActivityAPI(deleteConfirm.activity.id);

      // Update local state
      setItinerary((prev) => ({
        ...prev,
        days: prev.days.map((day) => ({
          ...day,
          activities: day.activities.filter((act) => act.id !== deleteConfirm.activity.id),
        })),
      }));

      setDeleteConfirm({ open: false, activity: null });
    } catch (error) {
      console.error("Delete activity error:", error);
    }
  };

  const handleActivityReplace = (activity) => {
    setAlternativesDialog({ open: true, activity });
  };

  const handleReplaceComplete = (newActivity) => {
    // Update local state
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((day) => ({
        ...day,
        activities: day.activities.map((act) =>
          act.id === alternativesDialog.activity.id ? { ...act, ...newActivity } : act,
        ),
      })),
    }));

    setAlternativesDialog({ open: false, activity: null });
  };

  const handleActivityViewReviews = (activity) => {
    setReviewsDialog({ open: true, activity });
  };

  const handleActivityToggleComplete = async (activity) => {
    try {
      await updateActivity(activity.id, {
        is_completed: !activity.is_completed,
      });

      // Update local state
      setItinerary((prev) => ({
        ...prev,
        days: prev.days.map((day) => ({
          ...day,
          activities: day.activities.map((act) =>
            act.id === activity.id ? { ...act, is_completed: !act.is_completed } : act,
          ),
        })),
      }));
    } catch (error) {
      console.error("Toggle complete error:", error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateActivity(editDialog.activity.id, {
        user_notes: editDialog.activity.user_notes,
        time: editDialog.activity.time,
      });

      // Update local state
      setItinerary((prev) => ({
        ...prev,
        days: prev.days.map((day) => ({
          ...day,
          activities: day.activities.map((act) =>
            act.id === editDialog.activity.id ? editDialog.activity : act,
          ),
        })),
      }));

      setEditDialog({ open: false, activity: null });
    } catch (error) {
      console.error("Save edit error:", error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await updateItinerary(itinerary.id, {
        is_favorite: !itinerary.is_favorite,
      });

      setItinerary((prev) => ({
        ...prev,
        is_favorite: !prev.is_favorite,
      }));
    } catch (error) {
      console.error("Toggle favorite error:", error);
    }
  };

  const handleDeleteItinerary = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch trình này?")) {
      try {
        await deleteItinerary(itinerary.id);
        navigate("/itineraries");
      } catch (error) {
        console.error("Delete itinerary error:", error);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        {itinerary && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Button startIcon={<ArrowBack />} onClick={() => navigate("/itineraries")}>
                Quay lại
              </Button>

              <Stack direction="row" spacing={1}>
                <Tooltip title={itinerary.is_favorite ? "Bỏ yêu thích" : "Yêu thích"}>
                  <IconButton onClick={handleToggleFavorite}>
                    {itinerary.is_favorite ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Chia sẻ">
                  <IconButton>
                    <Share />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Xóa lịch trình">
                  <IconButton onClick={handleDeleteItinerary} color="error">
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </motion.div>
        )}

        {/* Content */}
        <Stack spacing={4}>
          {/* Form - Show if no itinerary */}
          {!itinerary && !loading && (
            <ItineraryForm onSubmit={handleGenerateItinerary} loading={loading} />
          )}

          {/* Loading */}
          {loading && !itinerary && <LoadingScreen destination="điểm đến của bạn" />}

          {/* Timeline - Show if itinerary exists */}
          <AnimatePresence>
            {itinerary && !loading && (
              <motion.div
                id={timelineId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ItineraryTimeline
                  itinerary={itinerary}
                  onActivityEdit={handleActivityEdit}
                  onActivityDelete={handleActivityDelete}
                  onActivityReplace={handleActivityReplace}
                  onActivityViewReviews={handleActivityViewReviews}
                  onActivityToggleComplete={handleActivityToggleComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>

        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 1000,
              }}
            >
              <Fab color="primary" size="medium" onClick={scrollToTop}>
                <KeyboardArrowUp />
              </Fab>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Dialogs */}
      <AlternativesDialog
        open={alternativesDialog.open}
        onClose={() => setAlternativesDialog({ open: false, activity: null })}
        activity={alternativesDialog.activity}
        onReplace={handleReplaceComplete}
      />

      <ReviewsDialog
        open={reviewsDialog.open}
        onClose={() => setReviewsDialog({ open: false, activity: null })}
        activity={reviewsDialog.activity}
      />

      {/* Edit Activity Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, activity: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa hoạt động</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Thời gian"
              type="time"
              value={editDialog.activity?.time || ""}
              onChange={(e) =>
                setEditDialog((prev) => ({
                  ...prev,
                  activity: { ...prev.activity, time: e.target.value },
                }))
              }
              fullWidth
            />

            <TextField
              label="Ghi chú"
              multiline
              rows={3}
              value={editDialog.activity?.user_notes || ""}
              onChange={(e) =>
                setEditDialog((prev) => ({
                  ...prev,
                  activity: { ...prev.activity, user_notes: e.target.value },
                }))
              }
              fullWidth
              placeholder="Thêm ghi chú cá nhân của bạn..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, activity: null })}>Hủy</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, activity: null })}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa hoạt động "{deleteConfirm.activity?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, activity: null })}>Hủy</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
