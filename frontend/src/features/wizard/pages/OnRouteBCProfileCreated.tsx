import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

import "./OnRouteBCProfileCreated.scss";

export const OnRouteBCProfileCreated = memo(
  ({ onRouteBCClientNumber }: { onRouteBCClientNumber: string }) => {
    const navigate = useNavigate();
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >
        <Box>
            <br></br>
            <br></br>
          <Grid container>
            <Grid xs={4} item></Grid>
            <Grid xs={4} item>
              <Grid container>
                <Grid xs={3} item></Grid>
                <Grid xs={9} item>
                  <img
                    height="168"
                    width="178"
                    src="./Success_Graphic.png"
                  ></img>
                </Grid>
              </Grid>
              <Grid container>
                <Grid xs={2} item></Grid>
                <Grid>
                  <Typography variant="h3">
                    Profile Successfully set up!
                  </Typography>
                </Grid>
              </Grid>
              <br></br>
              <Grid container>
                <div className="horizontal-line"></div>
                <Grid>
                  <Typography variant="h4" className="padding-40px">
                    {`Your onRouteBC Client Number is ${onRouteBCClientNumber}`}
                  </Typography>
                </Grid>

                <div className="horizontal-line"></div>
              </Grid>
              <Grid container>
                <Grid>
                  <Typography variant="body1" className="padding-40px">
                    You can view the company and user information under the
                    Profile section. We have also sent you a confirmation email
                    with your registration details.
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid xs={3} item></Grid>
                <Grid>
                  <Button variant="contained" color="primary">
                    Apply for a permit
                  </Button>
                </Grid>
              </Grid>
              <Grid container className="padding-40px">
                <Grid xs={3.34} item></Grid>
                <Grid>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/manage-profiles")}
                  >
                    View Profile
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
);

OnRouteBCProfileCreated.displayName = "OnRouteBCProfileCreated";
