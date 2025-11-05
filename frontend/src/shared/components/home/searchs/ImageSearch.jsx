import { Box, Button, Paper, Typography } from "@mui/material";
import { useEffect } from "react";

const ImageSearch = ({ imageFile, setImageFile }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setImageFile(previewFile);
    }
  };

  useEffect(() => {
    return () => {
      if (imageFile?.preview) URL.revokeObjectURL(imageFile.preview);
    };
  }, [imageFile]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 7,
        minHeight: 250,
        bgcolor: "background.input",
        borderRadius: 2,
        textAlign: "center",
        border: "0.2px solid",
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

          <Button
            component="label"
            variant="contained"
            sx={{
              fontSize: "15px",
              bgcolor: "primary.main",
              px: 4,
              py: 1.5,
              color: "text.contrast",
            }}
          >
            Choose Image
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </Button>
        </>
      ) : (
        <>
          <Box
            component="img"
            src={imageFile.preview}
            alt="Preview"
            sx={{ maxWidth: "100%", maxHeight: 250, borderRadius: 1.5, mb: 2 }}
          />
          <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2 }}>
            {imageFile.name}
          </Typography>

          <Button
            variant="outlined"
            sx={{
              fontSize: "15px",
              px: 3,
              py: 1,
              color: "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            onClick={() => setImageFile(null)}
          >
            Change Image
          </Button>
        </>
      )}
    </Paper>
  );
};

export default ImageSearch;
