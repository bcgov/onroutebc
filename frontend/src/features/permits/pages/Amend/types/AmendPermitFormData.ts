import { Dayjs } from "dayjs";

import { ReadPermitDto, TermOversizeApplication } from "../../../types/permit";
import { DateStringToDayjs } from "../../../types/utility";
import { getDefaultValues } from "../../../helpers/getDefaultApplicationFormData";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { DATE_FORMATS, dayjsToLocalStr, dayjsToUtcStr, now, toLocalDayjs, utcToLocalDayjs } from "../../../../../common/helpers/formatDate";
import { PERMIT_APPLICATION_ORIGINS, PERMIT_APPROVAL_SOURCES } from "../../../types/application.d";
import { areApplicationDataEqual } from "../../../helpers/equality";

export interface AmendPermitFormData extends Omit<
  DateStringToDayjs<
    ReadPermitDto, 
    "permitIssueDateTime" | "createdDateTime" | "updatedDateTime"
  >, 
  "permitData"
> {
  permitData: TermOversizeApplication;
}

/**
 * Maps/transforms an permit object (with string for dates) to an form data object (Dayjs object for dates)
 * @param response ReadPermitDto object received as response data from backend
 * @returns converted AmendPermitFormData object that can be used by form fields and the front-end app
 */
export const mapPermitToFormData = (response: ReadPermitDto): AmendPermitFormData => {
  return {
    ...response,
    permitIssueDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => utcToLocalDayjs(datetimeStr),
      response.permitIssueDateTime,
    ),
    createdDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => utcToLocalDayjs(datetimeStr),
      response.createdDateTime,
    ),
    updatedDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => utcToLocalDayjs(datetimeStr),
      response.updatedDateTime,
    ),
    permitData: {
      ...response.permitData,
      startDate: applyWhenNotNullable(
        (datetimeStr: string): Dayjs => toLocalDayjs(datetimeStr),
        response.permitData.startDate,
        now()
      ),
      expiryDate: applyWhenNotNullable(
        (datetimeStr: string): Dayjs => toLocalDayjs(datetimeStr),
        response.permitData.expiryDate,
        now()
      ),
    }
  };
};

/**
 * Maps/transforms form data into ReadPermitDto so it can be used as payload for backend requests
 * @param data AmendPermitFormData form data
 * @returns ReadPermitDto object that's used for payload to request to backend
 */
export const mapFormDataToPermit = (data: AmendPermitFormData): ReadPermitDto => {
  return {
    ...data,
    createdDateTime: applyWhenNotNullable(
      dayjsToUtcStr,
      data.createdDateTime,
    ),
    updatedDateTime: applyWhenNotNullable(
      dayjsToUtcStr,
      data.updatedDateTime,
    ),
    permitIssueDateTime: applyWhenNotNullable(
      dayjsToUtcStr,
      data.permitIssueDateTime,
    ),
    permitData: {
      ...data.permitData,
      startDate: dayjsToLocalStr(data.permitData.startDate, DATE_FORMATS.DATEONLY),
      expiryDate: dayjsToLocalStr(data.permitData.expiryDate, DATE_FORMATS.DATEONLY),
    }
  };
};

export const getPermitFormDefaultValues = (permit?: ReadPermitDto | null): AmendPermitFormData => {
  // Default form values when permit is not available (or period of time when loading)
  if (!permit) {
    return {
      ...getDefaultValues(),
      permitApplicationOrigin: PERMIT_APPLICATION_ORIGINS.ONLINE,
      permitApprovalSource: PERMIT_APPROVAL_SOURCES.AUTO,
      permitId: 0,
      previousRevision: 0,
      permitIssueDateTime: undefined,
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
    permitId: permit.permitId,
    previousRevision: permit.previousRevision,
    permitIssueDateTime: applyWhenNotNullable(
      (issuedAt) => utcToLocalDayjs(issuedAt),
      permit.permitIssueDateTime
    ),
  };
};

export const getDefaultForPermitForm = (
  permitFormData?: AmendPermitFormData | null
): AmendPermitFormData => {
  // Default form values when permit is not available (or period of time when loading)
  if (!permitFormData) {
    return {
      ...getDefaultValues(),
      permitApplicationOrigin: PERMIT_APPLICATION_ORIGINS.ONLINE,
      permitApprovalSource: PERMIT_APPROVAL_SOURCES.AUTO,
      permitId: 0,
      previousRevision: 0,
    };
  }

  return {
    ...permitFormData,
    previousRevision: getDefaultRequiredVal(0, permitFormData.previousRevision),
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
    && (
      (!permit1.previousRevision && !permit2.previousRevision)
      || (permit1.previousRevision === permit2.previousRevision)
    )
    && (
      (!permit1.comment && !permit2.comment)
      || (permit1.comment === permit2.comment)
    )
    && permit1.permitStatus === permit2.permitStatus
    && permit1.companyId === permit2.companyId
    && (
      (!permit1.userGuid && !permit2.userGuid)
      || (permit1.userGuid === permit2.userGuid)
    )
    && permit1.permitType === permit2.permitType
    && permit1.applicationNumber === permit2.applicationNumber
    && permit1.permitNumber === permit2.permitNumber
    && permit1.permitApprovalSource === permit2.permitApprovalSource
    && permit1.permitApplicationOrigin === permit2.permitApplicationOrigin
    && (
      (!permit1.documentId && !permit2.documentId)
      || (permit1.documentId === permit2.documentId)
    )
    && (
      (!permit1.permitIssueDateTime && !permit2.permitIssueDateTime)
      || (
        permit1.permitIssueDateTime 
        && permit2.permitIssueDateTime 
        && dayjsToLocalStr(
          permit1.permitIssueDateTime, 
          DATE_FORMATS.DATETIME
        ) === dayjsToLocalStr(
          permit2.permitIssueDateTime,
          DATE_FORMATS.DATETIME
        )
      )
    )
    && dayjsToLocalStr(
      permit1.createdDateTime, 
      DATE_FORMATS.DATETIME
    ) === dayjsToLocalStr(
      permit2.createdDateTime,
      DATE_FORMATS.DATETIME
    )
    && dayjsToLocalStr(
      permit1.updatedDateTime, 
      DATE_FORMATS.DATETIME
    ) === dayjsToLocalStr(
      permit2.updatedDateTime,
      DATE_FORMATS.DATETIME
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
