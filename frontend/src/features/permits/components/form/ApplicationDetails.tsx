import { Box, Typography } from "@mui/material";
import { CompanyBanner } from "../../../../common/components/banners/CompanyBanner";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../themes/orbcStyles";
import { TermOversizeApplication } from "../../types/application";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { CompanyProfile } from "../../../manageProfile/apiManager/manageProfileAPI";
import {
  formatCountry,
  formatProvince,
} from "../../../../common/helpers/formatCountryProvince";

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

export const ApplicationDetails = ({
  values,
}: {
  values: TermOversizeApplication | undefined;
}) => {
  const companyInfoQuery = useCompanyInfoQuery();
  // TODO use an enum
  const applicationName =
    values?.applicationName === "TROS" ? "Term: Oversize" : "";

  if (!values) return <></>;

  return (
    <>
      <Typography
        variant={"h1"}
        sx={{
          marginRight: "200px",
          marginTop: "0px",
          paddingTop: "0px",
          borderBottom: "none",
        }}
      >
        {applicationName}
      </Typography>
      <Typography
        variant="h2"
        sx={{
          display: "block",
          borderBottom: "none",
          paddingBottom: "8px",
          paddingTop: "8px",
        }}
      >
        Application # {values.applicationId}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ width: "327px" }}>
          <Box component="span" fontWeight="bold">
            Date Created:
          </Box>
          {"  "}
          {values.dateCreated.format("LLL")}
        </Typography>
        <Typography>
          <Box component="span" fontWeight="bold">
            Last Updated:
          </Box>
          {"  "}
          {values.lastUpdated.format("LLL")}
        </Typography>
      </Box>
      <CompanyBanner companyInfo={companyInfoQuery.data} />
      <CompanyInformation companyInfo={companyInfoQuery.data} />
    </>
  );
};
