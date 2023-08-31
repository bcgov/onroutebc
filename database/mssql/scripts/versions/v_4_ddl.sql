CREATE SCHEMA [permit]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
BEGIN TRANSACTION

CREATE TABLE [permit].[ORBC_PERMIT](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ORIGINAL_ID] [bigint] NULL,
	[COMPANY_ID] [int] NULL,
	[PERMIT_TYPE_ID] [varchar](10) NULL,
	[PERMIT_APPROVAL_SOURCE_ID] [varchar](8) NULL,
	[APPLICATION_ORIGIN_ID] [varchar](8) NULL,
	[APPLICATION_NUMBER] [varchar](19) NULL,
	[PERMIT_NUMBER] [varchar](19) NULL,
	[REVISION] [tinyint] NULL,
	[PREVIOUS_REV_ID] [bigint] NULL,
	[OWNER_USER_GUID] [char](32) NULL,
	[PERMIT_STATUS_ID] [varchar](20) NULL,
	[PERMIT_ISSUE_DATE_TIME] [datetime2](7) NULL,
	[DOCUMENT_ID] [varchar](10) NULL,
	[COMMENT] [varchar](10) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_PERMIT] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [permit].[ORBC_PERMIT_COMMENTS](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_ID] [bigint] NOT NULL,
	[COMMENT] [nvarchar](500) NULL,
	[INTERNAL_ONLY] [bit] NOT NULL,
	[USER_GUID] [char](32) NULL,
	[COMMENT_DATE] [datetime2](7) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_PERMIT_COMMENTS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [permit].[ORBC_PERMIT_DATA](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_ID] [bigint] NULL,
	[PERMIT_DATA] [nvarchar](4000) NULL,
	[START_DATE]  AS (json_value([PERMIT_DATA],'$.startDate')),
	[EXPIRY_DATE]  AS (json_value([PERMIT_DATA],'$.expiryDate')),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_PERMIT_DATA] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [permit].[ORBC_PERMIT_STATE](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_ID] [bigint] NULL,
	[PERMIT_STATUS_ID] [varchar](20) NULL,
	[STATE_CHANGE_DATE] [datetime2](7) NULL,
	[USER_GUID] [char](32) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_PERMIT_STATE] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN](
	[ID] [varchar](8) NOT NULL,
	[DESCRIPTION] [nvarchar](50) NULL,
	[CODE] [tinyint] NOT NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_VT_PERMIT_ORIGIN] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE](
	[ID] [varchar](8) NOT NULL,
	[DESCRIPTION] [nvarchar](50) NULL,
	[CODE] [tinyint] NOT NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_VT_PERMIT_APPROVAL_SOURCE] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [permit].[ORBC_VT_PERMIT_STATUS](
	[PERMIT_STATUS_ID] [varchar](20) NOT NULL,
	[NAME] [nvarchar](50) NULL,
	[DESCRIPTION] [nvarchar](250) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_VT_PERMIT_STATUS] PRIMARY KEY CLUSTERED 
