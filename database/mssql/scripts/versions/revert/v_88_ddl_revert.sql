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

-- Reset vehicle subtype name back to Buses/Crummies in power unit types table for Buses
UPDATE [dbo].[ORBC_POWER_UNIT_TYPE]
SET [TYPE]=N'Buses/Crummies'
WHERE [POWER_UNIT_TYPE]=N'BUSCRUM'
GO

-- Remove the newly added policy configuration
DELETE FROM [dbo].[ORBC_POLICY_CONFIGURATION]
WHERE POLICY_CONFIGURATION_ID = (SELECT MAX(POLICY_CONFIGURATION_ID) FROM [dbo].[ORBC_POLICY_CONFIGURATION])
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting updates to power unit types table policy config to update vehicle subtype name for Buses'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (87, @VersionDescription, getutcdate())
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

COMMIT TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @Success AS BIT
SET @Success = 1
SET NOEXEC OFF
IF (@Success = 1) PRINT 'The database revert succeeded'
ELSE BEGIN
   IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
   PRINT 'The database revert failed'
END
GO