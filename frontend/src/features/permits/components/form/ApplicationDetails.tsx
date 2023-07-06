import { Box, Typography } from "@mui/material";
import { Dayjs } from "dayjs";

import { CompanyBanner } from "../../../../common/components/banners/CompanyBanner";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { DATE_FORMATS, dayjsToLocalStr } from "../../../../common/helpers/formatDate";
import { applyWhenNotNullable } from "../../../../common/helpers/util";
import { CompanyInformation } from "./CompanyInformation";

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
