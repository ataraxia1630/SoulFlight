import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import LoadingState from "@/shared/components/LoadingState";
import toast from "@/shared/utils/toast";
import JournalService from "../../services/journal.service";

const JournalPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: "",
  });

  const fetchJournals = useCallback(async () => {
    try {
      const res = await JournalService.getMyJournals();
      setJournals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  const handleClickDelete = (journal, e) => {
    e.stopPropagation();
    setDeleteDialog({
      open: true,
      id: journal.id,
      name: journal.title,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      await JournalService.delete(deleteDialog.id);
      toast.success("Đã xóa bài viết");
      setDeleteDialog({ open: false, id: null, name: "" });
      fetchJournals();
    } catch {
      toast.error("Lỗi khi xóa bài viết");
    }
  };

  const handleCloseDelete = () => {
    setDeleteDialog({ open: false, id: null, name: "" });
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/journal/edit/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Nhật Ký Hành Trình
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Lưu giữ những khoảnh khắc đáng nhớ của bạn.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/journal/create")}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Viết bài mới
        </Button>
      </Box>

      {loading ? (
        <LoadingState />
      ) : journals.length === 0 ? (
        <Box textAlign="center" py={7}>
          <Typography color="text.secondary">Bạn chưa có bài viết nào.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {journals.map((journal) => (
            <Box
              key={journal.id}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(33.333% - 16px)",
                },
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 1,
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[4],
                    borderColor: "primary.light",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/journal/${journal.id}`)}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <Box sx={{ position: "relative", width: "100%", pt: "60%" }}>
                    {journal.cover_image ? (
                      <CardMedia
                        component="img"
                        image={journal.cover_image}
                        alt={journal.title}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          bgcolor: "grey.100",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Stack alignItems="center" spacing={1} color="text.disabled">
                          <ImageIcon fontSize="large" />
                          <Typography variant="body2">No image</Typography>
                        </Stack>
                      </Box>
                    )}

                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        display: "flex",
                        gap: 1,
                        zIndex: 2,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(4px)",
                          "&:hover": { bgcolor: "white" },
                        }}
                        onClick={(e) => handleEdit(journal.id, e)}
                      >
                        <EditIcon fontSize="small" color="primary" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(4px)",
                          "&:hover": { bgcolor: "white" },
                        }}
                        onClick={(e) => handleClickDelete(journal, e)}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, width: "100%", p: 2.5 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1}
                      mb={1}
                      color="text.secondary"
                    >
                      <CalendarTodayIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        {new Date(journal.created_at).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Stack>

                    <Typography
                      gutterBottom
                      variant="h5"
                      fontWeight="semibold"
                      sx={{
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        minHeight: "2.6rem",
                      }}
                    >
                      {journal.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        height: "4rem",
                      }}
                    >
                      {journal.content}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        itemName={deleteDialog.name}
      />
    </Container>
  );
};

export default JournalPage;
