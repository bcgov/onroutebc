import { Permit } from "../../../types/permit";
import { getDefaultValues } from "../../../helpers/getDefaultApplicationFormData";
import { Nullable } from "../../../../../common/types/common";
import { areApplicationDataEqual } from "../../../helpers/equality";
import { DEFAULT_PERMIT_TYPE } from "../../../types/PermitType";
import { Application, ApplicationFormData } from "../../../types/application";
import {
  applyWhenNotNullable,
  areValuesDifferent,
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
  const defaultPermitType = getDefaultRequiredVal(DEFAULT_PERMIT_TYPE, permit?.permitType);

  // Default form values when permit is not available (or period of time when loading)
  if (!permit) {
    return {
      ...getDefaultValues(defaultPermitType),
    };
  }

  const {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    issuer,
    ...restOfPermit
  } = permit;

  return {
    ...getDefaultValues(
      defaultPermitType,
      {
        ...restOfPermit,
        permitData: {
          ...permit.permitData,
          startDate: applyWhenNotNullable(
            (startAt) => getStartOfDate(toLocalDayjs(startAt)),
            permit.permitData?.startDate,
          ),
          expiryDate: applyWhenNotNullable(
            (endAt) => getEndOfDate(toLocalDayjs(endAt)),
            permit.permitData?.expiryDate,
          ),
        },
      } as AmendPermitFormData,
      permit.companyId,
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

export const areFormDataEqual = (
  formData1?: Nullable<AmendPermitFormData>,
  formData2?: Nullable<AmendPermitFormData>,
) => {
  if (!formData1 && !formData2) return true; // considered equal when both are undefined
  if (!formData1 || !formData2) return false; // considered not equal when only one is undefined

  return (
    formData1.permitId === formData2.permitId &&
    formData1.originalPermitId === formData2.originalPermitId &&
    !areValuesDifferent(formData1.comment, formData2.comment) &&
    formData1.permitStatus === formData2.permitStatus &&
    formData1.companyId === formData2.companyId &&
    formData1.permitType === formData2.permitType &&
    formData1.applicationNumber === formData2.applicationNumber &&
    formData1.permitNumber === formData2.permitNumber &&
    areApplicationDataEqual(
      {
        ...formData1.permitData,
        companyName: getDefaultRequiredVal("", formData1.permitData.companyName),
        clientNumber: getDefaultRequiredVal(
          "",
          formData1.permitData.clientNumber,
        ),
      },
      {
        ...formData2.permitData,
        companyName: getDefaultRequiredVal("", formData2.permitData.companyName),
        clientNumber: getDefaultRequiredVal(
          "",
          formData2.permitData.clientNumber,
        ),
      },
    )
  );
};
