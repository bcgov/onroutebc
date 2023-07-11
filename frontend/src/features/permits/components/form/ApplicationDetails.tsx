import { Box, Typography } from "@mui/material";
import { Dayjs } from "dayjs";

import { CompanyBanner } from "../../../../common/components/banners/CompanyBanner";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../themes/orbcStyles";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import {
  formatCountry,
  formatProvince,
} from "../../../../common/helpers/formatCountryProvince";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { DATE_FORMATS, dayjsToLocalStr } from "../../../../common/helpers/formatDate";
import { applyWhenNotNullable } from "../../../../common/helpers/util";

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
          <Typography>{companyInfo?.mailingAddress.addressLine1}</Typography>
          <Typography>
            {formatCountry(companyInfo?.mailingAddress.countryCode)}
          </Typography>
          <Typography>
            {formatProvince(
              companyInfo?.mailingAddress.countryCode,
              companyInfo?.mailingAddress.provinceCode
            )}
          </Typography>
          <Typography>
            {companyInfo?.mailingAddress.city}{" "}
            {companyInfo?.mailingAddress.postalCode}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const ApplicationDetails = ({
  permitType,
  applicationNumber,
  createdDateTime,
  updatedDateTime,
}: {
  permitType?: string,
  applicationNumber?: string,
  createdDateTime?: Dayjs,
  updatedDateTime?: Dayjs,
}) => {
  const companyInfoQuery = useCompanyInfoQuery();
  // TODO use an enum
  const applicationName = permitType === "TROS" ? "Oversize: Term" : "";

  return (
    <>
      <div>
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
        {(applicationNumber && applicationNumber !== "") ? (
          <>
            <Typography
              variant="h2"
              sx={{
                display: "block",
                borderBottom: "none",
                paddingBottom: "8px",
                paddingTop: "8px",
              }}
            >
              Application #: {applicationNumber}
            </Typography>
            <Box sx={{ display: "flex" , gap: "40px"}}>
              <Typography sx={{ width: "327px"}}>
                <Box component="span" fontWeight="bold">
                  Date Created:
                </Box>
                {"  "}
                {applyWhenNotNullable(
                  (dayjsObj) => dayjsToLocalStr(dayjsObj, DATE_FORMATS.LONG),
                  createdDateTime,
                  ""
                )}
              </Typography>
              <Typography>
                <Box component="span" fontWeight="bold">
                  Last Updated:
                </Box>
                {"  "}
                {applyWhenNotNullable(
                  (dayjsObj) => dayjsToLocalStr(dayjsObj, DATE_FORMATS.LONG),
                  updatedDateTime,
                  ""
                )}
              </Typography>
            </Box>
          </>
        ) : (
          <></>
        )}
      </div>
      <CompanyBanner companyInfo={companyInfoQuery.data} />
      <CompanyInformation companyInfo={companyInfoQuery.data} />
    </>
  );
};
