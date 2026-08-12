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

ALTER TABLE [permit].[ORBC_PERMIT_DATA]
 ADD [EL_APPROVAL_NUMBER]  AS (json_value([PERMIT_DATA],'$.extraordinaryLoadRequest.approvalNumber'))

IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE NONCLUSTERED INDEX IX_ORBC_PERMIT_DATA_EL_APPROVAL_NUMBER ON [permit].[ORBC_PERMIT_DATA] ([EL_APPROVAL_NUMBER]);
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Calculated column for the extraordinary load approval number, pulled from the JSON PERMIT_DATA.',
   @level0type=N'SCHEMA',
   @level0name=N'permit',
   @level1type=N'TABLE',
   @level1name=N'ORBC_PERMIT_DATA',
   @level2type=N'COLUMN',
   @level2name=N'EL_APPROVAL_NUMBER'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Add EL_APPROVAL_NUMBER column to ORBC_PERMIT_DATA'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (106, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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

