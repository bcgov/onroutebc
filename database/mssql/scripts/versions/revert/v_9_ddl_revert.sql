SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

DROP TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS]
DROP TABLE [tps].[LEGACY_TPS_CLIENT_DATA]
DROP SCHEMA [tps]

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting creation of tables to store TPS migration staging data.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (8, @VersionDescription, '$(FILE_HASH)', getutcdate())
