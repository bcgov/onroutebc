SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

DROP TABLE [dops].[ORBC_DOCUMENT_TEMPLATE]
DROP SCHEMA [dops]

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting initial creation of entities for document generation feature'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (4, @VersionDescription, getutcdate())
