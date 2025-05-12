import { Permit } from 'src/modules/permit-application-payment/permit/entities/permit.entity';
import { PermitData } from '../interface/permit.template.interface';
import { PolicyApplication } from '../interface/policy-application.interface';
import { ValidationResults } from 'onroute-policy-engine';
import { IUserJWT } from '../interface/user-jwt.interface';
import { isCVClient } from './common.helper';
import { PermitType } from '../enum/permit-type.enum';
import { differenceBetween } from './date-time.helper';
export const convertToPolicyApplication = (
  application: Permit,
): PolicyApplication => {
  return {
    permitType: application.permitType,
    permitData: JSON.parse(application.permitData.permitData) as PermitData,
  };
};

/**
 * This method is written for JIRA ORV2-4020
 * As per specifications staff user can allow STOS amendments to be equal to or less than 30 days.
 * so BE will filter our policy engine violation for such scenario.
 * @param application
 * @param currentUser
 * @param validationResults
 * @returns
 */
export const staffAmendSTOS = (
  application: Permit,
  currentUser: IUserJWT,
  validationResults: ValidationResults,
): ValidationResults => {
  const isSTOS = application.permitType === PermitType.SINGLE_TRIP_OVERSIZE;
  const isAllowedDuration =
    differenceBetween(
      application.permitData.expiryDate,
      application.permitData.startDate,
    ) <= 30;
  const isRevised = application.revision > 0;
  const isCV = isCVClient(currentUser.identity_provider);
  const hasDurationViolations = validationResults?.violations?.some(
    (violation) => violation?.fieldReference == 'permitData.permitDuration',
  );

  if (
    isSTOS &&
    isAllowedDuration &&
    isRevised &&
    hasDurationViolations &&
    !isCV
  ) {
    validationResults.violations = validationResults.violations.filter(
      (violation) => violation.fieldReference !== 'permitData.permitDuration',
    );
  }
  return validationResults;
};
