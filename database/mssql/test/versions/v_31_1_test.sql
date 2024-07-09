-- Test that the GL_CODE column has been added correctly
SET NOCOUNT ON

select COL_LENGTH('$(DB_NAME).[permit].[ORBC_PERMIT_TYPE]', 'GL_CODE')
