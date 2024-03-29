SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

CREATE TABLE [dbo].[ORBC_SYS_VERSION](
	[MIGRATION_ID] [int] IDENTITY(1,1) NOT NULL,
	[VERSION_ID] [int] NOT NULL,
	[DESCRIPTION] [varchar](255) NULL,
	[UPDATE_SCRIPT] [nvarchar](max) NULL,
	[REVERT_SCRIPT] [nvarchar](max) NULL,
	[RELEASE_DATE] [datetime2](7) NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_SYS_VERSION] PRIMARY KEY CLUSTERED 
(
	[MIGRATION_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ORBC_SYS_VERSION] ADD  CONSTRAINT [DF_ORBC_SYS_VERSION_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [dbo].[ORBC_SYS_VERSION] ADD  CONSTRAINT [DF_ORBC_SYS_VERSION_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [dbo].[ORBC_SYS_VERSION] ADD  CONSTRAINT [DF_ORBC_SYS_VERSION_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [dbo].[ORBC_SYS_VERSION] ADD  CONSTRAINT [DF_ORBC_SYS_VERSION_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID of the migration - refers to either a schema update or a revert of a schema update.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_SYS_VERSION', @level2type=N'COLUMN',@level2name=N'MIGRATION_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Version number of the database schema.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_SYS_VERSION', @level2type=N'COLUMN',@level2name=N'VERSION_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Description of what was changed in the schema version update or revert.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_SYS_VERSION', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Date and time of the version update or revert.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_SYS_VERSION', @level2type=N'COLUMN',@level2name=N'RELEASE_DATE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_SYS_VERSION', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_SYS_VERSION', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_SYS_VERSION', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_SYS_VERSION', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table tracking the ORBC database schema version history' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_SYS_VERSION'
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initialize versions system table'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (1, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())