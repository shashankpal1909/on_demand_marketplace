import {
  Circle,
  Close,
  DarkMode,
  DoneAll,
  LightMode,
  Logout,
  Notifications,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Badge,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Link,
  Menu,
  MenuItem,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { signOut } from "@/features/auth/thunks";
import { selectThemeMode, toggleMode } from "@/features/theme/slice";

export default function Header({
  toggleDrawer,
}: Readonly<{
  toggleDrawer: (newOpen: boolean) => () => void;
}>) {
  const mode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { recentNotifications } = useAppSelector(
    (state) => state.notifications,
  );
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    let count = 0;
    recentNotifications.forEach((notification) => {
      if (!notification.read) {
        count++;
      }
    });
    setUnreadNotificationCount(count);
  }, [recentNotifications]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutDialogOpen = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <AppBar position="static">
      <Dialog
        fullWidth
        maxWidth="xs"
        open={logoutDialogOpen}
        onClose={handleLogoutDialogClose}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutDialogClose} variant="contained">
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              handleLogoutDialogClose();
              dispatch(signOut());
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link
            component={RouterLink}
            to={"/"}
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            On Demand Marketplace
          </Link>
        </Typography>
        {user && (
          <IconButton color="inherit" onClick={handleLogoutDialogOpen}>
            <Logout />
          </IconButton>
        )}
        <IconButton color="inherit" onClick={handleClick}>
          <Badge badgeContent={unreadNotificationCount} color="secondary">
            <Notifications />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={() => dispatch(toggleMode())}>
          {mode === "dark" ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Toolbar>
      <Menu
        component={Container}
        maxWidth="sm"
        anchorEl={anchorEl}
        open={open}
        sx={{
          m: 0,
          p: 0,
          // width: "400px",
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.1)",
            outline: "1px solid slategrey",
          },
        }}
        onClose={handleClose}
        // PaperProps={{
        //   style: {
        //     maxHeight: 600,
        //     maxWidth: 400,
        //     // width: "1000ch",
        //   },
        // }}
      >
        <Box
          sx={{
            px: 2,
            pb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        {recentNotifications?.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <Typography variant="body2" align="center">
              No notifications yet. Check back later.
            </Typography>
          </Box>
        )}
        {recentNotifications?.map((notification) => (
          <MenuItem
            key={notification.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
            onClick={handleClose}
          >
            <Typography
              variant="body1"
              sx={{
                display: "flex",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "space-between",
                gap: 1,
                flexGrow: 1,
                fontWeight: "600",
              }}
            >
              {notification.title}
              {!notification.read && (
                <Circle color="secondary" sx={{ width: "8px" }} />
              )}
            </Typography>
            <Typography variant="subtitle2" noWrap>
              {notification.description}
            </Typography>
          </MenuItem>
        ))}
        <Divider />
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="text"
            startIcon={<DoneAll />}
            size="small"
            onClick={handleClose}
            sx={{ whiteSpace: "nowrap" }}
          >
            Mark all as read
          </Button>

          <Button
            variant="contained"
            size="small"
            onClick={handleClose}
            sx={{ whiteSpace: "nowrap" }}
          >
            View all notifications
          </Button>
        </Box>
      </Menu>
    </AppBar>
  );
}
