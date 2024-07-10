import { Button, Container, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ServiceManagement() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4">Service Management</Typography>
      <Typography variant="subtitle2">
        Manage your services, view usage, and track your expenses.
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Button variant="contained" onClick={() => navigate("/services/add")}>
        Add New Service
      </Button>
    </Container>
  );
}

export default ServiceManagement;
