import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, Typography } from "@mui/material";

import "./PermitLOA.scss";
import { InfoBcGovBanner } from "../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../common/constants/bannerMessages";
import { LOADetail } from "../../../../../settings/types/SpecialAuthorization";
import { LOATable } from "./LOATable";
import { PermitType } from "../../../../types/PermitType";
import { minDurationForPermitType } from "../../../../helpers/dateSelection";
import { getExpiryDate } from "../../../../helpers/permitState";
import { getEndOfDate } from "../../../../../../common/helpers/formatDate";

export const PermitLOA = ({
  permitType,
  startDate,
  selectedLOAs,
  companyLOAs,
  isPermitIssued,
  onUpdateLOAs,
}: {
  permitType: PermitType;
  startDate: Dayjs;
  selectedLOAs: LOADetail[];
  companyLOAs: LOADetail[];
  isPermitIssued: boolean;
  onUpdateLOAs: (updatedLOAs: LOADetail[]) => void,
}) => {
  const minDuration = minDurationForPermitType(permitType);
  const minPermitExpiryDate = getExpiryDate(startDate, minDuration);

  const [originalSelectedLOAs, setOriginalSelectedLOAs] = useState<LOADetail[]>([]);

  useEffect(() => {
    // Only set the original selected LOAs once when component first renders
    // This is because the "selectedLOAs" are constantly changing when user selects/deselects LOAs,
    // but we want all the LOAs to be available for selection in the table based on the original selection
    // Otherwise, once previously-selected LOAs are deselected, they'll disappear from the table
    setOriginalSelectedLOAs(selectedLOAs);
  }, []);

  // For applications, only show the current active LOAs as selectable LOAs
  // For issued permits (amendments), combine the current active LOAs and snapshotted LOAs as selectable LOAs
  const loasForTable = useMemo(() => {
    return companyLOAs.map(loa => ({
      loa,
      checked: selectedLOAs.map(selectedLOA => selectedLOA.loaId).includes(loa.loaId),
      disabled: Boolean(loa.expiryDate) && minPermitExpiryDate.isAfter(getEndOfDate(dayjs(loa.expiryDate))),
    })).concat(!isPermitIssued ? [] : originalSelectedLOAs.map(originalSelectedLOA => ({
      loa: originalSelectedLOA,
      checked: selectedLOAs.map(selectedLOA => selectedLOA.loaId).includes(originalSelectedLOA.loaId),
      disabled: false,
    })));
  }, [originalSelectedLOAs, companyLOAs, selectedLOAs, isPermitIssued]);

  const handleSelectLOA = (loaId: string) => {
    const loa = loasForTable.find(loaRow => loaRow.loa.loaId === loaId);
    if (!loa || loa?.disabled) return;

    const isLOASelected = Boolean(loa?.checked);
    if (isLOASelected) {
      // Deselect the LOA
      onUpdateLOAs(
        selectedLOAs.filter(selectedLOA => selectedLOA.loaId !== loaId),
      );
    } else {
      // Select the LOA
      const { loa: loaToSelect } = loa;
      onUpdateLOAs([...selectedLOAs, loaToSelect]);
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
