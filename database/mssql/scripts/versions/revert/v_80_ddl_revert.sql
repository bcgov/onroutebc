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

/**
* Commented the revert script to avoid loss of data when reverting to original specification.Uncomment to execute 
*/

-- IF @@ERROR <> 0 SET NOEXEC ON
-- GO
-- ALTER TABLE [dops].[ORBC_DOCUMENT] ALTER COLUMN FILE_NAME VARCHAR(50) NOT NULL;

-- IF @@ERROR <> 0 SET NOEXEC ON
-- GO
-- ALTER TABLE [dops].[ORBC_DOCUMENT_HIST] ALTER COLUMN FILE_NAME VARCHAR(50) NOT NULL;


IF @@ERROR <> 0
	SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = 'Revert size of ORBC_DOCUMENT.FILE_NAME to original specification'

INSERT [dbo].[ORBC_SYS_VERSION] (
	[VERSION_ID]
	,[DESCRIPTION]
	,[RELEASE_DATE]
	)
VALUES (
	79
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