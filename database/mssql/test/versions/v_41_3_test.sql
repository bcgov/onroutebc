-- Test that the START_DATE column is of type date
SET NOCOUNT ON

SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ORBC_LOA_DETAILS' and TABLE_SCHEMA = 'permit' and TABLE_CATALOG = '$(DB_NAME)' and COLUMN_NAME = 'START_DATE';
