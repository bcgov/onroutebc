SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
BEGIN TRANSACTION

CREATE TABLE [dops].[ORBC_DOCUMENT](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[S3_OBJECT_ID] [uniqueidentifier] NOT NULL,
	[S3_VERSION_ID] [bigint] NULL,
	[S3_LOCATION] [varchar](200) NOT NULL,
	[OBJECT_MIME_TYPE] [varchar](200) NOT NULL,
	[FILE_NAME] [varchar](50) NOT NULL,
	[DMS_VERSION_ID] [int] NOT NULL,
	[COMPANY_ID] [int] NULL,
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
GO
ALTER TABLE [dops].[ORBC_DOCUMENT] ADD  CONSTRAINT [ORBC_DOCUMENT_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dops].[ORBC_DOCUMENT] ADD  CONSTRAINT [ORBC_DOCUMENT_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dops].[ORBC_DOCUMENT] ADD  CONSTRAINT [ORBC_DOCUMENT_DB_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO


ALTER TABLE [dops].[ORBC_DOCUMENT]  WITH CHECK ADD  CONSTRAINT [ORBC_DOCUMENT_COMPANY_ID_FK] FOREIGN KEY([COMPANY_ID])
REFERENCES [dbo].[ORBC_COMPANY] ([COMPANY_ID])
GO
ALTER TABLE [dops].[ORBC_DOCUMENT] CHECK CONSTRAINT [ORBC_DOCUMENT_COMPANY_ID_FK]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the document metadata record' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The uuid representing the object in S3' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'S3_OBJECT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The version identifier created in S3' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'S3_VERSION_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The URL to the uploaded resource' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'S3_LOCATION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The object MIME Type' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'OBJECT_MIME_TYPE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The File Name' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'FILE_NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The DMS Version ID' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DMS_VERSION_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Company ID' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'COMPANY_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table recording metadata of documents stored in OCIO S3 Storage via COMS ' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT'
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for Document Management System (DMS)'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (6, @VersionDescription, '$(FILE_HASH)', getutcdate())


COMMIT