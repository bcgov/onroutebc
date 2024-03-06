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

ALTER TABLE [dbo].[ORBC_CONTACT] ALTER COLUMN PHONE_1 VARCHAR(20) NULL
ALTER TABLE [dbo].[ORBC_CONTACT] ALTER COLUMN CITY VARCHAR(100) NULL
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[ORBC_CONTACT_HIST] ALTER COLUMN PHONE_1 VARCHAR(20) NULL
ALTER TABLE [dbo].[ORBC_CONTACT_HIST] ALTER COLUMN CITY VARCHAR(100) NULL
IF @@ERROR <> 0 SET NOEXEC ON
GO

INSERT INTO [dbo].[ORBC_DIRECTORY_TYPE](
   DIRECTORY_TYPE,
   DIRECTORY_NAME
) VALUES (
   'IDIR',
   'BC Staff Directory'
)
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @user_guid CHAR(32),
   @username NVARCHAR(50),
   @first_name NVARCHAR(100),
   @last_name NVARCHAR(100),
   @email NVARCHAR(100),
   @user_status_type VARCHAR(10),
   @user_auth_group_type VARCHAR(10);

DECLARE idir_user_cursor CURSOR FAST_FORWARD
FOR
SELECT USER_GUID,
   USERNAME,
   FIRST_NAME,
   LAST_NAME,
   EMAIL,
   USER_STATUS_TYPE,
   USER_AUTH_GROUP_TYPE
FROM [dbo].[ORBC_IDIR_USER];

OPEN idir_user_cursor;

FETCH NEXT
FROM idir_user_cursor
INTO @user_guid,
   @username,
   @first_name,
   @last_name,
   @email,
   @user_status_type,
   @user_auth_group_type;

WHILE @@FETCH_STATUS = 0
BEGIN
   INSERT INTO [dbo].[ORBC_CONTACT] (
      FIRST_NAME,
      LAST_NAME,
      EMAIL
      )
   VALUES (
      @first_name,
      @last_name,
      @email
      )

   INSERT INTO [dbo].[ORBC_USER] (
      USER_GUID,
      USERNAME,
      USER_DIRECTORY,
      USER_STATUS_TYPE,
      CONTACT_ID,
      USER_AUTH_GROUP_TYPE
      )
   VALUES (
      @user_guid,
      @username,
      'IDIR',
      @user_status_type,
      SCOPE_IDENTITY(),
      @user_auth_group_type
      )

   FETCH NEXT
   FROM idir_user_cursor
   INTO @user_guid,
      @username,
      @first_name,
      @last_name,
      @email,
      @user_status_type,
      @user_auth_group_type;
END

CLOSE idir_user_cursor;

DEALLOCATE idir_user_cursor;
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
	)
)
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

DROP TABLE [dbo].[ORBC_IDIR_USER]
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = 'Merge ORBC_IDIR_USER table into ORBC_USER'

INSERT [dbo].[ORBC_SYS_VERSION] (
   [VERSION_ID],
   [DESCRIPTION],
   [UPDATE_SCRIPT],
   [REVERT_SCRIPT],
   [RELEASE_DATE]
   )
VALUES (
   19,
   @VersionDescription,
   '$(UPDATE_SCRIPT)',
   '$(REVERT_SCRIPT)',
   getutcdate()
   )

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
