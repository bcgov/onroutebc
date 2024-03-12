-- Test that the template file names have been updated correctly
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[dops].[ORBC_DOCUMENT] 
WHERE FILE_NAME IN ('permit-template-v1.docx','permit-template-void-template-v1.docx','permit-template-revoked-template-v1.docx')