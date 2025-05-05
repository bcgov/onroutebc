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

-- Note that we are intentionally not going to reset the column length for postal code
-- We will also maintain the column length at 15 characters in the event
-- that postal code were created that exceed that, and we would not
-- want to delete or modify those records once in place.
-- So, this should be considered a non-revertable change - if necessary it
-- must be reverted manually and very carefully.
-- Including commented-out SQL for the revert below for reference, if we
-- were to choose to do it.

--ALTER TABLE [dbo].[ORBC_ADDRESS] 
--  ALTER COLUMN POSTAL_CODE VARCHAR(7) NOT NULL
--IF @@ERROR <> 0 SET NOEXEC ON
--GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting credit account sequence updates'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (70, @VersionDescription, getutcdate())
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
