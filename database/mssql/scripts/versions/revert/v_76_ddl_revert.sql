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

DROP PROCEDURE [tps].[CopyMigratedCreditAccounts]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Drop temp table to store TPS credit status
DROP TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_STATUS]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Drop temp table to store unposted TPS credit balance
DROP TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_UNPOSTED]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
-- Drop staging table for credit account users
DROP TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_USER]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Drop staging table for credit accounts
DROP TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNT]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Recreate the previous versions of the tables

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

IF @@ERROR <> 0
	SET NOEXEC ON
GO


DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting update TPS credit account staging table schemas'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (75, @VersionDescription, getutcdate())
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

COMMIT TRANSACTION
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @Success AS BIT
SET @Success = 1
SET NOEXEC OFF
IF (@Success = 1) PRINT 'The database revert succeeded'
ELSE BEGIN
   IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
   PRINT 'The database revert failed'
END
GO