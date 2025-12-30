import { Alert, AlertTitle, Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import TicketForm from "./AddTicketStep/TicketForm";
import TicketList from "./AddTicketStep/TicketList";

export default function AddTicketStep() {
  const theme = useTheme();
  const {
    formState: { errors },
  } = useFormContext();
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(null);
  const ticketErrors = errors.tickets;

  const handleSelectTicket = (index) => {
    setSelectedTicketIndex(index);
  };

  const handleConfirm = () => {
    setSelectedTicketIndex(null);
  };

  return (
    <Box
      width="100%"
      bgcolor="white"
      borderRadius={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "30px 100px 60px 100px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.text.dark,
          fontWeight: 600,
          textAlign: "center",
          mb: 4,
        }}
      >
        Create Your Admission Tickets
      </Typography>

      {ticketErrors && typeof ticketErrors === "object" && !Array.isArray(ticketErrors) && (
        <Box mb={3}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <AlertTitle>Validation Error</AlertTitle>
            {ticketErrors.message || "Please add at least one ticket type"}
          </Alert>
        </Box>
      )}

      <TicketList selectedIndex={selectedTicketIndex} onSelectTicket={handleSelectTicket} />

      {selectedTicketIndex !== null && (
        <Box mt={4}>
          <TicketForm ticketIndex={selectedTicketIndex} onConfirm={handleConfirm} />
        </Box>
      )}
    </Box>
  );
}
