CREATE SCHEMA [dms]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
BEGIN TRANSACTION

CREATE TABLE [dms].[ORBC_DOCUMENT](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[S3_OBJECT_ID] [uniqueidentifier] NOT NULL,
	[S3_VERSION_ID] [bigint] NULL,
	[S3_LOCATION] [varchar](200) NOT NULL,
	[OBJECT_MIME_TYPE] [varchar](20) NOT NULL,
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

ALTER TABLE [dms].[ORBC_DOCUMENT] ADD  CONSTRAINT [DF_ORBC_DOCUMENTS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dms].[ORBC_DOCUMENT] ADD  CONSTRAINT [DF_ORBC_DOCUMENTS_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dms].[ORBC_DOCUMENT] ADD  CONSTRAINT [DF_ORBC_DOCUMENTS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dms].[ORBC_DOCUMENT] ADD  CONSTRAINT [DF_ORBC_DOCUMENTS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dms', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dms', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dms', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dms', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table recording metadata of documents stored in OCIO S3 Storage via COMS ' , @level0type=N'SCHEMA',@level0name=N'dms', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT'
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for Document Management System (DMS)'

INSERT [dms].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (6, @VersionDescription, '$(FILE_HASH)', getdate())


COMMIT