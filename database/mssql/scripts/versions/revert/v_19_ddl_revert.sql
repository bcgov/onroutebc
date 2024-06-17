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

CREATE TABLE [dbo].[ORBC_IDIR_USER](
	[USER_GUID] [char](32) NOT NULL,
	[USERNAME] [nvarchar](50) NOT NULL,
	[FIRST_NAME] [nvarchar](100) NULL,
	[LAST_NAME] [nvarchar](100) NULL,
	[EMAIL] [nvarchar](100) NOT NULL,
	[USER_STATUS_TYPE] [varchar](10) NOT NULL,
	[USER_AUTH_GROUP_TYPE] [varchar](10) NULL,
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
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_IDIR_USER] PRIMARY KEY CLUSTERED 
(
	[USER_GUID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[ORBC_IDIR_USER] WITH CHECK ADD  CONSTRAINT CK_IS_NOT_NULL CHECK (FIRST_NAME IS NOT NULL OR LAST_NAME IS NOT NULL);
ALTER TABLE [dbo].[ORBC_IDIR_USER] ADD  CONSTRAINT [DF_ORBC_IDIR_USER_USER_STATUS_TYPE]  DEFAULT ('ACTIVE') FOR [USER_STATUS_TYPE]
ALTER TABLE [dbo].[ORBC_IDIR_USER] ADD  CONSTRAINT [DF_ORBC_IDIR_USER_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [dbo].[ORBC_IDIR_USER] ADD  CONSTRAINT [DF_ORBC_IDIR_USER_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [dbo].[ORBC_IDIR_USER] ADD  CONSTRAINT [DF_ORBC_IDIR_USER_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [dbo].[ORBC_IDIR_USER] ADD  CONSTRAINT [DF_ORBC_IDIR_USER_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
ALTER TABLE [dbo].[ORBC_IDIR_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_IDIR_USER_USER_AUTH_GROUP] FOREIGN KEY([USER_AUTH_GROUP_TYPE])
REFERENCES [access].[ORBC_USER_AUTH_GROUP_TYPE] ([USER_AUTH_GROUP_TYPE])
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Create trigger dbo.ORBC_IDRUSR_A_S_IUD_TR
PRINT N'Create trigger dbo.ORBC_IDRUSR_A_S_IUD_TR'
GO
CREATE TRIGGER [dbo].[ORBC_IDRUSR_A_S_IUD_TR] ON dbo.[ORBC_IDIR_USER] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
BEGIN TRY
DECLARE @curr_date datetime;
SET @curr_date = getutcdate();
  IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted) 
    RETURN;

  -- historical
  IF EXISTS(SELECT * FROM deleted)
    update [dbo].[ORBC_IDIR_USER_HIST] set END_DATE_HIST = @curr_date where USER_GUID in (select USER_GUID from deleted) and END_DATE_HIST is null;
  
  IF EXISTS(SELECT * FROM inserted)
    insert into [dbo].[ORBC_IDIR_USER_HIST] ([USER_GUID], [USERNAME], [FIRST_NAME], [LAST_NAME], [EMAIL], [USER_STATUS_TYPE], [USER_AUTH_GROUP_TYPE], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], _IDIR_USER_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
      select [USER_GUID], [USERNAME], [FIRST_NAME], [LAST_NAME], [EMAIL], [USER_STATUS_TYPE], [USER_AUTH_GROUP_TYPE], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], (next value for [dbo].[ORBC_IDIR_USER_H_ID_SEQ]) as [_IDIR_USER_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Create trigger dbo.ORBC_IDRUSR_I_S_U_TR
PRINT N'Create trigger dbo.ORBC_IDRUSR_I_S_U_TR'
GO
CREATE TRIGGER [dbo].[ORBC_IDRUSR_I_S_U_TR] ON dbo.[ORBC_IDIR_USER] INSTEAD OF UPDATE AS
SET NOCOUNT ON
BEGIN TRY
  IF NOT EXISTS(SELECT * FROM deleted) 
    RETURN;

  -- validate concurrency control
  if exists (select 1 from inserted, deleted where inserted.CONCURRENCY_CONTROL_NUMBER != deleted.CONCURRENCY_CONTROL_NUMBER+1 AND inserted.USER_GUID = deleted.USER_GUID)
    raiserror('CONCURRENCY FAILURE.',16,1)


  -- update statement
  update [dbo].[ORBC_IDIR_USER]
    set "USER_GUID" = inserted."USER_GUID",
      "USERNAME" = inserted."USERNAME",
      "FIRST_NAME" = inserted."FIRST_NAME",
      "LAST_NAME" = inserted."LAST_NAME",
      "EMAIL" = inserted."EMAIL",
      "USER_STATUS_TYPE" = inserted."USER_STATUS_TYPE",
      "USER_AUTH_GROUP_TYPE" = inserted."USER_AUTH_GROUP_TYPE",
      "APP_LAST_UPDATE_TIMESTAMP" = inserted."APP_LAST_UPDATE_TIMESTAMP",
      "APP_LAST_UPDATE_USERID" = inserted."APP_LAST_UPDATE_USERID",
      "APP_LAST_UPDATE_USER_GUID" = inserted."APP_LAST_UPDATE_USER_GUID",
      "APP_LAST_UPDATE_USER_DIRECTORY" = inserted."APP_LAST_UPDATE_USER_DIRECTORY",
      "CONCURRENCY_CONTROL_NUMBER" = inserted."CONCURRENCY_CONTROL_NUMBER"
    , DB_LAST_UPDATE_TIMESTAMP = getutcdate()
    , DB_LAST_UPDATE_USERID = user_name()
    from [dbo].[ORBC_IDIR_USER]
    inner join inserted
    on (ORBC_IDIR_USER.USER_GUID = inserted.USER_GUID);

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

DISABLE TRIGGER [dbo].[ORBC_IDRUSR_I_S_U_TR] ON dbo.[ORBC_IDIR_USER]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Create a function to return the full set of roles a user has in the system
-- for a given company. Can accept DEFAULT as the companyId parameter if no
-- company context is needed - this gives just the global roles in return.
ALTER FUNCTION [access].[ORBC_GET_ROLES_FOR_USER_FN] (@userGuid char(32), @companyId int = 0)
RETURNS TABLE 
AS 
RETURN 
(
	-- Union the global roles and the company-specific roles
	SELECT DISTINCT ROLE_TYPE FROM ORBC_GROUP_ROLE WHERE USER_AUTH_GROUP_TYPE IN (
		SELECT USER_AUTH_GROUP_TYPE FROM ORBC_USER WHERE ORBC_USER.USER_GUID = @userGuid
		UNION
		SELECT USER_AUTH_GROUP_TYPE FROM ORBC_COMPANY_USER WHERE ORBC_COMPANY_USER.USER_GUID = @userGuid
		AND ORBC_COMPANY_USER.COMPANY_ID = @companyId
		UNION 
		SELECT USER_AUTH_GROUP_TYPE FROM ORBC_IDIR_USER WHERE ORBC_IDIR_USER.USER_GUID = @userGuid
	)
)
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @user_guid CHAR(32),
   @username NVARCHAR(50),
   @first_name NVARCHAR(100),
   @last_name NVARCHAR(100),
   @email NVARCHAR(100),
   @user_status_type VARCHAR(10),
   @user_auth_group_type VARCHAR(10),
   @contact_id INT;

DECLARE idir_user_cursor CURSOR FAST_FORWARD
FOR
SELECT u.USER_GUID,
   u.USERNAME,
   c.FIRST_NAME,
   c.LAST_NAME,
   c.EMAIL,
   u.USER_STATUS_TYPE,
   u.USER_AUTH_GROUP_TYPE,
   c.CONTACT_ID
FROM [dbo].[ORBC_USER] u, [dbo].[ORBC_CONTACT] c
WHERE u.CONTACT_ID = c.CONTACT_ID
AND u.USER_DIRECTORY = 'IDIR';

OPEN idir_user_cursor;

FETCH NEXT
FROM idir_user_cursor
INTO @user_guid,
   @username,
   @first_name,
   @last_name,
   @email,
   @user_status_type,
   @user_auth_group_type,
   @contact_id;

WHILE @@FETCH_STATUS = 0
BEGIN
   INSERT INTO [dbo].[ORBC_IDIR_USER] (
      USER_GUID,
      USERNAME,
      FIRST_NAME,
      LAST_NAME,
      EMAIL,
      USER_STATUS_TYPE,
      USER_AUTH_GROUP_TYPE
      )
   VALUES (
      @user_guid,
      @username,
      @first_name,
      @last_name,
      @email,
      @user_status_type,
      @user_auth_group_type
      )

   DELETE FROM [dbo].[ORBC_USER]
      WHERE CONTACT_ID = @contact_id
   DELETE FROM [dbo].[ORBC_CONTACT]
      WHERE CONTACT_ID = @contact_id

   FETCH NEXT
   FROM idir_user_cursor
   INTO @user_guid,
      @username,
      @first_name,
      @last_name,
      @email,
      @user_status_type,
      @user_auth_group_type,
      @contact_id;
END

CLOSE idir_user_cursor;

DEALLOCATE idir_user_cursor;
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DELETE FROM [dbo].[ORBC_DIRECTORY_TYPE]
   WHERE DIRECTORY_TYPE = 'IDIR'
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[ORBC_CONTACT] ALTER COLUMN PHONE_1 VARCHAR(20) NOT NULL
ALTER TABLE [dbo].[ORBC_CONTACT] ALTER COLUMN CITY VARCHAR(100) NOT NULL
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Note we are not reverting the change to the ORBC_CONTACT_HIST table to
-- set it back again to NOT NULL, since there will be historical NULL values
-- in those columns that we want to maintain.

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting merge of ORBC_IDIR_USER table into ORBC_USER'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (18, @VersionDescription, getutcdate())
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