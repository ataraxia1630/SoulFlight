import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";

export default function PageHeaderWithAdd({ title, onAdd, addButtonText = "Add", sx = {} }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        ...sx,
      }}
    >
      <Typography variant="h2" sx={{ color: "primary.main", fontWeight: 600 }}>
        {title}
      </Typography>

      {onAdd && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {addButtonText} {title}
        </Button>
      )}
    </Box>
  );
}
