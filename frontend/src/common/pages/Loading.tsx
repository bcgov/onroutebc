import { Grid, Typography } from "@mui/material";

export const Loading = () => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      padding={"2em 2em 1em 2em"}
      height="calc(100vh - 100px)"
    >
      <Typography variant="h4" align="center">
        ... Loading
      </Typography>
    </Grid>
  );
};
