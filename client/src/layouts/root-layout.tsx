import {
  ForkLeft,
  ForkRight,
  Inbox,
  Mail,
  MoveToInboxRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  styled,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { useAppDispatch } from "@/app/hooks";

import Footer from "@/components/footer";
import Header from "@/components/header";

import { getCurrentUser } from "@/features/auth/thunks";

const drawerWidth = 240;

function RootLayout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    console.log("toggle drawer");
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <MoveToInboxRounded /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
        <Header toggleDrawer={toggleDrawer} />
        <Outlet />
        <Footer />
      </Box>
    </Box>
  );
}

export default RootLayout;
