SET NOCOUNT ON
IF OBJECT_ID('[$(MSSQL_DB)].[dbo].[ORBC_SYS_VERSION]', 'U') IS NOT NULL
    SELECT TOP 1 VERSION_ID FROM [$(MSSQL_DB)].[dbo].[ORBC_SYS_VERSION] ORDER BY RELEASE_DATE DESC
ELSE
    SELECT 0