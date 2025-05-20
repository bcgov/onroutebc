import { Permit } from 'src/modules/permit-application-payment/permit/entities/permit.entity';
import { PermitData } from '../interface/permit.template.interface';
import { PolicyApplication } from '../interface/policy-application.interface';
import { ValidationResult, ValidationResults } from 'onroute-policy-engine';
import { IUserJWT } from '../interface/user-jwt.interface';
import { isCVClient } from './common.helper';
import { PermitType } from '../enum/permit-type.enum';
import { differenceBetween } from './date-time.helper';
import { STOS_MAX_ALLOWED_DURATION_AMEND } from '../constants/permit.constant';
import {
  PE_FIELD_REFERENCE_PERMIT_DURATION,
  PE_FIELD_REFERENCE_START_DATE,
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

  // Function to check if there is a start date violation which can be excluded
  const isStartDateViolation = (violation: ValidationResult) =>
    violation?.fieldReference === PE_FIELD_REFERENCE_START_DATE;

  // Function to check if there is an STOS duration violation which can be excluded
  const isSTOSDurationViolation = (violation: ValidationResult) =>
    isSTOS &&
    isDurationViolation(violation) &&
    isAllowedDuration(STOS_MAX_ALLOWED_DURATION_AMEND);

  // Return true only if all violations are either STOS duration or start date violations
  return !validationResults?.violations?.some(
    (violation) =>
      !(
        //Add violations that need to be skipped
        (isSTOSDurationViolation(violation) || isStartDateViolation(violation))
      ),
  );
};
