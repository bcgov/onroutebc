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

-- Add non-nullable column [case].[ORBC_CASE].[CASE_OPENED_DATE_TIME] to track when a case was added to the queue.
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE] ADD [CASE_OPENED_DATE_TIME] [datetime2](7) NULL;

-- Patch up existing data to enforce the column as non nullable.
IF @@ERROR <> 0 SET NOEXEC ON
GO
UPDATE [case].[ORBC_CASE] SET [CASE_OPENED_DATE_TIME]=[APP_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE] ALTER COLUMN [CASE_OPENED_DATE_TIME] [datetime2](7) NOT NULL;


IF @@ERROR <> 0 SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The date and time when the case was added to the queue. i.e, when CASE_STATUS_TYPE = ''OPENED''. It cannot be null.'
	,@level0type = N'SCHEMA'
	,@level0name = N'case'
	,@level1type = N'TABLE'
	,@level1Name = N'ORBC_CASE'
	,@level2type = N'COLUMN'
	,@level2name = N'CASE_OPENED_DATE_TIME';

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Add column to history table, only if it does not already exist.
-- The check if it already exists is there because if we revert
-- this script, that history column will not be dropped. This check
-- allows this script to be run, rolled back, then run again if needed.
IF COL_LENGTH('case.ORBC_CASE_HIST', 'CASE_OPENED_DATE_TIME') IS NULL
BEGIN
  ALTER TABLE [case].[ORBC_CASE_HIST] ADD [CASE_OPENED_DATE_TIME] [datetime2](7) NULL;
END


-- Alter history trigger to reflect the new column
PRINT N'Alter trigger case.ORBC_CASE_A_S_IUD_TR'
GO
ALTER TRIGGER [case].[ORBC_CASE_A_S_IUD_TR] ON [case].[ORBC_CASE] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
BEGIN TRY
DECLARE @curr_date datetime;
SET @curr_date = getutcdate();
  IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted) 
    RETURN;

  -- historical
  IF EXISTS(SELECT * FROM deleted)
    update [case].[ORBC_CASE_HIST] set END_DATE_HIST = @curr_date where CASE_ID in (select CASE_ID from deleted) and END_DATE_HIST is null;
  
  IF EXISTS(SELECT * FROM inserted)
    insert into [case].[ORBC_CASE_HIST] ([CASE_ID], [ORIGINAL_CASE_ID], [PREVIOUS_CASE_ID], [PERMIT_ID], [CASE_TYPE], [CASE_STATUS_TYPE], [ASSIGNED_USER_GUID], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [CASE_OPENED_DATE_TIME], _CASE_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
      select [CASE_ID], [ORIGINAL_CASE_ID], [PREVIOUS_CASE_ID], [PERMIT_ID], [CASE_TYPE], [CASE_STATUS_TYPE], [ASSIGNED_USER_GUID], [CONCURRENCY_CONTROL_NUMBER], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], [CASE_OPENED_DATE_TIME], (next value for [case].[ORBC_CASE_H_ID_SEQ]) as [_CASE_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Add CASE_OPENED_DATE_TIME column to case.ORBC_CASE'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (78, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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
