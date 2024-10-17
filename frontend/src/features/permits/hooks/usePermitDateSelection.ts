import { useEffect } from "react";
import { Dayjs } from "dayjs";

import { getExpiryDate } from "../helpers/permitState";
import { LOADetail } from "../../settings/types/SpecialAuthorization";
import { PermitType } from "../types/PermitType";
import { getAvailableDurationOptions, handleUpdateDurationIfNeeded } from "../helpers/dateSelection";

/**
 * Hook that manages permit date selection based on changing permit data.
 * @param permitType Permit type
 * @param startDate Selected start date for the permit
 * @param durationOptions All possible duration options for the permit
 * @param selectedLOAs Selected LOAs for the permit
 * @param selectedDuration Selected duration for the permit
 * @returns Updated valid duration options
 */
export const usePermitDateSelection = (
  permitType: PermitType,
  startDate: Dayjs,
  durationOptions: {
    value: number;
    label: string;
  }[],
  selectedLOAs: LOADetail[],
  selectedDuration: number,
  onSetDuration: (duration: number) => void,
  onSetExpiryDate: (expiry: Dayjs) => void,
) => {
  // Limit permit duration options based on selected LOAs
  const availableDurationOptions = getAvailableDurationOptions(
    durationOptions,
    selectedLOAs,
    startDate,
  );

  // If duration options change, check if the current permit duration is still selectable
  const updatedDuration = handleUpdateDurationIfNeeded(
    permitType,
    selectedDuration,
    availableDurationOptions,
  );

  useEffect(() => {
    onSetDuration(updatedDuration);
  }, [
    updatedDuration,
    onSetDuration,
  ]);
  
  const expiryDate = getExpiryDate(startDate, selectedDuration);
  useEffect(() => {
    onSetExpiryDate(expiryDate);
  }, [
    expiryDate,
    onSetExpiryDate,
  ]);

  return { availableDurationOptions };
};
