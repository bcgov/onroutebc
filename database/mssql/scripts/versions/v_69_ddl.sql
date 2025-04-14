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
CREATE TABLE [dbo].[ORBC_OUTAGE_NOTIFICATION] (
	[OUTAGE_NOTIFICATION_ID] [int] IDENTITY(1,1) NOT NULL,
    [TITLE] [nvarchar](255) NOT NULL,
    [MESSAGE] [nvarchar](MAX) NOT NULL,
    [EFFECTIVE_START_TIMESTAMP] [datetime2](7) NOT NULL,
    [EFFECTIVE_END_TIMESTAMP] [datetime2](7) NOT NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (sysutcdatetime()),
	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (sysutcdatetime()),
	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
	 CONSTRAINT [ORBC_OUTAGE_NOTIFICATION_PK] PRIMARY KEY CLUSTERED 
(
	[OUTAGE_NOTIFICATION_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ORBC_OUTAGE_NOTIFICATION] ADD  CONSTRAINT [ORBC_OUTAGE_NOTIFICATION_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [dbo].[ORBC_OUTAGE_NOTIFICATION] ADD  CONSTRAINT [ORBC_OUTAGE_NOTIFICATION_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (sysutcdatetime()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [dbo].[ORBC_OUTAGE_NOTIFICATION] ADD  CONSTRAINT [ORBC_OUTAGE_NOTIFICATION_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [dbo].[ORBC_OUTAGE_NOTIFICATION] ADD  CONSTRAINT [ORBC_OUTAGE_NOTIFICATION_DB_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (sysutcdatetime()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO


EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the outage notification table' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_OUTAGE_NOTIFICATION', @level2type=N'COLUMN',@level2name=N'OUTAGE_NOTIFICATION_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Title for outage notification. For example: Important Notice' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_OUTAGE_NOTIFICATION', @level2type=N'COLUMN',@level2name=N'TITLE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Detailed message for outage notification.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_OUTAGE_NOTIFICATION', @level2type=N'COLUMN',@level2name=N'MESSAGE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Date and time (UTC) when the notification should first appear on the website banner.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_OUTAGE_NOTIFICATION', @level2type=N'COLUMN',@level2name=N'EFFECTIVE_START_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Date and time (UTC) when the notification should be removed from the website banner.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_OUTAGE_NOTIFICATION', @level2type=N'COLUMN',@level2name=N'EFFECTIVE_END_TIMESTAMP'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Create outage notification table'

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
