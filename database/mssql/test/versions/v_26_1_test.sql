-- Test that the IN_CART status has been added successfully
SET NOCOUNT ON

SELECT COUNT(*) FROM $(DB_NAME).[permit].[ORBC_PERMIT_STATUS_TYPE] 
WHERE PERMIT_STATUS_TYPE = 'IN_CART'