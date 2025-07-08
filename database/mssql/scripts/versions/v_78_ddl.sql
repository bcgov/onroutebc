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

/** ORBC_LOGIN captures login information for all users, including BCeID and IDIR.
* The table does not have any foreign key constraints to ORBC_USER or ORBC_COMPANY
* as it may represent a new user. */
IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [dbo].[ORBC_LOGIN] (
	[LOGIN_ID] [int] IDENTITY(1,1) NOT NULL,
	[USERNAME] [nvarchar](50) NOT NULL,
    [USER_GUID] [char](32) NOT NULL,	
	[COMPANY_GUID] [char](32) NULL,
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

ALTER TABLE [dbo].[ORBC_LOGIN] ADD  CONSTRAINT [ORBC_LOGIN_LOGIN_DATE_TIME_DF]  DEFAULT (getutcdate()) FOR [LOGIN_DATE_TIME]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[ORBC_LOGIN] ADD  CONSTRAINT [ORBC_LOGIN_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [dbo].[ORBC_LOGIN] ADD  CONSTRAINT [ORBC_LOGIN_DB_CREATE_TIMESTAMP_DEF] DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [dbo].[ORBC_LOGIN] ADD  CONSTRAINT [ORBC_LOGIN_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [dbo].[ORBC_LOGIN] ADD  CONSTRAINT [ORBC_LOGIN_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Details of user login.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the login table' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'LOGIN_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'GUID of the user, coming from bceid, bcsc or IDIR' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'USER_GUID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'User''s business bcied  as set in bceid' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'COMPANY_GUID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'User''s username as set in bceid, bcsc or IDIR' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'USERNAME'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'User''s email as set in bceid, bcsc or IDIR' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'EMAIL'

IF @@ERROR <> 0 SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_LOGIN', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE SEQUENCE [dbo].[ORBC_LOGIN_H_ID_SEQ] AS [bigint] START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 50;

IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [dbo].[ORBC_LOGIN_HIST](
  _LOGIN_HIST_ID [bigint] DEFAULT (NEXT VALUE FOR [dbo].[ORBC_LOGIN_H_ID_SEQ]) NOT NULL
  ,EFFECTIVE_DATE_HIST [datetime] NOT NULL default getutcdate()
  ,END_DATE_HIST [datetime]
  , [LOGIN_ID] int NOT NULL, [USERNAME] nvarchar(50) NOT NULL, [USER_GUID] char(32) NOT NULL, [COMPANY_GUID] char(32) NULL, [EMAIL] nvarchar(100) NULL, [LOGIN_DATE_TIME] datetime2 NOT NULL, [APP_CREATE_TIMESTAMP] datetime2 NULL, [APP_CREATE_USERID] nvarchar(30) NULL, [APP_CREATE_USER_GUID] char(32) NULL, [APP_CREATE_USER_DIRECTORY] nvarchar(30) NULL, [APP_LAST_UPDATE_TIMESTAMP] datetime2 NULL, [APP_LAST_UPDATE_USERID] nvarchar(30) NULL, [APP_LAST_UPDATE_USER_GUID] char(32) NULL, [APP_LAST_UPDATE_USER_DIRECTORY] nvarchar(30) NULL, [CONCURRENCY_CONTROL_NUMBER] int NULL, [DB_CREATE_USERID] varchar(63) NOT NULL, [DB_CREATE_TIMESTAMP] datetime2 NOT NULL, [DB_LAST_UPDATE_USERID] varchar(63) NOT NULL, [DB_LAST_UPDATE_TIMESTAMP] datetime2 NOT NULL
  )

IF @@ERROR <> 0 SET NOEXEC ON
GO
-- Create primary key constraint ORBC_LOGIN_HIST_PK
PRINT N'Create Primary constraint ORBC_LOGIN_HIST_PK'  
ALTER TABLE [dbo].[ORBC_LOGIN_HIST] ADD CONSTRAINT ORBC_LOGIN_HIST_PK PRIMARY KEY CLUSTERED (_LOGIN_HIST_ID);  
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
-- Create unique key constraint ORBC_LOGIN_HIST_UK
PRINT N'Create unique constraint ORBC_LOGIN_HIST_UK'  
ALTER TABLE [dbo].[ORBC_LOGIN_HIST] ADD CONSTRAINT ORBC_LOGIN_HIST_UK UNIQUE (_LOGIN_HIST_ID,END_DATE_HIST)
GO


PRINT N'Create trigger dbo.ORBC_LOGIN_I_S_U_TR'

IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TRIGGER ORBC_LOGIN_I_S_U_TR ON [dbo].[ORBC_LOGIN] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
BEGIN TRY
DECLARE @curr_date datetime;
SET @curr_date = getutcdate();
  IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted) 
    RETURN;

  -- historical
  IF EXISTS(SELECT * FROM deleted)
    update [dbo].[ORBC_LOGIN_HIST] set END_DATE_HIST = @curr_date where LOGIN_ID in (select LOGIN_ID from deleted) and END_DATE_HIST is null;
  
  IF EXISTS(SELECT * FROM inserted)
    insert into [dbo].[ORBC_LOGIN_HIST] ([LOGIN_ID], [USERNAME], [USER_GUID], [COMPANY_GUID], [EMAIL], [LOGIN_DATE_TIME], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], _LOGIN_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
      select [LOGIN_ID], [USERNAME], [USER_GUID], [COMPANY_GUID], [EMAIL], [LOGIN_DATE_TIME], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], (next value for [dbo].[ORBC_LOGIN_H_ID_SEQ]) as [_LOGIN_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
go

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Create ORBC_LOGIN table and associated components to track user login'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (78, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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