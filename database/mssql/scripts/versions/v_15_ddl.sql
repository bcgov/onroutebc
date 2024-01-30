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

-- Add IS_SUSPENDED flag to ORBC_COMPANY
ALTER TABLE [dbo].[ORBC_COMPANY]
   ADD [IS_SUSPENDED] [bit] NULL
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Default value for new company records is 0
ALTER TABLE [dbo].[ORBC_COMPANY] 
   ADD CONSTRAINT [DF_ORBC_COMPANY_IS_SUSPENDED] 
      DEFAULT ((0)) 
      FOR [IS_SUSPENDED]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Description of IS_SUSPENDED column
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Whether the company is suspended, 0=not suspended, 1=suspended.',
   @level0type=N'SCHEMA',
   @level0name=N'dbo',
   @level1type=N'TABLE',
   @level1name=N'ORBC_COMPANY',
   @level2type=N'COLUMN',
   @level2name=N'IS_SUSPENDED'
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Alter ORBC_COMPANY_HIST to track new column
ALTER TABLE [dbo].[ORBC_COMPANY_HIST]
   ADD [IS_SUSPENDED] [bit] NULL
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Alter history trigger to populate new column value
ALTER TRIGGER ORBC_COMPNY_A_S_IUD_TR ON [dbo].[ORBC_COMPANY]
FOR INSERT,
   UPDATE,
   DELETE
AS
   SET NOCOUNT ON

   BEGIN TRY
      DECLARE @curr_date DATETIME;

      SET @curr_date = getutcdate();

      IF NOT EXISTS (
            SELECT *
            FROM inserted
            )
         AND NOT EXISTS (
            SELECT *
            FROM deleted
            )
         RETURN;

      -- historical
      IF EXISTS (
            SELECT *
            FROM deleted
            )
         UPDATE [dbo].[ORBC_COMPANY_HIST]
         SET END_DATE_HIST = @curr_date
         WHERE COMPANY_ID IN (
               SELECT COMPANY_ID
               FROM deleted
               )
            AND END_DATE_HIST IS NULL;

      IF EXISTS (
            SELECT *
            FROM inserted
            )
         INSERT INTO [dbo].[ORBC_COMPANY_HIST] (
            [COMPANY_ID],
            [COMPANY_GUID],
            [CLIENT_NUMBER],
            [TPS_CLIENT_HASH],
            [LEGAL_NAME],
            [ALTERNATE_NAME],
            [COMPANY_DIRECTORY],
            [MAILING_ADDRESS_ID],
            [PHONE],
            [EXTENSION],
            [FAX],
            [EMAIL],
            [PRIMARY_CONTACT_ID],
            [ACCOUNT_REGION],
            [ACCOUNT_SOURCE],
            [APP_CREATE_TIMESTAMP],
            [APP_CREATE_USERID],
            [APP_CREATE_USER_GUID],
            [APP_CREATE_USER_DIRECTORY],
            [APP_LAST_UPDATE_TIMESTAMP],
            [APP_LAST_UPDATE_USERID],
            [APP_LAST_UPDATE_USER_GUID],
            [APP_LAST_UPDATE_USER_DIRECTORY],
            [CONCURRENCY_CONTROL_NUMBER],
            [DB_CREATE_USERID],
            [DB_CREATE_TIMESTAMP],
            [DB_LAST_UPDATE_USERID],
            [DB_LAST_UPDATE_TIMESTAMP],
            [IS_SUSPENDED],
            [_COMPANY_HIST_ID],
            [END_DATE_HIST],
            [EFFECTIVE_DATE_HIST]
            )
         SELECT [COMPANY_ID],
            [COMPANY_GUID],
            [CLIENT_NUMBER],
            [TPS_CLIENT_HASH],
            [LEGAL_NAME],
            [ALTERNATE_NAME],
            [COMPANY_DIRECTORY],
            [MAILING_ADDRESS_ID],
            [PHONE],
            [EXTENSION],
            [FAX],
            [EMAIL],
            [PRIMARY_CONTACT_ID],
            [ACCOUNT_REGION],
            [ACCOUNT_SOURCE],
            [APP_CREATE_TIMESTAMP],
            [APP_CREATE_USERID],
            [APP_CREATE_USER_GUID],
            [APP_CREATE_USER_DIRECTORY],
            [APP_LAST_UPDATE_TIMESTAMP],
            [APP_LAST_UPDATE_USERID],
            [APP_LAST_UPDATE_USER_GUID],
            [APP_LAST_UPDATE_USER_DIRECTORY],
            [CONCURRENCY_CONTROL_NUMBER],
            [DB_CREATE_USERID],
            [DB_CREATE_TIMESTAMP],
            [DB_LAST_UPDATE_USERID],
            [DB_LAST_UPDATE_TIMESTAMP],
            [IS_SUSPENDED],
            (
               NEXT value FOR [dbo].[ORBC_COMPANY_H_ID_SEQ]
               ) AS [_COMPANY_HIST_ID],
            NULL AS [END_DATE_HIST],
            @curr_date AS [EFFECTIVE_DATE_HIST]
         FROM inserted;
   END TRY

   BEGIN CATCH
      IF @@trancount > 0
         ROLLBACK TRANSACTION

      EXEC orbc_error_handling
   END CATCH;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Set value of 0 for all existing companies
