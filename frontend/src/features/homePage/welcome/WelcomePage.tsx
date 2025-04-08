import {
  CardContent,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import React, { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { getCompanyNameFromSession } from "../../../common/apiManager/httpRequestHandler";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { GreenCheckIcon } from "../../../common/components/icons/GreenCheckIcon";
import { RedXMarkIcon } from "../../../common/components/icons/RedXMarkIcon";
import { Nullable, Optional } from "../../../common/types/common";
import {
  CREATE_PROFILE_WIZARD_ROUTES,
  PROFILE_ROUTES,
} from "../../../routes/constants";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import "./welcome.scss";
import { VerifiedClient } from "../../../common/authentication/types";
import { useAuth } from "react-oidc-context";

const isInvitedUser = (companyNameFromContext?: string): boolean =>
  Boolean(companyNameFromContext);

const isUnclaimedClient = (unclaimed?: Optional<VerifiedClient>): boolean =>
  Boolean(unclaimed);

const isNewCompanyProfile = (companyNameFromContext?: string): boolean =>
  !isInvitedUser(companyNameFromContext);

const { user } = useAuth();

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
        <div className="company-label">Client Name</div>
        <div className="company-name">{companyName}</div>
      </div>
    </>
  );
};

/**
 * Reusable Card component to display a possible action for the user.
 * @returns A react component.
 */
const ProfileAction = ({
  navigateTo,
}: {
  navigateTo: string;
}): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <div className="welcome-page__profile-actions">
      <Card
        className="welcome-cards welcome-cards--new"
        sx={{
          ":hover": {
            boxShadow: 10,
          },
        }}
      >
        <CardContent onClick={() => navigate(navigateTo)}>
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
  );
};

const ChallengeOption = ({
  navigateTo,
  label,
  labelIcon,
}: {
  navigateTo: string;
  label: string;
  labelIcon: JSX.Element;
}): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <Paper
      sx={{
        ":hover": {
          background: BC_COLOURS.bc_messages_blue_background,
        },
        cursor: "pointer",
        width: "220px",
        height: "80px",
      }}
      onClick={() => navigate(navigateTo)}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          marginLeft: "5em",
          marginTop: "1.82em",
        }}
      >
        <div>{labelIcon}</div>
        <div>{label}</div>
      </Stack>
    </Paper>
  );
};

/**
 * The BCeID welcome page of the application.
 * A BCeID user reaches this page on their very first login.
 */
export const WelcomePage = React.memo(() => {
  const companyNameFromToken = getCompanyNameFromSession();

  const { companyLegalName: companyNameFromContext, unclaimedClient } =
    useContext(OnRouteBCContext);

  const getClientNameToDisplay = useCallback(() => {
    if (isInvitedUser(companyNameFromContext)) {
      return companyNameFromContext;
    } else if (companyNameFromToken) {
      companyNameFromToken;
    } else if (isUnclaimedClient(unclaimedClient)) {
      return unclaimedClient?.legalName;
    } else {
      return user?.profile?.given_name;
    }
  }, [companyNameFromContext, companyNameFromToken, unclaimedClient, user]);
  return (
    <div className="welcome-page">
      <div className="welcome-page__main">
        <div className="welcome-page__header">
          <div className="welcome-graphic"></div>
          <h2>Welcome to onRouteBC!</h2>
        </div>
        <WelcomeCompanyName companyName={getClientNameToDisplay()} />
        <div className="separator-line"></div>
        {/**
         * If the user is an invited user to a company that exists
         * redirect them to user info wizard.
         */}
        {isInvitedUser(companyNameFromContext) && (
          <ProfileAction navigateTo={PROFILE_ROUTES.USER_INFO} />
        )}
        {/**
         * companyNameFromContext will be undefined if there is
         * no associated company. It is a clear indication that we need to create
         * a new company.
         *
         * But to distinguish further between challenge and no challenge
         * workflows, we need to check if migratedClient has values.
         * If yes, it is an already verified legacyClient.
         * If not, the user gets the option to
         * 1) create new company 2) verify using permit and client numbers
         *
         */}
        {/**
         * No challenge Workflow
         *
         * If there is a matching unclaimedClient for the user, we
         * redirect them to the company profile info wizard
         * and prepopulate the form with the unclaimedClient data.
         *
         * This covers the scenario where the user is a new BCeID user and
         * - Unclaimed company was created by staff and user was invited.
         * - Unclaimed company was migrated from TPS WEB which had users.
         * - Unclaimed company was migrated from TPS and business guid matches the migrated company guid.
         */}
        {!companyNameFromContext &&
          unclaimedClient?.clientNumber &&
          isNewCompanyProfile(companyNameFromContext) && (
            <ProfileAction navigateTo={CREATE_PROFILE_WIZARD_ROUTES.CREATE} />
          )}
        {/**
         * Challenge Workflow
         * These options are presented if we do not know anything about the user.
         * i.e., this is a net new BCeID user with no company in the system.
         */}
        {!companyNameFromContext && !unclaimedClient && (
          <Stack spacing={2} sx={{ justifyContent: "center" }}>
            <div style={{ alignSelf: "center" }}>
              Has this company purchased a commercial vehicle
            </div>
            <div style={{ alignSelf: "center", marginTop: "0px" }}>
              permit in the last 2 years?
            </div>
            <Container>
              <Stack direction="row" spacing={3}>
                <ChallengeOption
                  navigateTo={CREATE_PROFILE_WIZARD_ROUTES.CREATE}
                  label="No"
                  labelIcon={<RedXMarkIcon size="xl" />}
                />
                <ChallengeOption
                  navigateTo={CREATE_PROFILE_WIZARD_ROUTES.MIGRATED_CLIENT}
                  label="Yes"
                  labelIcon={<GreenCheckIcon size="xl" />}
                />
              </Stack>
            </Container>
          </Stack>
        )}
      </div>
    </div>
  );
});

WelcomePage.displayName = "WelcomePage";
