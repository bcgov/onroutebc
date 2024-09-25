SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
GO
BEGIN TRANSACTION
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DELETE FROM [access].[ORBC_GROUP_ROLE] WHERE ROLE_TYPE IN (
  'ORBC-WRITE-SUSPEND',
  'ORBC-READ-SUSPEND'
)
GO

DELETE FROM [access].[ORBC_ROLE_TYPE] WHERE ROLE_TYPE IN (
  'ORBC-WRITE-SUSPEND',
  'ORBC-READ-SUSPEND'
)
GO

-- Revert history trigger
ALTER TRIGGER ORBC_COMPNY_A_S_IUD_TR ON [dbo].[ORBC_COMPANY]
FOR INSERT,
  UPDATE,
  DELETE
AS
  SET NOCOUNT ON

  BEGIN TRY
    DECLARE @curr_date DATETIME;

    SET @curr_date = getutcdate();

    IF NOT EXISTS (
          SELECT *
          FROM inserted
          )
        AND NOT EXISTS (
          SELECT *
          FROM deleted
          )
        RETURN;

    -- historical
    IF EXISTS (
          SELECT *
          FROM deleted
          )
        UPDATE [dbo].[ORBC_COMPANY_HIST]
        SET END_DATE_HIST = @curr_date
        WHERE COMPANY_ID IN (
              SELECT COMPANY_ID
              FROM deleted
              )
          AND END_DATE_HIST IS NULL;

    IF EXISTS (
          SELECT *
          FROM inserted
          )
        INSERT INTO [dbo].[ORBC_COMPANY_HIST] (
          [COMPANY_ID],
          [COMPANY_GUID],
          [CLIENT_NUMBER],
          [TPS_CLIENT_HASH],
          [LEGAL_NAME],
          [ALTERNATE_NAME],
          [COMPANY_DIRECTORY],
          [MAILING_ADDRESS_ID],
          [PHONE],
          [EXTENSION],
          [FAX],
          [EMAIL],
          [PRIMARY_CONTACT_ID],
          [ACCOUNT_REGION],
          [ACCOUNT_SOURCE],
          [APP_CREATE_TIMESTAMP],
          [APP_CREATE_USERID],
          [APP_CREATE_USER_GUID],
          [APP_CREATE_USER_DIRECTORY],
          [APP_LAST_UPDATE_TIMESTAMP],
          [APP_LAST_UPDATE_USERID],
          [APP_LAST_UPDATE_USER_GUID],
          [APP_LAST_UPDATE_USER_DIRECTORY],
          [CONCURRENCY_CONTROL_NUMBER],
          [DB_CREATE_USERID],
          [DB_CREATE_TIMESTAMP],
          [DB_LAST_UPDATE_USERID],
          [DB_LAST_UPDATE_TIMESTAMP],
          [_COMPANY_HIST_ID],
          [END_DATE_HIST],
          [EFFECTIVE_DATE_HIST]
          )
        SELECT [COMPANY_ID],
          [COMPANY_GUID],
          [CLIENT_NUMBER],
          [TPS_CLIENT_HASH],
          [LEGAL_NAME],
          [ALTERNATE_NAME],
          [COMPANY_DIRECTORY],
          [MAILING_ADDRESS_ID],
          [PHONE],
          [EXTENSION],
          [FAX],
          [EMAIL],
          [PRIMARY_CONTACT_ID],
          [ACCOUNT_REGION],
          [ACCOUNT_SOURCE],
          [APP_CREATE_TIMESTAMP],
          [APP_CREATE_USERID],
          [APP_CREATE_USER_GUID],
          [APP_CREATE_USER_DIRECTORY],
          [APP_LAST_UPDATE_TIMESTAMP],
          [APP_LAST_UPDATE_USERID],
          [APP_LAST_UPDATE_USER_GUID],
          [APP_LAST_UPDATE_USER_DIRECTORY],
          [CONCURRENCY_CONTROL_NUMBER],
          [DB_CREATE_USERID],
          [DB_CREATE_TIMESTAMP],
          [DB_LAST_UPDATE_USERID],
          [DB_LAST_UPDATE_TIMESTAMP],
          (
              NEXT value FOR [dbo].[ORBC_COMPANY_H_ID_SEQ]
              ) AS [_COMPANY_HIST_ID],
          NULL AS [END_DATE_HIST],
          @curr_date AS [EFFECTIVE_DATE_HIST]
        FROM inserted;
  END TRY

  BEGIN CATCH
    IF @@trancount > 0
        ROLLBACK TRANSACTION

    EXEC orbc_error_handling
  END CATCH;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[ORBC_COMPANY_HIST]
  DROP COLUMN [IS_SUSPENDED]
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[ORBC_COMPANY]
  DROP CONSTRAINT [DF_ORBC_COMP_IS_SUSP_DEFAULT]
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[ORBC_COMPANY]
  DROP CONSTRAINT [DF_ORBC_COMP_IS_SUSP_DOMAIN]
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[ORBC_COMPANY]
  DROP COLUMN [IS_SUSPENDED]
IF @@ERROR <> 0 SET NOEXEC ON
GO

DROP TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY]
IF @@ERROR <> 0 SET NOEXEC ON
GO

DROP TABLE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY_HIST]
IF @@ERROR <> 0 SET NOEXEC ON
GO

DROP SEQUENCE [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY_H_ID_SEQ]
IF @@ERROR <> 0 SET NOEXEC ON
GO

DROP TABLE [dbo].[ORBC_SUSPEND_ACTIVITY_TYPE]
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting allowance for company suspensions'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (14, @VersionDescription, getutcdate())
IF @@ERROR <> 0 SET NOEXEC ON
GO

COMMIT TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @Success AS BIT
SET @Success = 1
SET NOEXEC OFF
IF (@Success = 1) PRINT 'The database update succeeded'
ELSE BEGIN
   IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
   PRINT 'The database update failed'
END
GO