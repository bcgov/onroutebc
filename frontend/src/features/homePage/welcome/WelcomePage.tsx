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
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { CREATE_PROFILE_WIZARD_ROUTES, PROFILE_ROUTES } from "../../../routes/constants";

const isInvitedUser = (companyNameFromContext?: string): boolean =>
  Boolean(companyNameFromContext);

const isNewCompanyProfile = (companyNameFromContext?: string): boolean =>
  !isInvitedUser(companyNameFromContext);

const WelcomeCompanyName = ({
  companyName,
}: {
  companyName?: string;
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
        <div className="separator-line"></div>
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
              className="welcome-cards welcome-cards--new"
              sx={{
                ":hover": {
                  // background: BC_COLOURS.bc_messages_blue_background,
                  boxShadow: 10,
                  // border: `1px solid ${BC_COLOURS.bc_black}`,
                  // background: BC_COLOURS.bc_background_light_grey,
                },
              }}
            >
              <CardContent onClick={() => navigate(CREATE_PROFILE_WIZARD_ROUTES.CREATE)}>
                <Stack spacing={3}>
                  <div className="welcome-cards__img">
                    <img
                      height="80"
                      width="80"
                      className="welcome-account-graphics"
                      src="./Create_New_Profile_Graphic.svg"
                      alt="New onRouteBC Profile"
                    />
                  </div>

                  <Typography variant="body2">
                    Finish creating your onRouteBC Profile
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
});

WelcomePage.displayName = "WelcomePage";
