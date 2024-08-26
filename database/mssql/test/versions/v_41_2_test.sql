-- Test that constraint is added correctly
SET NOCOUNT ON

IF (OBJECT_ID('[$(DB_NAME)].[permit].[DF_ORBC_LOA_DETAILS_REVISION]','D') IS NOT NULL) 
    SELECT 1 
ELSE
    SELECT 0