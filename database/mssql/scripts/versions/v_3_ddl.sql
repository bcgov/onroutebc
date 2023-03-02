SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
BEGIN TRANSACTION

CREATE TABLE [dbo].[ORBC_ADDRESS](
	[ADDRESS_ID] [int] IDENTITY(1,1) NOT NULL,
	[ADDRESS_LINE_1] [nvarchar](150) NOT NULL,
	[ADDRESS_LINE_2] [nvarchar](100) NULL,
	[CITY] [nvarchar](100) NOT NULL,
	[PROVINCE_ID] [char](5) NOT NULL,
	[POSTAL_CODE] [varchar](7) NOT NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
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
	[COMPANY_GUID] [char](32) NOT NULL,
	[CLIENT_NUMBER] [char](13) NOT NULL,
	[LEGAL_NAME] [nvarchar](100) NOT NULL,
	[COMPANY_DIRECTORY] [varchar](10) NOT NULL,
	[PHYSICAL_ADDRESS_ID] [int] NOT NULL,
	[MAILING_ADDRESS_ID] [int] NOT NULL,
	[PHONE] [varchar](20) NOT NULL,
	[EXTENSION] [varchar](5) NULL,
	[FAX] [varchar](20) NULL,
	[EMAIL] [varchar](50) NULL,
	[PRIMARY_CONTACT_ID] [int] NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
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
	[COMPANY_USER_ID] [int] IDENTITY(1,1) NOT NULL,
	[COMPANY_GUID] [char](32) NOT NULL,
	[USER_GUID] [char](32) NOT NULL,
	[USER_AUTH_GROUP_ID] [varchar](10) NOT NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_COMPANY_USER] PRIMARY KEY CLUSTERED 
