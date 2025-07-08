-- Test that the CASE_OPENED_DATE_TIME column has been added to the ORBC_CASE table
SET NOCOUNT ON

select COL_LENGTH('$(DB_NAME).[case].[ORBC_CASE]', 'CASE_OPENED_DATE_TIME')
