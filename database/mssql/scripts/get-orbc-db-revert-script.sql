SET NOCOUNT ON
SELECT TOP 1 REVERT_SCRIPT FROM [$(DB_NAME)].[dbo].[ORBC_SYS_VERSION] 
WHERE REVERT_SCRIPT IS NOT NULL
AND VERSION_ID = (SELECT TOP 1 VERSION_ID FROM [$(DB_NAME)].[dbo].[ORBC_SYS_VERSION] ORDER BY RELEASE_DATE DESC)
ORDER BY RELEASE_DATE DESC