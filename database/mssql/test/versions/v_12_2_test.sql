-- Test that duplicate records are not migrated into ORBC_PERMIT
SET NOCOUNT ON
INSERT INTO $(DB_NAME).tps.ORBC_TPS_MIGRATED_PERMITS(
	PERMIT_TYPE,
	START_DATE,
	END_DATE,
	ISSUED_DATE,
	CLIENT_HASH,
	PLATE,
	VIN,
	PERMIT_NUMBER,
	NEW_PERMIT_NUMBER,
	PERMIT_GENERATION,
	SERVICE)
VALUES(
	'TROS',
	'20240101',
	'20240201',
	'20240101 12:00:00PM',
	'HASH',
	'TSTPLT',
	'TSTVIN',
	'08-100-3429',
	'P0-08100342-900',
	1,
	'C')

SELECT COUNT(*) FROM $(DB_NAME).permit.ORBC_PERMIT -- should be still just one, from prior test