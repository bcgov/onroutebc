-- Test that the permit template names have been updated correctly
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[dops].[ORBC_DOCUMENT_TEMPLATE] 
WHERE TEMPLATE_NAME IN ('PERMIT','PERMIT_VOID','PERMIT_REVOKED')