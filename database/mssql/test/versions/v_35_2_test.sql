-- Test that the auth groups have been inserted correctly
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[access].[ORBC_GROUP_ROLE] 
WHERE USER_AUTH_GROUP_TYPE = 'FINANCE'
   AND ROLE_TYPE = 'ORBC-READ-LCV-FLAG'