UPDATE [dbo].[ORBC_COMPANY]
   SET [IS_SUSPENDED] = 0
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Alter column to be non-nullable
ALTER TABLE [dbo].[ORBC_COMPANY]
   ALTER COLUMN [IS_SUSPENDED] [bit] NOT NULL
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Add table to store types of suspension action (suspend, unsuspend, etc)
-- May in future have a simple 'COMMENT' type or other
CREATE TABLE [dbo].[ORBC_SUSPEND_ACTIVITY_TYPE] (
   [SUSPEND_ACTIVITY_TYPE] [nvarchar](10) NOT NULL,
   [DESCRIPTION] [nvarchar](100) NULL,
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_SUSPEND_ACTIVITY_TYPE] PRIMARY KEY CLUSTERED ([SUSPEND_ACTIVITY_TYPE] ASC) WITH (
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

-- Default values for audit columns (boilerplate)
ALTER TABLE [dbo].[ORBC_SUSPEND_ACTIVITY_TYPE] ADD  CONSTRAINT [DF_ORBC_SUSPEND_ACTIVITY_TYPE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_SUSPEND_ACTIVITY_TYPE] ADD  CONSTRAINT [DF_ORBC_SUSPEND_ACTIVITY_TYPE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_SUSPEND_ACTIVITY_TYPE] ADD  CONSTRAINT [DF_ORBC_SUSPEND_ACTIVITY_TYPE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_SUSPEND_ACTIVITY_TYPE] ADD  CONSTRAINT [DF_ORBC_SUSPEND_ACTIVITY_TYPE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Descriptions for all ORBC_SUSPEND_ACTIVITY_TYPE columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The type of activity being performed.' , 
   @level0type=N'SCHEMA',
   @level0name=N'dbo', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_SUSPEND_ACTIVITY_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'SUSPEND_ACTIVITY_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Description of the activity type.' , 
   @level0type=N'SCHEMA',
   @level0name=N'dbo', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_SUSPEND_ACTIVITY_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'DESCRIPTION'
-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_SUSPEND_ACTIVITY_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_SUSPEND_ACTIVITY_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_SUSPEND_ACTIVITY_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_SUSPEND_ACTIVITY_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_SUSPEND_ACTIVITY_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Insert both current known activity types
INSERT [dbo].[ORBC_SUSPEND_ACTIVITY_TYPE] (
   [SUSPEND_ACTIVITY_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'SUSPEND',
   N'Suspend the company'
   )
GO
INSERT [dbo].[ORBC_SUSPEND_ACTIVITY_TYPE] (
   [SUSPEND_ACTIVITY_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'UNSUSPEND',
   N'Remove the company suspension'
   )
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Add suspension activity table for suspension history
CREATE TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY] (
   [ACTIVITY_ID] [int] IDENTITY(1, 1) NOT NULL,
   [COMPANY_ID] [int] NOT NULL,
   [IDIR_USER_GUID] [char](32) NOT NULL,
   [DATE] [datetime2](7) NOT NULL,
   [SUSPEND_ACTIVITY_TYPE] [nvarchar](10) NOT NULL,
   [COMMENTS] [nvarchar](max) NULL,
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
   CONSTRAINT [PK_ORBC_COMPANY_SUSPEND_ACTIVITY] PRIMARY KEY CLUSTERED ([ACTIVITY_ID] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Default values
ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY] 
   ADD CONSTRAINT [DF_ORBC_COMPANY_SUSPEND_ACTIVITY_DATE] 
   DEFAULT(getutcdate())
   FOR [DATE]
GO
-- Default values for audit columns (boilerplate)
ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY] ADD  CONSTRAINT [DF_ORBC_COMPANY_SUSPEND_ACTIVITY_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY] ADD  CONSTRAINT [DF_ORBC_COMPANY_SUSPEND_ACTIVITY_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY] ADD  CONSTRAINT [DF_ORBC_COMPANY_SUSPEND_ACTIVITY_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY] ADD  CONSTRAINT [DF_ORBC_COMPANY_SUSPEND_ACTIVITY_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- FK constraints
ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY]  
   WITH CHECK ADD  CONSTRAINT [FK_ORBC_COMPANY_SUSPEND_ACTIVITY_ORBC_COMPANY] 
   FOREIGN KEY([COMPANY_ID])
   REFERENCES [dbo].[ORBC_COMPANY] ([COMPANY_ID])
GO
ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY] CHECK CONSTRAINT [FK_ORBC_COMPANY_SUSPEND_ACTIVITY_ORBC_COMPANY]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY]
   WITH CHECK ADD CONSTRAINT [FK_ORBC_COMPANY_SUSPEND_ACTIVITY_SUSPEND_ACTIVITY_TYPE] 
   FOREIGN KEY ([SUSPEND_ACTIVITY_TYPE]) 
   REFERENCES [dbo].[ORBC_SUSPEND_ACTIVITY_TYPE]([SUSPEND_ACTIVITY_TYPE])
GO
ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY] 
   CHECK CONSTRAINT [FK_ORBC_COMPANY_SUSPEND_ACTIVITY_SUSPEND_ACTIVITY_TYPE]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Descriptions for all ORBC_COMPANY_SUSPEND_ACTIVITY columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Surrogate auto-generated primary key.' , 
   @level0type=N'SCHEMA',
   @level0name=N'dbo', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'ACTIVITY_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'ID of the company that this activity relates to.' , 
   @level0type=N'SCHEMA',
   @level0name=N'dbo', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'COMPANY_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'GUID of the IDIR user performing the activity.' , 
   @level0type=N'SCHEMA',
   @level0name=N'dbo', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'IDIR_USER_GUID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Date the activity was actioned.' , 
   @level0type=N'SCHEMA',
   @level0name=N'dbo', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'DATE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Type of activity (e.g. SUSPEND, UNSUSPEND).' , 
   @level0type=N'SCHEMA',
   @level0name=N'dbo', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'SUSPEND_ACTIVITY_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Freeform comments, typically to indicate the reason for suspension.' , 
   @level0type=N'SCHEMA',
   @level0name=N'dbo', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'COMMENTS'
