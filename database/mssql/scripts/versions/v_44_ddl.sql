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
INSERT [dops].[ORBC_DOCUMENT] ( [S3_OBJECT_ID], [S3_VERSION_ID], [S3_LOCATION], [OBJECT_MIME_TYPE], [FILE_NAME], [DMS_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES ( N'FF765BCC-7778-471C-9468-B788E358A07A', NULL, N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/ff765bcc-7778-471c-9468-b788e358a07a', N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',N'mfp-template-v1.docx',1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())

IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [dops].[ORBC_DOCUMENT] ( [S3_OBJECT_ID], [S3_VERSION_ID], [S3_LOCATION], [OBJECT_MIME_TYPE], [FILE_NAME], [DMS_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES ( N'FF765BCC-7778-471C-9468-B788E358A07A', NULL, N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/ff765bcc-7778-471c-9468-b788e358a07a', N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',N'mfp-void-template-v1.docx',1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())

IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [dops].[ORBC_DOCUMENT] ( [S3_OBJECT_ID], [S3_VERSION_ID], [S3_LOCATION], [OBJECT_MIME_TYPE], [FILE_NAME], [DMS_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES ( N'BCF467A3-23D0-4E1F-8CA1-EC47656F483E', NULL, N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/bcf467a3-23d0-4e1f-8ca1-ec47656f483e', N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',N'mfp-revoked-template-v1.docx',1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())

IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( [TEMPLATE_NAME], [TEMPLATE_VERSION], [DOCUMENT_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES ( N'PERMIT_MFP', 1, (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME='mfp-template-v1.docx'), 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( [TEMPLATE_NAME], [TEMPLATE_VERSION], [DOCUMENT_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES ( N'PERMIT_MFP_VOID', 1, (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME='mfp-void-template-v1.docx'), 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( [TEMPLATE_NAME], [TEMPLATE_VERSION], [DOCUMENT_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES ( N'PERMIT_MFP_REVOKED', 1, (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME='mfp-revoked-template-v1.docx'), 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'MFP permit templates.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (44, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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

