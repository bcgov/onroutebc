import { Grid, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { HOME } from "../../routes/constants";

/**
 * React-Error-Boundary fallback component.
 * Renders when there is a React error
 * Used code from: https://github.com/bvaughn/react-error-boundary
 */
export const ErrorFallback = ({ error }: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.
    console.log("ErrorFallback: ", error.message || error);
  }, []);

  return (
    <Container className="feature-container" sx={{ paddingTop: "24px" }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid container item xs={12} justifyContent="center">
          <Typography variant="h4" align="center">
            Unexpected Error
          </Typography>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <Typography variant="h5" align="center" margin={"20px"}>
            Please call XXX-XXXX
          </Typography>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              navigate(HOME);
            }}
          >
            Go to home page
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
