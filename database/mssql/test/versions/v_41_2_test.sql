-- Test that the ORIGINAL_LOA_ID column has been added correctly
SET NOCOUNT ON

select COL_LENGTH('$(DB_NAME).[permit].[ORBC_LOA_DETAILS]', 'ORIGINAL_LOA_ID')