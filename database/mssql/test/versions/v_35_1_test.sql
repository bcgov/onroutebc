-- Test that the Holidays have been inserted correctly
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[dbo].[ORBC_HOLIDAY] 
WHERE HOLIDAY_DATE IN ('2024-01-01','2025-01-01')