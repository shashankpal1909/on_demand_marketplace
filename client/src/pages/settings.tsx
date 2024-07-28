import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";

import RequireAuth from "@/components/require-auth";

function SettingsPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <RequireAuth>
      <Container sx={{ mt: 3 }}>
        <Typography variant="h4">Settings</Typography>
        <Typography variant="subtitle2">
          Edit your account settings, preferences, and security.
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Box>
          <Typography variant="overline">Personal</Typography>
          <Divider sx={{ mb: 1 }} />
          <Grid
            container
            spacing={1}
            sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
          >
            <Grid item xs={2.5}>
              <Typography variant="body1">Email</Typography>
            </Grid>
            <Grid item xs={9.5}>
              <TextField
                fullWidth
                variant="standard"
                value={user?.email}
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={2.5}>
              <Typography variant="body1">Username</Typography>
            </Grid>
            <Grid item xs={9.5}>
              <TextField
                fullWidth
                variant="standard"
                value={user?.username}
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={2.5}>
              <Typography variant="body1">Name</Typography>
            </Grid>
            <Grid item xs={9.5}>
              <TextField
                fullWidth
                variant="standard"
                value={user?.name}
                inputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ my: 1 }}>
          <Typography variant="overline">Security</Typography>
          <Divider sx={{ mb: 1 }} />
          <Button
            variant="outlined"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </Button>
        </Box>
      </Container>
    </RequireAuth>
  );
}

export default SettingsPage;
