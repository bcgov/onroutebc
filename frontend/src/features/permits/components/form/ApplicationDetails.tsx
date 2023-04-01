import { Box, Typography } from "@mui/material";
import { CompanyBanner } from "../../../../common/components/banners/CompanyBanner";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../themes/orbcStyles";

const CompanyInformation = () => {
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Company Information
        </Typography>
        <Typography sx={{ width: "320px" }}>
          If the Company Mailing Address is incorrect, please contact your
          onRouteBC Administrator.
        </Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Typography variant={"h3"}>Company Mailing Address</Typography>
        <Box>
          <Typography>???</Typography>
          <Typography>???</Typography>
          <Typography>???</Typography>
          <Typography>???</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const ApplicationDetails = () => {
  return (
    <>
      <Typography>Application #</Typography>
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ width: "327px" }}>Date Created: </Typography>
        <Typography>Last Updated: </Typography>
      </Box>
      <CompanyBanner />
      <CompanyInformation />
    </>
  );
};
