import React from "react";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import "./welcome.scss";
import { CardActionArea, CardContent, Chip, Typography } from "@mui/material";

export const WelcomePage = React.memo(() => {
  const navigate = useNavigate();
  return (
    <div className="welcome-page">
      <div className="welcome-page__main">
        <div className="welcome-page__header">
          <div className="welcome-graphic"></div>
          <h2>Welcome to onRouteBC!</h2>
        </div>
        <div className="separator-line">
          <Chip className="separator-line__label" label="Choose An Option Below" />
        </div>
        <div className="welcome-page__profile-actions">
          <Card className="welcome-cards welcome-cards--existing" elevation={12}>
            <CardActionArea>
              <div className="welcome-cards__img">
                <img
                  height="80"
                  width="80"
                  className="welcome-account-graphics"
                  src="./Existing_Account_Graphic.svg"
                  alt="Existing TPS Profile"
                />
              </div>
              <CardContent>
                <Typography variant="body2">
                  Claim an existing TPS Profile
                </Typography>
              </CardContent>
              <Chip className="welcome-cards__recommend" label="Recommend" />
            </CardActionArea>
          </Card>
          <Card className="welcome-cards welcome-cards--new" elevation={12}>
            <CardActionArea onClick={() => navigate("/create-profile")}>
              <div className="welcome-cards__img">
                <img
                  height="80"
                  width="80"
                  className="welcome-account-graphics"
                  src="./Create_New_Profile_Graphic.svg"
                  alt="New onRouteBC Profile"
                />
              </div>
              <CardContent>
                <Typography variant="body2">
                  Create a new onRouteBC Profile
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </div>
  );
});

WelcomePage.displayName = "WelcomePage";
