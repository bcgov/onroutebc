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

/** ORBC_LOGIN captures login information of all users, including BCeID and IDIR.
* The table does not have any foreign key constraints to ORBC_USER or ORBC_COMPANY
* as it may represent a new user. */
IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [dbo].[ORBC_LOGIN] (
	[LOGIN_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[USER_DIRECTORY] [varchar](10) NOT NULL,
	[USERNAME] [nvarchar](50) NOT NULL,
	[USER_GUID] [char](32) NOT NULL,
	[COMPANY_GUID] [char](32) NULL,
	[COMPANY_LEGAL_NAME] [nvarchar](500) NULL,
	[EMAIL] [nvarchar](100) NULL,
	[LOGIN_DATE_TIME] [datetime2](7) NOT NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL
	 CONSTRAINT [ORBC_LOGIN_PK] PRIMARY KEY CLUSTERED 
(
	[LOGIN_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[ORBC_LOGIN] ADD  CONSTRAINT [DF_ORBC_LOGIN_LOGIN_DATE_TIME]  DEFAULT (getutcdate()) FOR [LOGIN_DATE_TIME]

IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[ORBC_LOGIN]  WITH CHECK ADD  CONSTRAINT [ORBC_LOGIN_USER_DIRECTORY_FK] FOREIGN KEY([USER_DIRECTORY])
REFERENCES [dbo].[ORBC_DIRECTORY_TYPE] ([DIRECTORY_TYPE])

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[ORBC_LOGIN] CHECK CONSTRAINT [ORBC_LOGIN_USER_DIRECTORY_FK]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[ORBC_LOGIN] 
ADD CONSTRAINT [ORBC_LOGIN_USER_DIRECTORY_USER_GUID_LOGIN_DATE_TIME_UNIQUE] UNIQUE ([USER_DIRECTORY], [USER_GUID], [LOGIN_DATE_TIME]) ;  


IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[ORBC_LOGIN] ADD  CONSTRAINT [ORBC_LOGIN_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [dbo].[ORBC_LOGIN] ADD  CONSTRAINT [ORBC_LOGIN_DB_CREATE_TIMESTAMP_DEF] DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [dbo].[ORBC_LOGIN] ADD  CONSTRAINT [ORBC_LOGIN_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [dbo].[ORBC_LOGIN] ADD  CONSTRAINT [ORBC_LOGIN_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Details of user login. It captures a snapshot of certain fields from the user token. One record per login' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the login table' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'LOGIN_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Origin of the user, whether bceid, business bceid, bcsc or IDIR' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'USER_DIRECTORY'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'GUID of the user, coming from bceid, bcsc or IDIR' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'USER_GUID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'User''s business bcied  as set in user token or COMPANY_GUID as set in ORBC_COMPANY for non Business BCeid users.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'COMPANY_GUID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'User''s username as set in bceid, bcsc or IDIR' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'USERNAME'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'User''s email as set in bceid, bcsc or IDIR' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'EMAIL'

IF @@ERROR <> 0 SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created by the application.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The userid of the application user that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The guid of the application user that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory of the application user that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was last updated by the application.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The guid of the application user that last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory of the application user that last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Create ORBC_LOGIN table and associated components to track user login'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (79, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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