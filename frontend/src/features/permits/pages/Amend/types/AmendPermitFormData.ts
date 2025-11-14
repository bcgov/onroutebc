import { Permit } from "../../../types/permit";
import { getDefaultValues } from "../../../helpers/getDefaultApplicationFormData";
import { Nullable } from "../../../../../common/types/common";
import { DEFAULT_PERMIT_TYPE } from "../../../types/PermitType";
import { Application, ApplicationFormData } from "../../../types/application";
import { CompanyProfile } from "../../../../manageProfile/types/manageProfile";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";

import {
  getEndOfDate,
  getStartOfDate,
  toLocalDayjs,
} from "../../../../../common/helpers/formatDate";

export type AmendPermitFormData = ApplicationFormData;

/**
 * Get default values for form data from received Application object and company info.
 * @param companyInfo Company information
 * @param application Application object
 * @returns Default form data values
 */
export const getDefaultFormDataFromApplication = (
  companyInfo: Nullable<CompanyProfile>,
  application?: Nullable<Application>,
): AmendPermitFormData => {
  const defaultPermitType = getDefaultRequiredVal(
    DEFAULT_PERMIT_TYPE,
    application?.permitType,
  );

  // Default form values when application is not available (or period of time when loading)
  if (!application) {
    return {
      ...getDefaultValues(defaultPermitType, companyInfo),
    };
  }

  return {
    ...getDefaultValues(defaultPermitType, companyInfo, application),
  };
};

/**
 * Get default values for form data from received Permit object and company information.
 * @param companyInfo Company information
 * @param permit Permit object
 * @returns Default form data values
 */
export const getDefaultFormDataFromPermit = (
  companyInfo: Nullable<CompanyProfile>,
  permit?: Nullable<Permit>,
): AmendPermitFormData => {
  const defaultPermitType = getDefaultRequiredVal(
    DEFAULT_PERMIT_TYPE,
    permit?.permitType,
  );

  // Default form values when permit is not available (or period of time when loading)
  if (!permit) {
    return {
      ...getDefaultValues(defaultPermitType, companyInfo),
    };
  }

  const {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    issuer, // removes "issuer" field from permit
    ...restOfPermit
  } = permit;

  return {
    ...getDefaultValues(defaultPermitType, companyInfo, {
      ...restOfPermit,
      permitData: {
        ...restOfPermit.permitData,
        startDate: applyWhenNotNullable(
          (startAt) => getStartOfDate(toLocalDayjs(startAt)),
          restOfPermit.permitData?.startDate,
        ),
        expiryDate: applyWhenNotNullable(
          (endAt) => getEndOfDate(toLocalDayjs(endAt)),
          restOfPermit.permitData?.expiryDate,
        ),
      },
    } as AmendPermitFormData),
  };
};
