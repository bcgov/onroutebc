SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

-- Add TRY CATCH as a TEMP solution untill Full Text Search is installed in DB.
BEGIN TRY
  DROP FULLTEXT INDEX ON [permit].[ORBC_PERMIT_DATA]
  DROP FULLTEXT CATALOG PermitDataFTCat
END TRY

BEGIN CATCH
  PRINT ERROR_MESSAGE()
END CATCH

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting Creation of Full Text Search Index on ORBC_PERMIT_DATA table.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (7, @VersionDescription, getutcdate())
