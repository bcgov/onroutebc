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
-- NRSCV v3 -> v2
-------------------------------------------------------------------------

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE TEMPLATE_NAME IN (
    'PERMIT_NRSCV',
    'PERMIT_NRSCV_VOID',
    'PERMIT_NRSCV_REVOKED'
)
AND TEMPLATE_VERSION = '3';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


UPDATE dops.ORBC_DOCUMENT_TEMPLATE
SET IS_ACTIVE = 'Y'
WHERE TEMPLATE_NAME IN (
    'PERMIT_NRSCV',
    'PERMIT_NRSCV_VOID',
    'PERMIT_NRSCV_REVOKED'
)
AND TEMPLATE_VERSION = '2';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


-------------------------------------------------------------------------
-- NRQCV v2 -> v1
-------------------------------------------------------------------------

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE TEMPLATE_NAME IN (
    'PERMIT_NRQCV',
    'PERMIT_NRQCV_VOID',
    'PERMIT_NRQCV_REVOKED'
)
AND TEMPLATE_VERSION = '2';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


UPDATE dops.ORBC_DOCUMENT_TEMPLATE
SET IS_ACTIVE = 'Y'
WHERE TEMPLATE_NAME IN (
    'PERMIT_NRQCV',
    'PERMIT_NRQCV_VOID',
    'PERMIT_NRQCV_REVOKED'
)
AND TEMPLATE_VERSION = '1';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


-------------------------------------------------------------------------
-- STOS v5 -> v4
-------------------------------------------------------------------------

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE TEMPLATE_NAME IN (
    'PERMIT_STOS',
    'PERMIT_STOS_VOID',
    'PERMIT_STOS_REVOKED'
)
AND TEMPLATE_VERSION = '5';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


UPDATE dops.ORBC_DOCUMENT_TEMPLATE
SET IS_ACTIVE = 'Y'
WHERE TEMPLATE_NAME IN (
    'PERMIT_STOS',
    'PERMIT_STOS_VOID',
    'PERMIT_STOS_REVOKED'
)
AND TEMPLATE_VERSION = '4';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


-------------------------------------------------------------------------
-- TROW v3 -> v2
-------------------------------------------------------------------------

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE TEMPLATE_NAME IN (
    'PERMIT_TROW',
    'PERMIT_TROW_VOID',
    'PERMIT_TROW_REVOKED'
)
AND TEMPLATE_VERSION = '3';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


UPDATE dops.ORBC_DOCUMENT_TEMPLATE
SET IS_ACTIVE = 'Y'
WHERE TEMPLATE_NAME IN (
    'PERMIT_TROW',
    'PERMIT_TROW_VOID',
    'PERMIT_TROW_REVOKED'
)
AND TEMPLATE_VERSION = '2';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


-------------------------------------------------------------------------
-- TROS v3 -> v2
-------------------------------------------------------------------------

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE TEMPLATE_NAME IN (
    'PERMIT_TROS',
    'PERMIT_TROS_VOID',
    'PERMIT_TROS_REVOKED'
)
AND TEMPLATE_VERSION = '3';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


UPDATE dops.ORBC_DOCUMENT_TEMPLATE
SET IS_ACTIVE = 'Y'
WHERE TEMPLATE_NAME IN (
    'PERMIT_TROS',
    'PERMIT_TROS_VOID',
    'PERMIT_TROS_REVOKED'
)
AND TEMPLATE_VERSION = '2';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


-------------------------------------------------------------------------
-- MFP v5 -> v4
-------------------------------------------------------------------------

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE TEMPLATE_NAME IN (
    'PERMIT_MFP',
    'PERMIT_MFP_VOID',
    'PERMIT_MFP_REVOKED'
)
AND TEMPLATE_VERSION = '5';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


UPDATE dops.ORBC_DOCUMENT_TEMPLATE
SET IS_ACTIVE = 'Y'
WHERE TEMPLATE_NAME IN (
    'PERMIT_MFP',
    'PERMIT_MFP_VOID',
    'PERMIT_MFP_REVOKED'
)
AND TEMPLATE_VERSION = '4';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


-------------------------------------------------------------------------
-- STFR v3 -> v2
-------------------------------------------------------------------------

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE TEMPLATE_NAME IN (
    'PERMIT_STFR',
    'PERMIT_STFR_VOID',
    'PERMIT_STFR_REVOKED'
)
AND TEMPLATE_VERSION = '3';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


UPDATE dops.ORBC_DOCUMENT_TEMPLATE
SET IS_ACTIVE = 'Y'
WHERE TEMPLATE_NAME IN (
    'PERMIT_STFR',
    'PERMIT_STFR_VOID',
    'PERMIT_STFR_REVOKED'
)
AND TEMPLATE_VERSION = '2';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


-------------------------------------------------------------------------
-- QRFR v3 -> v2
-------------------------------------------------------------------------

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE TEMPLATE_NAME IN (
    'PERMIT_QRFR',
    'PERMIT_QRFR_VOID',
    'PERMIT_QRFR_REVOKED'
)
AND TEMPLATE_VERSION = '3';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


UPDATE dops.ORBC_DOCUMENT_TEMPLATE
SET IS_ACTIVE = 'Y'
WHERE TEMPLATE_NAME IN (
    'PERMIT_QRFR',
    'PERMIT_QRFR_VOID',
    'PERMIT_QRFR_REVOKED'
)
AND TEMPLATE_VERSION = '2';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


-------------------------------------------------------------------------
-- Payment Receipt v4 -> v3
-------------------------------------------------------------------------

DELETE [dops].[ORBC_DOCUMENT_TEMPLATE]
WHERE TEMPLATE_NAME IN (
    'PAYMENT_RECEIPT'
)
AND TEMPLATE_VERSION = '4';


IF @@ERROR <> 0
    SET NOEXEC ON
GO


UPDATE dops.ORBC_DOCUMENT_TEMPLATE
SET IS_ACTIVE = 'Y'
WHERE TEMPLATE_NAME IN (
    'PAYMENT_RECEIPT'
)
AND TEMPLATE_VERSION = '3';


IF @@ERROR <> 0
    SET NOEXEC ON
GO

-------------------------------------------------------------------------
-- System version
-------------------------------------------------------------------------

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = 'Revert global template updates to permit and payment templates'


INSERT [dbo].[ORBC_SYS_VERSION] (
    [VERSION_ID],
    [DESCRIPTION],
    [RELEASE_DATE]
)
VALUES (
    107,
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