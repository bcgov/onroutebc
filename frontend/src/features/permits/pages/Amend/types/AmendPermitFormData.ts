import { Permit } from "../../../types/permit";
import { getDefaultValues } from "../../../helpers/getDefaultApplicationFormData";
import { applyWhenNotNullable, areValuesDifferent, getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { Application, PERMIT_APPLICATION_ORIGINS, PERMIT_APPROVAL_SOURCES } from "../../../types/application.d";
import { areApplicationDataEqual } from "../../../helpers/equality";
import { transformApplicationToPermit, transformPermitToApplication } from "../../../helpers/mappers";
import { 
  DATE_FORMATS, 
  dayjsToLocalStr,
  toLocalDayjs, 
  utcToLocalDayjs, 
} from "../../../../../common/helpers/formatDate";

export type AmendPermitFormData = Application;

/**
 * Maps/transforms an permit object (with string for dates) to an form data object (Dayjs object for dates)
 * @param response Permit object received as response data from backend
 * @returns converted AmendPermitFormData object that can be used by form fields and the front-end app
 */
export const mapPermitToFormData = (response: Permit): AmendPermitFormData => {
  return transformPermitToApplication(response);
};

/**
 * Maps/transforms form data into Permit so it can be used as payload for backend requests
 * @param data AmendPermitFormData form data
 * @returns Permit object that's used for payload to request to backend
 */
export const mapFormDataToPermit = (data: AmendPermitFormData) => {
  return transformApplicationToPermit(data);
};

/**
 * Get default values for form data from received Permit object.
 * @param permit Permit object received
 * @returns Default form data values
 */
export const getDefaultFormDataFromPermit = (permit?: Permit | null): AmendPermitFormData => {
  // Default form values when permit is not available (or period of time when loading)
  if (!permit) {
    return {
      ...getDefaultValues(),
      permitApplicationOrigin: PERMIT_APPLICATION_ORIGINS.ONLINE,
      permitApprovalSource: PERMIT_APPROVAL_SOURCES.AUTO,
    };
  }

  return {
    ...getDefaultValues({
      ...permit,
      permitId: `${permit.permitId}`,
      previousRevision: applyWhenNotNullable(
        (prevRev) => `${prevRev}`,
        permit.previousRevision
      ),
      createdDateTime: applyWhenNotNullable(
        (createdAt) => utcToLocalDayjs(createdAt),
        permit.createdDateTime
      ),
      updatedDateTime: applyWhenNotNullable(
        (updatedAt) => utcToLocalDayjs(updatedAt),
        permit.updatedDateTime
      ),
      permitData: {
        ...permit.permitData,
        startDate: applyWhenNotNullable(
          (startAt) => toLocalDayjs(startAt),
          permit.permitData?.startDate,
        ),
        expiryDate: applyWhenNotNullable(
          (endAt) => toLocalDayjs(endAt),
          permit.permitData?.expiryDate
        ),
        companyName: getDefaultRequiredVal("", permit.permitData?.companyName),
        clientNumber: getDefaultRequiredVal("", permit.permitData?.clientNumber),
      },
    }, permit.companyId),
    permitApplicationOrigin: permit.permitApplicationOrigin,
    permitApprovalSource: permit.permitApprovalSource,
  };
};

/**
 * Get default values for the form data from nullable form data values.
 * @param permitFormData Nullable form data
 * @returns Default form data values
 */
export const getDefaultFromNullableFormData = (
  permitFormData?: AmendPermitFormData | null
): AmendPermitFormData => {
  // Default form values when permit is not available (or period of time when loading)
  if (!permitFormData) {
    return {
      ...getDefaultValues(),
      permitApplicationOrigin: PERMIT_APPLICATION_ORIGINS.ONLINE,
      permitApprovalSource: PERMIT_APPROVAL_SOURCES.AUTO,
    };
  }

  return {
    ...permitFormData,
    previousRevision: getDefaultRequiredVal("", permitFormData.previousRevision),
    comment: getDefaultRequiredVal("", permitFormData.comment),
    userGuid: getDefaultRequiredVal("", permitFormData.userGuid),
    documentId: getDefaultRequiredVal("", permitFormData.documentId),
    permitData: {
      ...permitFormData.permitData,
      companyName: getDefaultRequiredVal("", permitFormData.permitData?.companyName),
      clientNumber: getDefaultRequiredVal("", permitFormData.permitData?.clientNumber),
    },
  };
};

export const arePermitsEqual = (
  permit1?: AmendPermitFormData | null, 
  permit2?: AmendPermitFormData | null
) => {
  if (!permit1 && !permit2) return true; // considered equal when both are undefined
  if (!permit1 || !permit2) return false; // considered not equal when only one is undefined

  return permit1.permitId === permit2.permitId
    && permit1.originalPermitId === permit2.originalPermitId
    && permit1.revision === permit2.revision
    && !areValuesDifferent(permit1.previousRevision, permit2.previousRevision)
    && !areValuesDifferent(permit1.comment, permit2.comment)
    && permit1.permitStatus === permit2.permitStatus
    && permit1.companyId === permit2.companyId
    && !areValuesDifferent(permit1.userGuid, permit2.userGuid)
    && permit1.permitType === permit2.permitType
    && permit1.applicationNumber === permit2.applicationNumber
    && permit1.permitNumber === permit2.permitNumber
    && permit1.permitApprovalSource === permit2.permitApprovalSource
    && permit1.permitApplicationOrigin === permit2.permitApplicationOrigin
    && !areValuesDifferent(permit1.documentId, permit2.documentId)
    && !areValuesDifferent(
      applyWhenNotNullable(
        dt => dayjsToLocalStr(dt, DATE_FORMATS.DATETIME),
        permit1.createdDateTime
      ),
      applyWhenNotNullable(
        dt => dayjsToLocalStr(dt, DATE_FORMATS.DATETIME),
        permit2.createdDateTime
      )
    )
    && !areValuesDifferent(
      applyWhenNotNullable(
        dt => dayjsToLocalStr(dt, DATE_FORMATS.DATETIME),
        permit1.updatedDateTime
      ), 
      applyWhenNotNullable(
        dt => dayjsToLocalStr(dt, DATE_FORMATS.DATETIME),
        permit2.updatedDateTime
      )
    )
    && areApplicationDataEqual({
      ...permit1.permitData,
      companyName: getDefaultRequiredVal("", permit1.permitData.companyName),
      clientNumber: getDefaultRequiredVal("", permit1.permitData.clientNumber),
    }, {
      ...permit2.permitData,
      companyName: getDefaultRequiredVal("", permit2.permitData.companyName),
      clientNumber: getDefaultRequiredVal("", permit2.permitData.clientNumber),
    });
};
