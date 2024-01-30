SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

CREATE TABLE [dbo].[ORBC_FEATURE_FLAG](	
	[FEATURE_ID] [int] IDENTITY(1,1) NOT NULL,
	[FEATURE_KEY] [nvarchar](50) NOT NULL,
	[FEATURE_VALUE] [nvarchar](50) NOT NULL CHECK (FEATURE_VALUE IN ('ENABLED','DISABLED')),
	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [ORBC_FEATURE_FLAG_PK] PRIMARY KEY CLUSTERED 
(
	[FEATURE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_FEATURE_FLAG', @level2type=N'COLUMN',@level2name=N'FEATURE_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The feature flag' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_FEATURE_FLAG', @level2type=N'COLUMN',@level2name=N'FEATURE_KEY'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The feature value - ENABLED/DISABLED.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_FEATURE_FLAG', @level2type=N'COLUMN',@level2name=N'FEATURE_VALUE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_FEATURE_FLAG', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_FEATURE_FLAG', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_FEATURE_FLAG', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_FEATURE_FLAG', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_FEATURE_FLAG', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

CREATE SEQUENCE [dbo].[ORBC_FEATURE_FLAG_H_ID_SEQ] AS [bigint] START
   WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 50;

CREATE TABLE [dbo].[ORBC_FEATURE_FLAG_HIST] (
   [_FEATURE_FLAG_HIST_ID] [bigint] DEFAULT(NEXT VALUE FOR [dbo].[ORBC_FEATURE_FLAG_H_ID_SEQ]) NOT NULL,
   [EFFECTIVE_DATE_HIST] [datetime] NOT NULL DEFAULT getutcdate(),
   [END_DATE_HIST] [datetime],
   [FEATURE_ID] INT NOT NULL,
   [FEATURE_KEY] NVARCHAR(50) NOT NULL,
   [FEATURE_VALUE] NVARCHAR(50) NOT NULL,
   [APP_CREATE_TIMESTAMP] DATETIME2 NULL,
   [APP_CREATE_USERID] NVARCHAR(30) NULL,
   [APP_CREATE_USER_GUID] CHAR(32) NULL,
   [APP_CREATE_USER_DIRECTORY] NVARCHAR(30) NULL,
   [APP_LAST_UPDATE_TIMESTAMP] DATETIME2 NULL,
   [APP_LAST_UPDATE_USERID] NVARCHAR(30) NULL,
   [APP_LAST_UPDATE_USER_GUID] CHAR(32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] NVARCHAR(30) NULL,
   [CONCURRENCY_CONTROL_NUMBER] INT NULL,
   [DB_CREATE_USERID] VARCHAR(63) NULL,
   [DB_CREATE_TIMESTAMP] DATETIME2 NULL,
   [DB_LAST_UPDATE_USERID] VARCHAR(63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] DATETIME2 NULL
   )

ALTER TABLE [dbo].[ORBC_FEATURE_FLAG_HIST] ADD CONSTRAINT ORBC_8_H_PK PRIMARY KEY CLUSTERED (_FEATURE_FLAG_HIST_ID);

ALTER TABLE [dbo].[ORBC_FEATURE_FLAG_HIST] ADD CONSTRAINT ORBC_8_H_UK UNIQUE (
   _FEATURE_FLAG_HIST_ID,
   END_DATE_HIST
   )
GO

CREATE TRIGGER FEATFL_A_S_IUD_TR ON [dbo].[ORBC_FEATURE_FLAG]
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
      UPDATE [dbo].[ORBC_FEATURE_FLAG_HIST]
      SET END_DATE_HIST = @curr_date
      WHERE FEATURE_ID IN (
            SELECT FEATURE_ID
            FROM deleted
            )
         AND END_DATE_HIST IS NULL;

   IF EXISTS (
         SELECT *
         FROM inserted
         )
      INSERT INTO [dbo].[ORBC_FEATURE_FLAG_HIST] (
         [FEATURE_ID],
         [FEATURE_KEY],
         [FEATURE_VALUE],
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
         [_FEATURE_FLAG_HIST_ID],
         [END_DATE_HIST],
         [EFFECTIVE_DATE_HIST]
         )
      SELECT [FEATURE_ID],
         [FEATURE_KEY],
         [FEATURE_VALUE],
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
         (
            NEXT value FOR [dbo].[ORBC_FEATURE_FLAG_H_ID_SEQ]
            ) AS [_FEATURE_FLAG_HIST_ID],
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

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for feature flag'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (14, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
