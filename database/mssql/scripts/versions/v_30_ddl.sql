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

IF @@ERROR <> 0
   SET NOEXEC ON
GO

-- Add  Serive Account diretory type to ORBC_DIRECTORY_TYPE
INSERT [dbo].[ORBC_DIRECTORY_TYPE] (
   [DIRECTORY_TYPE],
   [DIRECTORY_NAME],
   [CONCURRENCY_CONTROL_NUMBER],
   [DB_CREATE_USERID],
   [DB_CREATE_TIMESTAMP],
   [DB_LAST_UPDATE_USERID],
   [DB_LAST_UPDATE_TIMESTAMP]
   )
VALUES (
   N'SA',
   N'Service Account User',
   NULL,
   N'dbo',
   GETUTCDATE(),
   N'dbo',
   GETUTCDATE()
   )
GO

IF @@ERROR <> 0
   SET NOEXEC ON
GO

--Add PAYER NAME to ORBC_TRANSACTION
ALTER TABLE [permit].[ORBC_TRANSACTION] ADD [PAYER_NAME] [varchar] (100) NULL
GO

IF @@ERROR <> 0
   SET NOEXEC ON
GO

--Add PAYER NAME to ORBC_TRANSACTION
ALTER TABLE [permit].[ORBC_TRANSACTION_HIST] ADD [PAYER_NAME] [varchar] (100) NULL
GO

IF @@ERROR <> 0
   SET NOEXEC ON
GO

ALTER TRIGGER [permit].[ORBC_TXN_A_S_IUD_TR] ON [permit].[ORBC_TRANSACTION]
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
      UPDATE [permit].[ORBC_TRANSACTION_HIST]
      SET END_DATE_HIST = @curr_date
      WHERE TRANSACTION_ID IN (
            SELECT TRANSACTION_ID
            FROM deleted
            )
         AND END_DATE_HIST IS NULL;

   IF EXISTS (
         SELECT *
         FROM inserted
         )
      INSERT INTO [permit].[ORBC_TRANSACTION_HIST] (
         [TRANSACTION_ID],
         [TRANSACTION_TYPE],
         [PAYMENT_METHOD_TYPE],
         [PAYMENT_CARD_TYPE],
         [TOTAL_TRANSACTION_AMOUNT],
         [TRANSACTION_SUBMIT_DATE],
         [TRANSACTION_ORDER_NUMBER],
         [PG_TRANSACTION_ID],
         [PG_TRANSACTION_APPROVED],
         [PG_AUTH_CODE],
         [PG_TRANSACTION_CARD_TYPE],
         [PG_TRANSACTION_DATE],
         [PG_CVD_ID],
         [PG_PAYMENT_METHOD],
         [PG_MESSAGE_ID],
         [PG_MESSAGE_TEXT],
         [PAYER_NAME],
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
         _TRANSACTION_HIST_ID,
         END_DATE_HIST,
         EFFECTIVE_DATE_HIST
         )
      SELECT [TRANSACTION_ID],
         [TRANSACTION_TYPE],
         [PAYMENT_METHOD_TYPE],
         [PAYMENT_CARD_TYPE],
         [TOTAL_TRANSACTION_AMOUNT],
         [TRANSACTION_SUBMIT_DATE],
         [TRANSACTION_ORDER_NUMBER],
         [PG_TRANSACTION_ID],
         [PG_TRANSACTION_APPROVED],
         [PG_AUTH_CODE],
         [PG_TRANSACTION_CARD_TYPE],
         [PG_TRANSACTION_DATE],
         [PG_CVD_ID],
         [PG_PAYMENT_METHOD],
         [PG_MESSAGE_ID],
         [PG_MESSAGE_TEXT],
         [PAYER_NAME],
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
            NEXT value FOR [permit].[ORBC_TRANSACTION_H_ID_SEQ]
            ) AS [_TRANSACTION_HIST_ID],
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

IF @@ERROR <> 0
   SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = '-- Add  Serive Account diretory type to ORBC_DIRECTORY_TYPE'

INSERT [dbo].[ORBC_SYS_VERSION] (
   [VERSION_ID],
   [DESCRIPTION],
   [UPDATE_SCRIPT],
   [REVERT_SCRIPT],
   [RELEASE_DATE]
   )
VALUES (
   30,
   @VersionDescription,
   '$(UPDATE_SCRIPT)',
   '$(REVERT_SCRIPT)',
   getutcdate()
   )

IF @@ERROR <> 0
   SET NOEXEC ON
GO

COMMIT TRANSACTION
GO

IF @@ERROR <> 0
   SET NOEXEC ON
GO

DECLARE @Success AS BIT

SET @Success = 1
SET NOEXEC OFF

IF (@Success = 1)
   PRINT 'The database update succeeded'
ELSE
BEGIN
   IF @@TRANCOUNT > 0
      ROLLBACK TRANSACTION

   PRINT 'The database update failed'
END
GO