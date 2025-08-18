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
UPDATE permit.ORBC_PERMIT_TYPE set NAME='Non-Resident Quarterly Licensing' where permit_TYPE ='NRQCV';


IF @@ERROR <> 0 SET NOEXEC ON
GO
UPDATE permit.ORBC_PERMIT_TYPE set NAME='Non-Resident Single Trip Licensing' where permit_TYPE ='NRSCV';

GO
DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Update NRQCV and NRSCV names to Non-Resident Quarterly Licensing and Non-Resident Single Trip Licensing'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (86, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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
