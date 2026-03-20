SET NOCOUNT ON
GO
DECLARE @TimestampCurrent int;
DECLARE @s nvarchar(1000);

SELECT @TimestampCurrent = DATEDIFF(SECOND, '19700101', sysutcdatetime());

SET @s = N'
ALTER SEQUENCE [permit].[ORBC_CREDIT_ACCOUNT_NUMBER_SEQ]
RESTART WITH ' + CAST(@TimestampCurrent AS nvarchar(10))

EXEC(@s)
