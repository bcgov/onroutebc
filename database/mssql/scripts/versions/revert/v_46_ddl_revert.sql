SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
BEGIN TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TRIGGER [permit].[ORBC_CFSTRDT_A_S_IUD_TR] ON [permit].[ORBC_CFS_TRANSACTION_DETAIL] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
   BEGIN TRY
   DECLARE @curr_date datetime;
   SET @curr_date = getutcdate();
     IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted) 
     RETURN;

     -- historical
     IF EXISTS(SELECT * FROM deleted)
       update [permit].[ORBC_CFS_TRANSACTION_DETAIL_HIST] set END_DATE_HIST = @curr_date where ID in (select ID from deleted) and END_DATE_HIST is null;
  
     IF EXISTS(SELECT * FROM inserted)
       insert into [permit].[ORBC_CFS_TRANSACTION_DETAIL_HIST] ([ID], [TRANSACTION_ID], [FILE_NAME], [CFS_FILE_STATUS_TYPE], [ERROR_MESSAGE], [PROCESSSING_DATE_TIME], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], _CFS_TRANSACTION_DETAIL_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
       select [ID], [TRANSACTION_ID], [FILE_NAME], [CFS_FILE_STATUS_TYPE], [ERROR_MESSAGE], [PROCESSSING_DATE_TIME], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], (next value for [permit].[ORBC_CFS_TRANSACTION_DETAIL_H_ID_SEQ]) as [_CFS_TRANSACTION_DETAIL_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

     END TRY
     BEGIN CATCH
       IF @@trancount > 0 ROLLBACK TRANSACTION
      EXEC orbc_error_handling
     END CATCH;
    GO

   IF @@ERROR <> 0 SET NOEXEC ON
   GO
UPDATE [permit].[ORBC_CFS_TRANSACTION_DETAIL]  SET CFS_FILE_STATUS_TYPE = NULL where CFS_FILE_STATUS_TYPE = 'PROCESSING'
GO
DELETE FROM [permit].[ORBC_CFS_FILE_STATUS_TYPE] where CFS_FILE_STATUS_TYPE = 'PROCESSING'
GO
ALTER TABLE [permit].[ORBC_CFS_TRANSACTION_DETAIL] DROP CONSTRAINT DK_ORBC_CFS_TRANSACTION_DETAIL_REPROCESS_FLAG
GO
ALTER TABLE [permit].[ORBC_CFS_TRANSACTION_DETAIL] DROP CONSTRAINT DK_ORBC_CFS_TRANSACTION_DETAIL_REPROCESS_FLAG_VAL
GO
ALTER TABLE [permit].[ORBC_CFS_TRANSACTION_DETAIL] DROP COLUMN REPROCESS_FLAG
GO
ALTER TABLE [permit].[ORBC_CFS_TRANSACTION_DETAIL_HIST] DROP COLUMN REPROCESS_FLAG
GO
DROP TABLE [permit].[ORBC_GL_CODE_TYPE]
GO
COMMIT

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting db changes for CGI File and GL Code.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (45, @VersionDescription, getutcdate())
