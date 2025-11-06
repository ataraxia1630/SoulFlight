import {
  ConfirmationNumber,
  Explore as ExploreIcon,
  Hotel,
  Restaurant,
  RoomService,
  Search,
} from "@mui/icons-material";
import { Paper, Tab, Tabs } from "@mui/material";

const tabs = [
  { value: "all", label: "All Results", icon: <Search /> },
  { value: "service", label: "Services", icon: <RoomService /> },
  { value: "room", label: "Rooms", icon: <Hotel /> },
  { value: "menu", label: "Menus", icon: <Restaurant /> },
  { value: "ticket", label: "Tickets", icon: <ConfirmationNumber /> },
  { value: "tour", label: "Tours", icon: <ExploreIcon /> },
];

const ExploreTabs = ({ value, onChange }) => {
  return (
    <Paper elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTab-root": {
            minHeight: 64,
            textTransform: "none",
            fontSize: 15,
            fontWeight: 600,
          },
        }}
      >
        {tabs.map((t) => (
          <Tab key={t.value} value={t.value} label={t.label} icon={t.icon} iconPosition="start" />
        ))}
      </Tabs>
    </Paper>
  );
};

export default ExploreTabs;
