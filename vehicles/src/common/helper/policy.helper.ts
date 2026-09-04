import { Permit } from 'src/modules/permit-application-payment/permit/entities/permit.entity';
import { PermitData } from '../interface/permit.template.interface';
import { PolicyApplication } from '../interface/policy-application.interface';
import { ValidationResult, ValidationResults } from 'onroute-policy-engine';
import { IUserJWT } from '../interface/user-jwt.interface';
import { isCVClient } from './common.helper';
import { PermitType } from '../enum/permit-type.enum';
import {
  addDaysToDate,
  differenceBetween,
  getCurrentPacificDateTime,
  subtractDaysFromDate,
} from './date-time.helper';

import {
  DEFAULT_STAFF_MAX_ALLOWED_START_DATE,
  MAX_HC_ALLOWED_PAST_DAYS,
  STOS_MAX_ALLOWED_DURATION_AMEND,
  STOW_MAX_ALLOWED_DURATION_AMEND,
} from '../constants/permit.constant';

import {
  PE_FIELD_REFERENCE_PERMIT_DURATION,
  PE_FIELD_REFERENCE_START_DATE,
  PE_ID_AXLE_WEIGHT_SPACING,
  PE_MESSAGE_CALENDAR_QTR_START_DATE_VIOLATION,
} from '../constants/policy-engine.constant';

export const convertToPolicyApplication = (
  application: Permit,
): PolicyApplication => {
  return {
    permitType: application.permitType,
    permitData: JSON.parse(application.permitData.permitData) as PermitData,
  };
};

/**
 * This method evaluates the policy validation results for a given application.
 * The method filters out violations based on certain criteria and returns a boolean result.
 *
 * @param application - The permit application being evaluated.
 * @param currentUser - The current user making the evaluation, encapsulating identity provider details.
 * @param validationResults - The validation results returned by the policy engine, containing potential violations.
 * @returns A boolean indicating whether the permit's violations comply with the allowed policy criteria.
 */
export const evaluatePolicyValidationResult = (
  application: Permit,
  currentUser: IUserJWT,
  validationResults: ValidationResults,
): boolean => {
  const { permitType, permitData } = application;

  const elApprovalNumber = permitData?.elApprovalNumber;

  const isSTOS = permitType === PermitType.SINGLE_TRIP_OVERSIZE;
  const isSTOW = permitType === PermitType.SINGLE_TRIP_OVERWEIGHT;

  // CV clients: generally reject if any policy validation violations exist.
  // Special handling for STOW (single-trip overweight) permits:
  // - If there's exactly one violation and it is `PE_ID_AXLE_WEIGHT_SPACING`,
  //   allow only when an `elApprovalNumber` (EL approval number) is present;
  //   otherwise reject.
  // - All other STOW or non-STOW violations cause rejection for CV clients.
  if (isCVClient(currentUser.identity_provider)) {
    const violations = validationResults?.violations;
    if (violations?.length) {
      if (isSTOW) {
        const isAxleWeightSpacingViolationOnly =
          violations?.length === 1 &&
          violations?.at(0)?.id === PE_ID_AXLE_WEIGHT_SPACING;
        if (!isAxleWeightSpacingViolationOnly || !elApprovalNumber) {
          return false;
        }
        // If only axle-weight-spacing violation and an elApprovalNumber is present: allow
      } else {
        return false;
      }
    }
  }

  // Function to check if the permit duration is within the allowed expiration limit
  const isAllowedDuration = (expirationLimit: number) =>
    differenceBetween(permitData.startDate, permitData.expiryDate) <=
    expirationLimit;

  // Function to check if there is a duration violation
  const isDurationViolation = (violation: ValidationResult) =>
    violation?.fieldReference === PE_FIELD_REFERENCE_PERMIT_DURATION;

  // Function to check if there is a axle weight spacing violation
  const isAxleWeightSpacingViolation = (violation: ValidationResult) =>
    violation?.id === PE_ID_AXLE_WEIGHT_SPACING;

  const isStartDateViolationAllowed = (
    violation: ValidationResult,
    permitType: PermitType,
  ) => {
    // Check if the violation is not related to the start date, return false immediately
    if (violation?.fieldReference !== PE_FIELD_REFERENCE_START_DATE) {
      return false;
    }

    const isHighwayCrossing = permitType === PermitType.HIGHWAY_CROSSING;

    if (isHighwayCrossing) {
      // For Highway Crossing permit, first check to see if the past date is within allowable range,
      // since staff is restricted to max 60 days in the past (rather than the usual unlimited days)
      const startDateDiffForPast = differenceBetween(
        subtractDaysFromDate(
          getCurrentPacificDateTime(),
          MAX_HC_ALLOWED_PAST_DAYS,
        ).format('YYYY-MM-DD'),
        permitData.startDate,
      );

      if (startDateDiffForPast < 0) {
        return false;
      }
    }

    // All other non-Highway Crossing permit types are considered here:
    // Determine if the permit type is Quarterly Non-Resident
    const isQuarterlyNonResident =
      permitType === PermitType.NON_RESIDENT_QUARTERLY_LICENSE ||
      permitType === PermitType.NON_RESIDENT_QUARTERLY_ICBC_BASIC_INSURANCE_FR;

    // Calculate the difference between the permit's start date and the allowed start date by staff
    const startDateDiff = differenceBetween(
      permitData.startDate,
      addDaysToDate(
        getCurrentPacificDateTime(),
        DEFAULT_STAFF_MAX_ALLOWED_START_DATE,
      ).format('YYYY-MM-DD'),
    );

    // If Quarterly Non-Resident, check the violation message and date difference to determine allowance
    if (isQuarterlyNonResident) {
      if (
        violation?.message === PE_MESSAGE_CALENDAR_QTR_START_DATE_VIOLATION ||
        startDateDiff < 0
      ) {
        return false;
      }
    }

    // Return true if start date is within allowed range, otherwise return false
    return startDateDiff >= 0;
  };

  // Function to check if there is an STOS duration violation which can be excluded
  const isSTOSDurationViolationAllowed = (violation: ValidationResult) =>
    isSTOS &&
    isDurationViolation(violation) &&
    isAllowedDuration(STOS_MAX_ALLOWED_DURATION_AMEND);

  // Function to check if there is an STOW duration violation which can be excluded
  const isSTOWDurationViolationAllowed = (violation: ValidationResult) =>
    isSTOW &&
    isDurationViolation(violation) &&
    isAllowedDuration(STOW_MAX_ALLOWED_DURATION_AMEND);

  // Function to check if there is an STOW axle weight spacing violation which can be excluded
  const isSTOWAxleWeightSpacingViolationAllowed = (
    violation: ValidationResult,
  ) => isSTOW && isAxleWeightSpacingViolation(violation);

  // Return true only if all violations are either STOS & STOW duration or start date violations
  return !validationResults?.violations?.some(
    (violation) =>
      !(
        //Add violations that need to be skipped
        (
          isSTOSDurationViolationAllowed(violation) ||
          isSTOWDurationViolationAllowed(violation) ||
          isSTOWAxleWeightSpacingViolationAllowed(violation) ||
          isStartDateViolationAllowed(violation, permitType)
        )
      ),
  );
};
