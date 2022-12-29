USE $(MSSQL_DB)
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
BEGIN TRANSACTION

-- Include all SQL to upgrade database version here.
-- Include updates to lookup table data that should go into prod, but do not include any test data.
-- Replace the version description below to describe the change(s) made
-- Replace the version number (integer) in the INSERT statement below to match the version of the
--   database you are upgrading to.
-- See v_1_ddl.sql for a practical example

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = '*** Enter description of DB change here ***'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (/*<<REPLACE VERSION NUMBER HERE>>*/, @VersionDescription, '$(FILE_HASH)', getdate())

COMMIT