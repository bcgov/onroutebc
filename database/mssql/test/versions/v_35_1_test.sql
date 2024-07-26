-- Test that the auth groups have been inserted correctly
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[access].[ORBC_GROUP_ROLE] 
WHERE USER_AUTH_GROUP_TYPE IN (
      'PAPPLICANT',
      'ORGADMIN',
      'SYSADMIN',
      'PPCCLERK',
      'EOFFICER',
      'CTPO'
      )
   AND ROLE_TYPE IN (
      'ORBC-READ-NOFEE',
      'ORBC-READ-LCV-FLAG',
      'ORBC-READ-LOA',
      'ORBC-READ-SPECIAL-AUTH',
      'ORBC-WRITE-LOA',
      'ORBC-WRITE-NOFEE'
      )