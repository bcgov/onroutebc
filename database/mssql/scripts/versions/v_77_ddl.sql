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

-- Drop temp table to store unposted TPS credit balance and status
-- Replace with separate tables for balance and status
DROP TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_STATUS]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Drop staging table for credit account users
-- Replace with similar table with updated schema
DROP TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_USER]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Drop staging table for credit accounts
-- Replace with similar table with updated schema
DROP TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNT]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNT](
	[TPS_PKEY] [bigint] NOT NULL,
	[CLIENT_HASH] [nvarchar](64) NOT NULL,
	[ACCOUNT_NUMBER] [nvarchar](15) NOT NULL,
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[IS_PROCESSED] [bit] NOT NULL,
 CONSTRAINT [PK_ORBC_TPS_MIGRATED_CREDIT_ACCOUNT_1] PRIMARY KEY CLUSTERED 
(
	[TPS_PKEY] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNT] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_CREDIT_ACCOUNT_IS_PROCESSED]  DEFAULT ((0)) FOR [IS_PROCESSED]
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

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicator of whether the staged record has been processed into the main ORBC tables.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'IS_PROCESSED'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_STATUS](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[TPS_PKEY] [bigint] NULL,
	[ACCOUNT_STATUS] [nvarchar](10) NULL,
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[IS_PROCESSED] [bit] NOT NULL,
 CONSTRAINT [PK_ORBC_TPS_MIGRATED_CREDIT_STATUS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_STATUS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_CREDIT_STATUS_IS_PROCESSED]  DEFAULT ((0)) FOR [IS_PROCESSED]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_STATUS]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_TPS_MIGRATED_CREDIT_STATUS_ORBC_TPS_MIGRATED_CREDIT_ACCOUNT] FOREIGN KEY([TPS_PKEY])
REFERENCES [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNT] ([TPS_PKEY])
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_STATUS] CHECK CONSTRAINT [FK_ORBC_TPS_MIGRATED_CREDIT_STATUS_ORBC_TPS_MIGRATED_CREDIT_ACCOUNT]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID for this unposted total migration record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the credit account.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'TPS_PKEY'
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

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicator of whether the staged record has been processed into the main ORBC tables.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_STATUS', @level2type=N'COLUMN',@level2name=N'IS_PROCESSED'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Create new staging table for unposted TPS credit balance
CREATE TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_UNPOSTED](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[TPS_PKEY] [bigint] NULL,
	[UNPOSTED_TOTAL] [decimal](9, 2) NULL,
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[IS_PROCESSED] [bit] NOT NULL,
 CONSTRAINT [PK_ORBC_TPS_MIGRATED_CREDIT_UNPOSTED] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_UNPOSTED] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_CREDIT_UNPOSTED_IS_PROCESSED]  DEFAULT ((0)) FOR [IS_PROCESSED]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_UNPOSTED]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_TPS_MIGRATED_CREDIT_UNPOSTED_ORBC_TPS_MIGRATED_CREDIT_ACCOUNT] FOREIGN KEY([TPS_PKEY])
REFERENCES [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNT] ([TPS_PKEY])
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_UNPOSTED] CHECK CONSTRAINT [FK_ORBC_TPS_MIGRATED_CREDIT_UNPOSTED_ORBC_TPS_MIGRATED_CREDIT_ACCOUNT]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID for this unposted total migration record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_UNPOSTED', @level2type=N'COLUMN',@level2name=N'ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the credit account.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_UNPOSTED', @level2type=N'COLUMN',@level2name=N'TPS_PKEY'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Total dollar amount not yet posted to the financial system.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_UNPOSTED', @level2type=N'COLUMN',@level2name=N'UNPOSTED_TOTAL'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the ETL process that created this record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_UNPOSTED', @level2type=N'COLUMN',@level2name=N'ETL_PROCESS_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_UNPOSTED', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_UNPOSTED', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_UNPOSTED', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_UNPOSTED', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicator of whether the staged record has been processed into the main ORBC tables.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_UNPOSTED', @level2type=N'COLUMN',@level2name=N'IS_PROCESSED'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_USER](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[CLIENT_HASH] [nvarchar](64) NULL,
	[TPS_PKEY] [bigint] NULL,
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[IS_PROCESSED] [bit] NOT NULL,
 CONSTRAINT [PK_ORBC_TPS_MIGRATED_CREDIT_USER] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_USER] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_CREDIT_USER_IS_PROCESSED]  DEFAULT ((0)) FOR [IS_PROCESSED]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_TPS_MIGRATED_CREDIT_USER_ORBC_TPS_MIGRATED_CREDIT_ACCOUNT] FOREIGN KEY([TPS_PKEY])
