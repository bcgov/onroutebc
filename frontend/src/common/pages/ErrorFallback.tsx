import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * React-Error-Boundary fallback component.
 * Renders when there is a React error
 * Used code from: https://github.com/bvaughn/react-error-boundary
 */
export const ErrorFallback = ({ error }: any) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

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
            {error.message}
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
