-- Test that the auth roles have been inserted correctly
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[access].[ORBC_ROLE_TYPE] 
WHERE ROLE_TYPE IN (
  'ORBC-READ-SPECIAL-AUTH',
  'ORBC-READ-NOFEE',
  'ORBC-WRITE-NOFEE',
  'ORBC-READ-LCV-FLAG',
  'ORBC-WRITE-LCV-FLAG',
  'ORBC-READ-LOA',
  'ORBC-WRITE-LOA'
)