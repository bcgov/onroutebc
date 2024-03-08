-- Test that the auth groups have been inserted correctly
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[dbo].[ORBC_FEATURE_FLAG] 
WHERE FEATURE_KEY IN ('SHOPPING_CART')