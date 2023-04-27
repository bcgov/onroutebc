import { Container, Grid, Typography } from "@mui/material";

export const Loading = () => {
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
            ... Loading
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
