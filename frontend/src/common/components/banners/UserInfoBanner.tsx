import { memo } from "react";
import { Box, Typography } from "@mui/material";

import { UserInformation } from "../../../features/manageProfile/types/manageProfile";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

export const UserInfoBanner = memo(
  ({ userInfo }: { userInfo?: UserInformation }) => {
    return userInfo ? (
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
          <Typography variant="h4">{userInfo.userAuthGroup}</Typography>
        </div>
      </Box>
    ) : null;
  },
);

UserInfoBanner.displayName = "UserInfoBanner";
