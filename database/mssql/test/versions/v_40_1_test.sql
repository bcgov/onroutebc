-- Test that the role types have been inserted correctly against user auth groups
SET NOCOUNT ON

IF (OBJECT_ID('[$(DB_NAME)].[permit].[DF_ORBC_LOA_DETAILS_REVISION]','D') IS NOT NULL) 
    SELECT 1 
ELSE
    SELECT 0