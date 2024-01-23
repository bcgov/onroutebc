SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

-- Include all SQL to upgrade database version here.
-- Include updates to lookup table data that should go into prod, but do not include any test data.
-- Replace the version description below to describe the change(s) made
-- Replace the version number (integer) in the INSERT statement below to match the version of the
--   database you are upgrading to.
-- See v_1_ddl.sql for a practical example



-- Create sequence dbo.ORBC_FEATURE_FLAG_ID_SEQ
PRINT N'Create sequence dbo.ORBC_FEATURE_FLAG_ID_SEQ'
GO
CREATE SEQUENCE [dbo].[ORBC_FEATURE_FLAG_ID_SEQ]
	AS bigint
	START WITH 1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	NO CYCLE
	CACHE 50
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Create table dbo.ORBC_FEATURE_FLAG
PRINT N'Create table dbo.ORBC_FEATURE_FLAG'
GO
CREATE TABLE [dbo].[ORBC_FEATURE_FLAG]  ( 
    [ID]           	bigint NOT NULL DEFAULT (NEXT VALUE FOR [dbo].[ORBC_FEATURE_FLAG_ID_SEQ]),
    [FEATURE_KEY] [nvarchar](50) NULL,
    [FEATURE_VALUE] [nvarchar](50) NULL,
ON [PRIMARY])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO


DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Add Feature Flag Support'
INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (13, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
