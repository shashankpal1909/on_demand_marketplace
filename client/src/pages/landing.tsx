import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography align="center" variant="h3">
        Welcome to the{" "}
        <Typography component={"span"} color={"primary.main"} variant="h3">
          On Demand Marketplace!
        </Typography>
      </Typography>
      <Typography align="center" variant="body1">
        This is a demo application showcasing a simple marketplace built with
        React, Redux, and Material-UI.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/sign-up")}>
        Get Started
      </Button>
    </Container>
  );
}

export default LandingPage;
