import { Box, Typography } from "@mui/material";
import { memo } from "react";

import { BC_COLOURS } from "../../../themes/bcGovStyles";
import {
  BCeIDUserAuthGroupType,
  BCeID_USER_AUTH_GROUP,
} from "../../authentication/types";

/**
 * Returns a label for the userAuthGroup.
 * @param userAuthGroup The userAuthGroup the user belongs to.
 * @returns A string representing the label of the user.
 */
const getLabelForBCeIDUserAuthGroup = (
  userAuthGroup: BCeIDUserAuthGroupType,
): string => {
  switch (userAuthGroup) {
    case BCeID_USER_AUTH_GROUP.COMPANY_ADMINISTRATOR:
      return "Administrator";
    default:
      return "Permit Applicant";
  }
};

export const UserInfoBanner = memo(
  ({ userAuthGroup }: { userAuthGroup?: BCeIDUserAuthGroupType }) => {
    return userAuthGroup ? (
      <Box
        sx={{
          height: 100,
          backgroundColor: BC_COLOURS.banner_grey,
          color: BC_COLOURS.bc_primary_blue,
          marginTop: "20px",
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography variant="h5">USER GROUP</Typography>
          <Typography variant="h4">
            {getLabelForBCeIDUserAuthGroup(userAuthGroup)}
          </Typography>
        </div>
      </Box>
    ) : null;
  },
);

UserInfoBanner.displayName = "UserInfoBanner";
