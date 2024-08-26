-- Test that no fee type MUNICIPALITY has been inserted correctly
SET NOCOUNT ON
SELECT COUNT(*) FROM $(DB_NAME).permit.ORBC_NO_FEE_TYPE 
WHERE 
  NO_FEE_TYPE = 'MUNICIPALITY'