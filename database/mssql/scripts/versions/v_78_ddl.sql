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
ALTER TABLE [case].[ORBC_CASE] ADD [CASE_OPENED_DATE_TIME] [datetime2](7) NOT NULL;


IF @@ERROR <> 0 SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The date and time when the case was added to the queue'
	,@level0type = N'SCHEMA'
	,@level0name = N'case'
	,@level1type = N'TABLE'
	,@level1Name = N'ORBC_CASE'
	,@level2type = N'COLUMN'
	,@level2name = N'CASE_OPENED_DATE_TIME';

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
