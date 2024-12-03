SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

SET XACT_ABORT ON

BEGIN TRY
  BEGIN TRANSACTION

    DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]  WHERE DOCUMENT_ID IN (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME='stos-template-v1.docx')
    DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]  WHERE DOCUMENT_ID IN (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME='stos-void-template-v1.docx')
    DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]  WHERE DOCUMENT_ID IN (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME='stos-revoked-template-v1.docx')
    DELETE [dops].[ORBC_DOCUMENT]  WHERE FILE_NAME='stos-template-v1.docx'
    DELETE [dops].[ORBC_DOCUMENT]  WHERE FILE_NAME='stos-void-template-v1.docx'
    DELETE [dops].[ORBC_DOCUMENT]  WHERE FILE_NAME='stos-revoked-template-v1.docx'
    COMMIT
END TRY

BEGIN CATCH
  IF @@TRANCOUNT > 0 
    ROLLBACK;
  THROW
END CATCH

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Revert STOS templates'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (42, @VersionDescription, getutcdate())