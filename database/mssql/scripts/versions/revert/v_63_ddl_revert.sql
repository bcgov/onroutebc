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
 -- Start - Drop power_unit_type from ORBC_LOA_VEHICLES, associated indexes, constraints, and columns from history table
IF @@ERROR <> 0 SET NOEXEC ON
GO
DROP INDEX IX_FK_ORBC_LOA_VEHICLES_POWER_UNIT_TYPE ON [permit].[ORBC_LOA_VEHICLES];

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES] DROP CONSTRAINT FK_ORBC_LOA_VEHICLES_POWER_UNIT_TYPE;

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES] DROP COLUMN [POWER_UNIT_TYPE]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES_HIST] DROP COLUMN [POWER_UNIT_TYPE]
-- End - Drop power_unit_type from ORBC_LOA_VEHICLES, associated indexes, constraints, and columns from history table

-- Start - Drop trailer_type from ORBC_LOA_VEHICLES, associated indexes, constraints, and columns from history table
IF @@ERROR <> 0 SET NOEXEC ON
GO
DROP INDEX IX_FK_ORBC_LOA_VEHICLES_TRAILER_TYPE ON [permit].[ORBC_LOA_VEHICLES];

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES] DROP CONSTRAINT FK_ORBC_LOA_VEHICLES_TRAILER_TYPE;

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES] DROP COLUMN [TRAILER_TYPE]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES_HIST] DROP COLUMN [TRAILER_TYPE]
-- End - Drop trailer_type from ORBC_LOA_VEHICLES, associated indexes, constraints, and columns from history table

-- Start - Add/Create POWER_UNIT_ID to ORBC_LOA_VEHICLES, associated indexes, constraints, and columns from history table

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES] ADD POWER_UNIT_ID [bigint] NULL;

IF @@ERROR <> 0 SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to power unit table, identifying the power units allowed in an LoA' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_VEHICLES', @level2type=N'COLUMN',@level2name=N'POWER_UNIT_ID';

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES]
   WITH CHECK ADD CONSTRAINT [ORBC_LOA_VEHICLES_POWER_UNIT_ID_FK] FOREIGN KEY ([POWER_UNIT_ID]) REFERENCES [dbo].[ORBC_POWER_UNIT]([POWER_UNIT_ID]);

IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE NONCLUSTERED INDEX IX_ORBC_LOA_VEHICLES_POWER_UNIT_ID_FK ON [permit].[ORBC_LOA_VEHICLES] ([POWER_UNIT_ID]);

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES_HIST] ADD POWER_UNIT_ID [bigint] NULL;
-- End - Add/Create POWER_UNIT_ID to ORBC_LOA_VEHICLES, associated indexes, constraints, and columns from history table

-- Start - Add/Create TRAILER_ID to ORBC_LOA_VEHICLES, associated indexes, constraints, and columns from history table

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES] ADD TRAILER_ID [bigint] NULL;

IF @@ERROR <> 0 SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to trailer table, identifying the trailers allowed in an LoA' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_VEHICLES', @level2type=N'COLUMN',@level2name=N'TRAILER_ID';

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES]
   WITH CHECK ADD CONSTRAINT [ORBC_LOA_VEHICLES_TRAILER_ID_FK] FOREIGN KEY ([TRAILER_ID]) REFERENCES [dbo].[ORBC_TRAILER]([TRAILER_ID]);

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_LOA_VEHICLES_HIST] ADD TRAILER_ID [bigint] NULL;

-- Check and enforce the newly added foreign key constraint
ALTER TABLE [permit].[ORBC_LOA_VEHICLES] CHECK CONSTRAINT [ORBC_LOA_VEHICLES_TRAILER_ID_FK];


IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE NONCLUSTERED INDEX IX_ORBC_LOA_VEHICLES_TRAILER_ID_FK ON [permit].[ORBC_LOA_VEHICLES] ([TRAILER_ID]);

-- End - Add/Create TRAILER_ID to ORBC_LOA_VEHICLES, associated indexes, constraints, and columns from history table

-- Check for errors after adding the column
IF @@ERROR <> 0 SET NOEXEC ON
GO
-- Print a message before altering the trigger
PRINT N'Alter trigger permit.ORBC_LOA_VEHICLES_A_S_IUD_TR'
GO
-- Alter the trigger to account for changes made to the ORBC_LOA_VEHICLES table
ALTER TRIGGER [permit].[ORBC_LOA_VEHICLES_A_S_IUD_TR] ON permit.[ORBC_LOA_VEHICLES] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
BEGIN TRY
DECLARE @curr_date datetime;
SET @curr_date = getutcdate();
  -- Exit the trigger if no rows are affected
  IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted)
    RETURN;

  -- Update the END_DATE_HIST for the deleted records
  IF EXISTS(SELECT * FROM deleted)
    update [permit].[ORBC_LOA_VEHICLES_HIST] set END_DATE_HIST = @curr_date where LOA_VEHICLE_ID in (select LOA_VEHICLE_ID from deleted) and END_DATE_HIST is null;

  -- Insert new historical records for the inserted rows
  IF EXISTS(SELECT * FROM inserted)
    insert into [permit].[ORBC_LOA_VEHICLES_HIST] ([LOA_VEHICLE_ID], [LOA_ID], [POWER_UNIT_ID], [TRAILER_ID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], _LOA_VEHICLES_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
     select [LOA_VEHICLE_ID], [LOA_ID], [POWER_UNIT_ID], [TRAILER_ID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], (next value for [permit].[ORBC_LOA_VEHICLES_H_ID_SEQ]) as [_LOA_VEHICLES_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;
END TRY
BEGIN CATCH
   -- Rollback transaction if an error occurs and execute error handling
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Revert replacement of POWER_UNIT_ID and TRAILER_ID with POWER_UNIT_TYPE and TRAILER_TYPE col in ORBC_LOA_VEHICLES'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (62, @VersionDescription, getutcdate())

IF @@ERROR <> 0 SET NOEXEC ON
GO
COMMIT TRANSACTION
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