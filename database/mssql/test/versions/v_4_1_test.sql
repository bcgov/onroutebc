SET NOCOUNT ON
IF OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_COMMENTS]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_DATA]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_STATE]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_APPLICATION_ORIGIN_TYPE]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_APPROVAL_SOURCE_TYPE]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_STATUS_TYPE]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_TYPE]', 'U') IS NOT NULL 
    SELECT 1 
ELSE
    SELECT 0