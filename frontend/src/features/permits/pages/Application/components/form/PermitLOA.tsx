import { useEffect, useMemo } from "react";
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
import { areArraysEqual } from "../../../../../../common/helpers/util";

export const PermitLOA = ({
  permitType,
  startDate,
  selectedLOAs,
  companyLOAs,
  onUpdateLOAs,
}: {
  permitType: PermitType;
  startDate: Dayjs;
  selectedLOAs: LOADetail[];
  companyLOAs: LOADetail[];
  onUpdateLOAs: (updatedLOAs: LOADetail[]) => void,
}) => {
  const minDuration = minDurationForPermitType(permitType);
  const minPermitExpiryDate = getExpiryDate(startDate, minDuration);

  // Only show the current active company LOAs as selectable LOAs
  const loasForTable = useMemo(() => {
    // The LOA table should only show each LOA once, but there's a chance that an existing company LOA
    // is also a selected LOA, which means that LOA should only be shown once.
    // Thus, any overlapping LOA between company LOAs and selected LOAs should only be included once in the table,
    // and all non-overlapping LOAs that are not the current active company LOAs shouldn't be included
    const currentlySelectedIds = new Set([...selectedLOAs.map(loa => loa.loaId)]);

    return companyLOAs.map(loa => {
      const wasSelected = currentlySelectedIds.has(loa.loaId);
      const isExpiringBeforeMinPermitExpiry = Boolean(loa.expiryDate)
        && minPermitExpiryDate.isAfter(getEndOfDate(dayjs(loa.expiryDate)));
      
      // Deselect and disable any LOAs expiring before min permit expiry date
      const isSelected = wasSelected && !isExpiringBeforeMinPermitExpiry;
      const isEnabled = !isExpiringBeforeMinPermitExpiry;
      
      return {
        loa,
        checked: isSelected,
        disabled: !isEnabled,
      };
    });
  }, [
    companyLOAs,
    selectedLOAs,
    minPermitExpiryDate,
  ]);

  // Since certain LOAs might have been removed from the table, we need to make sure
  // that the selected LOAs in the permit form matches the selection state of the table
  const selectedLOAsInTable = loasForTable
    .filter(selectableLOA => selectableLOA.checked)
    .map(selectableLOA => selectableLOA.loa);

  const selectedLOAIds = selectedLOAs.map(loa => loa.loaId);
  
  useEffect(() => {
    const selectedIdsInTable = selectedLOAsInTable.map(loa => loa.loaId);
    if (!areArraysEqual(selectedLOAIds, selectedIdsInTable)) {
      onUpdateLOAs([...selectedLOAsInTable]);
    }
  }, [selectedLOAIds, selectedLOAsInTable]);

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
