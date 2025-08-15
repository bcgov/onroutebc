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
UPDATE permit.ORBC_PERMIT_TYPE set NAME='Quarterly Non Resident Reg. / Ins. - Comm Vehicle' where permit_TYPE ='NRQCV';


IF @@ERROR <> 0 SET NOEXEC ON
GO
UPDATE permit.ORBC_PERMIT_TYPE set NAME='Single Trip Non-Resident Reg. / Ins. - Commercial Vehicle' where permit_TYPE ='NRSCV';


IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting name update of NRQCV and NRSCV permit types.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (85, @VersionDescription, getutcdate())

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