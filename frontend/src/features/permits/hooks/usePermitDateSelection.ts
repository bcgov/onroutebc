import { useEffect, useMemo } from "react";
import { Dayjs } from "dayjs";

import { getExpiryDate } from "../helpers/permitState";
import { isQuarterlyPermit, PermitType } from "../types/PermitType";
import { PermitLOA } from "../types/PermitLOA";
import { useMemoizedArray } from "../../../common/hooks/useMemoizedArray";
import { Nullable } from "../../../common/types/common";
import { now } from "../../../common/helpers/formatDate";
import {
  MAX_ALLOWED_FUTURE_DAYS_CV,
  MAX_ALLOWED_FUTURE_DAYS_STAFF,
} from "../constants/constants";

import {
  getAvailableDurationOptions,
  getMaxAllowedPermitFutureStartDate,
  getMinAllowedPermitPastStartDate,
  handleUpdateDurationIfNeeded,
} from "../helpers/dateSelection";

/**
 * Hook that manages permit date selection based on changing permit data.
 * @param permitType Permit type
 * @param isAmend Whether or not the permit is being amended
 * @param isStaff Whether or not the user working with the permit is staff
 * @param startDate Selected start date for the permit
 * @param oldPermitStartDate Old permit start date for an issued permit (applicable for amendments)
 * @param durationOptions All possible duration options for the permit
 * @param selectedLOAs Selected LOAs for the permit
 * @param selectedDuration Selected duration for the permit
 * @param onSetDuration Callback method triggered when duration is set
 * @param onSetExpiryDate Callback method triggered when expiry date is set
 * @returns Updated valid duration options
 */
export const usePermitDateSelection = ({
  permitType,
  isAmend,
  isStaff,
  startDate,
  oldPermitStartDate,
  durationOptions,
  selectedLOAs,
  selectedDuration,
  onSetDuration,
  onSetExpiryDate,
}: {
  permitType: PermitType;
  isAmend: boolean;
  isStaff: boolean;
  startDate: Dayjs;
  oldPermitStartDate?: Nullable<Dayjs>;
  durationOptions: {
    value: number;
    label: string;
  }[];
  selectedLOAs: PermitLOA[];
  selectedDuration: number;
  onSetDuration: (duration: number) => void;
  onSetExpiryDate: (expiry: Dayjs) => void;
}) => {
  // Limit permit duration options based on selected LOAs
  const availableDurationOptions = useMemoizedArray(
    getAvailableDurationOptions(
      durationOptions,
      selectedLOAs,
      startDate,
    ),
    (option) => option.value,
    (option1, option2) => option1.value === option2.value,
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
  ]);
  
  useEffect(() => {
    const expiryDate = getExpiryDate(
      startDate,
      isQuarterlyPermit(permitType),
      selectedDuration,
    );

    onSetExpiryDate(expiryDate);
  }, [
    startDate,
    selectedDuration,
    permitType,
  ]);

  const {
    minAllowedPastStartDate,
    maxAllowedFutureStartDate,
  } = useMemo(() => {
    const currentDate = now();

    return {
      minAllowedPastStartDate: getMinAllowedPermitPastStartDate(
        permitType,
        // if old permit start date doesn't exist (eg. new applications)
        // default the old permit start date to be current date
        oldPermitStartDate ? oldPermitStartDate : currentDate,
        currentDate,
        isStaff,
        isAmend,
      ),
      maxAllowedFutureStartDate: getMaxAllowedPermitFutureStartDate(
        currentDate,
        isStaff,
      ),
    };
  }, [
    permitType,
    oldPermitStartDate,
    isStaff,
    isAmend,
  ]);

  return {
    availableDurationOptions,
    minAllowedPastStartDate,
    maxAllowedFutureStartDate,
    maxNumDaysAllowedInFuture: isStaff
      ? MAX_ALLOWED_FUTURE_DAYS_STAFF
      : MAX_ALLOWED_FUTURE_DAYS_CV,
  };
};
