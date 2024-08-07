SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

SET XACT_ABORT ON

BEGIN TRY
  BEGIN TRANSACTION

    DELETE FROM [access].[ORBC_GROUP_ROLE] WHERE ROLE_TYPE ='ORBC-READ-CREDIT-ACCOUNT' AND USER_AUTH_GROUP_TYPE IN ('PPCCLERK', 'CTPO', 'HQADMIN')

  COMMIT
END TRY

BEGIN CATCH
  IF @@TRANCOUNT > 0 
    ROLLBACK;
  THROW
END CATCH

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting mapping of ORBC-READ-CREDIT-ACCOUNT from PPCCLERK, CTPO, and HQADMIN.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (32, @VersionDescription, getutcdate())
