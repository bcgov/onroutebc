import { Box, Typography } from "@mui/material";
import { memo } from "react";

import { BC_COLOURS } from "../../../themes/bcGovStyles";
import {
  BCeIDUserAuthGroupType,
} from "../../authentication/types";
import { getLabelForBCeIDUserAuthGroup } from "../../helpers/util";


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
