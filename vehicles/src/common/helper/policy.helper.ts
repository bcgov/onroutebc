import { Permit } from 'src/modules/permit-application-payment/permit/entities/permit.entity';
import { PermitData } from '../interface/permit.template.interface';
import { PolicyApplication } from '../interface/policy-application.interface';
import { ValidationResult, ValidationResults } from 'onroute-policy-engine';
import { IUserJWT } from '../interface/user-jwt.interface';
import { isCVClient } from './common.helper';
import { PermitType } from '../enum/permit-type.enum';
import { differenceBetween } from './date-time.helper';
import {
  QUARTERLY_PERMIT_TYPES,
  STOS_MAX_ALLOWED_DURATION_AMEND,
} from '../constants/permit.constant';
import {
  PE_FIELD_REFERENCE_PERMIT_DURATION,
  PE_FIELD_REFERENCE_START_DATE,
} from '../constants/policy-engine.constant';
import { QueryRunner } from 'typeorm';
import { format, getQuarter, getYear } from 'date-fns';
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
export const evaluatePolicyValidationResult = async (
  application: Permit,
  currentUser: IUserJWT,
  validationResults: ValidationResults,
  queryRunner: QueryRunner,
): Promise<boolean> => {
  // Return false if the current user is a CV Client and there are validation violations
  if (
    isCVClient(currentUser.identity_provider) &&
    validationResults?.violations?.length
  ) {
    return false;
  }

  const { permitType, permitData } = application;

  const isSTOS = permitType === PermitType.SINGLE_TRIP_OVERSIZE;
  const isQuarterlyPermitType = (permitType: PermitType): boolean => {
    return QUARTERLY_PERMIT_TYPES.includes(permitType);
  };
  // Function to check if there is a duration violation
  const isDurationViolation = (violation: ValidationResult) =>
    violation?.fieldReference === PE_FIELD_REFERENCE_PERMIT_DURATION;
  // Function to check if there is a start date violation
  const isStartDateViolation = (violation: ValidationResult) =>
    violation?.fieldReference === PE_FIELD_REFERENCE_START_DATE;

  // Function to check if the permit duration is within the allowed expiration limit
  // differenceBetween(date1, date2) returns (date2 - date1) in days
  // Positive result means date2 is after date1
  const isAllowedDuration = (expirationLimit) =>
    differenceBetween(permitData.startDate, permitData.expiryDate) <=
    expirationLimit;

  // Function to check if there is a start date violation for permit which can be excluded
  const canSkipStartDateViolation = async (): Promise<boolean> => {
    let previousApplication: Permit | null = null;

    //If application is an amendment then get old permit
    if (application.revision > 0) {
      previousApplication = await queryRunner.manager.findOne(Permit, {
        where: { permitId: application.previousRevision },
        relations: { permitData: true },
      });
      //Return false if start date of old permit is not found
      if (!previousApplication?.permitData?.startDate) {
        return false;
      }
    }
    const previousApplicationStartDate =
      previousApplication?.permitData?.startDate;
    const newApplicationStartDate = application.permitData.startDate;
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    // differenceBetween(date1, date2) returns (date2 - date1) in days
    // Positive result means date2 is after date1
    // All new application with start date lesser than the current date (i.e. back date applications) are allowed
    // All permit type(except quarterly permits) amendments can be back dated to any date
    // Quarterly permits amendments can only be backdated to remain in the same quarter as of the previous permit.
    if (
      differenceBetween(newApplicationStartDate, previousApplicationStartDate) >
      0
    ) {
      //Amendment for quarterly permits can only be back dated to start within the same quarter
      if (isQuarterlyPermitType(permitType) && application.revision > 0) {
        const oldDate = new Date(previousApplicationStartDate);
        const newDate = new Date(newApplicationStartDate);
        return (
          getQuarter(oldDate) === getQuarter(newDate) &&
          getYear(oldDate) === getYear(newDate)
        );
      }
      //All other type of permits can be backdated to any date in past
      return true;
    } else {
      // If the application is either an amendment or a new permit with a future start date,
      // then the start date must be within the next 60 days from the current date, including the current date.
      return differenceBetween(currentDate, newApplicationStartDate) < 60;
    }
  };

  // Function to check if there is an STOS duration violation which can be excluded
  const isSTOSDurationViolation = (violation: ValidationResult) =>
    isSTOS &&
    isDurationViolation(violation) &&
    isAllowedDuration(STOS_MAX_ALLOWED_DURATION_AMEND);

  // Return true only if all violations are either STOS duration or start date violations
  const violations = validationResults?.violations ?? [];
  for (const violation of violations) {
    const isValid =
      isSTOSDurationViolation(violation) ||
      (isStartDateViolation(violation) && (await canSkipStartDateViolation()));

    if (!isValid) {
      return false;
    }
  }
  return true;
};
