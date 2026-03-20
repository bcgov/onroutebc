-- Test that the APP_LAST_UPDATE_USERID column has been added correctly
SET NOCOUNT ON

select COL_LENGTH('$(DB_NAME).[permit].[ORBC_CREDIT_ACCOUNT]', 'CREDIT_ACCOUNT_NUMBER')
