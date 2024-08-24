-- Test that the role types have been inserted correctly against user auth groups
SET NOCOUNT ON

IF (OBJECT_ID('[$(DB_NAME)].[permit].[FK_ORBC_SPECIAL_AUTH_NO_FEE_TYPE]','D') IS NOT NULL) 
AND (OBJECT_ID('[$(DB_NAME)].[permit].[PK_ORBC_NO_FEE_TYPE]','D') IS NOT NULL) 
    SELECT 1 
ELSE
    SELECT 0