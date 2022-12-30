-- Search and replace TABLENAME with the name of the table you want
-- audit columns added to.

USE ORBC_DEV
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER TABLE TABLENAME ADD
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
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL;

ALTER TABLE [dbo].[TABLENAME] ADD  CONSTRAINT [DF_TABLENAME_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO

ALTER TABLE [dbo].[TABLENAME] ADD  CONSTRAINT [DF_TABLENAME_DB_CREATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_CREATE_TIMESTAMP]
GO

ALTER TABLE [dbo].[TABLENAME] ADD  CONSTRAINT [DF_TABLENAME_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO

ALTER TABLE [dbo].[TABLENAME] ADD  CONSTRAINT [DF_TABLENAME_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_CREATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user account name of the application user who performed the action that created or last updated the record (e.g. ''JSMITH''). This value is not preceded by the directory name.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time of the application action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Globally Unique Identifier of the application user who performed the action that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory in which APP_LAST_UPDATE_USERID is defined.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'TABLENAME', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO


