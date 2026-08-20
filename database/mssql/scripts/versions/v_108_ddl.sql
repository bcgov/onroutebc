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

    -- NRSCV v2
    UPDATE dops.ORBC_DOCUMENT_TEMPLATE
    SET IS_ACTIVE = 'N'
    WHERE TEMPLATE_NAME IN (
        'PERMIT_NRSCV',
        'PERMIT_NRSCV_VOID',
        'PERMIT_NRSCV_REVOKED'
    )
    AND TEMPLATE_VERSION = 2;


    -- NRQCV v1
    UPDATE dops.ORBC_DOCUMENT_TEMPLATE
    SET IS_ACTIVE = 'N'
    WHERE TEMPLATE_NAME IN (
        'PERMIT_NRQCV',
        'PERMIT_NRQCV_VOID',
        'PERMIT_NRQCV_REVOKED'
    )
    AND TEMPLATE_VERSION = 1;


    -- STOS v4
    UPDATE dops.ORBC_DOCUMENT_TEMPLATE
    SET IS_ACTIVE = 'N'
    WHERE TEMPLATE_NAME IN (
        'PERMIT_STOS',
        'PERMIT_STOS_VOID',
        'PERMIT_STOS_REVOKED'
    )
    AND TEMPLATE_VERSION = 4;


    -- TROW v2
    UPDATE dops.ORBC_DOCUMENT_TEMPLATE
    SET IS_ACTIVE = 'N'
    WHERE TEMPLATE_NAME IN (
        'PERMIT_TROW',
        'PERMIT_TROW_VOID',
        'PERMIT_TROW_REVOKED'
    )
    AND TEMPLATE_VERSION = 2;


    -- TROS v2
    UPDATE dops.ORBC_DOCUMENT_TEMPLATE
    SET IS_ACTIVE = 'N'
    WHERE TEMPLATE_NAME IN (
        'PERMIT_TROS',
        'PERMIT_TROS_VOID',
        'PERMIT_TROS_REVOKED'
    )
    AND TEMPLATE_VERSION = 2;


    -- MFP v4
    UPDATE dops.ORBC_DOCUMENT_TEMPLATE
    SET IS_ACTIVE = 'N'
    WHERE TEMPLATE_NAME IN (
        'PERMIT_MFP',
        'PERMIT_MFP_VOID',
        'PERMIT_MFP_REVOKED'
    )
    AND TEMPLATE_VERSION = 4;


    -- STFR v2
    UPDATE dops.ORBC_DOCUMENT_TEMPLATE
    SET IS_ACTIVE = 'N'
    WHERE TEMPLATE_NAME IN (
        'PERMIT_STFR',
        'PERMIT_STFR_VOID',
        'PERMIT_STFR_REVOKED'
    )
    AND TEMPLATE_VERSION = 2;


    -- QRFR v2
    UPDATE dops.ORBC_DOCUMENT_TEMPLATE
    SET IS_ACTIVE = 'N'
    WHERE TEMPLATE_NAME IN (
        'PERMIT_QRFR',
        'PERMIT_QRFR_VOID',
        'PERMIT_QRFR_REVOKED'
    )
    AND TEMPLATE_VERSION = 2;


    -- Payment Receipt v3
    UPDATE dops.ORBC_DOCUMENT_TEMPLATE
    SET IS_ACTIVE = 'N'
    WHERE TEMPLATE_NAME IN (
        'PAYMENT_RECEIPT'
    )
    AND TEMPLATE_VERSION = 3;


    -------------------------------------------------------------------------
    -- NRSCV v3
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
        'PERMIT_NRSCV',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'nrscv-template-v3.docx'
    ),
    (
        'PERMIT_NRSCV_VOID',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'nrscv-void-template-v3.docx'
    ),
    (
        'PERMIT_NRSCV_REVOKED',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'nrscv-revoked-template-v3.docx'
    );


    -------------------------------------------------------------------------
    -- NRQCV v2
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
        'PERMIT_NRQCV',
        2,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'nrqcv-template-v2.docx'
    ),
    (
        'PERMIT_NRQCV_VOID',
        2,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'nrqcv-void-template-v2.docx'
    ),
    (
        'PERMIT_NRQCV_REVOKED',
        2,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'nrqcv-revoked-template-v2.docx'
    );


    -------------------------------------------------------------------------
    -- STOS v5
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
        'PERMIT_STOS',
        5,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'stos-template-v5.docx'
    ),
    (
        'PERMIT_STOS_VOID',
        5,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'stos-void-template-v5.docx'
    ),
    (
        'PERMIT_STOS_REVOKED',
        5,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'stos-revoked-template-v5.docx'
    );


    -------------------------------------------------------------------------
    -- TROW v3
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
        'PERMIT_TROW',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'trow-template-v3.docx'
    ),
    (
        'PERMIT_TROW_VOID',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'trow-void-template-v3.docx'
    ),
    (
        'PERMIT_TROW_REVOKED',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'trow-revoked-template-v3.docx'
    );


    -------------------------------------------------------------------------
    -- TROS v3
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
        'PERMIT_TROS',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'tros-template-v3.docx'
    ),
    (
        'PERMIT_TROS_VOID',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'tros-void-template-v3.docx'
    ),
    (
        'PERMIT_TROS_REVOKED',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'tros-revoked-template-v3.docx'
    );


    -------------------------------------------------------------------------
    -- MFP v5
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
        'PERMIT_MFP',
        5,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'mfp-template-v5.docx'
    ),
    (
        'PERMIT_MFP_VOID',
        5,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'mfp-void-template-v5.docx'
    ),
    (
        'PERMIT_MFP_REVOKED',
        5,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'mfp-revoked-template-v5.docx'
    );


    -------------------------------------------------------------------------
    -- STFR v3
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
        'PERMIT_STFR',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'stfr-template-v3.docx'
    ),
    (
        'PERMIT_STFR_VOID',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'stfr-void-template-v3.docx'
    ),
    (
        'PERMIT_STFR_REVOKED',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'stfr-revoked-template-v3.docx'
    );


    -------------------------------------------------------------------------
    -- QRFR v3
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
        'PERMIT_QRFR',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'qrfr-template-v3.docx'
    ),
    (
        'PERMIT_QRFR_VOID',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'qrfr-void-template-v3.docx'
    ),
    (
        'PERMIT_QRFR_REVOKED',
        3,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'qrfr-revoked-template-v3.docx'
    );

    -------------------------------------------------------------------------
    -- Payment Receipt v4
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
        'PAYMENT_RECEIPT',
        4,
        1,
        'dops',
        GETUTCDATE(),
        'dops',
        GETUTCDATE(),
        'Y',
        'payment-receipt-template-v4.docx'
    );


    -------------------------------------------------------------------------
    -- System version
    -------------------------------------------------------------------------

    DECLARE @VersionDescription VARCHAR(255);

    SET @VersionDescription = 'Configure permit templates updates';


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
        108,
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