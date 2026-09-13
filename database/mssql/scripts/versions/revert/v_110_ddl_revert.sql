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
  AND CHANGE_DESCRIPTION = N'ORV2-5692: Calculate STOW fees using the selected OCD overload.'

IF @@ROWCOUNT <> 1
   THROW 50000, 'STOW fee revert requires the latest policy configuration to belong to ORV2-5692.', 1;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Revert ORV2-5692 STOW fee configuration.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE])
VALUES (109, @VersionDescription, GETUTCDATE())
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
