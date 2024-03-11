import { Permit } from "../../../types/permit";
import { getDefaultValues } from "../../../helpers/getDefaultApplicationFormData";
import { Nullable } from "../../../../../common/types/common";
import { DEFAULT_PERMIT_TYPE } from "../../../types/PermitType";
import { Application, ApplicationFormData } from "../../../types/application";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";

import {
  getEndOfDate,
  getStartOfDate,
  toLocalDayjs,
} from "../../../../../common/helpers/formatDate";

export interface AmendPermitFormData extends ApplicationFormData {};

/**
 * Get default values for form data from received Application object.
 * @param application Application object
 * @returns Default form data values
 */
export const getDefaultFormDataFromApplication = (
  application?: Nullable<Application>,
): AmendPermitFormData => {
  const defaultPermitType = getDefaultRequiredVal(DEFAULT_PERMIT_TYPE, application?.permitType);

  // Default form values when application is not available (or period of time when loading)
  if (!application) {
    return {
      ...getDefaultValues(defaultPermitType),
    };
  }

  return {
    ...getDefaultValues(
      defaultPermitType,
      application,
      application.companyId,
    ),
  };
};

/**
 * Get default values for form data from received Permit object.
 * @param permit Permit object
 * @returns Default form data values
 */
export const getDefaultFormDataFromPermit = (
  permit?: Nullable<Permit>,
): AmendPermitFormData => {
  const defaultPermitType = getDefaultRequiredVal(
    DEFAULT_PERMIT_TYPE,
    permit?.permitType,
  );

  // Default form values when permit is not available (or period of time when loading)
  if (!permit) {
    return {
      ...getDefaultValues(defaultPermitType),
    };
  }

  const {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    issuer, // removes "issuer" field from permit
    ...restOfPermit
  } = permit;

  return {
    ...getDefaultValues(
      defaultPermitType,
      {
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
      } as AmendPermitFormData,
      restOfPermit.companyId,
    ),
  };
};

/**
 * Get default values for the form data from nullable form data values.
 * @param permitFormData Nullable form data
 * @returns Default form data values
 */
export const getDefaultFromNullableFormData = (
  permitFormData?: Nullable<AmendPermitFormData>,
): AmendPermitFormData => {
  const defaultPermitType = getDefaultRequiredVal(DEFAULT_PERMIT_TYPE, permitFormData?.permitType);

  // Default form values when form data is not available (or period of time when loading)
  if (!permitFormData) {
    return {
      ...getDefaultValues(defaultPermitType),
    };
  }

  return {
    ...getDefaultValues(
      defaultPermitType,
      permitFormData,
      permitFormData.companyId,
    ),
  };
};
