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

-- Create staging table for credit accounts
CREATE TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNT](
	[CREDIT_ACCOUNT_ID] [bigint] IDENTITY(1,1) NOT NULL,
    [TPS_PKEY] int NOT NULL,
	[CLIENT_HASH] [nvarchar](64) NOT NULL,
	[ACCOUNT_NUMBER] [nvarchar](15) NOT NULL,
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [PK_ORBC_TPS_MIGRATED_CREDIT_ACCOUNT] PRIMARY KEY CLUSTERED 
(
	[CREDIT_ACCOUNT_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID for this credit account migration record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'CREDIT_ACCOUNT_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID for this credit account from TPS.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'TPS_PKEY'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hash of the TPS client number of the credit account owner.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'CLIENT_HASH'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Credit account number.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'ACCOUNT_NUMBER'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the ETL process that created this record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'ETL_PROCESS_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Create staging table for credit account users
CREATE TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_USER](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[CLIENT_HASH] [nvarchar](64) NULL,
	[CREDIT_ACCOUNT_ID] [bigint] NULL,
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [PK_ORBC_TPS_MIGRATED_CREDIT_USER] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_TPS_MIGRATED_CREDIT_USER_CREDIT_ACCOUNT] FOREIGN KEY([CREDIT_ACCOUNT_ID])
REFERENCES [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNT] ([CREDIT_ACCOUNT_ID])
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_USER] CHECK CONSTRAINT [FK_ORBC_TPS_MIGRATED_CREDIT_USER_CREDIT_ACCOUNT]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID for this credit account user migration record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hash of the TPS client number.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'CLIENT_HASH'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the credit account the client is permitted to use.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'CREDIT_ACCOUNT_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the ETL process that created this record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'ETL_PROCESS_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Create temp table to store unposted TPS credit balance and status
CREATE TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_STATUS](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[CREDIT_ACCOUNT_ID] [bigint] NULL,
	[UNPOSTED_TOTAL] [decimal](9, 2) NULL,
	[ACCOUNT_STATUS] [nvarchar](10) NULL,
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [PK_ORBC_TPS_MIGRATED_CREDIT_STATUS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_STATUS]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_TPS_MIGRATED_CREDIT_STATUS_CREDIT_ACCOUNT] FOREIGN KEY([CREDIT_ACCOUNT_ID])
REFERENCES [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNT] ([CREDIT_ACCOUNT_ID])
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_STATUS] CHECK CONSTRAINT [FK_ORBC_TPS_MIGRATED_CREDIT_STATUS_CREDIT_ACCOUNT]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID for this unposted total migration record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the credit account.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'CREDIT_ACCOUNT_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Total dollar amount not yet posted to the financial system.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'UNPOSTED_TOTAL'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Status of the credit account, derived from the status code in TPS.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'ACCOUNT_STATUS'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the ETL process that created this record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'ETL_PROCESS_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Add new credit account activity types
IF NOT EXISTS (SELECT 1 FROM permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_TYPE WHERE CREDIT_ACCOUNT_ACTIVITY_TYPE = 'MIGRATED')
BEGIN
  INSERT INTO permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_TYPE
    (CREDIT_ACCOUNT_ACTIVITY_TYPE, DESCRIPTION)
  VALUES
    ('MIGRATED', 'Migrated')
END
GO

IF NOT EXISTS (SELECT 1 FROM permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_TYPE WHERE CREDIT_ACCOUNT_ACTIVITY_TYPE = 'VERIFIED')
BEGIN
  INSERT INTO permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_TYPE
    (CREDIT_ACCOUNT_ACTIVITY_TYPE, DESCRIPTION)
  VALUES
    ('VERIFIED', 'Account Verified')
END
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Add new 'UNKNOWN' credit account type
IF NOT EXISTS (SELECT 1 FROM permit.ORBC_CREDIT_ACCOUNT_TYPE WHERE CREDIT_ACCOUNT_TYPE = 'UNKNOWN')
BEGIN
  INSERT INTO permit.ORBC_CREDIT_ACCOUNT_TYPE
    (CREDIT_ACCOUNT_TYPE, DESCRIPTION)
  VALUES
    ('UNKNOWN', 'Unknown credit account type')
END
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Add new ETL process type
IF NOT EXISTS (SELECT 1 FROM tps.ETL_PROCESS_TYPE WHERE PROCESS_TYPE = 'CRE')
BEGIN
  INSERT INTO tps.ETL_PROCESS_TYPE
    (PROCESS_TYPE, DESCRIPTION)
  VALUES
    ('CRE', 'Credit Account Data')
