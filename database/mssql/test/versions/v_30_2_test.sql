-- Test that the role types have been inserted correctly
SET NOCOUNT ON

select COL_LENGTH('$(DB_NAME).[permit].[ORBC_TRANSACTION]', 'PAYER_NAME')
