import TagService from "@business/services/tag.service";
import {
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItemButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function ServiceTagStep() {
  const theme = useTheme();
  const { setValue, watch } = useFormContext();
  const selectedTagIds = watch("tags") || [];
  const type = watch("model");
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type) {
      setCategories([]);
      setSelectedCategory("");
      setLoading(false);
      return;
    }
    setLoading(true);
    TagService.getByType({ type: type, mode: "other" })
      .then((data) => {
        setCategories(data.grouped || {});
        setSelectedCategory(Object.keys(data.grouped)[0] || "");
      })
      .catch(() => alert("Load service tags failed"))
      .finally(() => setLoading(false));
  }, [type]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleTagToggle = (tagId) => {
    const newTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    setValue("tags", newTagIds, { shouldValidate: true });
  };

  const tags = categories[selectedCategory] || [];

  if (!type) {
    return (
      <Box textAlign="center" py={5}>
        <Typography color="text.secondary">Vui lòng chọn loại dịch vụ trước.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" py={5}>
        <Typography>Đang tải trang...</Typography>
      </Box>
    );
  }

  if (Object.keys(categories).length === 0) {
    return (
      <Box textAlign="center" py={5}>
        <Typography color="text.secondary">Không có tag nào cho loại dịch vụ này.</Typography>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingBottom: "60px",
      }}
    >
      <Box width="100%" bgcolor="white" borderRadius={3} paddingY="30px">
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.dark,
            fontWeight: 600,
            textAlign: "center",
            mb: 2,
          }}
        >
          Choose the tags that best describe your business
        </Typography>
        <Typography
          sx={{
            fontWeight: "light",
            textAlign: "center",
            fontSize: "12px",
            marginX: { xs: "0px", sm: "100px" },
          }}
        >
          These tags not only help travelers discover your services more easily through smart
          filters and personalized recommendations, but also increase your visibility, attract the
          right audience, and highlight your business’s unique strengths.
        </Typography>
      </Box>
      <Box display="flex" mt={4} gap={4} width="100%">
        <Box width={{ xs: "30%", sm: "20%", md: "15%" }} bgcolor="white" borderRadius={3} py={2}>
          <List disablePadding>
            {Object.keys(categories).map((category) => (
              <ListItemButton
                key={category}
                onClick={() => handleCategoryChange(category)}
                sx={{
                  color:
                    selectedCategory === category
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  fontWeight: selectedCategory === category ? 600 : 400,
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  "&:hover": {
                    backgroundColor: "#f5f8fa",
                  },
                }}
              >
                {category}
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box flexGrow={1} bgcolor="white" borderRadius={3} px={{ xs: 2, sm: 4, md: 6 }} py={3}>
          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
            {tags.map((tag) => (
              <FormControlLabel
                key={tag.id}
                control={
                  <Checkbox
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                  />
                }
                label={tag.display || tag.name}
                sx={{
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
