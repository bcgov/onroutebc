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
DECLARE @NewGuid UNIQUEIDENTIFIER
SET @NewGuid = NEWID();
INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'nrqcl-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)


INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_NRQCL',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'nrqcl-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();


INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'nrqcl-void-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_NRQCL_VOID',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'nrqcl-void-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'nrqcl-revoked-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_NRQCL_REVOKED',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'nrqcl-revoked-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid =NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'nrscl-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)


INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_NRSCL',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'nrscl-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();


INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'nrscl-void-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_NRSCL_VOID',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'nrscl-void-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'nrscl-revoked-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_NRSCL_REVOKED',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'nrscl-revoked-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)


SET @NewGuid =NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'qrfr-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)


INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_QRFR',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'qrfr-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();


INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'qrfr-void-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_QRFR_VOID',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'qrfr-void-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'qrfr-revoked-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_QRFR_REVOKED',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'qrfr-revoked-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid =NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'stfr-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)


INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_STFR',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'stfr-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();


INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'stfr-void-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_STFR_VOID',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'stfr-void-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'stfr-revoked-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_STFR_REVOKED',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'stfr-revoked-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'mfp-template-v3.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_MFP',
    3,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'mfp-template-v3.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'mfp-void-template-v3.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_MFP_VOID',
    3,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'mfp-void-template-v3.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'mfp-revoked-template-v3.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_MFP_REVOKED',
    3,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'mfp-revoked-template-v3.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'stos-template-v3.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_STOS',
    3,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'stos-template-v3.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'stos-void-template-v3.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_STOS_VOID',
    3,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'stos-void-template-v3.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'stos-revoked-template-v3.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)


INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_STOS_REVOKED',
    3,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'stos-revoked-template-v3.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid =NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'trow-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)


INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_TROW',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'trow-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'trow-void-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_TROW_VOID',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'trow-void-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'trow-revoked-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_TROW_REVOKED',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'trow-revoked-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid =NEWID();
INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'tros-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)


INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_TROS',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'tros-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();


INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'tros-void-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_TROS_VOID',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'tros-void-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    N'tros-revoked-template-v2.docx',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ( 
    [TEMPLATE_NAME], 
    [TEMPLATE_VERSION], 
    [DOCUMENT_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
) 
VALUES (
    N'PERMIT_TROS_REVOKED',
    2,
    (SELECT ID FROM [dops].[ORBC_DOCUMENT] WHERE FILE_NAME = 'tros-revoked-template-v2.docx'),
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Update LOA tag in all permit templates'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (64, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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
