import { DarkMode, LightMode, Logout } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { signOut } from "@/features/auth/thunks";
import { selectThemeMode, toggleMode } from "@/features/theme/slice";

export default function Header({
  toggleDrawer,
}: {
  toggleDrawer: (newOpen: boolean) => () => void;
}) {
  const mode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppBar position="static">
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              handleClose();
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
          <IconButton color="inherit" onClick={handleClickOpen}>
            <Logout />
          </IconButton>
        )}
        <IconButton color="inherit" onClick={() => dispatch(toggleMode())}>
          {mode === "dark" ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
