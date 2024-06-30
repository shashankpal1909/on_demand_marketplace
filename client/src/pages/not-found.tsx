import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h3" color="primary.main">
        404 : Not Found
      </Typography>
      <Typography variant="body1">
        Oops! It seems the page you&apos;re looking for doesn&apos;t exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Back To Home
      </Button>
    </Container>
  );
}

export default NotFoundPage;
