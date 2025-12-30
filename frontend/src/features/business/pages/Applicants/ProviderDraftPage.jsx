import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../../../shared/components/LoadingState";
import PartnerRegistrationAPI from "../../../../shared/services/partnerRegistration.service";

export default function ProviderDraftsPage() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    draftId: null,
  });
  const [submitDialog, setSubmitDialog] = useState({
    open: false,
    draft: null,
  });

  useEffect(() => {
    const fetchDrafts = async () => {
      setLoading(true);
      try {
        const response = await PartnerRegistrationAPI.getDrafts();
        setDrafts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch drafts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handleEdit = (draftId) => {
    navigate(`/business/partner-registration/draft/${draftId}`);
  };

  const handleDelete = async () => {
    try {
      await PartnerRegistrationAPI.deleteDraft(deleteDialog.draftId);
      setDrafts(drafts.filter((d) => d.id !== deleteDialog.draftId));
      setDeleteDialog({ open: false, draftId: null });
    } catch (error) {
      console.error("Failed to delete draft:", error);
      alert("Failed to delete draft");
    }
  };

  const handleSubmit = async () => {
    try {
      const services = Array.isArray(submitDialog.draft.metadata)
        ? submitDialog.draft.metadata
        : [submitDialog.draft.metadata];

      await PartnerRegistrationAPI.submitApplicant(services);
      await PartnerRegistrationAPI.deleteDraft(submitDialog.draft.id);

      setDrafts(drafts.filter((d) => d.id !== submitDialog.draft.id));
      setSubmitDialog({ open: false, draft: null });
      alert("Draft submitted successfully!");
    } catch (error) {
      console.error("Failed to submit draft:", error);
      alert("Failed to submit draft");
    }
  };

  const getServiceCount = (draft) => {
    const services = Array.isArray(draft.metadata) ? draft.metadata : [draft.metadata];
    return services.length;
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={600}>
          My Drafts
        </Typography>
        <Button variant="contained" onClick={() => navigate("/business/partner-registration")}>
          New Application
        </Button>
      </Box>

      {drafts.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            No drafts yet
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Start creating your service registration
          </Typography>
          <Button variant="contained" onClick={() => navigate("/business/partner-registration")}>
            Create New Application
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          {drafts.map((draft) => (
            <Card key={draft.id} variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={500} mb={1}>
                      Draft #{draft.id.slice(0, 8)}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip
                        label={`${getServiceCount(draft)} Service${
                          getServiceCount(draft) > 1 ? "s" : ""
                        }`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Last saved: {new Date(draft.updated_at).toLocaleString()}
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(draft.id)}
                      title="Edit draft"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => setSubmitDialog({ open: true, draft })}
                      title="Submit application"
                    >
                      <SendIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, draftId: draft.id })}
                      title="Delete draft"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, draftId: null })}
      >
        <DialogTitle>Delete Draft</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this draft? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, draftId: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={submitDialog.open}
        onClose={() => setSubmitDialog({ open: false, draft: null })}
      >
        <DialogTitle>Submit Application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Submit this draft as an official application? You won't be able to edit it after
            submission.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialog({ open: false, draft: null })}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
