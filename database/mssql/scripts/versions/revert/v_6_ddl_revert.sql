SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
BEGIN TRANSACTION

DROP TABLE [dms].[ORBC_DOCUMENT]

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting initial creation of entities for Document Management System (DMS).'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (5, @VersionDescription, '$(FILE_HASH)', getdate())

COMMIT