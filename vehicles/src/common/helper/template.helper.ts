import { InternalServerErrorException } from '@nestjs/common';
import { ApplicationStatus } from '../enum/application-status.enum';
import { PermitType } from '../enum/permit-type.enum';
import {
  PermitTemplateMapping,
  TemplateName,
} from '../enum/template-name.enum';

/**
 * Returns the appropriate template name based on the provided application status and permit type.
 * Throws an error if the combination of status and type does not yield a valid template.
 *
 * @param {ApplicationStatus} status - The status of the application for which the template is required.
 * @param {PermitType} type - The type of permit for which the template is required.
 * @returns {TemplateName} - The template name corresponding to the status and type provided.
 * @throws {InternalServerErrorException} - If no valid template is found for the given status.
 */
export const getPermitTemplateName = (
  status: ApplicationStatus,
  type: PermitType,
): TemplateName => {
  const templateMapping: PermitTemplateMapping = {
    [ApplicationStatus.ISSUED]: {
      [PermitType.SINGLE_TRIP_OVERSIZE]: TemplateName.PERMIT_STOS,
      [PermitType.SINGLE_TRIP_OVERWEIGHT]: TemplateName.PERMIT_STOW,
      [PermitType.MOTIVE_FUEL_USER]: TemplateName.PERMIT_MFP,
      [PermitType.TERM_OVERWEIGHT]: TemplateName.PERMIT_TROW,
      [PermitType.TERM_OVERSIZE]: TemplateName.PERMIT_TROS,
      [PermitType.SINGLE_TRIP_NON_RESIDENT_REG_INS_COMMERCIAL_VEHICLE]:
        TemplateName.PERMIT_NRSCV,
      [PermitType.QUARTERLY_NON_RESIDENT_REG_INS_COMM_VEHICLE]:
        TemplateName.PERMIT_NRQCV,
      [PermitType.NON_RESIDENT_SINGLE_TRIP_ICBC_BASIC_INSURANCE_FR]:
        TemplateName.PERMIT_STFR,
      [PermitType.NON_RESIDENT_QUARTERLY_ICBC_BASIC_INSURANCE_FR]:
        TemplateName.PERMIT_QRFR,
      default: TemplateName.PERMIT,
    },
    [ApplicationStatus.VOIDED]: {
      [PermitType.SINGLE_TRIP_OVERSIZE]: TemplateName.PERMIT_STOS_VOID,
      [PermitType.SINGLE_TRIP_OVERWEIGHT]: TemplateName.PERMIT_STOW_VOID,
      [PermitType.MOTIVE_FUEL_USER]: TemplateName.PERMIT_MFP_VOID,
      [PermitType.TERM_OVERWEIGHT]: TemplateName.PERMIT_TROW_VOID,
      [PermitType.TERM_OVERSIZE]: TemplateName.PERMIT_TROS_VOID,
      [PermitType.SINGLE_TRIP_NON_RESIDENT_REG_INS_COMMERCIAL_VEHICLE]:
        TemplateName.PERMIT_NRSCV_VOID,
      [PermitType.QUARTERLY_NON_RESIDENT_REG_INS_COMM_VEHICLE]:
        TemplateName.PERMIT_NRQCV_VOID,
      [PermitType.NON_RESIDENT_SINGLE_TRIP_ICBC_BASIC_INSURANCE_FR]:
        TemplateName.PERMIT_STFR_VOID,
      [PermitType.NON_RESIDENT_QUARTERLY_ICBC_BASIC_INSURANCE_FR]:
        TemplateName.PERMIT_QRFR_VOID,
      default: TemplateName.PERMIT_VOID,
    },
    [ApplicationStatus.REVOKED]: {
      [PermitType.SINGLE_TRIP_OVERSIZE]: TemplateName.PERMIT_STOS_REVOKED,
      [PermitType.SINGLE_TRIP_OVERWEIGHT]: TemplateName.PERMIT_STOW_REVOKED,
      [PermitType.MOTIVE_FUEL_USER]: TemplateName.PERMIT_MFP_REVOKED,
      [PermitType.TERM_OVERWEIGHT]: TemplateName.PERMIT_TROW_REVOKED,
      [PermitType.TERM_OVERSIZE]: TemplateName.PERMIT_TROS_REVOKED,
      [PermitType.SINGLE_TRIP_NON_RESIDENT_REG_INS_COMMERCIAL_VEHICLE]:
        TemplateName.PERMIT_NRSCV_REVOKED,
      [PermitType.QUARTERLY_NON_RESIDENT_REG_INS_COMM_VEHICLE]:
        TemplateName.PERMIT_NRQCV_REVOKED,
      [PermitType.NON_RESIDENT_SINGLE_TRIP_ICBC_BASIC_INSURANCE_FR]:
        TemplateName.PERMIT_STFR_REVOKED,
      [PermitType.NON_RESIDENT_QUARTERLY_ICBC_BASIC_INSURANCE_FR]:
        TemplateName.PERMIT_QRFR_REVOKED,
      default: TemplateName.PERMIT_REVOKED,
    },
  };

  const template =
    templateMapping[status]?.[type] || templateMapping[status]?.default;
  if (!template) {
    throw new InternalServerErrorException(
      'Invalid status for document generation',
    );
  }
  return template;
};
