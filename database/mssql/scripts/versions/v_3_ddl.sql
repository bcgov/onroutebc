USE $(MSSQL_DB)
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
BEGIN TRANSACTION

CREATE TABLE [dbo].[ORBC_ADDRESS](
	[ADDRESS_ID] [int] IDENTITY(1,1) NOT NULL,
	[ADDRESS_LINE_1] [nvarchar](100) NULL,
	[ADDRESS_LINE_2] [nvarchar](100) NULL,
	[CITY] [nvarchar](100) NULL,
	[PROVINCE_ID] [char](5) NULL,
	[POSTAL_CODE] [varchar](7) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[APP_CREATE_USERID] [varchar](30) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_CREATE_USER_DIRECTORY] [varchar](30) NULL,
	[APP_LAST_UPDATE_USERID] [varchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [varchar](30) NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_ADDRESS] PRIMARY KEY CLUSTERED 
(
	[ADDRESS_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORBC_COMPANY](
	[COMPANY_GUID] [varchar](36) NOT NULL,
	[CLIENT_NUMBER] [char](10) NOT NULL,
	[LEGAL_NAME] [nvarchar](100) NOT NULL,
	[COMPANY_DIRECTORY] [varchar](10) NOT NULL,
	[PHYSICAL_ADDRESS_ID] [int] NULL,
	[MAILING_ADDRESS_ID] [int] NULL,
	[PHONE] [varchar](20) NOT NULL,
	[EXTENSION] [varchar](5) NULL,
	[FAX] [varchar](20) NULL,
	[EMAIL] [varchar](50) NULL,
	[PRIMARY_CONTACT_ID] [int] NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[APP_CREATE_USERID] [varchar](30) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_CREATE_USER_DIRECTORY] [varchar](30) NULL,
	[APP_LAST_UPDATE_USERID] [varchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [varchar](30) NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_COMPANY] PRIMARY KEY CLUSTERED 
(
	[COMPANY_GUID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORBC_COMPANY_USER](
	[COMPANY_GUID] [varchar](36) NOT NULL,
	[USER_GUID] [varchar](36) NOT NULL,
	[USER_AUTH_GROUP_ID] [varchar](10) NOT NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[APP_CREATE_USERID] [varchar](30) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_CREATE_USER_DIRECTORY] [varchar](30) NULL,
	[APP_LAST_UPDATE_USERID] [varchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [varchar](30) NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORBC_CONTACT](
	[CONTACT_ID] [int] IDENTITY(1,1) NOT NULL,
	[FIRST_NAME] [nvarchar](100) NOT NULL,
	[LAST_NAME] [nvarchar](100) NOT NULL,
	[EMAIL] [nvarchar](100) NOT NULL,
	[PHONE_1] [varchar](20) NOT NULL,
	[EXTENSION_1] [varchar](5) NULL,
	[PHONE_2] [varchar](20) NULL,
	[EXTENSION_2] [varchar](5) NULL,
	[FAX] [varchar](20) NULL,
	[CITY] [nvarchar](100) NULL,
	[PROVINCE_ID] [char](5) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[APP_CREATE_USERID] [varchar](30) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_CREATE_USER_DIRECTORY] [varchar](30) NULL,
	[APP_LAST_UPDATE_USERID] [varchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [varchar](30) NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_CONTACT] PRIMARY KEY CLUSTERED 
(
	[CONTACT_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORBC_PENDING_USER](
	[COMPANY_GUID] [varchar](36) NOT NULL,
	[USERNAME] [varchar](50) NOT NULL,
	[USER_DIRECTORY] [varchar](10) NULL,
	[USER_AUTH_GROUP_ID] [varchar](10) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[APP_CREATE_USERID] [varchar](30) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_CREATE_USER_DIRECTORY] [varchar](30) NULL,
	[APP_LAST_UPDATE_USERID] [varchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [varchar](30) NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_PENDING_USER] PRIMARY KEY CLUSTERED 
(
	[COMPANY_GUID] ASC,
	[USERNAME] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORBC_USER](
	[USER_GUID] [varchar](36) NOT NULL,
	[USERNAME] [nvarchar](50) NOT NULL,
	[USER_DIRECTORY] [varchar](10) NOT NULL,
	[CONTACT_ID] [int] NOT NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[APP_CREATE_USERID] [varchar](30) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_CREATE_USER_DIRECTORY] [varchar](30) NULL,
	[APP_LAST_UPDATE_USERID] [varchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [varchar](30) NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_USER] PRIMARY KEY CLUSTERED 
(
	[USER_GUID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORBC_VT_DIRECTORY](
	[DIRECTORY_CODE] [varchar](10) NOT NULL,
	[DIRECTORY_NAME] [varchar](20) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[APP_CREATE_USERID] [varchar](30) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_CREATE_USER_DIRECTORY] [varchar](30) NULL,
	[APP_LAST_UPDATE_USERID] [varchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [varchar](30) NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_VT_DIRECTORY] PRIMARY KEY CLUSTERED 
(
	[DIRECTORY_CODE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP](
	[GROUP_ID] [varchar](10) NOT NULL,
	[DISPLAY_NAME] [varchar](25) NULL,
	[DESCRIPTION] [varchar](100) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[APP_CREATE_USERID] [varchar](30) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_CREATE_USER_DIRECTORY] [varchar](30) NULL,
	[APP_LAST_UPDATE_USERID] [varchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USER_GUID] [uniqueidentifier] NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [varchar](30) NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_USER_AUTH_GROUP] PRIMARY KEY CLUSTERED 
(
	[GROUP_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE], [DIRECTORY_NAME], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_USERID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'bbceid', N'Business BCeID', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'dbo', CAST(N'2023-01-12T00:13:58.2200000' AS DateTime2), N'dbo', CAST(N'2023-01-12T00:13:58.2200000' AS DateTime2))
GO
INSERT [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE], [DIRECTORY_NAME], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_USERID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'bceid', N'BCeID', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'dbo', CAST(N'2023-01-12T00:13:58.2366667' AS DateTime2), N'dbo', CAST(N'2023-01-12T00:13:58.2366667' AS DateTime2))
GO
INSERT [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE], [DIRECTORY_NAME], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_USERID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'bcsc', N'BC Services Card', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'dbo', CAST(N'2023-01-12T00:13:58.2466667' AS DateTime2), N'dbo', CAST(N'2023-01-12T00:13:58.2466667' AS DateTime2))
GO
INSERT [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE], [DIRECTORY_NAME], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_USERID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'orbc', N'onRouteBC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'dbo', CAST(N'2023-01-12T00:13:58.2566667' AS DateTime2), N'dbo', CAST(N'2023-01-12T00:13:58.2566667' AS DateTime2))
GO
INSERT [dbo].[ORBC_VT_USER_AUTH_GROUP] ([GROUP_ID], [DISPLAY_NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_USERID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'admin', N'Administrator', N'Administrator of the onRouteBC company', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'dbo', CAST(N'2023-01-18T19:31:29.3766667' AS DateTime2), N'dbo', CAST(N'2023-01-18T19:31:29.3766667' AS DateTime2))
GO
INSERT [dbo].[ORBC_VT_USER_AUTH_GROUP] ([GROUP_ID], [DISPLAY_NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_USERID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'cvclient', N'CV Client', N'Commercial Vehicle client allowed to apply for permits', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'dbo', CAST(N'2023-01-18T19:31:29.3933333' AS DateTime2), N'dbo', CAST(N'2023-01-18T19:31:29.3933333' AS DateTime2))
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] ADD  CONSTRAINT [DF_ORBC_ADDRESS_APP_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] ADD  CONSTRAINT [DF_ORBC_ADDRESS_APP_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] ADD  CONSTRAINT [DF_ORBC_ADDRESS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] ADD  CONSTRAINT [DF_ORBC_ADDRESS_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] ADD  CONSTRAINT [DF_ORBC_ADDRESS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] ADD  CONSTRAINT [DF_ORBC_ADDRESS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY] ADD  CONSTRAINT [DF_ORBC_COMPANY_APP_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY] ADD  CONSTRAINT [DF_ORBC_COMPANY_APP_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY] ADD  CONSTRAINT [DF_ORBC_COMPANY_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_COMPANY] ADD  CONSTRAINT [DF_ORBC_COMPANY_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY] ADD  CONSTRAINT [DF_ORBC_COMPANY_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_COMPANY] ADD  CONSTRAINT [DF_ORBC_COMPANY_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] ADD  CONSTRAINT [DF_ORBC_COMPANY_USER_APP_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] ADD  CONSTRAINT [DF_ORBC_COMPANY_USER_APP_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] ADD  CONSTRAINT [DF_ORBC_MM_COMPANY_USER_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] ADD  CONSTRAINT [DF_ORBC_MM_COMPANY_USER_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] ADD  CONSTRAINT [DF_ORBC_MM_COMPANY_USER_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] ADD  CONSTRAINT [DF_ORBC_MM_COMPANY_USER_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_CONTACT] ADD  CONSTRAINT [DF_ORBC_CONTACT_APP_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_CONTACT] ADD  CONSTRAINT [DF_ORBC_CONTACT_APP_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_CONTACT] ADD  CONSTRAINT [DF_ORBC_CONTACT_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_CONTACT] ADD  CONSTRAINT [DF_ORBC_CONTACT_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_CONTACT] ADD  CONSTRAINT [DF_ORBC_CONTACT_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_CONTACT] ADD  CONSTRAINT [DF_ORBC_CONTACT_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] ADD  CONSTRAINT [DF_ORBC_PENDING_USER_APP_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] ADD  CONSTRAINT [DF_ORBC_PENDING_USER_APP_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] ADD  CONSTRAINT [DF_ORBC_PENDING_USER_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] ADD  CONSTRAINT [DF_ORBC_PENDING_USER_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] ADD  CONSTRAINT [DF_ORBC_PENDING_USER_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] ADD  CONSTRAINT [DF_ORBC_PENDING_USER_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_APP_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_APP_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_DIRECTORY] ADD  CONSTRAINT [DF_ORBC_VT_DIRECTORY_APP_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_DIRECTORY] ADD  CONSTRAINT [DF_ORBC_VT_DIRECTORY_APP_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_DIRECTORY] ADD  CONSTRAINT [DF_ORBC_VT_DIRECTORY_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_VT_DIRECTORY] ADD  CONSTRAINT [DF_ORBC_VT_DIRECTORY_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_DIRECTORY] ADD  CONSTRAINT [DF_ORBC_VT_DIRECTORY_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_VT_DIRECTORY] ADD  CONSTRAINT [DF_ORBC_VT_DIRECTORY_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP] ADD  CONSTRAINT [DF_ORBC_VT_USER_AUTH_GROUP_APP_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP] ADD  CONSTRAINT [DF_ORBC_VT_USER_AUTH_GROUP_APP_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP] ADD  CONSTRAINT [DF_ORBC_USER_AUTH_GROUP_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP] ADD  CONSTRAINT [DF_ORBC_USER_AUTH_GROUP_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP] ADD  CONSTRAINT [DF_ORBC_USER_AUTH_GROUP_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP] ADD  CONSTRAINT [DF_ORBC_USER_AUTH_GROUP_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_ADDRESS]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_ADDRESS_PROVINCE] FOREIGN KEY([PROVINCE_ID])
REFERENCES [dbo].[ORBC_VT_PROVINCE] ([PROVINCE_ID])
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] CHECK CONSTRAINT [FK_ORBC_ADDRESS_PROVINCE]
GO
ALTER TABLE [dbo].[ORBC_COMPANY]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_COMPANY_DIRECTORY] FOREIGN KEY([COMPANY_DIRECTORY])
REFERENCES [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE])
GO
ALTER TABLE [dbo].[ORBC_COMPANY] CHECK CONSTRAINT [FK_ORBC_COMPANY_DIRECTORY]
GO
ALTER TABLE [dbo].[ORBC_COMPANY]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_COMPANY_MAILING_ADDRESS] FOREIGN KEY([MAILING_ADDRESS_ID])
REFERENCES [dbo].[ORBC_ADDRESS] ([ADDRESS_ID])
GO
ALTER TABLE [dbo].[ORBC_COMPANY] CHECK CONSTRAINT [FK_ORBC_COMPANY_MAILING_ADDRESS]
GO
ALTER TABLE [dbo].[ORBC_COMPANY]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_COMPANY_PHYSICAL_ADDRESS] FOREIGN KEY([PHYSICAL_ADDRESS_ID])
REFERENCES [dbo].[ORBC_ADDRESS] ([ADDRESS_ID])
GO
ALTER TABLE [dbo].[ORBC_COMPANY] CHECK CONSTRAINT [FK_ORBC_COMPANY_PHYSICAL_ADDRESS]
GO
ALTER TABLE [dbo].[ORBC_COMPANY]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_COMPANY_PRIMARY_CONTACT] FOREIGN KEY([PRIMARY_CONTACT_ID])
REFERENCES [dbo].[ORBC_CONTACT] ([CONTACT_ID])
GO
ALTER TABLE [dbo].[ORBC_COMPANY] CHECK CONSTRAINT [FK_ORBC_COMPANY_PRIMARY_CONTACT]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_COMPANY_USER_COMPANY] FOREIGN KEY([COMPANY_GUID])
REFERENCES [dbo].[ORBC_COMPANY] ([COMPANY_GUID])
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] CHECK CONSTRAINT [FK_ORBC_COMPANY_USER_COMPANY]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_COMPANY_USER_USER] FOREIGN KEY([USER_GUID])
REFERENCES [dbo].[ORBC_USER] ([USER_GUID])
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] CHECK CONSTRAINT [FK_ORBC_COMPANY_USER_USER]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_COMPANY_USER_USER_AUTH_GROUP] FOREIGN KEY([USER_AUTH_GROUP_ID])
REFERENCES [dbo].[ORBC_VT_USER_AUTH_GROUP] ([GROUP_ID])
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] CHECK CONSTRAINT [FK_ORBC_COMPANY_USER_USER_AUTH_GROUP]
GO
ALTER TABLE [dbo].[ORBC_CONTACT]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_CONTACT_PROVINCE] FOREIGN KEY([PROVINCE_ID])
REFERENCES [dbo].[ORBC_VT_PROVINCE] ([PROVINCE_ID])
GO
ALTER TABLE [dbo].[ORBC_CONTACT] CHECK CONSTRAINT [FK_ORBC_CONTACT_PROVINCE]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PENDING_USER_AUTH_GROUP] FOREIGN KEY([USER_AUTH_GROUP_ID])
REFERENCES [dbo].[ORBC_VT_USER_AUTH_GROUP] ([GROUP_ID])
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] CHECK CONSTRAINT [FK_ORBC_PENDING_USER_AUTH_GROUP]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PENDING_USER_COMPANY] FOREIGN KEY([COMPANY_GUID])
REFERENCES [dbo].[ORBC_COMPANY] ([COMPANY_GUID])
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] CHECK CONSTRAINT [FK_ORBC_PENDING_USER_COMPANY]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PENDING_USER_DIRECTORY] FOREIGN KEY([USER_DIRECTORY])
REFERENCES [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE])
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] CHECK CONSTRAINT [FK_ORBC_PENDING_USER_DIRECTORY]
GO
ALTER TABLE [dbo].[ORBC_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_USER_CONTACT] FOREIGN KEY([CONTACT_ID])
REFERENCES [dbo].[ORBC_CONTACT] ([CONTACT_ID])
GO
ALTER TABLE [dbo].[ORBC_USER] CHECK CONSTRAINT [FK_ORBC_USER_CONTACT]
GO
ALTER TABLE [dbo].[ORBC_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_USER_DIRECTORY] FOREIGN KEY([USER_DIRECTORY])
REFERENCES [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE])
GO
ALTER TABLE [dbo].[ORBC_USER] CHECK CONSTRAINT [FK_ORBC_USER_DIRECTORY]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_CREATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created or last updated the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_LAST_UPDATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_CREATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created or last updated the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_LAST_UPDATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_CREATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created or last updated the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_LAST_UPDATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_CREATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created or last updated the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_LAST_UPDATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_CREATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created or last updated the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_LAST_UPDATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_CREATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created or last updated the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_LAST_UPDATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_CREATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created or last updated the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_LAST_UPDATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_CREATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created or last updated the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_LAST_UPDATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of schema entities for manage profile feature'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (3, @VersionDescription, '$(FILE_HASH)', getdate())

COMMIT