SET NOCOUNT ON
IF OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_CFS_TRANSACTION_DETAIL_HIST]', 'U') IS NOT NULL 
    SELECT 1 
ELSE
    SELECT 0