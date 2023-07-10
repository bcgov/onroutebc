SET NOCOUNT ON
GO
SET IDENTITY_INSERT [dops].[ORBC_DOCUMENT] ON 

INSERT [dops].[ORBC_DOCUMENT] ([ID], [S3_OBJECT_ID], [S3_VERSION_ID], [S3_LOCATION], [OBJECT_MIME_TYPE], [FILE_NAME], [DMS_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (1, N'bcc0644f-9076-41e0-9841-4ee23e109e7a', NULL, N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/bcc0644f-9076-41e0-9841-4ee23e109e7a', N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',N'tros-template-v1.docx',1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
GO

INSERT [dops].[ORBC_DOCUMENT] ([ID], [S3_OBJECT_ID], [S3_VERSION_ID], [S3_LOCATION], [OBJECT_MIME_TYPE], [FILE_NAME], [DMS_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2, N'de4229ce-4d4a-4129-8a6b-1f7a469ab667', NULL, N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/de4229ce-4d4a-4129-8a6b-1f7a469ab667', N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',N'Payment Receipt Template.docx',1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
GO

SET IDENTITY_INSERT [dops].[ORBC_DOCUMENT] OFF
GO