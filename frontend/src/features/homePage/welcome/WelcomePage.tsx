import Card from "@mui/material/Card";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { getCompanyNameFromSession } from "../../../common/apiManager/httpRequestHandler";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import "./welcome.scss";
import { CREATE_PROFILE_WIZARD_ROUTES, PROFILE_ROUTES } from "../../../routes/constants";
import { Nullable } from "../../../common/types/common";

const isInvitedUser = (companyNameFromContext?: string): boolean =>
  Boolean(companyNameFromContext);

const isNewCompanyProfile = (companyNameFromContext?: string): boolean =>
  !isInvitedUser(companyNameFromContext);

const WelcomeCompanyName = ({
  companyName,
}: {
  companyName: Nullable<string>;
}): React.ReactElement => {
  if (!companyName) return <></>;
  return (
    <>
      <div className="separator-line"></div>
      <div className="welcome-page__company-info">
        <div className="company-label">Company Name</div>
        <div className="company-name">{companyName}</div>
      </div>
    </>
  );
};

export const WelcomePage = React.memo(() => {
  const navigate = useNavigate();
  const companyNameFromToken = getCompanyNameFromSession();
  const { companyLegalName: companyNameFromContext } =
    useContext(OnRouteBCContext);

  return (
    <div className="welcome-page">
      <div className="welcome-page__main">
        <div className="welcome-page__header">
          <div className="welcome-graphic"></div>
          <h2>Welcome to onRouteBC!</h2>
        </div>
        {isInvitedUser(companyNameFromContext) ? (
          <WelcomeCompanyName companyName={companyNameFromContext} />
        ) : (
          <WelcomeCompanyName companyName={companyNameFromToken} />
        )}
        <div className="separator-line">
          {isNewCompanyProfile(companyNameFromContext) && (
            <Chip
              className="separator-line__label"
              label="Choose An Option Below"
            />
          )}
        </div>
        {isInvitedUser(companyNameFromContext) && (
          <>
            <br />
            <Card elevation={12} sx={{ maxWidth: 200 }}>
              <CardActionArea onClick={() => navigate(PROFILE_ROUTES.USER_INFO)}>
                <Stack>
                  <Stack direction="row">
                    <Grid container>
                      <Grid item xs={3}></Grid>
                      <Grid item xs={6} sx={{ paddingTop: "2rem" }}>
                        <div className="welcome-cards__img">
                          <img
                            height="80"
                            width="80"
                            className="welcome-account-graphics"
                            src="./Create_New_Profile_Graphic.svg"
                            alt="New onRouteBC Profile"
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </Stack>
                  <CardContent>
                    <Typography variant="body2">
                      Finish creating your <br /> onRouteBC Profile
                    </Typography>
                  </CardContent>
                </Stack>

                <div className="welcome-cards__img"></div>
              </CardActionArea>
            </Card>
          </>
        )}
        {isNewCompanyProfile(companyNameFromContext) && (
          <div className="welcome-page__profile-actions">
            <Card
              className="welcome-cards welcome-cards--existing"
              elevation={12}
            >
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
              <CardActionArea onClick={() => navigate(CREATE_PROFILE_WIZARD_ROUTES.CREATE)}>
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
        )}
      </div>
    </div>
  );
});

WelcomePage.displayName = "WelcomePage";
