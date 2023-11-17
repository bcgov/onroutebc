SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

SET XACT_ABORT ON

BEGIN TRY
  BEGIN TRANSACTION
    DROP TABLE [permit].[ORBC_PERMIT_TRANSACTION]
    DROP TABLE [permit].[ORBC_RECEIPT]
    DROP TABLE [permit].[ORBC_TRANSACTION]
    DROP TABLE [permit].[ORBC_TRANSACTION_TYPE]
    DROP TABLE [permit].[ORBC_PAYMENT_METHOD_TYPE]
    DROP TABLE [permit].[ORBC_PAYMENT_TYPE]
    DROP SEQUENCE [permit].[ORBC_RECEIPT_NUMBER_SEQ]
    DROP SEQUENCE [permit].[ORBC_TRANSACTION_NUMBER_SEQ]
  COMMIT
END TRY

BEGIN CATCH
  IF @@TRANCOUNT > 0 
    ROLLBACK;
  THROW
END CATCH

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting initial creation of entities for Payment.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (6, @VersionDescription, getutcdate())
