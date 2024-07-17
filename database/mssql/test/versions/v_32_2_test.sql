-- Test that the role types have been inserted correctly
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[access].[ORBC_ROLE_TYPE] 
WHERE ROLE_TYPE IN ('ORBC-WRITE-POLICY-CONFIG','ORBC-READ-POLICY-CONFIG')