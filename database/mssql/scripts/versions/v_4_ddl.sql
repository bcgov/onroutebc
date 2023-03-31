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
CREATE TABLE [permit].[ORBC_PERMIT_METADATA](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_ID] [bigint] NOT NULL,
	[STATUS_ID] [varchar](20) NOT NULL,
	[COMPANY_ID] [int] NOT NULL,
	[PERMIT_TYPE_ID] [varchar](10) NOT NULL,
	[REVISION] [int] NOT NULL,
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
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_METADATA_STATUS_ID]  DEFAULT ('IN_PROGRESS') FOR [STATUS_ID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_METADATA_REVISION]  DEFAULT ((0)) FOR [REVISION]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_METADATA_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_METADATA_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] ADD  CONSTRAINT [DF_ORBC_PERMIT_METADATA_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
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
ALTER TABLE [permit].[ORBC_PERMIT_METADATA]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_METADATA_COMPANY] FOREIGN KEY([COMPANY_ID])
REFERENCES [dbo].[ORBC_COMPANY] ([COMPANY_ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] CHECK CONSTRAINT [FK_ORBC_PERMIT_METADATA_COMPANY]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT] FOREIGN KEY([PERMIT_ID])
REFERENCES [permit].[ORBC_PERMIT] ([PERMIT_ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] CHECK CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT_STATUS] FOREIGN KEY([STATUS_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_STATUS] ([PERMIT_STATUS_ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] CHECK CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT_STATUS]
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT_TYPE] FOREIGN KEY([PERMIT_TYPE_ID])
REFERENCES [permit].[ORBC_VT_PERMIT_TYPE] ([PERMIT_TYPE_ID])
GO
ALTER TABLE [permit].[ORBC_PERMIT_METADATA] CHECK CONSTRAINT [FK_ORBC_PERMIT_METADATA_PERMIT_TYPE]
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
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key ID for the permit metadata record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the ORBC_PERMIT table' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'PERMIT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the ORBC_VT_PERMIT_STATUS table, represents the current status of the permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'STATUS_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the ORBC_COMPANY table, represents the company requesting the permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'COMPANY_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the ORBC_VT_PERMIT_TYPE table, represents the type of permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'PERMIT_TYPE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Revision of the permit, begins with zero and increments by 1 for each subsequent revision' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_METADATA', @level2type=N'COLUMN',@level2name=N'REVISION'
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

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for applying for and issuing permits'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (4, @VersionDescription, '$(FILE_HASH)', getdate())

COMMIT