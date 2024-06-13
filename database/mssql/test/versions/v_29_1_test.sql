-- Test that the role types have been inserted correctly
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[dbo].[ORBC_DIRECTORY_TYPE]
WHERE DIRECTORY_TYPE = 'SERVICE_ACCOUNT'