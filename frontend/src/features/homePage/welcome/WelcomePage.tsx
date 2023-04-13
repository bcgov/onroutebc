import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import "./welcome.scss";
import { CardActionArea, CardContent, Typography } from "@mui/material";

export const WelcomePage = React.memo(() => {
  const navigate = useNavigate();
  return (
    <div>
      <Grid container spacing={3} sx={{ flexGrow: 1 }} alignItems="center">
        <Grid xs={4} item={false}></Grid>
        <Grid xs={6} justifyContent="center" item={true}>
          <br></br>
          <div className="welcome-graphic"></div>
          <h2>Welcome to onRouteBC!</h2>
          <Grid container>
            <Grid xs={4} justifyContent="center" item={true}>
              <Card className="welcome-cards" elevation={12}>
                <CardActionArea>
                  <Grid container>
                    <Grid xs={4}></Grid>
                    <Grid xs={1}>
                      <img
                        height="80"
                        width="80"
                        className="welcome-account-graphics"
                        src="./Existing_Account_Graphic.svg"
                      ></img>
                    </Grid>
                    <Grid xs={3}></Grid>
                  </Grid>
                  <CardContent>
                    <Typography variant="body2">
                      Claim an existing TPS Profile
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid xs={4} justifyContent="center" item={true}>
              <Card className="welcome-cards" elevation={12}>
                <CardActionArea onClick={() => navigate("/create-profile")}>
                  <Grid container>
                    <Grid xs={4}></Grid>
                    <Grid xs={1}>
                      <img
                        height="80"
                        width="80"
                        className="welcome-account-graphics"
                        src="./Create_New_Profile_Graphic.svg"
                      ></img>
                    </Grid>
                    <Grid xs={3}></Grid>
                  </Grid>
                  <CardContent>
                    <Typography variant="body2">
                      Create a new onRouteBC Profile
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br></br>
    </div>
  );
});

WelcomePage.displayName = "WelcomePage";
