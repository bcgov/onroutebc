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

-- Increase size of credit account number column because it will be using
-- a 10-digit suffix instead of 4 when we are in dev/test to avoid duplicates
-- in CFS when we refresh the dev/test databases
ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT]
  ALTER COLUMN CREDIT_ACCOUNT_NUMBER nvarchar(15) NOT NULL
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_CREDIT_ACCOUNT_HIST]
  ALTER COLUMN CREDIT_ACCOUNT_NUMBER nvarchar(15)
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Set the sequence to have no max value (big int) so longer credit
-- account numbers may be created in dev/test
ALTER SEQUENCE [permit].[ORBC_CREDIT_ACCOUNT_NUMBER_SEQ]
  NO MAXVALUE
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Update credit account sequence to avoid duplicates in dev and test'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (38, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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