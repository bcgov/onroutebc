import { Box, Typography } from "@mui/material";
import { CompanyBanner } from "../../../../common/components/banners/CompanyBanner";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../themes/orbcStyles";
import { Permit } from "../../types/permits";
import { useFormContext } from "react-hook-form";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { CompanyProfile } from "../../../manageProfile/apiManager/manageProfileAPI";
import {
  formatCountry,
  formatProvince,
} from "../../../../common/helpers.ts/formatCountryProvince";

const CompanyInformation = ({
  companyInfo,
}: {
  companyInfo?: CompanyProfile;
}) => {
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
          <Typography>{companyInfo?.companyAddress.addressLine1}</Typography>
          <Typography>
            {formatCountry(companyInfo?.companyAddress.countryCode)}
          </Typography>
          <Typography>
            {formatProvince(
              companyInfo?.companyAddress.countryCode,
              companyInfo?.companyAddress.provinceCode
            )}
          </Typography>
          <Typography>
            {companyInfo?.companyAddress.city}{" "}
            {companyInfo?.companyAddress.postalCode}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const ApplicationDetails = () => {
  const companyInfoQuery = useCompanyInfoQuery();
  const { getValues } = useFormContext<Permit>();
  const applicationValues = getValues();

  return (
    <>
      <Typography>Application #{applicationValues?.applicationId}</Typography>
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ width: "327px" }}>
          Date Created: {applicationValues?.dateCreated.format("LL")}
        </Typography>
        <Typography>
          Last Updated: {applicationValues?.lastUpdated.format("LL")}
        </Typography>
      </Box>
      <CompanyBanner companyInfo={companyInfoQuery.data} />
      <CompanyInformation companyInfo={companyInfoQuery.data} />
    </>
  );
};
