SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET NOCOUNT ON
GO

SET XACT_ABORT ON
GO

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
GO

BEGIN TRANSACTION
GO

-- Drop staging table for credit accounts
DROP TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNTS]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Drop staging table for credit account users
DROP TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_USERS]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Drop temp table to store unposted TPS credit balance
DROP TABLE [tps].[ORBC_TPS_UNPOSTED_CREDIT_TOTAL]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Remove new credit account activity types, only if
-- there are no credit account activity records of these
-- types already
IF NOT EXISTS (SELECT 1 FROM permit.ORBC_CREDIT_ACCOUNT_ACTIVITY WHERE CREDIT_ACCOUNT_ACTIVITY_TYPE = 'MIGRATED')
BEGIN
  DELETE FROM permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_TYPE
  WHERE CREDIT_ACCOUNT_ACTIVITY_TYPE = 'MIGRATED'
END
GO

IF NOT EXISTS (SELECT 1 FROM permit.ORBC_CREDIT_ACCOUNT_ACTIVITY WHERE CREDIT_ACCOUNT_ACTIVITY_TYPE = 'VERIFIED')
BEGIN
  DELETE FROM permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_TYPE
  WHERE CREDIT_ACCOUNT_ACTIVITY_TYPE = 'VERIFIED'
END
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Remove new 'UNKNOWN' credit account type, only if
-- there are no credit accounts with this type already
IF NOT EXISTS (SELECT 1 FROM permit.ORBC_CREDIT_ACCOUNT WHERE CREDIT_ACCOUNT_TYPE = 'UNKNOWN')
BEGIN
  DELETE FROM permit.ORBC_CREDIT_ACCOUNT_TYPE
  WHERE CREDIT_ACCOUNT_TYPE = 'UNKNOWN'
END
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Remove new ETL process type, only if there are no
-- ETL processes that have been run already
IF NOT EXISTS (SELECT 1 FROM tps.ETL_PROCESSES WHERE PROCESS_TYPE = 'CRE')
BEGIN
  DELETE FROM tps.ETL_PROCESS_TYPE
  WHERE PROCESS_TYPE = 'CRE'
END
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Make CFS-specific columns nullable, only if
-- there are no null records in the table already
IF NOT EXISTS (SELECT 1 FROM permit.ORBC_CREDIT_ACCOUNT WHERE CFS_PARTY_NUMBER IS NULL)
BEGIN
  ALTER TABLE permit.ORBC_CREDIT_ACCOUNT
  ALTER COLUMN CFS_PARTY_NUMBER int NOT NULL
END
GO

IF NOT EXISTS (SELECT 1 FROM permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_HIST WHERE IDIR_USER_GUID IS NULL)
BEGIN
  ALTER TABLE permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_HIST
  ALTER COLUMN IDIR_USER_GUID char(32) NOT NULL
END
GO

IF NOT EXISTS (SELECT 1 FROM permit.ORBC_CREDIT_ACCOUNT_ACTIVITY WHERE IDIR_USER_GUID IS NULL)
BEGIN
  ALTER TABLE permit.ORBC_CREDIT_ACCOUNT_ACTIVITY
  ALTER COLUMN IDIR_USER_GUID char(32) NOT NULL
END
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Remove verified flag for TPS migrated accounts
ALTER TRIGGER [permit].[ORBC_CRACC_A_S_IUD_TR] ON [permit].[ORBC_CREDIT_ACCOUNT] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
BEGIN TRY
DECLARE @curr_date datetime;
SET @curr_date = getutcdate();
  IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted) 
    RETURN;

  -- historical
  IF EXISTS(SELECT * FROM deleted)
    update [permit].[ORBC_CREDIT_ACCOUNT_HIST] set END_DATE_HIST = @curr_date where CREDIT_ACCOUNT_ID in (select CREDIT_ACCOUNT_ID from deleted) and END_DATE_HIST is null;
  
  IF EXISTS(SELECT * FROM inserted)
    insert into [permit].[ORBC_CREDIT_ACCOUNT_HIST] ([CREDIT_ACCOUNT_ID], [COMPANY_ID], [CREDIT_ACCOUNT_STATUS_TYPE], [CREDIT_ACCOUNT_TYPE], [CFS_PARTY_NUMBER], [CREDIT_ACCOUNT_NUMBER], [CFS_SITE_NUMBER], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], _CREDIT_ACCOUNT_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
      select [CREDIT_ACCOUNT_ID], [COMPANY_ID], [CREDIT_ACCOUNT_STATUS_TYPE], [CREDIT_ACCOUNT_TYPE], [CFS_PARTY_NUMBER], [CREDIT_ACCOUNT_NUMBER], [CFS_SITE_NUMBER], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], (next value for [permit].[ORBC_CREDIT_ACCOUNT_H_ID_SEQ]) as [_CREDIT_ACCOUNT_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT] DROP CONSTRAINT DF_ORBC_CREDIT_IS_VERIF_DEFAULT
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT] DROP CONSTRAINT DF_ORBC_CREDIT_IS_VERIF_DOMAIN
GO

ALTER TABLE permit.ORBC_CREDIT_ACCOUNT
DROP COLUMN IS_VERIFIED
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO


DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = 'Revert update schema to support TPS credit account migration'

INSERT [dbo].[ORBC_SYS_VERSION] (
	[VERSION_ID]
	,[DESCRIPTION]
	,[RELEASE_DATE]
	)
VALUES (
	68
	,@VersionDescription
	,getutcdate()
	)
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

COMMIT TRANSACTION
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DECLARE @Success AS BIT

SET @Success = 1
SET NOEXEC OFF

IF (@Success = 1)
	PRINT 'The database revert succeeded'
ELSE
BEGIN
	IF @@TRANCOUNT > 0
		ROLLBACK TRANSACTION

	PRINT 'The database revert failed'
END
GO