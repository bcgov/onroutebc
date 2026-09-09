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

-- Deploy the policy engine containing overloadAxleCost to both the frontend and
-- vehicles service before activating this configuration.
-- Copy the current policy so only the STOW cost rule changes.
DECLARE @PolicyJson NVARCHAR(MAX)
DECLARE @OriginId INT
DECLARE @StowIndex NVARCHAR(10)
DECLARE @CostPath NVARCHAR(200)

SELECT TOP (1) @PolicyJson = POLICY_JSON, @OriginId = POLICY_CONFIGURATION_ID
FROM [dbo].[ORBC_POLICY_CONFIGURATION]
WHERE IS_DRAFT = 'N' AND EFFECTIVE_DATE <= GETUTCDATE()
ORDER BY EFFECTIVE_DATE DESC, POLICY_CONFIGURATION_ID DESC

IF @PolicyJson IS NULL
   THROW 50000, 'STOW fee migration requires an active policy configuration.', 1;

IF (SELECT COUNT(*) FROM OPENJSON(@PolicyJson, '$.permitTypes')
    WHERE JSON_VALUE([value], '$.id') = 'STOW') <> 1
   THROW 50000, 'STOW fee migration requires exactly one STOW permit type.', 1;

SELECT @StowIndex = [key]
FROM OPENJSON(@PolicyJson, '$.permitTypes')
WHERE JSON_VALUE([value], '$.id') = 'STOW'


-- We update the JSON in place, safer than pasting whole thing in.
SET @CostPath = '$.permitTypes[' + @StowIndex + '].costRules'
SET @PolicyJson = JSON_MODIFY(@PolicyJson, @CostPath,
    JSON_QUERY(N'[{"fact":"overloadAxleCost","params":{}}]'))
-- overloadAxleCost was introduced in policy engine 2.31.0.
SET @PolicyJson = JSON_MODIFY(@PolicyJson, '$.minPEVersion', '2.31.0')

INSERT [dbo].[ORBC_POLICY_CONFIGURATION]
    (EFFECTIVE_DATE, IS_DRAFT, CHANGE_DESCRIPTION, ORIGIN_ID, POLICY_JSON)
VALUES (GETUTCDATE(), 'N', N'ORV2-5692: Calculate STOW fees using the selected OCD overload.',
    @OriginId, @PolicyJson)
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'ORV2-5692: Calculate STOW fees using the selected OCD overload.'

INSERT [dbo].[ORBC_SYS_VERSION]
    ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE])
VALUES (110, @VersionDescription,
    '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', GETUTCDATE())
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
IF (@Success = 1) PRINT 'The database update succeeded'
ELSE BEGIN
   IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
   PRINT 'The database update failed'
END
GO
