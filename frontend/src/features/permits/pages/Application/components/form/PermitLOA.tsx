import dayjs, { Dayjs } from "dayjs";
import { Box, Typography } from "@mui/material";

import "./PermitLOA.scss";
import { InfoBcGovBanner } from "../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../common/constants/bannerMessages";
import { LOADetail } from "../../../../../settings/types/SpecialAuthorization";
import { LOATable } from "./LOATable";
import { PermitType } from "../../../../types/PermitType";
import { minDurationForPermitType } from "../../../../helpers/dateSelection";

export const PermitLOA = ({
  permitType,
  startDate,
  loaSnapshots,
  companyLOAs,
  isPermitIssued,
  onUpdateLOAs,
}: {
  permitType: PermitType;
  startDate: Dayjs;
  loaSnapshots: LOADetail[];
  companyLOAs: LOADetail[];
  isPermitIssued: boolean;
  onUpdateLOAs: (updatedLOAs: LOADetail[]) => void,
}) => {
  const minDuration = minDurationForPermitType(permitType);
  const minPermitExpiryDate = dayjs(startDate).add(minDuration, "day");
  const loasForTable = companyLOAs.map(loa => ({
    ...loa,
    checked: loaSnapshots.map(selectedLOA => selectedLOA.loaId).includes(loa.loaId),
    disabled: Boolean(loa.expiryDate) && minPermitExpiryDate.isAfter(loa.expiryDate),
  }));

  const handleSelectLOA = (loaId: string) => {
    const loa = loasForTable.find(loaRow => loaRow.loaId === loaId);
    if (!loa || loa?.disabled) return;

    const isLOASelected = Boolean(loa?.checked);
    if (isLOASelected) {
      // Deselect the LOA
      onUpdateLOAs(
        loaSnapshots.filter(selectedLOA => selectedLOA.loaId !== loaId),
      );
    } else {
      // Select the LOA
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { checked, disabled, ...loaToSelect } = loa;
      onUpdateLOAs([...loaSnapshots, loaToSelect]);
    }
  };

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
          loas={loasForTable}
          onSelectLOA={handleSelectLOA}
        />
      </Box>
    </Box>
  );
};
