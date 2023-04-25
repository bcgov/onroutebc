import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 100px)"
    >
      <Grid container item xs={2} justifyContent="center">
        <Typography variant="h4" align="center" marginBottom={"24px"}>
          404 Page Not Found
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
  );
};
