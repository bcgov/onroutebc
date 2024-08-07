SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

SET XACT_ABORT ON

BEGIN TRY
  BEGIN TRANSACTION

   ALTER TABLE [dbo].[ORBC_POLICY_CONFIGURATION] DROP CONSTRAINT [DF_ORBC_POLICY_CONFIGURATION_IS_DRAFT]
   ALTER TABLE [dbo].[ORBC_POLICY_CONFIGURATION] DROP COLUMN [APP_LAST_UPDATE_USERID];  

    DELETE FROM [access].[ORBC_GROUP_ROLE] WHERE ROLE_TYPE IN ('ORBC-WRITE-POLICY-CONFIG','ORBC-READ-POLICY-CONFIG')
    DELETE FROM [access].[ORBC_ROLE_TYPE] WHERE ROLE_TYPE IN ('ORBC-WRITE-POLICY-CONFIG','ORBC-READ-POLICY-CONFIG')

  COMMIT
END TRY

BEGIN CATCH
  IF @@TRANCOUNT > 0 
    ROLLBACK;
  THROW
END CATCH

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting addition of APP_CREATE_USERID and APP_LAST_UPDATE_USERID to ORBC_POLICY_CONFIGURATION.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (31, @VersionDescription, getutcdate())
