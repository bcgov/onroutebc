CREATE SCHEMA [dops]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

CREATE TABLE [dops].[ORBC_DOCUMENT_TEMPLATE](
	[TEMPLATE_ID] [int] IDENTITY(1,1) NOT NULL,
	[TEMPLATE_NAME] [varchar](50) NOT NULL,
	[TEMPLATE_VERSION] [int] NOT NULL,
	[DOCUMENT_ID] [varchar](50) NOT NULL,
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
 CONSTRAINT [PK_ORBC_DOCUMENT_TEMPLATE] PRIMARY KEY CLUSTERED 
(
	[TEMPLATE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dops].[ORBC_DOCUMENT_TEMPLATE]
ADD CONSTRAINT UK_ORBC_DOCUMENT_TEMPLATE UNIQUE (TEMPLATE_NAME, TEMPLATE_VERSION);

GO
SET IDENTITY_INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ON 
INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ([TEMPLATE_ID], [TEMPLATE_NAME], [TEMPLATE_VERSION], [DOCUMENT_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (1, N'PERMIT_TROS', 1, 1, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ([TEMPLATE_ID], [TEMPLATE_NAME], [TEMPLATE_VERSION], [DOCUMENT_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2, N'PAYMENT_RECEIPT', 1, 2, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ([TEMPLATE_ID], [TEMPLATE_NAME], [TEMPLATE_VERSION], [DOCUMENT_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (3, N'PERMIT_TROS_VOID', 1, 3, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] ([TEMPLATE_ID], [TEMPLATE_NAME], [TEMPLATE_VERSION], [DOCUMENT_ID], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (4, N'PERMIT_TROS_REVOKED', 1, 4, 1, N'dops', GETUTCDATE(), N'dops', GETUTCDATE())
GO

SET IDENTITY_INSERT [dops].[ORBC_DOCUMENT_TEMPLATE] OFF
GO


DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for generating a document'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (5, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())