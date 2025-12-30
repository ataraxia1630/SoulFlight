import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import CollectionsIcon from "@mui/icons-material/Collections";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import LoadingState from "@/shared/components/LoadingState";
import toast from "@/shared/utils/toast";
import JournalService from "../../services/journal.service";

const JournalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openLightbox, setOpenLightbox] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await JournalService.getById(id);
        setJournal(res.data);
      } catch {
        toast.error("Không tìm thấy bài viết");
        navigate("/journal");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await JournalService.delete(id);
      toast.success("Đã xóa bài viết");
      navigate("/journal");
    } catch {
      toast.error("Lỗi khi xóa");
    } finally {
      setDeleteDialog(false);
    }
  };

  const handleOpenLightbox = (index) => {
    setActiveImageIndex(index);
    setOpenLightbox(true);
  };
  const handleCloseLightbox = () => setOpenLightbox(false);
  const handleNextImage = () => {
    if (!journal?.images) return;
    setActiveImageIndex((prev) => (prev + 1) % journal.images.length);
  };
  const handlePrevImage = () => {
    if (!journal?.images) return;
    setActiveImageIndex((prev) => (prev - 1 + journal.images.length) % journal.images.length);
  };

  if (loading) return <LoadingState />;
  if (!journal) return <Container sx={{ py: 5 }}>Không tìm thấy bài viết</Container>;

  return (
    <Box sx={{ minHeight: "100vh", pb: 7 }}>
      <Container maxWidth="lg" sx={{ mt: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/journal")}
            sx={{
              color: "text.primary",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Quay lại
          </Button>

          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/journal/edit/${journal.id}`)}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Sửa
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialog(true)}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Xóa
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            height: { xs: 200, md: 350 },
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            backgroundImage: `url(${
              journal.cover_image || "https://via.placeholder.com/1200x600"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            mb: 4,
            boxShadow: theme.shadows[4],
            cursor: "pointer",
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "70%",
              background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
            },
          }}
          onClick={() => handleOpenLightbox(0)}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 30,
              left: 0,
              px: { xs: 2, md: 5 },
              width: "100%",
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                color: "white",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                fontSize: { xs: "1.8rem", md: "3rem" },
                mb: 2,
              }}
            >
              {journal.title}
            </Typography>

            <Box display="flex" gap={3} alignItems="center" color="rgba(255,255,255,0.9)">
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="body1" fontWeight={500}>
                  {new Date(journal.created_at).toLocaleDateString("vi-VN", {
                    dateStyle: "long",
                  })}
                </Typography>
              </Box>

              <Chip
                icon={<CollectionsIcon style={{ color: "white", fontSize: "1rem" }} />}
                label={`${journal.images?.length || 0} ảnh`}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  backdropFilter: "blur(4px)",
                  fontWeight: 600,
                  border: "none",
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ maxWidth: "md", mx: "auto" }}>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              fontSize: "1.15rem",
              whiteSpace: "pre-wrap",
              color: "text.primary",
              mb: 6,
            }}
          >
            {journal.content}
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {journal.images && journal.images.length > 0 && (
            <>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                Thư viện ảnh
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                  gap: 2,
                }}
              >
                {journal.images.map((img, index) => (
                  <Box
                    key={img.id}
                    sx={{
                      position: "relative",
                      paddingTop: "75%",
                      borderRadius: 3,
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: 2,
                      transition: "all 0.3s ease",
                      "&:hover": { boxShadow: 6 },
                    }}
                    onClick={() => handleOpenLightbox(index)}
                  >
                    <Box
                      component="img"
                      src={img.thumbnail_url || img.url}
                      alt="Memory"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>

      <DeleteConfirmDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        itemName={journal.title}
      />

      <Dialog
        fullScreen
        open={openLightbox}
        onClose={handleCloseLightbox}
        sx={{ "& .MuiDialog-paper": { bgcolor: "black" } }}
      >
        <IconButton
          onClick={handleCloseLightbox}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            color: "white",
            bgcolor: "rgba(255,255,255,0.2)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        <IconButton
          onClick={handlePrevImage}
          sx={{
            position: "absolute",
            top: "50%",
            left: 20,
            transform: "translateY(-50%)",
            color: "white",
            bgcolor: "rgba(255,255,255,0.2)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
            zIndex: 10,
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
          onClick={handleCloseLightbox}
        >
          <Box onClick={(e) => e.stopPropagation()} sx={{ display: "inline-block" }}>
            <img
              src={journal.images?.[activeImageIndex]?.url}
              alt="Fullsize"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: 4,
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            />
          </Box>
        </Box>

        <IconButton
          onClick={handleNextImage}
          sx={{
            position: "absolute",
            top: "50%",
            right: 20,
            transform: "translateY(-50%)",
            color: "white",
            bgcolor: "rgba(255,255,255,0.2)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
            zIndex: 10,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        <Typography
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.8)",
            fontWeight: "bold",
          }}
        >
          {activeImageIndex + 1} / {journal.images?.length}
        </Typography>
      </Dialog>
    </Box>
  );
};

export default JournalDetailPage;
