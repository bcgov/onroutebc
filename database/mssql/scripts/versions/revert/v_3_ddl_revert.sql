SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
BEGIN TRANSACTION

DROP TABLE [dbo].[ORBC_COMPANY_USER]
DROP TABLE [dbo].[ORBC_PENDING_USER]
DROP TABLE [dbo].[ORBC_PENDING_IDIR_USER]
/* Drop the FK constraints and company ID column added to the vehicle tables */
ALTER TABLE [dbo].ORBC_POWER_UNIT DROP CONSTRAINT [FK_ORBC_POWER_UNIT_COMPANY]
ALTER TABLE [dbo].ORBC_POWER_UNIT DROP COLUMN COMPANY_ID
ALTER TABLE [dbo].ORBC_TRAILER DROP CONSTRAINT [FK_ORBC_TRAILER_COMPANY]
ALTER TABLE [dbo].ORBC_TRAILER DROP COLUMN COMPANY_ID
DROP TABLE [dbo].[ORBC_COMPANY]
DROP TABLE [access].[ORBC_GROUP_ROLE]
DROP TABLE [dbo].[ORBC_USER]
DROP TABLE [dbo].[ORBC_IDIR_USER]
DROP TABLE [dbo].[ORBC_ADDRESS]
DROP TABLE [dbo].[ORBC_CONTACT]
DROP TABLE [dbo].[ORBC_VT_DIRECTORY]
DROP TABLE [access].[ORBC_VT_ROLE]
DROP TABLE [access].[ORBC_VT_USER_AUTH_GROUP]
DROP TABLE [dbo].[ORBC_VT_USER_STATUS]
DROP FUNCTION IF EXISTS [dbo].[ORBC_GENERATE_CLIENT_NUMBER_FN]
DROP FUNCTION IF EXISTS [access].[ORBC_GET_ROLES_FOR_USER_FN]
DROP SEQUENCE [dbo].[ORBC_CLIENT_NUMBER_SEQ]
DROP SCHEMA [access]

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting initial creation of schema entities for manage profile feature'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (2, @VersionDescription, '$(FILE_HASH)', getdate())

COMMIT