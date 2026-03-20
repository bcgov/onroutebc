-- Test that the role types have been inserted correctly against user auth groups
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[access].[ORBC_GROUP_ROLE] 
WHERE ROLE_TYPE = 'ORBC-READ-CREDIT-ACCOUNT' AND USER_AUTH_GROUP_TYPE='PAPPLICANT'