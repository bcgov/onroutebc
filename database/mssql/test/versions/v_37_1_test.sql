-- Test that the role types have been inserted correctly against user auth groups
SET NOCOUNT ON

IF OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_NO_FEE_TYPE]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_SPECIAL_AUTH]', 'U') IS NOT NULL 
    SELECT 1 
ELSE
    SELECT 0