-- Test that the APP_LAST_UPDATE_USERID column has been added correctly
SET NOCOUNT ON

select COL_LENGTH('$(DB_NAME).[dbo].[ORBC_POLICY_CONFIGURATION]', 'APP_LAST_UPDATE_USERID')
