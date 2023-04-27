import { Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <Container className="feature-container" sx={{ paddingTop: "24px" }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid container item xs={6} justifyContent="center">
          <Typography variant="h4" align="center">
            Unauthorized
          </Typography>
          <Typography variant="h5" align="center" margin={"20px"}>
            You do not have the necessary authorization to view this page. Click
            the button below to go back
          </Typography>

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
      </Grid>
    </Container>
  );
};
