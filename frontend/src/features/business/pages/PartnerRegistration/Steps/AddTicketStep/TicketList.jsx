import AddIcon from "@mui/icons-material/Add";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { Box, Stack, Typography } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { defaultTicket } from "../defaultValues";

export default function TicketList({ onSelectTicket, selectedIndex }) {
  const { control, watch } = useFormContext();
  const { fields, append } = useFieldArray({ control, name: "tickets" });

  const handleAddTicket = () => {
    append(defaultTicket);
    onSelectTicket(fields.length);
  };

  return (
    <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center" mb={4}>
      {fields.map((field, index) => {
        const ticket = watch(`tickets.${index}`);
        const hasPrice = ticket.price && !Number.isNaN(ticket.price);

        return (
          <Stack
            key={field.id}
            alignItems="center"
            spacing={1}
            sx={{
              cursor: "pointer",
              border: selectedIndex === index ? "2px solid" : "2px dashed",
              borderColor: selectedIndex === index ? "primary.main" : "grey.300",
              borderRadius: 3,
              p: 2,
              width: 140,
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                transform: "translateY(-2px)",
                boxShadow: 2,
              },
            }}
            onClick={() => onSelectTicket(index)}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: selectedIndex === index ? "primary.light" : "grey.100",
                transition: "all 0.2s",
              }}
            >
              <ConfirmationNumberIcon
                sx={{
                  fontSize: 40,
                  color: selectedIndex === index ? "primary.main" : "grey.500",
                }}
              />
            </Box>

            <Typography
              variant="subtitle2"
              noWrap
              sx={{ width: 120, textAlign: "center", fontWeight: 500 }}
            >
              {ticket.name || `Ticket ${index + 1}`}
            </Typography>

            {hasPrice && (
              <Typography variant="caption" color="primary.main" fontWeight={600}>
                ${ticket.price}
              </Typography>
            )}
          </Stack>
        );
      })}

      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{
          border: "2px dashed",
          borderColor: "grey.400",
          borderRadius: 3,
          width: 140,
          height: 140,
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "grey.50",
            transform: "translateY(-2px)",
          },
        }}
        onClick={handleAddTicket}
      >
        <AddIcon sx={{ fontSize: 40, color: "grey.500" }} />
        <Typography variant="subtitle2" color="text.secondary">
          Add Ticket
        </Typography>
      </Stack>
    </Box>
  );
}
