-- This is a typical DDL migration script 
-- Note that a revert script is ALSO needed, so be sure to check out
-- revert/sample-ddl.sql

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

-- Here is what a typical create table looks like
-- Note that the APP_CREATE_*, APP_LAST_*, CONCURRENCY and DB_CREATE / DB_LAST columns
-- are all mandatory along with the columns you're creating
-- CREATE TABLE [dbo].[ORBC_NEW_TABLE](	
--	[NEW_TABLE_ID] [int] IDENTITY(1,1) NOT NULL,
--  [NEW_TABLE_COL_1] [nvarchar](50) NOT NULL,
--  [NEW_TABLE_COL_2] [nvarchar](50) NOT NULL,
--	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
--	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
--	[APP_CREATE_USER_GUID] [char](32) NULL,
--	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
--	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
--	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
--	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
--	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
--	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
--	[DB_CREATE_USERID] [varchar](63) NULL,
--	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
--	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
--	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
-- CONSTRAINT [ORBC_FEATURE_FLAG_PK] PRIMARY KEY CLUSTERED 
--(
--	[NEW_TABLE_ID] ASC
--)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
--) ON [PRIMARY]
--GO

-- Include extended descriptions of each new column created
-- along with the descriptions of the standard columns
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'NEW_TABLE_ID'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The column1 description' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'NEW_TABLE_COL_1'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The column2 description' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'NEW_TABLE_COL_2'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_FEATURE_FLAG', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created by the application.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The userid of the application user that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The guid of the application user that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory of the application user that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was last updated by the application.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The guid of the application user that last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory of the application user that last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1Name=N'ORBC_NEW_TABLE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
--GO

-- Include all SQL to upgrade database version here.
-- Include updates to lookup table data that should go into prod, but do not include any test data.
-- Replace the version description below to describe the change(s) made
-- Replace the version number (integer) in the INSERT statement below to match the version of the
--   database you are upgrading to.
-- See v_1_ddl.sql for a practical example

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = '*** Enter description of DB change here ***'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (/*<<REPLACE VERSION NUMBER HERE>>*/, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
