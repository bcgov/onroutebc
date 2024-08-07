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

IF @@ERROR <> 0
   SET NOEXEC ON
GO


INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'PPCCLERK', N'ORBC-READ-CREDIT-ACCOUNT')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'CTPO', N'ORBC-READ-CREDIT-ACCOUNT')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-READ-CREDIT-ACCOUNT')
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Add ORBC-READ-CREDIT-ACCOUNT to PPCCLERK, CTPO, and HQADMIN'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (33, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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