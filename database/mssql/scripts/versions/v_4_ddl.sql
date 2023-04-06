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
	[PERMIT_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_DATA] [nvarchar](4000) NULL,
	[PERMIT_NUMBER]  AS (json_value([PERMIT_DATA],'$.permitNumber')),
	[START_DATE]  AS (json_value([PERMIT_DATA],'$.startDate')),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_PERMIT] PRIMARY KEY CLUSTERED 
(
	[PERMIT_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [permit].[ORBC_PERMIT_COMMENTS](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_METADATA_ID] [bigint] NOT NULL,
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
CREATE TABLE [permit].[ORBC_PERMIT_METADATA](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_ID] [bigint] NULL,
	[COMPANY_ID] [int] NULL,
	[PERMIT_TYPE_ID] [varchar](10) NULL,
	[PERMIT_APPROVAL_SOURCE_ID] [tinyint] NULL,
	[APPLICATION_ORIGIN_ID] [tinyint] NULL,
	[APPLICATION_NUMBER] [varchar](19) NULL,
	[ISSUED_PERMIT_NUMBER] [varchar](19) NULL,
	[REVISION] [tinyint] NULL,
	[PREVIOUS_REV_METADATA_ID] [bigint] NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_PERMIT_METADATA] PRIMARY KEY CLUSTERED 
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
	[PERMIT_METADATA_ID] [bigint] NULL,
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
	[ID] [tinyint] NOT NULL,
	[DESCRIPTION] [nvarchar](50) NULL,
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
	[ID] [tinyint] NOT NULL,
	[DESCRIPTION] [nvarchar](50) NULL,
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

ALTER TABLE [permit].[ORBC_PERMIT] ADD  CONSTRAINT [DF_ORBC_PERMIT_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT] ADD  CONSTRAINT [DF_ORBC_PERMIT_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT] ADD  CONSTRAINT [DF_ORBC_PERMIT_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT] ADD  CONSTRAINT [DF_ORBC_PERMIT_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] ADD  CONSTRAINT [DF_ORBC_PERMIT_COMMENTS_INTERNAL_ONLY]  DEFAULT ((1)) FOR [INTERNAL_ONLY]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] ADD  CONSTRAINT [DF_ORBC_PERMIT_COMMENTS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] ADD  CONSTRAINT [DF_ORBC_PERMIT_COMMENTS_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] ADD  CONSTRAINT [DF_ORBC_PERMIT_COMMENTS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] ADD  CONSTRAINT [DF_ORBC_PERMIT_COMMENTS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_METADATA_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_METADATA_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_METADATA_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_METADATA_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] ADD  CONSTRAINT [DF_ORBC_PERMIT_STATE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] ADD  CONSTRAINT [DF_ORBC_PERMIT_STATE_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] ADD  CONSTRAINT [DF_ORBC_PERMIT_STATE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] ADD  CONSTRAINT [DF_ORBC_PERMIT_STATE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_ORIGIN_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_ORIGIN_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_ORIGIN_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_ORIGIN_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_APPROVAL_SOURCE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_APPROVAL_SOURCE_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_APPROVAL_SOURCE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_APPROVAL_SOURCE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_STATUS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_STATUS_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_STATUS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_STATUS] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_STATUS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_TYPE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_TYPE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_TYPE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_TYPE_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_TYPE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_TYPE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [permit].[ORBC_VT_PERMIT_TYPE] ADD  CONSTRAINT [DF_ORBC_VT_PERMIT_TYPE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_COMMENTS_PERMIT_METADATA] FOREIGN KEY([PERMIT_METADATA_ID])
REFERENCES [permit].[ORBC_PERMIT_METADATA] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_COMMENTS] CHECK CONSTRAINT [FK_ORBC_PERMIT_COMMENTS_PERMIT_METADATA]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_METADATA_PARENT_PERMIT_METADATA] FOREIGN KEY([PREVIOUS_REV_METADATA_ID])
REFERENCES [permit].[ORBC_PERMIT_METADATA] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] CHECK CONSTRAINT [FK_ORBC_PERMIT_METADATA_PARENT_PERMIT_METADATA]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT] FOREIGN KEY([PERMIT_ID])
REFERENCES [permit].[ORBC_PERMIT] ([PERMIT_ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] CHECK CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT_APPLICATION_ORIGIN] FOREIGN KEY([APPLICATION_ORIGIN_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] CHECK CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT_APPLICATION_ORIGIN]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT_APPROVAL_SOURCE] FOREIGN KEY([PERMIT_APPROVAL_SOURCE_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] CHECK CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT_APPROVAL_SOURCE]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT_TYPE] FOREIGN KEY([PERMIT_TYPE_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_TYPE] ([PERMIT_TYPE_ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] CHECK CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT_TYPE]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_STATE_PERMIT_METADATA] FOREIGN KEY([PERMIT_METADATA_ID])
REFERENCES [permit].[ORBC_PERMIT_METADATA] ([ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] CHECK CONSTRAINT [FK_ORBC_PERMIT_STATE_PERMIT_METADATA]
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_STATE_PERMIT_STATUS] FOREIGN KEY([PERMIT_STATUS_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_STATE] CHECK CONSTRAINT [FK_ORBC_PERMIT_STATE_PERMIT_STATUS]
GO

INSERT [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ([ID], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (1, N'Created by PPC', NULL, N'dbo', CAST(N'2023-04-05T23:14:09.0566667' AS DateTime2), N'dbo', CAST(N'2023-04-05T23:14:09.0566667' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_APPLICATION_ORIGIN] ([ID], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2, N'Created Online', NULL, N'dbo', CAST(N'2023-04-05T23:14:14.6333333' AS DateTime2), N'dbo', CAST(N'2023-04-05T23:14:14.6333333' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ([ID], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (0, N'Imported from TPS', NULL, N'dbo', CAST(N'2023-04-05T23:14:31.4133333' AS DateTime2), N'dbo', CAST(N'2023-04-05T23:14:31.4133333' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ([ID], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (1, N'Approved by PPC', NULL, N'dbo', CAST(N'2023-04-05T23:14:37.0133333' AS DateTime2), N'dbo', CAST(N'2023-04-05T23:14:37.0133333' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_APPROVAL_SOURCE] ([ID], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2, N'Auto Approved Online by Carrier', NULL, N'dbo', CAST(N'2023-04-05T23:14:45.9333333' AS DateTime2), N'dbo', CAST(N'2023-04-05T23:14:45.9333333' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'APPROVED', N'Approved', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:30:04.8033333' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:30:04.8033333' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'AUTO_APPROVED', N'Auto Approved', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:30:32.2466667' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:30:32.2466667' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'CANCELLED', N'Cancelled', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:30:40.2200000' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:30:40.2200000' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'IN_PROGRESS', N'In Progress', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:30:50.3466667' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:30:50.3466667' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'ISSUED', N'Issued', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:30:58.0100000' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:30:58.0100000' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'REJECTED', N'Rejected', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:31:05.4300000' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:31:05.4300000' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'REVOKED', N'Revoked', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:31:18.6266667' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:31:18.6266667' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'SUPERSEDED', N'Superseded', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:31:25.5333333' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:31:25.5333333' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'UNDER_REVIEW', N'Under Review', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:31:39.3700000' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:31:39.3700000' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'VOIDED', N'Voided', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:31:42.8900000' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:31:42.8900000' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'WAITING_APPROVAL', N'Waiting Approval', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:32:00.8433333' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:32:00.8433333' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'WAITING_PAYMENT', N'Waiting Payment', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:32:09.2566667' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:32:09.2566667' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_TYPE] ([PERMIT_TYPE_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'STOS', N'Single Trip Oversize', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:28:06.8366667' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:28:06.8366667' AS DateTime2))
GO
INSERT [permit].[ORBC_VT_PERMIT_TYPE] ([PERMIT_TYPE_ID], [NAME], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'TROS', N'Term Oversize', NULL, NULL, N'dbo', CAST(N'2023-03-31T21:28:06.8466667' AS DateTime2), N'dbo', CAST(N'2023-03-31T21:28:06.8466667' AS DateTime2))
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID of the permit record and revision (each revision is its own ID)' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'PERMIT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'JSON structured data representing the permit details' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'PERMIT_DATA'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Calculated column for the permit number, pulled from the JSON PERMIT_DATA' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'PERMIT_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Calculated column for the permit start date, pulled from the JSON PERMIT_DATA' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT', @level2type=N'COLUMN',@level2name=N'START_DATE'
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
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table tracking the submitted permit data from the user input form' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for this comment record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to related permit metadata record this comment is related to' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_COMMENTS', @level2type=N'COLUMN',@level2name=N'PERMIT_METADATA_ID'
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
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the permit metadata record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit table identifying the permit record this metadata record is associated with' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'PERMIT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the ORBC_COMPANY table, represents the company requesting the permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'COMPANY_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit type table, represents the type of permit this record refers to' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'PERMIT_TYPE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit approval source table, identifying which system gave final approval to the permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'PERMIT_APPROVAL_SOURCE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit application source table, identifying the system that the permit application originated from' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'APPLICATION_ORIGIN_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique formatted permit application number' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'APPLICATION_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique formatted permit number, recorded once the permit is approved and issued' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'ISSUED_PERMIT_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Revision of the permit, begins with zero and increments by 1 for each subsequent revision' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'REVISION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the previous permit revision metadata record, if this permit revision is greater than zero' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'PREVIOUS_REV_METADATA_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table recording fixed metadata for a permit application or issued permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for this permit state record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the permit metadata table that this state refers to' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_STATE', @level2type=N'COLUMN',@level2name=N'PERMIT_METADATA_ID'
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

CREATE FUNCTION [permit].[ORBC_GENERATE_PERMIT_NUMBER_FN] (@TYPE char(1), @SOURCE tinyint, @SEQ int)
-- @TYPE is either 'A' or 'P' - application number (A) or approved permit number (P)
-- @SOURCE is the source of either the application (for A), or the source of the permit approval (for P)
-- @SEQ is typically the PERMIT_ID (integer, intended to be auto-incrementing)
-- Returning varchar(19) to allow for future permit amendment suffix characters
RETURNS varchar(19)
AS
BEGIN
	DECLARE @PermitNumber varchar(19);
	DECLARE @Now datetime2(7) = getdate()
	DECLARE @Milli char(3);
	SET @Milli = FORMAT(@Now, 'fff');


	SET @PermitNumber = CONCAT(@TYPE, @SOURCE, '-', FORMAT(@SEQ, '00000000'), '-', @Milli);
	RETURN(@PermitNumber);
END;
GO

CREATE   TRIGGER [permit].[ORBC_PERMIT_APPLICATION_NUMBER_TRG] 
   ON  [permit].[ORBC_PERMIT_METADATA] 
   AFTER INSERT
AS 
BEGIN
	SET NOCOUNT ON;
	DECLARE @ApplicationNumber varchar(19), @Src tinyint, @SeqVal bigint, @MetadataId bigint
	SELECT @ApplicationNumber = APPLICATION_NUMBER FROM INSERTED

	IF @ApplicationNumber IS NULL
		BEGIN
			SELECT @Src = APPLICATION_ORIGIN_ID FROM INSERTED
			SELECT @SeqVal = PERMIT_ID FROM INSERTED
			SELECT @MetadataId = ID FROM INSERTED
			DECLARE @NewApplicationNumber varchar(19)
			SET @NewApplicationNumber = [permit].[ORBC_GENERATE_PERMIT_NUMBER_FN]('A', @Src, @SeqVal);
			UPDATE [PERMIT].[ORBC_PERMIT_METADATA] SET APPLICATION_NUMBER = @NewApplicationNumber  WHERE ID = @MetadataId
		END
END
GO

ALTER TABLE [permit].[ORBC_PERMIT_METADATA] ENABLE TRIGGER [ORBC_PERMIT_APPLICATION_NUMBER_TRG]
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for applying for and issuing permits'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (4, @VersionDescription, '$(FILE_HASH)', getdate())

COMMIT