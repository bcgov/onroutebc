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
UPDATE [permit].[ORBC_PERMIT] SET PERMIT_STATUS_TYPE = 'IN_PROGRESS', DB_LAST_UPDATE_TIMESTAMP = GETUTCDATE() WHERE PERMIT_STATUS_TYPE = 'IN_CART'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
DELETE FROM [permit].[ORBC_PERMIT_STATUS_TYPE] WHERE PERMIT_STATUS_TYPE='IN_CART'
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting addition of IN_CART status to ORBC_PERMIT_STATUS_TYPE table'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (25, @VersionDescription, getutcdate())
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
