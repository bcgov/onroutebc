import { Box, Typography } from "@mui/material";
import { memo } from "react";

import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { BCeIDUserRoleType } from "../../authentication/types";
import { getLabelForBCeIDUserRole } from "../../helpers/util";

export const UserInfoBanner = memo(
  ({ userRole }: { userRole?: BCeIDUserRoleType }) => {
    return userRole ? (
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
            {getLabelForBCeIDUserRole(userRole)}
          </Typography>
        </div>
      </Box>
    ) : null;
  },
);

UserInfoBanner.displayName = "UserInfoBanner";
