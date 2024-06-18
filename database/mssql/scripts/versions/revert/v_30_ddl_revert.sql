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

BEGIN TRY
   DELETE
   FROM [dbo].[ORBC_DIRECTORY_TYPE]
   WHERE DIRECTORY_TYPE = 'SERVICE_ACCOUNT'

   ALTER TABLE [permit].[ORBC_TRANSACTION]

   DROP COLUMN [PAYER_NAME]

   ALTER TABLE [permit].[ORBC_TRANSACTION_HIST]

   DROP COLUMN [PAYER_NAME]

   COMMIT
END TRY

BEGIN CATCH
   IF @@TRANCOUNT > 0
      ROLLBACK;

   THROW
END CATCH

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = 'Reverting initial creation ofservice account in directory table.'

INSERT [dbo].[ORBC_SYS_VERSION] (
   [VERSION_ID],
   [DESCRIPTION],
   [RELEASE_DATE]
   )
VALUES (
   29,
   @VersionDescription,
   getutcdate()
   )
