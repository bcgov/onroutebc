SET NOCOUNT ON
GO
SET IDENTITY_INSERT [dbo].[ORBC_DOCUMENT] ON 

INSERT [dms].[ORBC_DOCUMENT] ([ID], [S3_OBJECT_ID], [S3_VERSION_ID], [S3_LOCATION], [OBJECT_MIME_TYPE], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (1, N'bcc0644f-9076-41e0-9841-4ee23e109e7a', NULL, N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/bcc0644f-9076-41e0-9841-4ee23e109e7a', N'application/octet-stream', 1, N'dms', GETDATE(), N'dms', GETDATE())
GO

SET IDENTITY_INSERT [dbo].[ORBC_DOCUMENT] OFF
GO