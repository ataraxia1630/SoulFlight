import { Box } from "@mui/material";
import FormInput from "../../FormInput";

const TextSearch = ({ searchText, setSearchText }) => {
  return (
    <Box>
      <FormInput
        label="Search text"
        placeholder="Enter destination, hotel, restaurant..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        multiline
        sx={{
          "& .MuiInputBase-root": {
            minHeight: 245,
            alignItems: "start",
          },
          "& textarea": {
            minHeight: "245px !important",
            resize: "none",
          },
        }}
      />
    </Box>
  );
};

export default TextSearch;
