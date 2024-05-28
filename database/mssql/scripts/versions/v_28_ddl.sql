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
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE SEQUENCE [permit].[ORBC_CREDIT_ACCOUNT_NUMBER_SEQ] 
 AS [bigint]
 START WITH 5000
 INCREMENT BY 1
 MINVALUE 5000
 MAXVALUE 9999
 CACHE 
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [permit].[ORBC_CREDIT_ACCOUNT_TYPE] (
   [CREDIT_ACCOUNT_TYPE] [nvarchar](10) NOT NULL,
   [DESCRIPTION] [nvarchar](100) NULL,
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_CREDIT_ACCOUNT_TYPE] PRIMARY KEY CLUSTERED ([CREDIT_ACCOUNT_TYPE] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO


-- Descriptions for all ORBC_CREDIT_ACCOUNT_TYPE columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The type of credit account.' , 
   @level0type=N'SCHEMA',
   @level0name=N'permit', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CREDIT_ACCOUNT_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'CREDIT_ACCOUNT_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Description of the credit account type.' , 
   @level0type=N'SCHEMA',
   @level0name=N'permit', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CREDIT_ACCOUNT_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'DESCRIPTION'
-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT_TYPE] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_TYPE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT_TYPE] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_TYPE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT_TYPE] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_TYPE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT_TYPE] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_TYPE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]

-- Insert current known credit account types
IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [permit].[ORBC_CREDIT_ACCOUNT_TYPE] (
   [CREDIT_ACCOUNT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'PREPAID',
   N'Prepaid credit account type'
   )

IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [permit].[ORBC_CREDIT_ACCOUNT_TYPE] (
   [CREDIT_ACCOUNT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'UNSECURED',
   N'Unsecured credit account type'
   )

IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [permit].[ORBC_CREDIT_ACCOUNT_TYPE] (
   [CREDIT_ACCOUNT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'SECURED',
   N'Secured credit account type'
   )
GO


IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [permit].[ORBC_CREDIT_ACCOUNT_STATUS_TYPE] (
   [CREDIT_ACCOUNT_STATUS_TYPE] [nvarchar](10) NOT NULL,
   [DESCRIPTION] [nvarchar](100) NULL,
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_CREDIT_ACCOUNT_STATUS_TYPE] PRIMARY KEY CLUSTERED ([CREDIT_ACCOUNT_STATUS_TYPE] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO


-- Descriptions for all ORBC__CREDIT_ACCOUNT_STATUS_TYPE columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The status of credit account.' , 
   @level0type=N'SCHEMA',
   @level0name=N'permit', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CREDIT_ACCOUNT_STATUS_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'CREDIT_ACCOUNT_STATUS_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Description of the credit account type.' , 
   @level0type=N'SCHEMA',
   @level0name=N'permit', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CREDIT_ACCOUNT_STATUS_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'DESCRIPTION'
-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT_STATUS_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT_STATUS_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT_STATUS_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT_STATUS_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT_STATUS_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT_STATUS_TYPE] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_STATUS_TYPE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT_STATUS_TYPE] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_STATUS_TYPE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT_STATUS_TYPE] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_STATUS_TYPE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT_STATUS_TYPE] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_STATUS_TYPE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]

-- Insert current known credit account types
IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [permit].[ORBC_CREDIT_ACCOUNT_STATUS_TYPE] (
   [CREDIT_ACCOUNT_STATUS_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'ONHOLD',
   N'Credit account status is on hold'
   )

IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [permit].[ORBC_CREDIT_ACCOUNT_STATUS_TYPE] (
   [CREDIT_ACCOUNT_STATUS_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'ACTIVE',
   N'Credit account status is ACTIVE'
   )


IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [permit].[ORBC_CREDIT_ACCOUNT_STATUS_TYPE] (
   [CREDIT_ACCOUNT_STATUS_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'SETUP',
   N'Credit account is being SETUP'
   )

IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [permit].[ORBC_CREDIT_ACCOUNT_STATUS_TYPE] (
   [CREDIT_ACCOUNT_STATUS_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'CLOSED',
   N'Credit account status is Closed'
   )
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [permit].[ORBC_CREDIT_ACCOUNT] (
   [ID] [int] IDENTITY(1, 1) NOT NULL,
   [COMPANY_ID] [int] NOT NULL,
   [CREDIT_ACCOUNT_STATUS_TYPE] [nvarchar](10) NOT NULL,
   [CREDIT_ACCOUNT_TYPE] [nvarchar](10) NOT NULL,
   [CFS_PARTY_NUMBER] [int] NOT NULL,
   [CREDIT_ACCOUNT_NUMBER] [nvarchar](6) NOT NULL,
   [CFS_SITE_NUMBER] [int] NULL,
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_CREATE_USERID] [nvarchar](30) NULL,
   [APP_CREATE_USER_GUID] [char](32) NULL,
   [APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_LAST_UPDATE_USERID] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_CREDIT_ACCOUNT] PRIMARY KEY CLUSTERED ([ID] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The company who is the account holder of the credit account' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'COMPANY_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The status of the credit account - ONHOLD, ACTIVE, CLOSED, SETUP' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'CREDIT_ACCOUNT_STATUS_TYPE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The type of credit account - PREPAID, UNSECURED, SECURED' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'CREDIT_ACCOUNT_TYPE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The primary key of the client in CFS' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'CFS_PARTY_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The primary key of the site associated with the party in CFS' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'CFS_SITE_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_CREDIT_ACCOUNT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT] ADD  CONSTRAINT [DF_ORBC_CREDIT_ACCOUNT_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]


IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT]
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CREDIT_ACCOUNT_COMPANY_ID] 
   FOREIGN KEY ([COMPANY_ID]) 
   REFERENCES [dbo].[ORBC_COMPANY]([COMPANY_ID])

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT] CHECK CONSTRAINT [FK_ORBC_CREDIT_ACCOUNT_COMPANY_ID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT]
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CREDIT_ACCOUNT_CREDIT_ACCOUNT_TYPE] 
   FOREIGN KEY ([CREDIT_ACCOUNT_TYPE]) 
   REFERENCES [permit].[ORBC_CREDIT_ACCOUNT_TYPE]([CREDIT_ACCOUNT_TYPE])


IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT] CHECK CONSTRAINT [FK_ORBC_CREDIT_ACCOUNT_CREDIT_ACCOUNT_TYPE]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT]
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CREDIT_ACCOUNT_CREDIT_ACCOUNT_STATUS_TYPE] 
   FOREIGN KEY ([CREDIT_ACCOUNT_STATUS_TYPE]) 
   REFERENCES [permit].[ORBC_CREDIT_ACCOUNT_STATUS_TYPE]([CREDIT_ACCOUNT_STATUS_TYPE])


IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT] CHECK CONSTRAINT [FK_ORBC_CREDIT_ACCOUNT_CREDIT_ACCOUNT_STATUS_TYPE]




DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Objects for Credit Accounts'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (28, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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

