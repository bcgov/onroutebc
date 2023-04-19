import { Box, Typography } from "@mui/material";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { CompanyProfile } from "../../../features/manageProfile/types/manageProfile";

export const CompanyBanner = ({
  companyInfo,
}: {
  companyInfo?: CompanyProfile;
}) => {
  return (
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
        <Typography variant="h5">COMPANY NAME</Typography>
        <Typography variant="h4">{companyInfo?.legalName}</Typography>
      </div>
      <div>
        <Typography variant="h5">onRouteBC CLIENT NUMBER</Typography>
        <Typography variant="h4">{companyInfo?.clientNumber}</Typography>
      </div>
    </Box>
  );
};
