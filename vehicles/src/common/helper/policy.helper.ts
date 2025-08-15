import { Permit } from 'src/modules/permit-application-payment/permit/entities/permit.entity';
import { PermitData } from '../interface/permit.template.interface';
import { PolicyApplication } from '../interface/policy-application.interface';
import { ValidationResult, ValidationResults } from 'onroute-policy-engine';
import { IUserJWT } from '../interface/user-jwt.interface';
import { isCVClient } from './common.helper';
import { PermitType } from '../enum/permit-type.enum';
import {
  addDaysToDate,
  convertUtcToPt,
  differenceBetween,
} from './date-time.helper';
import {
  DEFAULT_STAFF_MAX_ALLOWED_START_DATE,
  STOS_MAX_ALLOWED_DURATION_AMEND,
} from '../constants/permit.constant';
import {
  PE_FIELD_REFERENCE_PERMIT_DURATION,
  PE_FIELD_REFERENCE_START_DATE,
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
  // Return false if the current user is a CV Client and there are validation violations
  if (
    isCVClient(currentUser.identity_provider) &&
    validationResults?.violations?.length
  ) {
    return false;
  }

  const { permitType, permitData } = application;

  const isSTOS = permitType === PermitType.SINGLE_TRIP_OVERSIZE;

  // Function to check if the permit duration is within the allowed expiration limit
  const isAllowedDuration = (expirationLimit) =>
    differenceBetween(permitData.startDate, permitData.expiryDate) <=
    expirationLimit;

  // Function to check if there is a duration violation
  const isDurationViolation = (violation: ValidationResult) =>
    violation?.fieldReference === PE_FIELD_REFERENCE_PERMIT_DURATION;

  const isStartDateViolationAllowed = (
    violation: ValidationResult,
    permitType: PermitType,
  ) => {
    // Check if the violation is not related to the start date, return false immediately
    if (violation?.fieldReference !== PE_FIELD_REFERENCE_START_DATE) {
      return false;
    }

    // Determine if the permit type is Quarterly Non-Resident
    const isQuarterlyNonResident =
      permitType === PermitType.NON_RESIDENT_QUARTERLY_LICENSE ||
      permitType === PermitType.NON_RESIDENT_QUARTERLY_ICBC_BASIC_INSURANCE_FR;

    // Calculate the difference between the permit's start date and the allowed start date by staff
    const startDateDiff = differenceBetween(
      permitData.startDate,
      convertUtcToPt(
        addDaysToDate(
          new Date().toISOString(),
          DEFAULT_STAFF_MAX_ALLOWED_START_DATE,
        ),
        'YYYY-MM-DD',
      ),
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

  // Return true only if all violations are either STOS duration or start date violations
  return !validationResults?.violations?.some(
    (violation) =>
      !(
        //Add violations that need to be skipped
        (
          isSTOSDurationViolationAllowed(violation) ||
          isStartDateViolationAllowed(violation, permitType)
        )
      ),
  );
};
