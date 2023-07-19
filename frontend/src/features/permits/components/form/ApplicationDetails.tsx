import { Box, Typography } from "@mui/material";
import { Dayjs } from "dayjs";

import { CompanyBanner } from "../../../../common/components/banners/CompanyBanner";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { DATE_FORMATS, dayjsToLocalStr } from "../../../../common/helpers/formatDate";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../common/helpers/util";
import { CompanyInformation } from "./CompanyInformation";
import "./ApplicationDetails.scss";
import { permitTypeDisplayText } from "../../helpers/mappers";
import { PermitType } from "../../types/application";

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
  const applicationName = permitTypeDisplayText(
    getDefaultRequiredVal("", permitType) as PermitType
  );

  return (
    <>
      <div className="application-details">
        <Typography
          className="application-details__title"
          variant={"h1"}
          data-testid="application-title"
        >
          {applicationName}
        </Typography>
        {(applicationNumber && applicationNumber !== "") ? (
          <Box>
            <Typography
              className="application-number"
              variant="h2"
            >
              <Box 
                className="application-number__label" 
                component="span"
              >
                Application #:
              </Box>
              <Box
                className="application-number__number"
                component="span"
                data-testid="application-number"
              >
                {applicationNumber}
              </Box>
            </Typography>
            <Box className="application-details__audit-dates">
              <Typography className="audit-date audit-date--created">
                <Box 
                  className="audit-date__label"
                  component="span"
                >
                  Date Created:
                </Box>
                <Box 
                  className="audit-date__date" 
                  component="span"
                  data-testid="application-created-date"
                >
                  {applyWhenNotNullable(
                    (dayjsObj) => dayjsToLocalStr(dayjsObj, DATE_FORMATS.LONG),
                    createdDateTime,
                    ""
                  )}
                </Box>
              </Typography>
              <Typography className="audit-date audit-date--updated">
                <Box 
                  className="audit-date__label"
                  component="span"
                >
                  Last Updated:
                </Box>
                <Box 
                  className="audit-date__date" 
                  component="span"
                  data-testid="application-updated-date"
                >
                  {applyWhenNotNullable(
                    (dayjsObj) => dayjsToLocalStr(dayjsObj, DATE_FORMATS.LONG),
                    updatedDateTime,
                    ""
                  )}
                </Box>
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box></Box>
        )}
      </div>
      <CompanyBanner companyInfo={companyInfoQuery.data} />
      <CompanyInformation companyInfo={companyInfoQuery.data} />
    </>
  );
};
