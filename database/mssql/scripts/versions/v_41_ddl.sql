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

 ALTER TABLE [permit].[ORBC_LOA_DETAILS] ADD [PREVIOUS_LOA_ID] [int] NULL
 ALTER TABLE [permit].[ORBC_LOA_DETAILS] ADD  [ORIGINAL_LOA_ID] [int] NULL
 ALTER TABLE [permit].[ORBC_LOA_DETAILS] ALTER COLUMN [START_DATE] [date] NOT NULL
 ALTER TABLE [permit].[ORBC_LOA_DETAILS] ALTER COLUMN [EXPIRY_DATE] [date] NULL
 ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] DROP CONSTRAINT ORBC_LOA_PERMIT_TYPES_PERMIT_TYPE_ID_FK
 EXEC sp_rename @objname = 'permit.ORBC_LOA_PERMIT_TYPE_DETAILS.PERMIT_TYPE_ID', @newname = 'PERMIT_TYPE', @objtype = 'COLUMN'
 ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS]
   WITH CHECK ADD CONSTRAINT [FK_ORBC_LOA_PERMIT_TYPES_PERMIT_TYPE] FOREIGN KEY ([PERMIT_TYPE]) REFERENCES [permit].[ORBC_PERMIT_TYPE]([PERMIT_TYPE])
 ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] CHECK CONSTRAINT [FK_ORBC_LOA_PERMIT_TYPES_PERMIT_TYPE]
 ALTER TABLE [permit].[ORBC_LOA_DETAILS] WITH CHECK ADD CONSTRAINT [FK_ORBC_LOA_DETAILS_PREVIOUS_LOA_ID] FOREIGN KEY([PREVIOUS_LOA_ID]) 
 REFERENCES [permit].[ORBC_LOA_DETAILS] ([LOA_ID])
 GO
 ALTER TABLE [permit].[ORBC_LOA_DETAILS] CHECK CONSTRAINT [FK_ORBC_LOA_DETAILS_PREVIOUS_LOA_ID]
 ALTER TABLE [permit].[ORBC_LOA_DETAILS] WITH CHECK ADD CONSTRAINT [FK_ORBC_LOA_DETAILS_ORIGINAL_LOA_ID] FOREIGN KEY([ORIGINAL_LOA_ID]) 
 REFERENCES [permit].[ORBC_LOA_DETAILS] ([LOA_ID])
 GO
 ALTER TABLE [permit].[ORBC_LOA_DETAILS] CHECK CONSTRAINT [FK_ORBC_LOA_DETAILS_ORIGINAL_LOA_ID]
 ALTER TABLE [permit].[ORBC_LOA_VEHICLES] DROP CONSTRAINT [FK_ORBC_LOA_VEHICLES_LOA_ID]
 ALTER TABLE [permit].[ORBC_LOA_VEHICLES]
   WITH CHECK ADD CONSTRAINT [FK_ORBC_LOA_VEHICLES_LOA_ID] FOREIGN KEY ([LOA_ID]) REFERENCES [permit].[ORBC_LOA_DETAILS]([LOA_ID]) 
ALTER TABLE [permit].[ORBC_LOA_VEHICLES] CHECK CONSTRAINT [FK_ORBC_LOA_VEHICLES_LOA_ID]
ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] DROP CONSTRAINT [FK_ORBC_LOA_PERMIT_TYPE_LOA_ID]
ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS]
   WITH CHECK ADD CONSTRAINT [FK_ORBC_LOA_PERMIT_TYPE_LOA_ID] FOREIGN KEY ([LOA_ID]) REFERENCES [permit].[ORBC_LOA_DETAILS]([LOA_ID]) 
 ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] CHECK CONSTRAINT [FK_ORBC_LOA_PERMIT_TYPE_LOA_ID]

IF @@ERROR <> 0
   SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'previous LoA id' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'PREVIOUS_LOA_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Original LoA id' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'ORIGINAL_LOA_ID'

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = 'Add previous loa id and original load id columns to LoA table'

INSERT [dbo].[ORBC_SYS_VERSION] (
   [VERSION_ID],
   [DESCRIPTION],
   [UPDATE_SCRIPT],
   [REVERT_SCRIPT],
   [RELEASE_DATE]
   )
VALUES (
   41,
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