-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_COMPANY_SUSPEND_ACTIVITY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Audit history tables and triggers
CREATE SEQUENCE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY_H_ID_SEQ] AS [bigint] START
   WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 50;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY_HIST] (
   [_COMPANY_SUSPEND_ACTIVITY_HIST_ID] [bigint] DEFAULT(NEXT VALUE FOR [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY_H_ID_SEQ]) NOT NULL,
   [EFFECTIVE_DATE_HIST] [datetime] NOT NULL DEFAULT getutcdate(),
   [END_DATE_HIST] [datetime],
   [ACTIVITY_ID] INT NOT NULL,
   [COMPANY_ID] INT NOT NULL,
   [IDIR_USER_GUID] CHAR(32) NOT NULL,
   [DATE] DATETIME2 NOT NULL,
   [SUSPEND_ACTIVITY_TYPE] NVARCHAR(10) NOT NULL,
   [CONCURRENCY_CONTROL_NUMBER] INT NULL,
   [APP_CREATE_TIMESTAMP] DATETIME2 NULL,
   [APP_CREATE_USERID] NVARCHAR(30) NULL,
   [APP_CREATE_USER_GUID] CHAR(32) NULL,
   [APP_CREATE_USER_DIRECTORY] NVARCHAR(30) NULL,
   [APP_LAST_UPDATE_TIMESTAMP] DATETIME2 NULL,
   [APP_LAST_UPDATE_USERID] NVARCHAR(30) NULL,
   [APP_LAST_UPDATE_USER_GUID] CHAR(32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] NVARCHAR(30) NULL,
   [DB_CREATE_USERID] VARCHAR(63) NULL,
   [DB_CREATE_TIMESTAMP] DATETIME2 NULL,
   [DB_LAST_UPDATE_USERID] VARCHAR(63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] DATETIME2 NULL
   )

ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY_HIST] ADD CONSTRAINT ORBC_3_H_PK PRIMARY KEY CLUSTERED (_COMPANY_SUSPEND_ACTIVITY_HIST_ID);

