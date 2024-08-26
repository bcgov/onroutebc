-- Test that column is added correctly
SET NOCOUNT ON

SELECT 1 FROM sys.columns 
          WHERE Name = N'REVISION'
          AND Object_ID = Object_ID(N'[$(DB_NAME)].[permit].[ORBC_NO_FEE_TYPE]')