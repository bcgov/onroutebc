SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

DROP TABLE [dbo].[ORBC_POWER_UNIT]
DROP TABLE [dbo].[ORBC_TRAILER]
DROP TABLE [dbo].[ORBC_VT_POWER_UNIT_TYPE]
DROP TABLE [dbo].[ORBC_VT_TRAILER_TYPE]
DROP TABLE [dbo].[ORBC_VT_PROVINCE]
DROP TABLE [dbo].[ORBC_VT_COUNTRY]

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting initial creation of schema entities for manage vehicles feature'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (1, @VersionDescription, getutcdate())
