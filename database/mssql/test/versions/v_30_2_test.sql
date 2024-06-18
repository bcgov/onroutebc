-- Test that the role types have been inserted correctly
SET NOCOUNT ON

select COL_LENGTH('[ORBC_TST].[permit].[ORBC_TRANSACTION]', 'PAYER_NAME')
