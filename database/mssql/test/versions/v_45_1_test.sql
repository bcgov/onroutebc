-- Test that the new table for LoA assignment is created successfully
SET NOCOUNT ON
IF OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_LOA]', 'U') IS NOT NULL
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_LOA_HIST]', 'U') IS NOT NULL 

    SELECT 1 
ELSE
    SELECT 0