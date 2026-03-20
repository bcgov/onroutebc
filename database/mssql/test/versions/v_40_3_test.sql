-- Test that no fee type OTHER_USA_GOVT has been inserted correctly
SET NOCOUNT ON
SELECT COUNT(*) FROM $(DB_NAME).permit.ORBC_NO_FEE_TYPE 
WHERE 
  NO_FEE_TYPE = 'OTHER_USA_GOVT'