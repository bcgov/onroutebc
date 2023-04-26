import { Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container className="feature-container" sx={{ paddingTop: "24px" }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid container item xs={12} justifyContent="center">
          <Typography variant="h4" align="center" marginBottom={"24px"}>
            404 Page Not Found
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/");
            }}
          >
            Go to home page
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
