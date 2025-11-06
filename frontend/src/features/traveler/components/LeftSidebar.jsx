import ChatIcon from "@mui/icons-material/Chat";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

const LeftSidebar = () => {
  const menu = [
    { text: "Home", icon: <HomeIcon /> },
    { text: "Explore", icon: <ExploreIcon /> },
    { text: "Groups", icon: <GroupIcon /> },
    { text: "Chats", icon: <ChatIcon /> },
  ];

  return (
    <List>
      {menu.map((item) => (
        <ListItem key={item.text}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );
};

export default LeftSidebar;
