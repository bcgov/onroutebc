SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

SET XACT_ABORT ON

BEGIN TRY
  BEGIN TRANSACTION
    DROP TABLE [dbo].[ORBC_POLICY_CONFIGURATION_HIST]
    DROP TABLE [dbo].[ORBC_POLICY_CONFIGURATION]
    DROP SEQUENCE [dbo].[ORBC_POLICY_CONFIGURATION_H_ID_SEQ]

    DROP TRIGGER [permit].[ORBC_CFSTRDT_A_S_IUD_TR]
    DROP TABLE [permit].[ORBC_CFS_TRANSACTION_DETAIL_HIST]
    DROP SEQUENCE [permit].[ORBC_CFS_TRANSACTION_DETAIL_H_ID_SEQ]

    DROP TRIGGER [permit].[ORBC_CRACCACT_A_S_IUD_TR]
    DROP TABLE [permit].[ORBC_CREDIT_ACCOUNT_ACTIVITY_HIST]
    DROP SEQUENCE [permit].[ORBC_CREDIT_ACCOUNT_ACTIVITY_H_ID_SEQ]

    DROP TRIGGER [permit].[ORBC_CRACC_A_S_IUD_TR]
    DROP TABLE [permit].[ORBC_CREDIT_ACCOUNT_HIST]
    DROP SEQUENCE [permit].[ORBC_CREDIT_ACCOUNT_H_ID_SEQ]

    DROP TRIGGER [permit].[ORBC_CRACCUSR_A_S_IUD_TR]
    DROP TABLE [permit].[ORBC_CREDIT_ACCOUNT_USER_HIST]
    DROP SEQUENCE [permit].[ORBC_CREDIT_ACCOUNT_USER_H_ID_SEQ]
  COMMIT
END TRY

BEGIN CATCH
  IF @@TRANCOUNT > 0 
    ROLLBACK;
  THROW
END CATCH

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting policy configuration table creation plus history tables for v28 and v27'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (28, @VersionDescription, getutcdate())
