-- Test that no fee type USA_FEDERAL_GOVT has been inserted correctly
SET NOCOUNT ON
SELECT COUNT(*) FROM $(DB_NAME).permit.ORBC_NO_FEE_TYPE 
WHERE 
  NO_FEE_TYPE = 'USA_FEDERAL_GOVT'