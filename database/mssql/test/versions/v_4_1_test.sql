SET NOCOUNT ON
IF OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_COMMENTS]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_PERMIT_DATA]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_VT_PERMIT_STATUS]', 'U') IS NOT NULL 
AND OBJECT_ID('[$(DB_NAME)].[permit].[ORBC_VT_PERMIT_TYPE]', 'U') IS NOT NULL 
    SELECT 1 
ELSE
    SELECT 0