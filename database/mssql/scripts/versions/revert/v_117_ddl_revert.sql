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

-- Follow the policy-configuration revert convention, but verify ownership
-- before removing the latest row. Never remove a newer unrelated configuration.
DELETE FROM [dbo].[ORBC_POLICY_CONFIGURATION]
WHERE POLICY_CONFIGURATION_ID = (SELECT MAX(POLICY_CONFIGURATION_ID) FROM [dbo].[ORBC_POLICY_CONFIGURATION])
  AND CHANGE_DESCRIPTION = N'Update Policy Engine to 3.0.0, which includes stories ORV2-6030: STOW ASW Evaluation: Booster Interaxle Spacing Exceptions, ORV2-5706 - STOW ASW Evaluation: Determine Axle Unit Legal Weight Allowance Maximums, ORV2-5709 - STOW ASW Evaluation: Determine Axle Unit Permittable Weight Allowance Maximums. This version also addresses the following bugs/tasks: ORV2-6007, ORV2-6009, ORV2-6009, ORV2-6068, ORV2-6067'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Revert Update Policy Engine to 3.0.0'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE])
VALUES (116, @VersionDescription, GETUTCDATE())
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
