SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
BEGIN TRANSACTION

CREATE TABLE [dbo].[ORBC_VT_ERROR_TYPE](
	[ERROR_TYPE_ID] [int] IDENTITY(1,1) NOT NULL,
	[ERROR_TYPE_CODE] [varchar] (30) NOT NULL,
	[DESCRIPTION] [varchar] (50) NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [ORBC_VT_ERROR_TYPE_PK] PRIMARY KEY CLUSTERED 
(
	[ERROR_TYPE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET IDENTITY_INSERT [dbo].[ORBC_VT_ERROR_TYPE] ON 
INSERT [dbo].[ORBC_VT_ERROR_TYPE] ([ERROR_TYPE_ID], [ERROR_TYPE_CODE], [DESCRIPTION], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (1, N'NOT_FOUND', N'Page not found', N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT [dbo].[ORBC_VT_ERROR_TYPE] ([ERROR_TYPE_ID], [ERROR_TYPE_CODE], [DESCRIPTION], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2, N'UNAUTHORIZED', N'Unauthorized', N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT [dbo].[ORBC_VT_ERROR_TYPE] ([ERROR_TYPE_ID], [ERROR_TYPE_CODE], [DESCRIPTION], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (3, N'UNIVERSAL_UNAUTHORIZED', N'Universal Unauthorized', N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT [dbo].[ORBC_VT_ERROR_TYPE] ([ERROR_TYPE_ID], [ERROR_TYPE_CODE], [DESCRIPTION], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (4, N'UNEXPECTED', N'Unexpected', N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
SET IDENTITY_INSERT [dbo].[ORBC_VT_ERROR_TYPE] OFF 

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORBC_ERROR](
	[ERROR_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ERROR_TYPE_ID] [int] NOT NULL,
	[ERROR_OCCURED_TIME] [datetime2](7) NOT NULL,
	[SESSION_ID] [varchar] (50) NOT NULL,
	[USER_GUID] [char] (32) NOT NULL,
	[CORELATION_ID] [varchar] (32) NOT NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [ORBC_ERROR_PK] PRIMARY KEY CLUSTERED 
(
	[ERROR_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


ALTER TABLE [dbo].[ORBC_ERROR] ADD  CONSTRAINT [ORBC_ERROR_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_ERROR] ADD  CONSTRAINT [ORBC_ERROR_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO
ALTER TABLE [dbo].[ORBC_ERROR] ADD  CONSTRAINT [ORBC_ERROR_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO
ALTER TABLE [dbo].[ORBC_ERROR] ADD  CONSTRAINT [ORBC_ERROR_DB_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO


ALTER TABLE [dbo].[ORBC_ERROR]  WITH CHECK ADD  CONSTRAINT [ORBC_ERROR_USER_GUID_FK] FOREIGN KEY([USER_GUID])
REFERENCES [dbo].[ORBC_USER] ([USER_GUID])
GO

ALTER TABLE [dbo].[ORBC_ERROR]  WITH CHECK ADD  CONSTRAINT [ORBC_ERROR_ERROR_TYPE_ID_FK] FOREIGN KEY([ERROR_TYPE_ID])
REFERENCES [dbo].[ORBC_VT_ERROR_TYPE] ([ERROR_TYPE_ID])
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Primary key for error type metadata record' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_ERROR_TYPE', @level2type=N'COLUMN',@level2name=N'ERROR_TYPE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Error type code' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_ERROR_TYPE', @level2type=N'COLUMN',@level2name=N'ERROR_TYPE_CODE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Error type description' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_VT_ERROR_TYPE', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Primary key for error metadata record' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ERROR', @level2type=N'COLUMN',@level2name=N'ERROR_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Error type id' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ERROR', @level2type=N'COLUMN',@level2name=N'ERROR_TYPE_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time that the error occured' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ERROR', @level2type=N'COLUMN',@level2name=N'ERROR_OCCURED_TIME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Session id related to the error' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ERROR', @level2type=N'COLUMN',@level2name=N'SESSION_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'User guid related to the error' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ERROR', @level2type=N'COLUMN',@level2name=N'USER_GUID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique id generated for each error instance to facilitate easy tracking and correlation' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_ERROR', @level2type=N'COLUMN',@level2name=N'CORELATION_ID'
GO


DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for error'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (9, @VersionDescription, '$(FILE_HASH)', getutcdate())


COMMIT
