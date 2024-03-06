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
 ADD [VIN]  AS (json_value([PERMIT_DATA],'$.vehicleDetails.vin'))

IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PERMIT_DATA] 
 DROP COLUMN APPLICANT
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Calculated column for the vehicle VIN, pulled from the JSON PERMIT_DATA.',
   @level0type=N'SCHEMA',
   @level0name=N'permit',
   @level1type=N'TABLE',
   @level1name=N'ORBC_PERMIT_DATA',
   @level2type=N'COLUMN',
   @level2name=N'VIN'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Add VIN, LEGAL_NAME, CLIENT_NUMBER derived column to Permit Data and drop APPLICANT column'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (21, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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