(
	[COMPANY_USER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
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
	[CITY] [nvarchar](100) NOT NULL,
	[PROVINCE_ID] [char](5) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
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
	[COMPANY_GUID] [char](32) NOT NULL,
	[USERNAME] [varchar](50) NOT NULL,
	[USER_AUTH_GROUP_ID] [varchar](10) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
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
	[USER_GUID] [char](32) NOT NULL,
	[USERNAME] [nvarchar](50) NOT NULL,
	[USER_DIRECTORY] [varchar](10) NOT NULL,
	[STATUS_CODE] [varchar](10) NOT NULL,
	[CONTACT_ID] [int] NOT NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
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
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORBC_VT_USER_STATUS](
	[STATUS_CODE] [varchar](10) NOT NULL,
	[DISPLAY_NAME] [varchar](10) NULL,
	[DESCRIPTION] [varchar](100) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_VT_USER_STATUS] PRIMARY KEY CLUSTERED 
(
	[STATUS_CODE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE], [DIRECTORY_NAME], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'BBCEID', N'Business BCeID', NULL, N'dbo', CAST(N'2023-01-12T00:13:58.2200000' AS DateTime2), N'dbo', CAST(N'2023-01-12T00:13:58.2200000' AS DateTime2))
INSERT [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE], [DIRECTORY_NAME], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'BCEID', N'BCeID', NULL, N'dbo', CAST(N'2023-01-12T00:13:58.2366667' AS DateTime2), N'dbo', CAST(N'2023-01-12T00:13:58.2366667' AS DateTime2))
INSERT [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE], [DIRECTORY_NAME], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'BCSC', N'BC Services Card', NULL, N'dbo', CAST(N'2023-01-12T00:13:58.2466667' AS DateTime2), N'dbo', CAST(N'2023-01-12T00:13:58.2466667' AS DateTime2))
INSERT [dbo].[ORBC_VT_DIRECTORY] ([DIRECTORY_CODE], [DIRECTORY_NAME], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'ORBC', N'onRouteBC', NULL, N'dbo', CAST(N'2023-01-12T00:13:58.2566667' AS DateTime2), N'dbo', CAST(N'2023-01-12T00:13:58.2566667' AS DateTime2))
GO
INSERT [dbo].[ORBC_VT_USER_AUTH_GROUP] ([GROUP_ID], [DISPLAY_NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'ADMIN', N'Administrator', N'Administrator of the onRouteBC company', NULL, N'dbo', CAST(N'2023-01-18T19:31:29.3766667' AS DateTime2), N'dbo', CAST(N'2023-01-18T19:31:29.3766667' AS DateTime2))
INSERT [dbo].[ORBC_VT_USER_AUTH_GROUP] ([GROUP_ID], [DISPLAY_NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'CVCLIENT', N'CV Client', N'Commercial Vehicle client allowed to apply for permits', NULL, N'dbo', CAST(N'2023-01-18T19:31:29.3933333' AS DateTime2), N'dbo', CAST(N'2023-01-18T19:31:29.3933333' AS DateTime2))
GO
INSERT [dbo].[ORBC_VT_USER_STATUS] ([STATUS_CODE], [DISPLAY_NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'ACTIVE', N'Active', N'User is active in the onRouteBC system and can log in', NULL, N'dbo', CAST(N'2023-01-19T19:46:33.3400000' AS DateTime2), N'dbo', CAST(N'2023-01-19T19:46:33.3400000' AS DateTime2))
INSERT [dbo].[ORBC_VT_USER_STATUS] ([STATUS_CODE], [DISPLAY_NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'DELETED', N'Deleted', N'User has been deleted from onRouteBC and cannot be viewed by the administrator', NULL, N'dbo', CAST(N'2023-01-19T19:46:33.3700000' AS DateTime2), N'dbo', CAST(N'2023-01-19T19:46:33.3700000' AS DateTime2))
INSERT [dbo].[ORBC_VT_USER_STATUS] ([STATUS_CODE], [DISPLAY_NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'DISABLED', N'Disabled', N'User is temporarily disabled in onRouteBC - on leave or other reason', NULL, N'dbo', CAST(N'2023-01-19T19:46:33.3900000' AS DateTime2), N'dbo', CAST(N'2023-01-19T19:46:33.3900000' AS DateTime2))
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] ADD  CONSTRAINT [DF_ORBC_ADDRESS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] ADD  CONSTRAINT [DF_ORBC_ADDRESS_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] ADD  CONSTRAINT [DF_ORBC_ADDRESS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_ADDRESS] ADD  CONSTRAINT [DF_ORBC_ADDRESS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY] ADD  CONSTRAINT [DF_ORBC_COMPANY_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_COMPANY] ADD  CONSTRAINT [DF_ORBC_COMPANY_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY] ADD  CONSTRAINT [DF_ORBC_COMPANY_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_COMPANY] ADD  CONSTRAINT [DF_ORBC_COMPANY_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] ADD  CONSTRAINT [DF_ORBC_MM_COMPANY_USER_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] ADD  CONSTRAINT [DF_ORBC_MM_COMPANY_USER_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] ADD  CONSTRAINT [DF_ORBC_MM_COMPANY_USER_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_COMPANY_USER] ADD  CONSTRAINT [DF_ORBC_MM_COMPANY_USER_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_CONTACT] ADD  CONSTRAINT [DF_ORBC_CONTACT_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_CONTACT] ADD  CONSTRAINT [DF_ORBC_CONTACT_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_CONTACT] ADD  CONSTRAINT [DF_ORBC_CONTACT_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_CONTACT] ADD  CONSTRAINT [DF_ORBC_CONTACT_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] ADD  CONSTRAINT [DF_ORBC_PENDING_USER_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] ADD  CONSTRAINT [DF_ORBC_PENDING_USER_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] ADD  CONSTRAINT [DF_ORBC_PENDING_USER_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_PENDING_USER] ADD  CONSTRAINT [DF_ORBC_PENDING_USER_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_STATUS_CODE]  DEFAULT ('ACTIVE') FOR [STATUS_CODE]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_USER] ADD  CONSTRAINT [DF_ORBC_USER_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_DIRECTORY] ADD  CONSTRAINT [DF_ORBC_VT_DIRECTORY_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_VT_DIRECTORY] ADD  CONSTRAINT [DF_ORBC_VT_DIRECTORY_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_DIRECTORY] ADD  CONSTRAINT [DF_ORBC_VT_DIRECTORY_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_VT_DIRECTORY] ADD  CONSTRAINT [DF_ORBC_VT_DIRECTORY_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP] ADD  CONSTRAINT [DF_ORBC_USER_AUTH_GROUP_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP] ADD  CONSTRAINT [DF_ORBC_USER_AUTH_GROUP_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP] ADD  CONSTRAINT [DF_ORBC_USER_AUTH_GROUP_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_AUTH_GROUP] ADD  CONSTRAINT [DF_ORBC_USER_AUTH_GROUP_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_USER_STATUS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_USER_STATUS_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_USER_STATUS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_VT_USER_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_USER_STATUS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
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
ALTER TABLE [dbo].[ORBC_USER]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_USER_USER_STATUS] FOREIGN KEY([STATUS_CODE])
REFERENCES [dbo].[ORBC_VT_USER_STATUS] ([STATUS_CODE])
GO
ALTER TABLE [dbo].[ORBC_USER] CHECK CONSTRAINT [FK_ORBC_USER_USER_STATUS]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'ADDRESS_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'First line of the address' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'ADDRESS_LINE_1'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Second line of the address (e.g. unit number, floor number, etc)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'ADDRESS_LINE_2'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'City portion of the address' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'CITY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the province or US state of the address, foreign key into the province table' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'PROVINCE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Postal code, zip code, or other (depending on country)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'POSTAL_CODE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Represents the physical or mailing address of an entity, whether a company, user, or other.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ADDRESS'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'GUID of the company record, which typically comes from Business BCeID' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'COMPANY_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique client-facing client number' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'CLIENT_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Legal name of the company' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'LEGAL_NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The source of the company record - this can be Business BCeID or onRouteBC for clients without a Business BCeID. FK into directory table.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'COMPANY_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the physical address of the company (FK into address table)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'PHYSICAL_ADDRESS_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the mailing address of the company (FK into address table)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'MAILING_ADDRESS_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'General phone number of the company' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'PHONE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional phone extension for the general company number (e.g. to reach the department responsible for vehicle permitting)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'EXTENSION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fax number of the company' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'FAX'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'General email of the company related to permitting.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'EMAIL'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the primary contact for permitting at the company (FK into the contact table)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'PRIMARY_CONTACT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A company entity in onRouteBC. May be directly related to a company record in Business BCeID or may be managed entirely within onRouteBC.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'COMPANY_USER_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'GUID of the company' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'COMPANY_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'GUID of the user' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the authorization group the user belongs to for the company' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'USER_AUTH_GROUP_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table resolving a many to many relationship between users and companies.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_COMPANY_USER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique surrogate primary key for the contact' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'CONTACT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'First (given) name of the contact' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'FIRST_NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Last (family) name of the contact' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'LAST_NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Email of the contact' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'EMAIL'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Primary phone number of the contact' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'PHONE_1'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional extension for the primary phone number for the contact' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'EXTENSION_1'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Secondary phone number of the contact' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'PHONE_2'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional extension for the secondary phone number for the contact' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'EXTENSION_2'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fax number of the contact' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'FAX'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'City in which the contact resides' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'CITY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the province or state in which the contact resides (FK into province table)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'PROVINCE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Contains the details for a person in onRouteBC, whether an application user or other (primary contact, permit applicant) who is not an application user.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_CONTACT'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A user who has been added to onRouteBC by an administrator but who has not yet logged in.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_PENDING_USER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'GUID of the user, coming from bceid or bcsc' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'User''s username as set in bceid or bcsc' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'USERNAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Origin of the user, whether bceid, business bceid, or bcsc (FK to directory table)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'USER_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'User''s current status in the onRouteBC system, FK into the user status table' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'STATUS_CODE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the contact record associated with this user (FK to the contact table)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'CONTACT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A user who has access to log in to the ORBC application.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_USER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Short code representing the directory' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'DIRECTORY_CODE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Common user-friendly name of the directory' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'DIRECTORY_NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Lookup table containing directories where users and companies can be registered externally (e.g. bceid, business bceid)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_DIRECTORY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique short code representing the authorization group' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'GROUP_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Common user-friendly display name of the authorization group' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'DISPLAY_NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Description of the authorization group' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Lookup table containing all valid user authorization groups in the ORBC application.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_AUTH_GROUP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique short code PK of the user status' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_STATUS', @level2type=N'COLUMN',@level2name=N'STATUS_CODE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'User-friendly display name of the user status' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_STATUS', @level2type=N'COLUMN',@level2name=N'DISPLAY_NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Description of the user status' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_STATUS', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_STATUS', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_STATUS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_STATUS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_STATUS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_STATUS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Lookup table for all possible user status values in ORBC' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_USER_STATUS'
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of schema entities for manage profile feature'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (3, @VersionDescription, '$(FILE_HASH)', getdate())

COMMIT