/**
 * The claims of a user.
 *
 * NOTE: The frontend has an identical copy of this. Any changes made here
 * should be cascaded.
 */
export enum Claim {
  PUBLIC_AGENT = 'ORBC-PUBLIC-AGENT',
  PUBLIC_ORG_ADMIN = 'ORBC-PUBLIC-ORG-ADMIN',
  PUBLIC_USER_ADMIN = 'ORBC-PUBLIC-USER-ADMIN',
  PUBLIC_VEHICLE_ADMIN = 'ORBC-PUBLIC-VEHICLE-ADMIN',
  PUBLIC_VERIFIED = 'ORBC-PUBLIC-VERIFIED',
  READ_BILLING = 'ORBC-READ-BILLING',
  READ_ORG = 'ORBC-READ-ORG',
  READ_PAYMENT = 'ORBC-READ-PAYMENT',
  READ_PERMIT = 'ORBC-READ-PERMIT',
  READ_SELF = 'ORBC-READ-SELF',
  READ_USER = 'ORBC-READ-USER',
  READ_VEHICLE = 'ORBC-READ-VEHICLE',
  STAFF = 'ORBC-STAFF',
  STAFF_ADMIN = 'ORBC-STAFF-ADMIN',
  STAFF_PERMIT_ISSUER = 'ORBC-STAFF-PERMIT-ISSUER',
  WRITE_BILLING = 'ORBC-WRITE-BILLING',
  WRITE_ORG = 'ORBC-WRITE-ORG',
  WRITE_PAYMENT = 'ORBC-WRITE-PAYMENT',
  WRITE_PERMIT = 'ORBC-WRITE-PERMIT',
  VOID_PERMIT = 'ORBC-VOID-PERMIT',
  WRITE_SELF = 'ORBC-WRITE-SELF',
  WRITE_USER = 'ORBC-WRITE-USER',
  WRITE_VEHICLE = 'ORBC-WRITE-VEHICLE',
  WRITE_VEHICLE_TYPES = 'ORBC-WRITE-VEHICLE-TYPES',
  READ_VEHICLE_TYPES = 'ORBC-READ-VEHICLE-TYPES',
  READ_DOCUMENT = 'ORBC-READ-DOCUMENT',
  WRITE_DOCUMENT = 'ORBC-WRITE-DOCUMENT',
  DELETE_DOCUMENT = 'ORBC-DELETE-DOCUMENT',
  GENERATE_DOCUMENT = 'ORBC-GENERATE-DOCUMENT',
  GENERATE_REPORT = 'ORBC-GENERATE-REPORT',
  GENERATE_TRANSACTION_REPORT_ALL = 'ORBC-GENERATE-TRANSACTION-REPORT-ALL',
  GENERATE_TRANSACTION_REPORT_SELF = 'ORBC-GENERATE-TRANSACTION-REPORT-SELF',
  GENERATE_TRANSACTION_REPORT = 'ORBC-GENERATE-TRANSACTION-REPORT',
  READ_SPECIAL_AUTH = 'ORBC-READ-SPECIAL-AUTH',
  READ_NOFEE = 'ORBC-READ-NOFEE',
  WRITE_NOFEE = 'ORBC-WRITE-NOFEE',
  READ_LCV_FLAG = 'ORBC-READ-LCV-FLAG',
  WRITE_LCV_FLAG = 'ORBC-WRITE-LCV-FLAG',
  READ_LOA = 'ORBC-READ-LOA',
  WRITE_LOA = 'ORBC-WRITE-LOA',
  READ_SUSPEND = 'ORBC-READ-SUSPEND',
  WRITE_SUSPEND = 'ORBC-WRITE-SUSPEND',
  SEND_NOTIFICATION = 'ORBC-SEND-NOTIFICATION',
  WRITE_CREDIT_ACCOUNT = 'ORBC-WRITE-CREDIT-ACCOUNT',
  READ_CREDIT_ACCOUNT = 'ORBC-READ-CREDIT-ACCOUNT',
  READ_POLICY_CONFIG = 'ORBC-READ-POLICY-CONFIG',
  WRITE_POLICY_CONFIG = 'ORBC-WRITE-POLICY-CONFIG',
}
