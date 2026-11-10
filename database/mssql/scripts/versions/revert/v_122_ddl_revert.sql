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


-------------------------------------------------------------------------
-- STOW v3 -> v1
-------------------------------------------------------------------------

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE TEMPLATE_NAME IN (
    'PERMIT_STOW',
    'PERMIT_STOW_VOID',
    'PERMIT_STOW_REVOKED'
)
AND TEMPLATE_VERSION = '3';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


UPDATE dops.ORBC_DOCUMENT_TEMPLATE
SET IS_ACTIVE = 'Y'
WHERE TEMPLATE_NAME IN (
    'PERMIT_STOW',
    'PERMIT_STOW_VOID',
    'PERMIT_STOW_REVOKED'
)
AND TEMPLATE_VERSION = '1';


IF @@ERROR <> 0
    SET NOEXEC ON
GO

-------------------------------------------------------------------------
-- System version
-------------------------------------------------------------------------

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = 'Revert configuring STOW v3 templates'


INSERT [dbo].[ORBC_SYS_VERSION] (
    [VERSION_ID],
    [DESCRIPTION],
    [RELEASE_DATE]
)
VALUES (
    121,
    @VersionDescription,
    GETUTCDATE()
)
GO


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
    PRINT 'The database revert succeeded'
ELSE
BEGIN
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    PRINT 'The database revert failed'
END
GO
