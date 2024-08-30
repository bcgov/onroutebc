-- Test that the PREVIOUS_LOA_ID column has been added correctly
SET NOCOUNT ON

select COL_LENGTH('$(DB_NAME).[permit].[ORBC_LOA_DETAILS]', 'PREVIOUS_LOA_ID')