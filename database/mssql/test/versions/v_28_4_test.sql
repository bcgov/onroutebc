-- Test that the credit account activity types have been inserted correctly.
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[permit].[ORBC_CREDIT_ACCOUNT_ACTIVITY_TYPE] 
WHERE CREDIT_ACCOUNT_ACTIVITY_TYPE IN ('ONHOLD','HOLDRMVD','CLOSED','REOPENED')