-- Test that the credit account types have been inserted correctly.
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[permit].[ORBC_CREDIT_ACCOUNT_TYPE] 
WHERE CREDIT_ACCOUNT_TYPE IN ('PREPAID','UNSECURED','SECURED')