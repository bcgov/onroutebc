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

IF @@ERROR <> 0
	SET NOEXEC ON
GO


DROP TABLE [dbo].[ORBC_OUTAGE_NOTIFICATION]

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = 'Drop outage notification table.'

INSERT [dbo].[ORBC_SYS_VERSION] (
	[VERSION_ID]
	,[DESCRIPTION]
	,[RELEASE_DATE]
	)
VALUES (
	69
	,@VersionDescription
	,getutcdate()
	)
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

COMMIT TRANSACTION
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DECLARE @Success AS BIT

SET @Success = 1
SET NOEXEC OFF

IF (@Success = 1)
	PRINT 'The database revert succeeded'
ELSE
BEGIN
	IF @@TRANCOUNT > 0
		ROLLBACK TRANSACTION

	PRINT 'The database revert failed'
END
GO