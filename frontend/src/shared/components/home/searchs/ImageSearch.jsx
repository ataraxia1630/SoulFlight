import { Box, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import PrimaryButton from "@/shared/components/PrimaryButton";

const ImageSearch = ({ imageFile, setImageFile }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  useEffect(() => {
    return () => {
      if (imageFile) URL.revokeObjectURL(imageFile.preview);
    };
  }, [imageFile]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 7,
        minHeight: "250px",
        bgcolor: "background.input",
        borderRadius: 2,
        textAlign: "center",
        border: 0.2,
        borderColor: "border.light",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!imageFile ? (
        <>
          <Typography sx={{ mb: 2, fontSize: 14, color: "text.secondary" }}>
            Upload an image to search
          </Typography>

          <PrimaryButton
            component="label"
            sx={{
              px: 4,
              py: 1.5,
              color: "text.contrast",
              "&:hover": { backgroundColor: "primary.main" },
            }}
          >
            Choose Image
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </PrimaryButton>
        </>
      ) : (
        <>
          <Box
            component="img"
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            sx={{
              maxWidth: "100%",
              maxHeight: 250,
              borderRadius: 1.5,
              mb: 2,
            }}
          />
          <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2 }}>
            {imageFile.name}
          </Typography>

          <PrimaryButton
            variant="outlined"
            sx={{
              px: 3,
              py: 1,
              color: "primary.main",
              backgroundColor: "transparent",
              border: "1px solid",
              borderColor: "primary.main",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            onClick={() => setImageFile(null)}
          >
            Change Image
          </PrimaryButton>
        </>
      )}
    </Paper>
  );
};

export default ImageSearch;
