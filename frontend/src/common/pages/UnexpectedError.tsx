import { Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const UnexpectedError = ({ error }: { error: string }) => {
  const navigate = useNavigate();
  return (
    <Box height="calc(100vh - 100px)" paddingTop="24px">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid container item xs={12} justifyContent="center">
          <Typography variant="h4" align="center">
            Error:
          </Typography>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <Typography variant="h4" align="center" margin={"20px"}>
            {error}
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
    </Box>
  );
};
