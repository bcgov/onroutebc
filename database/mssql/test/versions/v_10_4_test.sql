SET NOCOUNT ON
SELECT $(DB_NAME).dbo.ORBC_FORMAT_UTC_TO_PACIFIC_FN(CONVERT(datetime2, '2024-01-01T04:00:00.000Z', 127))