SET NOCOUNT ON
IF OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_CFS_TRANSACTION_DETAIL]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_CFS_FILE_STATUS_TYPE]', 'U') IS NOT NULL 
    SELECT 1 
ELSE
    SELECT 0