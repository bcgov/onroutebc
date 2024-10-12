import { useEffect, useMemo } from "react";
import { Dayjs } from "dayjs";
import { Box, Typography } from "@mui/material";

import "./PermitLOA.scss";
import { InfoBcGovBanner } from "../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../common/constants/bannerMessages";
import { LOADetail } from "../../../../../settings/types/SpecialAuthorization";
import { LOATable } from "./LOATable";
import { PermitType } from "../../../../types/PermitType";
import { getMinPermitExpiryDate } from "../../../../helpers/dateSelection";
import { areArraysEqual } from "../../../../../../common/helpers/util";
import { getUpdatedLOASelection } from "../../../../helpers/permitLOA";

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
  const minPermitExpiryDate = getMinPermitExpiryDate(permitType, startDate);

  // Only show the current active company LOAs as selectable LOAs
  const loasForTable = useMemo(() => getUpdatedLOASelection(
    companyLOAs,
    selectedLOAs,
    minPermitExpiryDate,
  ), [
    companyLOAs,
    selectedLOAs,
    minPermitExpiryDate,
  ]);

  // Since certain LOAs might have been removed from the table, we need to make sure
  // that the selected LOAs in the permit form matches the selection state of the table
  const selectedLOAsInTable = loasForTable
    .filter(selectableLOA => selectableLOA.checked)
    .map(selectableLOA => selectableLOA.loa);

  const selectedLOANumbers = selectedLOAs.map(loa => loa.loaNumber);
  
  useEffect(() => {
    const selectedNumbersInTable = selectedLOAsInTable.map(loa => loa.loaNumber);
    if (!areArraysEqual(selectedLOANumbers, selectedNumbersInTable)) {
      onUpdateLOAs([...selectedLOAsInTable]);
    }
  }, [selectedLOANumbers, selectedLOAsInTable]);

  const handleSelectLOA = (loaNumber: number) => {
    const loa = loasForTable.find(loaRow => loaRow.loa.loaNumber === loaNumber);
    if (!loa || loa?.disabled) return;

    const isLOASelected = Boolean(loa?.checked);
    if (isLOASelected) {
      // Deselect the LOA
      onUpdateLOAs(
        selectedLOAs.filter(selectedLOA => selectedLOA.loaNumber !== loaNumber),
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
