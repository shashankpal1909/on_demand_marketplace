import { Box, Button, Container, CssBaseline, Typography } from "@mui/material";
import { useNavigate, useRouteError } from "react-router-dom";

export default function RootErrorBoundary() {
  const navigate = useNavigate();
  const error = useRouteError() as Error;

  return (
    <Container
      sx={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Uh oh, something went terribly wrong 😩
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 4, mb: 8 }}>
        <pre className="text-sm">{error.message || JSON.stringify(error)}</pre>
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button onClick={() => navigate("/")} variant="contained">
          Report
        </Button>
        <Button onClick={() => navigate("/")} variant={"outlined"}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
