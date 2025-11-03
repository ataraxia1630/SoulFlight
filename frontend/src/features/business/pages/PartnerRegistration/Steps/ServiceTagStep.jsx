import {
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItemButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const TAG_CATEGORIES = {
  Environment: [
    "Beachfront",
    "Forest Retreat",
    "Desert Stay",
    "Ocean View",
    "Cliffside",
    "Mountain View",
    "Countryside",
    "Island Stay",
    "Valley View",
    "Lake View",
    "Urban Center",
    "Nature Escape",
    "Hilltop",
    "Jungle Stay",
    "Riverfront",
    "Suburban Area",
    "Seaside",
    "Garden View",
  ],
  Concept: [
    "Eco Lodge",
    "Luxury Resort",
    "Minimalist",
    "Boutique Stay",
    "Family Friendly",
    "Romantic Getaway",
  ],
  Experience: ["Adventure", "Cultural", "Wellness", "Retreat", "Food & Wine", "Outdoor"],
  Feature: ["Pet Friendly", "Private Pool", "Infinity Pool", "Spa Access", "Private Beach"],
  Other: ["Unique Architecture", "Historical Site", "Off-grid", "Camping Spot"],
};

export default function ServiceTagStep() {
  const theme = useTheme();
  const { setValue, watch } = useFormContext();
  const selectedTags = watch("tags") || [];
  const [selectedCategory, setSelectedCategory] = useState("Environment");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleTagToggle = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setValue("tags", newTags, { shouldValidate: true });
  };

  const tags = TAG_CATEGORIES[selectedCategory];

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
            {Object.keys(TAG_CATEGORIES).map((category) => (
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
                key={tag}
                control={
                  <Checkbox
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                }
                label={tag}
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