REFERENCES [tps].[ORBC_TPS_MIGRATED_CREDIT_ACCOUNT] ([TPS_PKEY])
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CREDIT_USER] CHECK CONSTRAINT [FK_ORBC_TPS_MIGRATED_CREDIT_USER_ORBC_TPS_MIGRATED_CREDIT_ACCOUNT]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID for this credit account user migration record.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hash of the TPS client number.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'CLIENT_HASH'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the credit account the client is permitted to use.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'TPS_PKEY'
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

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicator of whether the staged record has been processed into the main ORBC tables.' , @level0type=N'SCHEMA',@level0name=N'tps', @level1type=N'TABLE',@level1name=N'ORBC_TPS_MIGRATED_CREDIT_USER', @level2type=N'COLUMN',@level2name=N'IS_PROCESSED'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE PROCEDURE [tps].[CopyMigratedCreditAccounts]
AS
BEGIN
    SET NOCOUNT ON;

    -- Update COMPANY_ID for if the owner of a credit account has switched
    -- to a different company.
    UPDATE p
    SET p.COMPANY_ID = newC.NEW_COMPANY_ID
    FROM permit.ORBC_CREDIT_ACCOUNT p
    INNER JOIN tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT t ON p.CREDIT_ACCOUNT_NUMBER = t.ACCOUNT_NUMBER
    INNER JOIN dbo.ORBC_COMPANY c ON p.COMPANY_ID = c.COMPANY_ID
	INNER JOIN (
		SELECT cc.COMPANY_ID AS NEW_COMPANY_ID, tt.CLIENT_HASH 
		FROM dbo.ORBC_COMPANY cc 
		INNER JOIN tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT tt ON tt.CLIENT_HASH = cc.TPS_CLIENT_HASH
	) newC ON newC.CLIENT_HASH = t.CLIENT_HASH
    WHERE t.IS_PROCESSED = 0
    AND t.CLIENT_HASH <> c.TPS_CLIENT_HASH;

    -- Update CREDIT_ACCOUNT_NUMBER for if the credit account number has been
    -- changed in TPS but the pkey and company have remained the same
    UPDATE p
    SET p.CREDIT_ACCOUNT_NUMBER = t.ACCOUNT_NUMBER
    FROM permit.ORBC_CREDIT_ACCOUNT p
    INNER JOIN dbo.ORBC_COMPANY c ON p.COMPANY_ID = c.COMPANY_ID
    INNER JOIN tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT t ON c.TPS_CLIENT_HASH = t.CLIENT_HASH
    WHERE t.IS_PROCESSED = 0
    AND t.ACCOUNT_NUMBER <> p.CREDIT_ACCOUNT_NUMBER;

    -- Temporary table to store status updates before modification
    DECLARE @UpdatedAccounts TABLE (CREDIT_ACCOUNT_ID INT, OLD_STATUS VARCHAR(50), NEW_STATUS VARCHAR(50));

    -- Update CREDIT_ACCOUNT_STATUS_TYPE for existing accounts and store previous values
    UPDATE p
    SET p.CREDIT_ACCOUNT_STATUS_TYPE = s.ACCOUNT_STATUS
    OUTPUT INSERTED.CREDIT_ACCOUNT_ID, DELETED.CREDIT_ACCOUNT_STATUS_TYPE, INSERTED.CREDIT_ACCOUNT_STATUS_TYPE
    INTO @UpdatedAccounts
    FROM permit.ORBC_CREDIT_ACCOUNT p
    INNER JOIN tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT t ON p.CREDIT_ACCOUNT_NUMBER = t.ACCOUNT_NUMBER
    INNER JOIN (
        SELECT m.TPS_PKEY, m.ACCOUNT_STATUS
        FROM tps.ORBC_TPS_MIGRATED_CREDIT_STATUS m
        WHERE m.IS_PROCESSED = 0
        AND m.ID = (SELECT MAX(ID) FROM tps.ORBC_TPS_MIGRATED_CREDIT_STATUS WHERE IS_PROCESSED = 0 AND TPS_PKEY = m.TPS_PKEY)
    ) s ON t.TPS_PKEY = s.TPS_PKEY;

    -- Log status changes in ORBC_CREDIT_ACCOUNT_ACTIVITY
    INSERT INTO permit.ORBC_CREDIT_ACCOUNT_ACTIVITY (CREDIT_ACCOUNT_ID, DATE, CREDIT_ACCOUNT_ACTIVITY_TYPE, COMMENTS)
    SELECT 
        ua.CREDIT_ACCOUNT_ID,
        GETUTCDATE(),
        CASE 
            WHEN ua.NEW_STATUS = 'ONHOLD' THEN 'ONHOLD'
            WHEN ua.NEW_STATUS = 'CLOSED' THEN 'CLOSED'
            WHEN ua.NEW_STATUS = 'ACTIVE' AND ua.OLD_STATUS = 'ONHOLD' THEN 'HOLDRMVD'
            WHEN ua.NEW_STATUS = 'ACTIVE' AND ua.OLD_STATUS <> 'ONHOLD' THEN 'REOPENED'
        END,
        ''
    FROM @UpdatedAccounts ua;

    -- Temporary table to store newly inserted records
    DECLARE @InsertedAccounts TABLE (CREDIT_ACCOUNT_ID INT, CREDIT_ACCOUNT_NUMBER VARCHAR(255));

    -- Insert new accounts and store the inserted records
    INSERT INTO permit.ORBC_CREDIT_ACCOUNT (CREDIT_ACCOUNT_NUMBER, COMPANY_ID, CREDIT_ACCOUNT_TYPE, CREDIT_ACCOUNT_STATUS_TYPE)
    OUTPUT INSERTED.CREDIT_ACCOUNT_ID, INSERTED.CREDIT_ACCOUNT_NUMBER INTO @InsertedAccounts
    SELECT 
        t.ACCOUNT_NUMBER,
        c.COMPANY_ID,
        'UNKNOWN',  -- Default CREDIT_ACCOUNT_TYPE
        COALESCE(
            (SELECT TOP 1 s.ACCOUNT_STATUS
             FROM tps.ORBC_TPS_MIGRATED_CREDIT_STATUS s
             WHERE s.IS_PROCESSED = 0 AND s.TPS_PKEY = t.TPS_PKEY
             ORDER BY s.ID DESC),
            'CLOSED' -- Default CREDIT_ACCOUNT_STATUS_TYPE if no match is found
        )
    FROM tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT t
    INNER JOIN dbo.ORBC_COMPANY c ON t.CLIENT_HASH = c.TPS_CLIENT_HASH
    WHERE t.IS_PROCESSED = 0
    AND NOT EXISTS (
        SELECT 1 
        FROM permit.ORBC_CREDIT_ACCOUNT p 
        WHERE p.CREDIT_ACCOUNT_NUMBER = t.ACCOUNT_NUMBER
    );

    -- Insert into ORBC_CREDIT_ACCOUNT_ACTIVITY for each newly added account
    INSERT INTO permit.ORBC_CREDIT_ACCOUNT_ACTIVITY (CREDIT_ACCOUNT_ID, DATE, CREDIT_ACCOUNT_ACTIVITY_TYPE, COMMENTS)
    SELECT 
        ia.CREDIT_ACCOUNT_ID,
        GETUTCDATE(),
        'MIGRATED',
        'Migrated from TPS'
    FROM @InsertedAccounts ia;

    -- Update IS_PROCESSED to 1 for processed records in ORBC_TPS_MIGRATED_CREDIT_ACCOUNT
    UPDATE tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT
    SET IS_PROCESSED = 1
    WHERE IS_PROCESSED = 0;

    -- Update IS_PROCESSED to 1 for processed records in ORBC_TPS_MIGRATED_CREDIT_STATUS
    UPDATE tps.ORBC_TPS_MIGRATED_CREDIT_STATUS
    SET IS_PROCESSED = 1
    WHERE IS_PROCESSED = 0;

    -- Update EXTERNAL_ADJUSTMENT_AMT in ORBC_CREDIT_ACCOUNT
    UPDATE p
    SET p.EXTERNAL_ADJUSTMENT_AMT = COALESCE(u.UNPOSTED_TOTAL, 0)
    FROM permit.ORBC_CREDIT_ACCOUNT p
    INNER JOIN tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT t ON p.CREDIT_ACCOUNT_NUMBER = t.ACCOUNT_NUMBER
    LEFT JOIN tps.ORBC_TPS_MIGRATED_CREDIT_UNPOSTED u ON t.TPS_PKEY = u.TPS_PKEY;

    -- Update IS_PROCESSED to 1 for processed records in ORBC_TPS_MIGRATED_CREDIT_UNPOSTED
    UPDATE tps.ORBC_TPS_MIGRATED_CREDIT_UNPOSTED
    SET IS_PROCESSED = 1
    WHERE IS_PROCESSED = 0;

    -- Activate existing inactive records
    UPDATE permit.ORBC_CREDIT_ACCOUNT_USER
    SET IS_ACTIVE = 'Y'
    WHERE EXISTS (
        SELECT 1
        FROM tps.ORBC_TPS_MIGRATED_CREDIT_USER AS tpu
        JOIN tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT AS tpa 
            ON tpu.TPS_PKEY = tpa.TPS_PKEY
        JOIN permit.ORBC_CREDIT_ACCOUNT AS pca 
            ON tpa.ACCOUNT_NUMBER = pca.CREDIT_ACCOUNT_NUMBER
        JOIN dbo.ORBC_COMPANY AS oc
            ON tpu.CLIENT_HASH = oc.TPS_CLIENT_HASH
        WHERE permit.ORBC_CREDIT_ACCOUNT_USER.COMPANY_ID = oc.COMPANY_ID
            AND permit.ORBC_CREDIT_ACCOUNT_USER.CREDIT_ACCOUNT_ID = pca.CREDIT_ACCOUNT_ID
            AND permit.ORBC_CREDIT_ACCOUNT_USER.IS_ACTIVE = 'N'
    );

    -- Insert new records
    INSERT INTO permit.ORBC_CREDIT_ACCOUNT_USER (COMPANY_ID, CREDIT_ACCOUNT_ID, IS_ACTIVE)
    SELECT DISTINCT oc.COMPANY_ID, pca.CREDIT_ACCOUNT_ID, 'Y'
    FROM tps.ORBC_TPS_MIGRATED_CREDIT_USER AS tpu
    JOIN tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT AS tpa 
        ON tpu.TPS_PKEY = tpa.TPS_PKEY
    JOIN permit.ORBC_CREDIT_ACCOUNT AS pca 
        ON tpa.ACCOUNT_NUMBER = pca.CREDIT_ACCOUNT_NUMBER
    JOIN dbo.ORBC_COMPANY AS oc
        ON tpu.CLIENT_HASH = oc.TPS_CLIENT_HASH
    WHERE NOT EXISTS (
        SELECT 1
        FROM permit.ORBC_CREDIT_ACCOUNT_USER AS pcau
        WHERE pcau.COMPANY_ID = oc.COMPANY_ID
            AND pcau.CREDIT_ACCOUNT_ID = pca.CREDIT_ACCOUNT_ID
    );

    -- Deactivate records no longer matching
    UPDATE permit.ORBC_CREDIT_ACCOUNT_USER
    SET IS_ACTIVE = 'N'
    WHERE IS_ACTIVE = 'Y'
    AND NOT EXISTS (
        SELECT 1
        FROM tps.ORBC_TPS_MIGRATED_CREDIT_USER AS tpu
        JOIN tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT AS tpa 
            ON tpu.TPS_PKEY = tpa.TPS_PKEY
        JOIN permit.ORBC_CREDIT_ACCOUNT AS pca 
            ON tpa.ACCOUNT_NUMBER = pca.CREDIT_ACCOUNT_NUMBER
        JOIN dbo.ORBC_COMPANY AS oc
            ON tpu.CLIENT_HASH = oc.TPS_CLIENT_HASH
        WHERE permit.ORBC_CREDIT_ACCOUNT_USER.COMPANY_ID = oc.COMPANY_ID
            AND permit.ORBC_CREDIT_ACCOUNT_USER.CREDIT_ACCOUNT_ID = pca.CREDIT_ACCOUNT_ID
    );
END;

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Update TPS credit account staging table schemas'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (77, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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
