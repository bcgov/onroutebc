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

-- Note that we are not revering the change to add the new DELETED
-- status to the permit status type table, due to the possibility of
-- breaking FK constraints with any permits that had changed in the
-- meantime. This permit type remaining after the revert is a 
-- reasonable / acceptable outcome of the revert.

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting addition of deleted status to permit status table'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (17, @VersionDescription, getutcdate())
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
