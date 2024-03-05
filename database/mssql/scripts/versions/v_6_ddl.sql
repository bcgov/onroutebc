SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

CREATE TABLE [dops].[ORBC_DOCUMENT](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[S3_OBJECT_ID] [uniqueidentifier] NOT NULL,
	[S3_VERSION_ID] [bigint] NULL,
	[S3_LOCATION] [varchar](200) NOT NULL,
	[OBJECT_MIME_TYPE] [varchar](200) NOT NULL,
	[FILE_NAME] [varchar](50) NOT NULL,
	[DMS_VERSION_ID] [int] NOT NULL,
	[COMPANY_ID] [int] NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_DOCUMENTS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dops].[ORBC_DOCUMENT] ADD  CONSTRAINT [ORBC_DOCUMENT_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [dops].[ORBC_DOCUMENT] ADD  CONSTRAINT [ORBC_DOCUMENT_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [dops].[ORBC_DOCUMENT] ADD  CONSTRAINT [ORBC_DOCUMENT_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [dops].[ORBC_DOCUMENT] ADD  CONSTRAINT [ORBC_DOCUMENT_DB_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dops].[ORBC_DOCUMENT]  WITH CHECK ADD  CONSTRAINT [ORBC_DOCUMENT_COMPANY_ID_FK] FOREIGN KEY([COMPANY_ID])
REFERENCES [dbo].[ORBC_COMPANY] ([COMPANY_ID])
ALTER TABLE [dops].[ORBC_DOCUMENT] CHECK CONSTRAINT [ORBC_DOCUMENT_COMPANY_ID_FK]

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the document metadata record' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The uuid representing the object in S3' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'S3_OBJECT_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The version identifier created in S3' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'S3_VERSION_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The URL to the uploaded resource' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'S3_LOCATION'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The object MIME Type' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'OBJECT_MIME_TYPE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The File Name' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'FILE_NAME'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The DMS Version ID' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DMS_VERSION_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Company ID' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'COMPANY_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table recording metadata of documents stored in OCIO S3 Storage via COMS ' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT'
GO

CREATE TABLE [dops].[ORBC_EXTERNAL_DOCUMENT](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[DOCUMENT_NAME] [varchar](50) NOT NULL,
	[DOCUMENT_DESCRIPTION] [varchar](200) NULL,
	[DOCUMENT_LOCATION] [varchar](200) NOT NULL,
	[DOCUMENT_MIME_TYPE] [varchar](200) NOT NULL,
	[DOCUMENT_VERSION_ID] [int] NOT NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_EXTERNAL_DOCUMENTS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dops].[ORBC_EXTERNAL_DOCUMENT]
ADD CONSTRAINT ORBC_EXTERNAL_DOCUMENT_UK UNIQUE (DOCUMENT_NAME, DOCUMENT_VERSION_ID);
ALTER TABLE [dops].[ORBC_EXTERNAL_DOCUMENT] ADD  CONSTRAINT [ORBC_EXTERNAL_DOCUMENT_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [dops].[ORBC_EXTERNAL_DOCUMENT] ADD  CONSTRAINT [ORBC_EXTERNAL_DOCUMENT_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [dops].[ORBC_EXTERNAL_DOCUMENT] ADD  CONSTRAINT [ORBC_EXTERNAL_DOCUMENT_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [dops].[ORBC_EXTERNAL_DOCUMENT] ADD  CONSTRAINT [ORBC_EXTERNAL_DOCUMENT_DB_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the document metadata record' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_EXTERNAL_DOCUMENT', @level2type=N'COLUMN',@level2name=N'ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Document Name' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_EXTERNAL_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DOCUMENT_NAME'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The URL to the external Document' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_EXTERNAL_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DOCUMENT_LOCATION'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The document MIME Type' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_EXTERNAL_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DOCUMENT_MIME_TYPE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The document version Id' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_EXTERNAL_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DOCUMENT_VERSION_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_EXTERNAL_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_EXTERNAL_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_EXTERNAL_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_EXTERNAL_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table recording metadata of documents external to ORBC' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_EXTERNAL_DOCUMENT'

GO
SET IDENTITY_INSERT [dops].[ORBC_DOCUMENT] ON 
INSERT [dops].[ORBC_DOCUMENT] ([ID], [S3_OBJECT_ID], [S3_VERSION_ID], [S3_LOCATION], [OBJECT_MIME_TYPE], [FILE_NAME], [DMS_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (1, N'bcc0644f-9076-41e0-9841-4ee23e109e7a', NULL, N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/bcc0644f-9076-41e0-9841-4ee23e109e7a', N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',N'tros-template-v1.docx',1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_DOCUMENT] ([ID], [S3_OBJECT_ID], [S3_VERSION_ID], [S3_LOCATION], [OBJECT_MIME_TYPE], [FILE_NAME], [DMS_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2, N'de4229ce-4d4a-4129-8a6b-1f7a469ab667', NULL, N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/de4229ce-4d4a-4129-8a6b-1f7a469ab667', N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',N'payment-receipt-template-v1.docx',1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_DOCUMENT] ([ID], [S3_OBJECT_ID], [S3_VERSION_ID], [S3_LOCATION], [OBJECT_MIME_TYPE], [FILE_NAME], [DMS_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (3, N'D33C4B65-955F-4BBF-88B0-D59787E62A79', NULL, N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/d33c4b65-955f-4bbf-88b0-d59787e62a79', N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',N'tros-template-void-template-v1.docx',1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_DOCUMENT] ([ID], [S3_OBJECT_ID], [S3_VERSION_ID], [S3_LOCATION], [OBJECT_MIME_TYPE], [FILE_NAME], [DMS_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (4, N'95E8660A-74FC-411B-ACBD-5D43E447A5B4', NULL, N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/95e8660a-74fc-411b-acbd-5d43e447a5b4', N'application/vnd.openxmlformats-officedocument.wordprocessingml.document',N'tros-template-revoked-template-v1.docx',1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
SET IDENTITY_INSERT [dops].[ORBC_DOCUMENT] OFF 
GO

GO
SET IDENTITY_INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ON 
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (1, N'CVSE-1000', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2, N'CVSE-1000L', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1250', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (3, N'CVSE-1000S', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1255', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (4, N'CVSE-1001', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1252', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (5, N'CVSE-1002', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1253', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (6, N'CVSE-1010', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1257', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (7, N'CVSE-1011', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1258', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (8, N'CVSE-1012', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1259', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (9, N'CVSE-1013', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1254', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (10, N'CVSE-1014', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1260', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (11, N'CVSE-1016', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1462', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (12, N'CVSE-1020', N'https://www.th.gov.bc.ca/forms/getFile.aspx?formId=1266', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (13, N'CVSE-1021', N'https://www.th.gov.bc.ca/forms/getFile.aspx?formId=1272', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (14, N'CVSE-1022', N'https://www.th.gov.bc.ca/forms/getFile.aspx?formId=1271', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (15, N'CVSE-1040', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1445', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (16, N'CVSE-1049', N'https://www.th.gov.bc.ca/forms/getFile.aspx?formId=1262', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (17, N'CVSE-1052', N'https://www.th.gov.bc.ca/forms/getFile.aspx?formId=1265', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (18, N'CVSE-1053', N'https://www.th.gov.bc.ca/forms/getFile.aspx?formId=1433', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (19, N'CVSE-1054', N'https://gww.th.gov.bc.ca/forms/getFormFile2.aspx?formId=1438', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (20, N'CVSE-1060', N'https://www.th.gov.bc.ca/forms/getFile.aspx?formId=1268', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (21, N'CVSE-1061', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1269', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID], [DOCUMENT_NAME], [DOCUMENT_LOCATION], [DOCUMENT_MIME_TYPE], [DOCUMENT_VERSION_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (22, N'CVSE-1070', N'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261', N'application/pdf', 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
SET IDENTITY_INSERT [dops].[ORBC_EXTERNAL_DOCUMENT] OFF
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for Document Management System (DMS)'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (6, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
