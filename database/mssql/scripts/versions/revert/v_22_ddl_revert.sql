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

DELETE FROM [access].[ORBC_GROUP_ROLE] WHERE USER_AUTH_GROUP_TYPE IN ('CTPO')
GO
--Downgrade to PPCCLERK from PPC Supervisor
UPDATE [dbo].[ORBC_USER]
SET USER_AUTH_GROUP_TYPE = 'PPCCLERK'
WHERE USER_AUTH_GROUP_TYPE IN ('CTPO')
GO
 --Downgrade to PPCCLERK from PPC Supervisor 
UPDATE [dbo].[ORBC_PENDING_IDIR_USER]
SET USER_AUTH_GROUP_TYPE = 'PPCCLERK' 
WHERE USER_AUTH_GROUP_TYPE IN ('CTPO')
GO

DELETE FROM [access].[ORBC_USER_AUTH_GROUP_TYPE] WHERE USER_AUTH_GROUP_TYPE IN ('CTPO')
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Removing auth groups CTPO'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (21, @VersionDescription, getutcdate())
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