ALTER TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY_HIST] ADD CONSTRAINT ORBC_3_H_UK UNIQUE (
   _COMPANY_SUSPEND_ACTIVITY_HIST_ID,
   END_DATE_HIST
   )
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TRIGGER CSA3_A_S_IUD_TR ON [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY]
FOR INSERT,
   UPDATE,
   DELETE
AS
   SET NOCOUNT ON

   BEGIN TRY
      DECLARE @curr_date DATETIME;

      SET @curr_date = getutcdate();

      IF NOT EXISTS (
            SELECT *
            FROM inserted
            )
         AND NOT EXISTS (
            SELECT *
            FROM deleted
            )
         RETURN;

      -- historical
      IF EXISTS (
            SELECT *
            FROM deleted
            )
         UPDATE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY_HIST]
         SET END_DATE_HIST = @curr_date
         WHERE ACTIVITY_ID IN (
               SELECT ACTIVITY_ID
               FROM deleted
               )
            AND END_DATE_HIST IS NULL;

      IF EXISTS (
            SELECT *
            FROM inserted
            )
         INSERT INTO [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY_HIST] (
            [ACTIVITY_ID],
            [COMPANY_ID],
            [IDIR_USER_GUID],
            [DATE],
            [SUSPEND_ACTIVITY_TYPE],
            [CONCURRENCY_CONTROL_NUMBER],
            [APP_CREATE_TIMESTAMP],
            [APP_CREATE_USERID],
            [APP_CREATE_USER_GUID],
            [APP_CREATE_USER_DIRECTORY],
            [APP_LAST_UPDATE_TIMESTAMP],
            [APP_LAST_UPDATE_USERID],
            [APP_LAST_UPDATE_USER_GUID],
            [APP_LAST_UPDATE_USER_DIRECTORY],
            [DB_CREATE_USERID],
            [DB_CREATE_TIMESTAMP],
            [DB_LAST_UPDATE_USERID],
            [DB_LAST_UPDATE_TIMESTAMP],
            [_COMPANY_SUSPEND_ACTIVITY_HIST_ID],
            [END_DATE_HIST],
            [EFFECTIVE_DATE_HIST]
            )
         SELECT [ACTIVITY_ID],
            [COMPANY_ID],
            [IDIR_USER_GUID],
            [DATE],
            [SUSPEND_ACTIVITY_TYPE],
            [CONCURRENCY_CONTROL_NUMBER],
            [APP_CREATE_TIMESTAMP],
            [APP_CREATE_USERID],
            [APP_CREATE_USER_GUID],
            [APP_CREATE_USER_DIRECTORY],
            [APP_LAST_UPDATE_TIMESTAMP],
            [APP_LAST_UPDATE_USERID],
            [APP_LAST_UPDATE_USER_GUID],
            [APP_LAST_UPDATE_USER_DIRECTORY],
            [DB_CREATE_USERID],
            [DB_CREATE_TIMESTAMP],
            [DB_LAST_UPDATE_USERID],
            [DB_LAST_UPDATE_TIMESTAMP],
            (
               NEXT value FOR [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY_H_ID_SEQ]
               ) AS [_COMPANY_SUSPEND_ACTIVITY_HIST_ID],
            NULL AS [END_DATE_HIST],
            @curr_date AS [EFFECTIVE_DATE_HIST]
         FROM inserted;
   END TRY

   BEGIN CATCH
      IF @@trancount > 0
         ROLLBACK TRANSACTION

      EXEC orbc_error_handling
   END CATCH;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Allow for company suspensions'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (15, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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

