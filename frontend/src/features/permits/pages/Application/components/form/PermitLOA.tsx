import { Box, Typography } from "@mui/material";

import "./PermitLOA.scss";
import { InfoBcGovBanner } from "../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../common/constants/bannerMessages";
import { LOADetail } from "../../../../../settings/types/SpecialAuthorization";
import { LOATable } from "./LOATable";

export const PermitLOA = ({
  selectableLOAs,
}: {
  selectableLOAs: LOADetail[];
}) => {
  return (
    <Box className="permit-loa">
      <Box className="permit-loa__header">
        <Typography variant={"h3"}>
          Letter of Authorization (LOA)
        </Typography>
      </Box>

      <Box className="permit-details__body">
        <div className="loa-title">
          <span className="loa-title__title">Select the relevant LOA(s)</span>
          <span className="loa-title__title--optional">(optional)</span>
        </div>

        <InfoBcGovBanner
          className="loa-info"
          msg={BANNER_MESSAGES.FIND_LOA_DETAILS}
          additionalInfo={
            <div className="loa-info__message">
              {BANNER_MESSAGES.LOA_VEHICLE_CANNOT_BE_EDITED_IN_PERMIT}
            </div>
          }
        />

        <LOATable
          selectableLOAs={selectableLOAs}
        />
      </Box>
    </Box>
  );
};
