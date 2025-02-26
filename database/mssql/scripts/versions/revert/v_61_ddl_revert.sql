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

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE DOCUMENT_ID IN (
		SELECT ID
		FROM [dops].[ORBC_DOCUMENT]
		WHERE FILE_NAME = 'nrscl-template-v1.docx'
		)

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT]
WHERE FILE_NAME = 'nrscl-template-v1.docx'

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE DOCUMENT_ID IN (
		SELECT ID
		FROM [dops].[ORBC_DOCUMENT]
		WHERE FILE_NAME = 'nrscl-void-template-v1.docx'
		)

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT]
WHERE FILE_NAME = 'nrscl-void-template-v1.docx'

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE DOCUMENT_ID IN (
		SELECT ID
		FROM [dops].[ORBC_DOCUMENT]
		WHERE FILE_NAME = 'nrscl-revoked-template-v1.docx'
		)

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT]
WHERE FILE_NAME = 'nrscl-revoked-template-v1.docx'

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE DOCUMENT_ID IN (
		SELECT ID
		FROM [dops].[ORBC_DOCUMENT]
		WHERE FILE_NAME = 'nrqcl-template-v1.docx'
		)

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT]
WHERE FILE_NAME = 'nrqcl-template-v1.docx'

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE DOCUMENT_ID IN (
		SELECT ID
		FROM [dops].[ORBC_DOCUMENT]
		WHERE FILE_NAME = 'nrqcl-void-template-v1.docx'
		)

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT]
WHERE FILE_NAME = 'nrqcl-void-template-v1.docx'

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE DOCUMENT_ID IN (
		SELECT ID
		FROM [dops].[ORBC_DOCUMENT]
		WHERE FILE_NAME = 'nrqcl-revoked-template-v1.docx'
		)

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DELETE [dops].[ORBC_DOCUMENT]
WHERE FILE_NAME = 'nrqcl-revoked-template-v1.docx'

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = 'Remove NRSCL & NRQCL permit templates'

INSERT [dbo].[ORBC_SYS_VERSION] (
	[VERSION_ID]
	,[DESCRIPTION]
	,[RELEASE_DATE]
	)
VALUES (
	60
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