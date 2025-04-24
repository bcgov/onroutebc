export interface IPermitReportDataDetails {
  CLIENT_NUMBER: string;
  CLIENT_NAME: string;
  CLIENT_DBA: string;
  CLIENT_ADDR1: string;
  CLIENT_ADDR2: string;
  CLIENT_CITY: string;
  CLIENT_POSTAL_CODE: string;
  CLIENT_PROVINCE: string;
  CLIENT_COUNTRY: string;
  OFFICE: string;
  PERMIT_NUMBER: string;
  PERMIT_ISSUE_DATE_TIME: Date;
  APP_PERMIT_START_DATE: Date;
  APP_PERMIT_END_DATE: Date;
  PERMIT_TYPE: string;
  VEH_PLATE: string;
  VEH_VIN: string;
  VEH_PROVINCE_CODE: string;
  VEH_COUNTRY_CODE: string;
  TOTAL_KM: string;
  STATUS: string;
}