(
	[PERMIT_STATUS_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [permit].[ORBC_VT_PERMIT_TYPE](
	[PERMIT_TYPE_ID] [varchar](10) NOT NULL,
	[NAME] [nvarchar](50) NULL,
	[DESCRIPTION] [nvarchar](250) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_VT_PERMIT_TYPE] PRIMARY KEY CLUSTERED 
(
	[PERMIT_TYPE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [permit].[ORBC_PERMIT] ADD  CONSTRAINT [DF_ORBC_PERMIT_REVISION]  DEFAULT ((0)) FOR [REVISION]
GO
ALTER TABLE [permit].[ORBC_PERMIT] ADD  CONSTRAINT [DF_ORBC_PERMIT_PERMIT_STATUS_ID]  DEFAULT ('IN_PROGRESS') FOR [PERMIT_STATUS_ID]
GO
ALTER TABLE [permit].[ORBC_PERMIT] ADD  CONSTRAINT [DF_ORBC_PERMIT_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT] ADD  CONSTRAINT [DF_ORBC_PERMIT_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT] ADD  CONSTRAINT [DF_ORBC_PERMIT_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT] ADD  CONSTRAINT [DF_ORBC_PERMIT_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] ADD  CONSTRAINT [DF_ORBC_PERMIT_COMMENTS_INTERNAL_ONLY]  DEFAULT ((1)) FOR [INTERNAL_ONLY]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] ADD  CONSTRAINT [DF_ORBC_PERMIT_COMMENTS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] ADD  CONSTRAINT [DF_ORBC_PERMIT_COMMENTS_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] ADD  CONSTRAINT [DF_ORBC_PERMIT_COMMENTS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] ADD  CONSTRAINT [DF_ORBC_PERMIT_COMMENTS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_DATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_DATA_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_DATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_DATA_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_DATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_DATA_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_DATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_DATA_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] ADD  CONSTRAINT [DF_ORBC_PERMIT_STATE_STATE_CHANGE_DATE]  DEFAULT (getutcdate()) FOR [STATE_CHANGE_DATE]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] ADD  CONSTRAINT [DF_ORBC_PERMIT_STATE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] ADD  CONSTRAINT [DF_ORBC_PERMIT_STATE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] ADD  CONSTRAINT [DF_ORBC_PERMIT_STATE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] ADD  CONSTRAINT [DF_ORBC_PERMIT_STATE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_ORIGIN_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_ORIGIN_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_ORIGIN_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_ORIGIN_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_APPROVAL_SOURCE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_APPROVAL_SOURCE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_APPROVAL_SOURCE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_APPROVAL_SOURCE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_STATUS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_STATUS_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_STATUS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_STATUS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_TYPE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_TYPE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_TYPE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_TYPE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_TYPE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_TYPE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_TYPE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_TYPE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_PARENT_PERMIT] FOREIGN KEY([PREVIOUS_REV_ID])
REFERENCES [permit].[ORBC_PERMIT] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT] CHECK CONSTRAINT [FK_ORBC_PERMIT_PARENT_PERMIT]
GO
ALTER TABLE [permit].[ORBC_PERMIT]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_PERMIT_APPLICATION_ORIGIN] FOREIGN KEY([APPLICATION_ORIGIN_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT] CHECK CONSTRAINT [FK_ORBC_PERMIT_PERMIT_APPLICATION_ORIGIN]
GO
ALTER TABLE [permit].[ORBC_PERMIT]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_PERMIT_APPROVAL_SOURCE] FOREIGN KEY([PERMIT_APPROVAL_SOURCE_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT] CHECK CONSTRAINT [FK_ORBC_PERMIT_PERMIT_APPROVAL_SOURCE]
GO
ALTER TABLE [permit].[ORBC_PERMIT]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_PERMIT_TYPE] FOREIGN KEY([PERMIT_TYPE_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_TYPE] ([PERMIT_TYPE_ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT] CHECK CONSTRAINT [FK_ORBC_PERMIT_PERMIT_TYPE]
GO
ALTER TABLE [permit].[ORBC_PERMIT_DATA]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_ID] FOREIGN KEY([PERMIT_ID])
REFERENCES [permit].[ORBC_PERMIT] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_DATA] CHECK CONSTRAINT [FK_ORBC_PERMIT_ID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_COMMENTS_PERMIT] FOREIGN KEY([PERMIT_ID])
REFERENCES [permit].[ORBC_PERMIT] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] CHECK CONSTRAINT [FK_ORBC_PERMIT_COMMENTS_PERMIT]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_STATE_PERMIT] FOREIGN KEY([PERMIT_ID])
REFERENCES [permit].[ORBC_PERMIT] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] CHECK CONSTRAINT [FK_ORBC_PERMIT_STATE_PERMIT]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_STATE_PERMIT_STATUS] FOREIGN KEY([PERMIT_STATUS_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] CHECK CONSTRAINT [FK_ORBC_PERMIT_STATE_PERMIT_STATUS]
GO
ALTER TABLE [permit].[ORBC_PERMIT]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_OWNER_USER_GUID] FOREIGN KEY([OWNER_USER_GUID])
REFERENCES [dbo].[ORBC_USER] ([USER_GUID])
GO
ALTER TABLE [permit].[ORBC_PERMIT] CHECK CONSTRAINT [FK_ORBC_PERMIT_OWNER_USER_GUID]
GO
ALTER TABLE [permit].[ORBC_PERMIT]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_PERMIT_STATUS_ID] FOREIGN KEY([PERMIT_STATUS_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT] CHECK CONSTRAINT [FK_ORBC_PERMIT_PERMIT_STATUS_ID]
GO

INSERT [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ([ID], [DESCRIPTION], [CODE], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'ONLINE', N'Created Online', 2, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ([ID], [DESCRIPTION], [CODE], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'PPC', N'Created by PPC', 1, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ([ID], [DESCRIPTION], [CODE], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'AUTO', N'Auto Approved Online by Carrier', 2, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ([ID], [DESCRIPTION], [CODE], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'PPC', N'Approved by PPC', 1, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ([ID], [DESCRIPTION], [CODE], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'TPS', N'Imported from TPS', 0, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'APPROVED', N'Approved', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'AUTO_APPROVED', N'Auto Approved', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'CANCELLED', N'Cancelled', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'IN_PROGRESS', N'In Progress', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'ISSUED', N'Issued', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'REJECTED', N'Rejected', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'REVOKED', N'Revoked', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'SUPERSEDED', N'Superseded', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'UNDER_REVIEW', N'Under Review', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'VOIDED', N'Voided', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'WAITING_APPROVAL', N'Waiting Approval', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'WAITING_PAYMENT', N'Waiting Payment', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_TYPE] ([PERMIT_TYPE_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'STOS', N'Single Trip Oversize', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
INSERT [permit].[ORBC_VT_PERMIT_TYPE] ([PERMIT_TYPE_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'TROS', N'Oversize: Term', NULL, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the permit metadata record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the original permit or application without any revisions. All subsequent revisions of that original permit will share the same ORIGINAL_ID value making history tracking straightforward.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'ORIGINAL_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the ORBC_COMPANY table, represents the company requesting the permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'COMPANY_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit type table, represents the type of permit this record refers to' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'PERMIT_TYPE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit approval source table, identifying which system gave final approval to the permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'PERMIT_APPROVAL_SOURCE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit application source table, identifying the system that the permit application originated from' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'APPLICATION_ORIGIN_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique formatted permit application number' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'APPLICATION_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique formatted permit number, recorded once the permit is approved and issued' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'PERMIT_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Revision of the permit, begins with zero and increments by 1 for each subsequent revision' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'REVISION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the previous permit revision metadata record, if this permit revision is greater than zero' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'PREVIOUS_REV_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time when permit was issued' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'PERMIT_ISSUE_DATE_TIME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the document/PDF that references the Document Management System (DMS)' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'DOCUMENT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Current status of the permit or permit application.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'PERMIT_STATUS_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table recording fixed metadata for a permit application or issued permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for this comment record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to related permit metadata record this comment is related to' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'PERMIT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Freeform text comment on the permit or permit application' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'COMMENT'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Whether this comment should be considered internal-only (not for public display). 1 = internal, 0 = not internal.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'INTERNAL_ONLY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key relationship to the user table indicating the id of the user who recorded the comment' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Date and time the comment was recorded' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'COMMENT_DATE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Individual time-stamped comments related to an individual permit application' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID of the permit data record and revision (each revision is its own ID)' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit table identifying the permit record this data record is associated with' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA', @level2type=N'COLUMN',@level2name=N'PERMIT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'JSON structured data representing the permit details' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA', @level2type=N'COLUMN',@level2name=N'PERMIT_DATA'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Calculated column for the permit start date, pulled from the JSON PERMIT_DATA' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA', @level2type=N'COLUMN',@level2name=N'START_DATE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Calculated column for the permit expiry date, pulled from the JSON PERMIT_DATA' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA', @level2type=N'COLUMN',@level2name=N'EXPIRY_DATE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table tracking the submitted permit data from the user input form' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_DATA'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for this permit state record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit metadata table that this state refers to' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'PERMIT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit status table' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'PERMIT_STATUS_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Date and time that the state was changed' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'STATE_CHANGE_DATE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key relationship to the user table indicating the id of the user who effected the state change' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table tracking all historic changes to the permit or application status or other variable properties' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique identifier for the application origin' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPLICATION_ORIGIN', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Longer-form text description of the application origin' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPLICATION_ORIGIN', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Code used for the application origin in permit application number generation' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPLICATION_ORIGIN', @level2type=N'COLUMN',@level2name=N'CODE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPLICATION_ORIGIN', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPLICATION_ORIGIN', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPLICATION_ORIGIN', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPLICATION_ORIGIN', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPLICATION_ORIGIN', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Definition of all available permit application origins' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPLICATION_ORIGIN'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique identifier for the permit approval source' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPROVAL_SOURCE', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Longer-form text description of the permit approval source' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPROVAL_SOURCE', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Code for the approval source used in permit number generation' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPROVAL_SOURCE', @level2type=N'COLUMN',@level2name=N'CODE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPROVAL_SOURCE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPROVAL_SOURCE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPROVAL_SOURCE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPROVAL_SOURCE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPROVAL_SOURCE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Definition of all possible sources of permit approvals' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_APPROVAL_SOURCE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique id of the permit status' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_STATUS', @level2type=N'COLUMN',@level2name=N'PERMIT_STATUS_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Friendly name of the permit status' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_STATUS', @level2type=N'COLUMN',@level2name=N'NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Long description of the permit status' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_STATUS', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_STATUS', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_STATUS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_STATUS', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_STATUS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_STATUS', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Defines all possible status values a permit can be in' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_STATUS'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID of the permit type' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_TYPE', @level2type=N'COLUMN',@level2name=N'PERMIT_TYPE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Friendly name for the permit type' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_TYPE', @level2type=N'COLUMN',@level2name=N'NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Long description of the permit type' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_TYPE', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table enumerating all possible permit types' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PERMIT_TYPE'
GO

CREATE SEQUENCE [permit].[ORBC_PERMIT_NUMBER_SEQ] 
 AS [bigint]
 START WITH 10000
 INCREMENT BY 1
 MINVALUE 1
 MAXVALUE 99999999
 CACHE 
GO

CREATE   TRIGGER [permit].[ORBC_PERMIT_APPLICATION_NUMBER_TRG] 
   ON  [permit].[ORBC_PERMIT] 
   AFTER INSERT
AS 
BEGIN
	SET NOCOUNT ON;
	DECLARE @ApplicationNumber varchar(19)
	DECLARE @PermitID bigint
	DECLARE @OriginId varchar(8)
	DECLARE @Src tinyint
	DECLARE @SeqVal char(8)
	DECLARE @Revision tinyint
	DECLARE @RevisionSuffix varchar(4) = ''
	DECLARE @Rnd char(3)

	SELECT @ApplicationNumber = APPLICATION_NUMBER FROM INSERTED
	SELECT @PermitID = ID FROM INSERTED

	IF @ApplicationNumber IS NULL
	BEGIN
		SELECT @Revision = REVISION FROM INSERTED
		IF @Revision > 0
		BEGIN
			-- All revisions of a permit share the same sequence number
			-- and 3-character suffix number
			DECLARE @PreviousID bigint, @PreviousPermitNumber varchar(19)

			-- For a permit to have a revision, it must have previously
			-- had a permit number assigned (i.e. the previous revision must
			-- have been in an ISSUED state)
			SELECT @PreviousID = PREVIOUS_REV_ID FROM INSERTED
			SELECT @PreviousPermitNumber = PERMIT_NUMBER FROM [PERMIT].[ORBC_PERMIT] WHERE ID = @PreviousID
			SET @SeqVal = SUBSTRING(@PreviousPermitNumber, 4, 8)
			SET @Rnd = SUBSTRING(@PreviousPermitNumber, 13, 3)
			SET @RevisionSuffix = CONCAT('-R', FORMAT(@Revision, '00'))
		END
		ELSE
		BEGIN
			-- New applications get their sequence number from the ID and
			-- the 3-character suffix number is randomized
			SET @SeqVal = FORMAT(@PermitID, '00000000')
			SET @Rnd = FORMAT(CAST(RAND() * 1000 AS INT), '000')
		END
		
		SELECT @OriginId = APPLICATION_ORIGIN_ID FROM INSERTED
		SELECT @Src = CODE FROM [PERMIT].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] WHERE ID = @OriginId

		-- We should not get to this point, but if no application source was
		-- specified we fall back to 9 for unknown source
		IF @Src IS NULL
			SET @Src = 9

		UPDATE [PERMIT].[ORBC_PERMIT] SET APPLICATION_NUMBER = CONCAT('A', @Src, '-', @SeqVal, '-', @Rnd, @RevisionSuffix) WHERE ID = @PermitID
	END

	-- Set this new application state to IN_PROGRESS by default
	INSERT INTO [PERMIT].[ORBC_PERMIT_STATE] (PERMIT_ID, PERMIT_STATUS_ID) VALUES (@PermitID, 'IN_PROGRESS')
END
GO

CREATE   TRIGGER [permit].[ORBC_PERMIT_ORIGINAL_ID_TRG] 
   ON  [permit].[ORBC_PERMIT] 
   AFTER INSERT
AS 
BEGIN
	SET NOCOUNT ON;
	DECLARE @OriginalID varchar(19)
	DECLARE @PermitID bigint

	SELECT @OriginalID = ORIGINAL_ID FROM INSERTED
	SELECT @PermitID = ID FROM INSERTED

	IF @OriginalID IS NULL
	BEGIN
		UPDATE [PERMIT].[ORBC_PERMIT] SET ORIGINAL_ID = @PermitID WHERE ID = @PermitID
	END

END
GO

ALTER TABLE [permit].[ORBC_PERMIT] DISABLE TRIGGER [ORBC_PERMIT_APPLICATION_NUMBER_TRG]
GO

CREATE TRIGGER [permit].[ORBC_PERMIT_NUMBER_TRG] 
   ON  [permit].[ORBC_PERMIT_STATE] 
   AFTER INSERT
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for trigger here
	DECLARE @Status varchar(20)
	SELECT @Status = PERMIT_STATUS_ID FROM INSERTED
	IF @Status = 'ISSUED'
	BEGIN
		-- When a status of ISSUED is set on a permit, we create
		-- a permit number automatically if not already set
		DECLARE @PermitID bigint
		SELECT @PermitID = PERMIT_ID FROM INSERTED
		DECLARE @PermitNumber varchar(19)
		SELECT @PermitNumber = PERMIT_NUMBER FROM [PERMIT].[ORBC_PERMIT] WHERE ID = @PermitID

		IF (@PermitNumber IS NULL)
		BEGIN
			DECLARE @ApplicationNumber varchar(19)
			SELECT @ApplicationNumber = APPLICATION_NUMBER FROM [PERMIT].[ORBC_PERMIT] WHERE ID = @PermitID
			DECLARE @SrcID varchar(8)
			SELECT @SrcID = PERMIT_APPROVAL_SOURCE_ID FROM [PERMIT].[ORBC_PERMIT] WHERE ID = @PermitID
			DECLARE @ApprovalCode tinyint
			SELECT @ApprovalCode = CODE FROM [PERMIT].[ORBC_VT_PERMIT_APPROVAL_SOURCE] WHERE ID = @SrcID
			
			-- If somehow there is no approval code, fall back to 9 for unknown
			IF @ApprovalCode IS NULL
				SET @ApprovalCode = 9

			DECLARE @Revision tinyint
			SELECT @Revision = REVISION FROM [PERMIT].[ORBC_PERMIT] WHERE ID = @PermitID
			IF @Revision = 0
			BEGIN
				-- If this is the original permit with no revisions, calculate a new random
				-- 3-digit suffix so the user cannot guess the permit number from the
				-- application number
				DECLARE @Rnd char(3)
				SET @Rnd = FORMAT(CAST(RAND() * 1000 AS INT), '000')
				DECLARE @SeqVal char(8)
				SET @SeqVal = SUBSTRING(@ApplicationNumber, 4, 8)
				SET @PermitNumber = CONCAT('P', @ApprovalCode, '-', @SeqVal, '-', @Rnd)
			END
			ELSE
			BEGIN
				-- For any revision and all subsequent revisions, we maintain the same
				-- permit number and application number, apart from the second character
				-- which indicates who approved the permit
				SET @PermitNumber = SUBSTRING(@ApplicationNumber, 4, 19)
				SET @PermitNumber = CONCAT('P', @ApprovalCode, '-', @PermitNumber)
			END

			UPDATE [PERMIT].[ORBC_PERMIT] SET PERMIT_NUMBER = @PermitNumber WHERE ID = @PermitID
		END
	END
END
GO

ALTER TABLE [permit].[ORBC_PERMIT_STATE] DISABLE TRIGGER [ORBC_PERMIT_NUMBER_TRG]
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for applying for and issuing permits'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (4, @VersionDescription, '$(FILE_HASH)', getutcdate())

COMMIT