END
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Make CFS-specific columns nullable
ALTER TABLE permit.ORBC_CREDIT_ACCOUNT
ALTER COLUMN CFS_PARTY_NUMBER int NULL
GO

ALTER TABLE permit.ORBC_CREDIT_ACCOUNT_HIST
ALTER COLUMN CFS_PARTY_NUMBER int NULL
GO

ALTER TABLE permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_HIST
ALTER COLUMN IDIR_USER_GUID char(32) NULL
GO

ALTER TABLE permit.ORBC_CREDIT_ACCOUNT_ACTIVITY
ALTER COLUMN IDIR_USER_GUID char(32) NULL
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Add verified flag for TPS migrated accounts
-- Add verified flag for TPS migrated accounts
ALTER TABLE permit.ORBC_CREDIT_ACCOUNT
ADD IS_VERIFIED char(1) NULL
GO

-- The IS_VERIFIED column is not removed from the HIST table in
-- the revert script to avoid data loss, so it is only added here
-- if it does not already exist.
IF COL_LENGTH('permit.ORBC_CREDIT_ACCOUNT_HIST', 'IS_VERIFIED') IS NULL
BEGIN
  ALTER TABLE permit.ORBC_CREDIT_ACCOUNT_HIST
  ADD IS_VERIFIED char(1) NULL
END
GO

-- Add external adjustment dollar amount, currently will only be used
-- for TPS migrations to store the unposted credit value, but may be
-- used in future for ad-hoc adjustments if necessary
-- Add verified flag for TPS migrated accounts
ALTER TABLE permit.ORBC_CREDIT_ACCOUNT
ADD EXTERNAL_ADJUSTMENT_AMT decimal(9,2) NULL
GO

-- The EXTERNAL_ADJUSTMENT column is not removed from the HIST table in
-- the revert script to avoid data loss, so it is only added here
-- if it does not already exist.
IF COL_LENGTH('permit.ORBC_CREDIT_ACCOUNT_HIST', 'EXTERNAL_ADJUSTMENT_AMT') IS NULL
BEGIN
  ALTER TABLE permit.ORBC_CREDIT_ACCOUNT_HIST
  ADD EXTERNAL_ADJUSTMENT_AMT decimal(9,2) NULL
END
GO


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
    insert into [permit].[ORBC_CREDIT_ACCOUNT_HIST] ([CREDIT_ACCOUNT_ID], [COMPANY_ID], [CREDIT_ACCOUNT_STATUS_TYPE], [CREDIT_ACCOUNT_TYPE], [CFS_PARTY_NUMBER], [CREDIT_ACCOUNT_NUMBER], [CFS_SITE_NUMBER], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [IS_VERIFIED], [EXTERNAL_ADJUSTMENT_AMT], _CREDIT_ACCOUNT_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
      select [CREDIT_ACCOUNT_ID], [COMPANY_ID], [CREDIT_ACCOUNT_STATUS_TYPE], [CREDIT_ACCOUNT_TYPE], [CFS_PARTY_NUMBER], [CREDIT_ACCOUNT_NUMBER], [CFS_SITE_NUMBER], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [IS_VERIFIED], [EXTERNAL_ADJUSTMENT_AMT], (next value for [permit].[ORBC_CREDIT_ACCOUNT_H_ID_SEQ]) as [_CREDIT_ACCOUNT_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE permit.ORBC_CREDIT_ACCOUNT ADD  CONSTRAINT [DF_ORBC_CREDIT_IS_VERIF_DEFAULT] DEFAULT ('N') FOR IS_VERIFIED
GO

ALTER TABLE permit.ORBC_CREDIT_ACCOUNT  WITH CHECK ADD  CONSTRAINT [DF_ORBC_CREDIT_IS_VERIF_DOMAIN] CHECK ((IS_VERIFIED='N' OR IS_VERIFIED='Y'))
GO

UPDATE permit.ORBC_CREDIT_ACCOUNT
SET IS_VERIFIED = 'N'
GO

ALTER TABLE permit.ORBC_CREDIT_ACCOUNT
ALTER COLUMN IS_VERIFIED char(1) NOT NULL
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Whether the account has been verified after migration from TPS.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'IS_VERIFIED'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Update schema to support TPS credit account migration'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (69, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
IF @@ERROR <> 0 SET NOEXEC ON
GO

COMMIT TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @Success AS BIT
SET @Success = 1
SET NOEXEC OFF
IF (@Success = 1) PRINT 'The database update succeeded'
ELSE BEGIN
   IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
   PRINT 'The database update failed'
END
GO
