SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
DELETE FROM $(DB_NAME).tps.ORBC_TPS_MIGRATED_PERMITS
DELETE FROM $(DB_NAME).permit.ORBC_PERMIT_DATA
DELETE FROM $(DB_NAME).permit.ORBC_PERMIT