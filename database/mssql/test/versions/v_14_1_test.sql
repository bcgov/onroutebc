SET NOCOUNT ON
IF OBJECT_ID('[$(DB_NAME)].[dbo].[ORBC_FEATURE_FLAG]', 'U') IS NOT NULL
    SELECT 1 
ELSE
    SELECT 0