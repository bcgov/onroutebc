import { Box, Typography } from "@mui/material";

import "./ApplicationSummary.scss";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { PermitType, permitTypeDisplayText } from "../../../../types/PermitType";

export const ApplicationSummary = ({
  permitType,
  applicationNumber,
}: {
  permitType?: PermitType;
  applicationNumber?: string;
}) => {
  const applicationName = permitTypeDisplayText(
    getDefaultRequiredVal("", permitType)
  );

  const applicationNumberExists = () =>
    applicationNumber && applicationNumber !== "";

  return (
    <Box className="application-summary">
      <Typography
        variant={"h1"}
      >
        {applicationName}
      </Typography>
      {applicationNumberExists() ? (
        <Typography
          variant="h2"
        >
          Application # {applicationNumber}
        </Typography>
      ) : (
        <></>
      )}
    </Box>
  );
};
