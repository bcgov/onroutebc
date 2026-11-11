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

BEGIN TRY

    BEGIN TRANSACTION;


    -------------------------------------------------------------------------
    -- Deactivate previous versions
    -------------------------------------------------------------------------

    -- STOW v1
    UPDATE dops.ORBC_DOCUMENT_TEMPLATE
    SET IS_ACTIVE = 'N'
    WHERE TEMPLATE_NAME IN (
        'PERMIT_STOW',
        'PERMIT_STOW_VOID',
        'PERMIT_STOW_REVOKED'
    )
    AND TEMPLATE_VERSION = 1;

    -------------------------------------------------------------------------
    -- STOW v3 (STOW v2 was never inserted)
    -------------------------------------------------------------------------

    INSERT INTO dops.ORBC_DOCUMENT_TEMPLATE
    (
        TEMPLATE_NAME,
        TEMPLATE_VERSION,
        CONCURRENCY_CONTROL_NUMBER,
        DB_CREATE_USERID,
        DB_CREATE_TIMESTAMP,
        DB_LAST_UPDATE_USERID,
        DB_LAST_UPDATE_TIMESTAMP,
        IS_ACTIVE,
        FILE_NAME
    )
    VALUES
    (
        'PERMIT_STOW',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'stow-template-v3.docx'
    ),
    (
        'PERMIT_STOW_VOID',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'stow-void-template-v3.docx'
    ),
    (
        'PERMIT_STOW_REVOKED',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'stow-revoked-template-v3.docx'
    );

    -------------------------------------------------------------------------
    -- System version
    -------------------------------------------------------------------------

    DECLARE @VersionDescription VARCHAR(255);

    SET @VersionDescription = 'Configure STOW v3 templates';


    INSERT INTO dbo.ORBC_SYS_VERSION
    (
        VERSION_ID,
        DESCRIPTION,
        UPDATE_SCRIPT,
        REVERT_SCRIPT,
        RELEASE_DATE
    )
    VALUES
    (
        123,
        @VersionDescription,
        '$(UPDATE_SCRIPT)',
        '$(REVERT_SCRIPT)',
        GETUTCDATE()
    );


    COMMIT TRANSACTION;

    PRINT 'The database update succeeded';

END TRY
BEGIN CATCH

    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    PRINT 'The database update failed';

    THROW;

END CATCH
GO
