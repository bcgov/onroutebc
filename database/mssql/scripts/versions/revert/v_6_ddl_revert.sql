SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

SET XACT_ABORT ON

BEGIN TRY
  BEGIN TRANSACTION
    DROP TABLE [dops].[ORBC_EXTERNAL_DOCUMENT]
    DROP TABLE [dops].[ORBC_DOCUMENT]
  COMMIT
END TRY

BEGIN CATCH
  IF @@TRANCOUNT > 0 
    ROLLBACK;
  THROW
END CATCH

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting initial creation of entities for Document Management System (DMS).'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (5, @VersionDescription, getutcdate())
