-- Test that the POSTAL_CODE column has been altered correctly
SET NOCOUNT ON

select COL_LENGTH('$(DB_NAME).[dbo].[ORBC_ADDRESS]', 'POSTAL_CODE')
