import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

const PictureInput = ({
  label = "Image",
  value = "",
  file = null,
  onUrlChange,
  onFileChange,
  error = false,
  helperText = "",
  required = false,
  fullWidth = true,
  margin = "normal",
  placeholder = "https://example.com/image.png",
  sx = {},
  ...props
}) => {
  const [internalUrl, setInternalUrl] = useState(value);
  const theme = useTheme();

  useEffect(() => {
    setInternalUrl(value);
  }, [value]);

  const displayValue = file ? file.name : internalUrl || "";
  const previewUrl = file ? URL.createObjectURL(file) : internalUrl;

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setInternalUrl(val);
    onUrlChange?.(val);

    if (val && file) {
      onFileChange?.(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange?.(selectedFile);
      setInternalUrl("");
      onUrlChange?.("");
    }
  };

  return (
    <>
      <TextField
        fullWidth={fullWidth}
        margin={margin}
        label={label + (required ? " *" : "")}
        value={displayValue}
        onChange={handleUrlChange}
        placeholder={placeholder}
        error={error}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: theme.palette.background.input,
            "& fieldset": {
              border: `1px solid ${theme.palette.border.light}`,
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.light,
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-error fieldset": {
              borderColor: theme.palette.error.main,
            },
          },
          ...sx,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton component="label" size="large" color="primary">
                <CloudUploadIcon fontSize="medium" />
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />

      {(helperText || previewUrl) && (
        <Box sx={{ mt: 0.5, display: "flex", alignItems: "flex-start", gap: 2 }}>
          {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
          {previewUrl && (
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 1,
                overflow: "hidden",
                border: "2px solid",
                borderColor: error ? "error.main" : "grey.300",
                position: "relative",
              }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              {file && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    bgcolor: "primary.main",
                    color: "white",
                    fontSize: 9,
                    px: 0.6,
                    py: 0.2,
                    borderRadius: 1,
                  }}
                >
                  NEW
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default PictureInput;
