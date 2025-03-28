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

-- Foreign key indexes on all tables
CREATE NONCLUSTERED INDEX IX_FK_ETL_PROCESSES_ETL_PROCESS_TYPE ON [tps].[ETL_PROCESSES] ([PROCESS_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_ADDRESS_PROVINCE ON [dbo].[ORBC_ADDRESS] ([PROVINCE_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_ACTIVITY_CASE_ACTIVITY_TYPE ON [case].[ORBC_CASE_ACTIVITY] ([CASE_ACTIVITY_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_ACTIVITY_CASE_EVENT_ID ON [case].[ORBC_CASE_ACTIVITY] ([CASE_EVENT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_ACTIVITY_CASE_ID ON [case].[ORBC_CASE_ACTIVITY] ([CASE_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_CASE_STATUS_TYPE ON [case].[ORBC_CASE] ([CASE_STATUS_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_CASE_TYPE ON [case].[ORBC_CASE] ([CASE_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_DOCUMENT_CASE_EVENT_ID ON [case].[ORBC_CASE_DOCUMENT] ([CASE_EVENT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_DOCUMENT_CASE_ID ON [case].[ORBC_CASE_DOCUMENT] ([CASE_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_EVENT_CASE_EVENT_TYPE ON [case].[ORBC_CASE_EVENT] ([CASE_EVENT_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_NOTES_CASE_EVENT_ID ON [case].[ORBC_CASE_NOTES] ([CASE_EVENT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_NOTES_CASE_ID ON [case].[ORBC_CASE_NOTES] ([CASE_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_ORIGINAL_CASE_ID ON [case].[ORBC_CASE] ([ORIGINAL_CASE_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_PERMIT_ID ON [case].[ORBC_CASE] ([PERMIT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CASE_PREVIOUS_CASE_ID ON [case].[ORBC_CASE] ([PREVIOUS_CASE_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_COMPANY_DIRECTORY ON [dbo].[ORBC_COMPANY] ([COMPANY_DIRECTORY]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_COMPANY_MAILING_ADDRESS ON [dbo].[ORBC_COMPANY] ([MAILING_ADDRESS_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_COMPANY_PRIMARY_CONTACT ON [dbo].[ORBC_COMPANY] ([PRIMARY_CONTACT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_COMPANY_SUSPEND_ACTIVITY_ORBC_COMPANY ON [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY] ([COMPANY_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_COMPANY_SUSPEND_ACTIVITY_SUSPEND_ACTIVITY_TYPE ON [dbo].[ORBC_COMPANY_SUSPEND_ACTIVITY] ([SUSPEND_ACTIVITY_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_COMPANY_USER_COMPANY ON [dbo].[ORBC_COMPANY_USER] ([COMPANY_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_COMPANY_USER_USER ON [dbo].[ORBC_COMPANY_USER] ([USER_GUID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_COMPANY_USER_USER_AUTH_GROUP ON [dbo].[ORBC_COMPANY_USER] ([USER_AUTH_GROUP_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_COMPANY_USER_USER_STATUS ON [dbo].[ORBC_COMPANY_USER] ([USER_STATUS_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CONTACT_PROVINCE ON [dbo].[ORBC_CONTACT] ([PROVINCE_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CREDIT_ACCOUNT_ACTIVITY_CREDIT_ACCOUNT_ACTIVITY_TYPE ON [permit].[ORBC_CREDIT_ACCOUNT_ACTIVITY] ([CREDIT_ACCOUNT_ACTIVITY_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CREDIT_ACCOUNT_ACTIVITY_CREDIT_ACCOUNT_ID ON [permit].[ORBC_CREDIT_ACCOUNT_ACTIVITY] ([CREDIT_ACCOUNT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CREDIT_ACCOUNT_COMPANY_ID ON [permit].[ORBC_CREDIT_ACCOUNT] ([COMPANY_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CREDIT_ACCOUNT_CREDIT_ACCOUNT_STATUS_TYPE ON [permit].[ORBC_CREDIT_ACCOUNT] ([CREDIT_ACCOUNT_STATUS_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CREDIT_ACCOUNT_CREDIT_ACCOUNT_TYPE ON [permit].[ORBC_CREDIT_ACCOUNT] ([CREDIT_ACCOUNT_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CREDIT_ACCOUNT_USER_COMPANY_ID ON [permit].[ORBC_CREDIT_ACCOUNT_USER] ([COMPANY_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_CREDIT_ACCOUNT_USER_CREDIT_ACCOUNT_ID ON [permit].[ORBC_CREDIT_ACCOUNT_USER] ([CREDIT_ACCOUNT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_GL_CODE_TYPE_GL_TYPE ON [permit].[ORBC_GL_CODE_TYPE] ([GL_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_GL_CODE_TYPE_PAYMENT_CARD_TYPE ON [permit].[ORBC_GL_CODE_TYPE] ([PAYMENT_CARD_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_GL_CODE_TYPE_PAYMENT_METHOD_TYPE ON [permit].[ORBC_GL_CODE_TYPE] ([PAYMENT_METHOD_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_GL_CODE_TYPE_PERMIT_TYPE ON [permit].[ORBC_GL_CODE_TYPE] ([PERMIT_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_GROUP_ROLE_ROLE ON [access].[ORBC_GROUP_ROLE] ([ROLE_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_GROUP_ROLE_USER_AUTH_GROUP ON [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_LOA_DETAILS_COMPANY ON [permit].[ORBC_LOA_DETAILS] ([COMPANY_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_LOA_DETAILS_ORIGINAL_LOA_ID ON [permit].[ORBC_LOA_DETAILS] ([ORIGINAL_LOA_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_LOA_DETAILS_PREVIOUS_LOA_ID ON [permit].[ORBC_LOA_DETAILS] ([PREVIOUS_LOA_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_LOA_PERMIT_TYPE_LOA_ID ON [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] ([LOA_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_LOA_PERMIT_TYPES_PERMIT_TYPE ON [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] ([PERMIT_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_LOA_VEHICLES_LOA_ID ON [permit].[ORBC_LOA_VEHICLES] ([LOA_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PENDING_IDIR_USER_AUTH_GROUP ON [dbo].[ORBC_PENDING_IDIR_USER] ([USER_AUTH_GROUP_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PENDING_USER_AUTH_GROUP ON [dbo].[ORBC_PENDING_USER] ([USER_AUTH_GROUP_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PENDING_USER_COMPANY ON [dbo].[ORBC_PENDING_USER] ([COMPANY_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PERMIT_COMMENTS_PERMIT ON [permit].[ORBC_PERMIT_COMMENTS] ([PERMIT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PERMIT_ID ON [permit].[ORBC_PERMIT_DATA] ([PERMIT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PERMIT_PARENT_PERMIT ON [permit].[ORBC_PERMIT] ([PREVIOUS_REV_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PERMIT_PERMIT_APPLICATION_ORIGIN ON [permit].[ORBC_PERMIT] ([PERMIT_APPLICATION_ORIGIN_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PERMIT_PERMIT_APPROVAL_SOURCE ON [permit].[ORBC_PERMIT] ([PERMIT_APPROVAL_SOURCE_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PERMIT_PERMIT_ISSUED_BY ON [permit].[ORBC_PERMIT] ([PERMIT_ISSUED_BY_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PERMIT_PERMIT_STATUS_TYPE ON [permit].[ORBC_PERMIT] ([PERMIT_STATUS_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PERMIT_PERMIT_TYPE ON [permit].[ORBC_PERMIT] ([PERMIT_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PERMIT_STATE_PERMIT ON [permit].[ORBC_PERMIT_STATE] ([PERMIT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_PERMIT_STATE_PERMIT_STATUS ON [permit].[ORBC_PERMIT_STATE] ([PERMIT_STATUS_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_POWER_UNIT_COMPANY ON [dbo].[ORBC_POWER_UNIT] ([COMPANY_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_POWER_UNIT_POWER_UNIT_TYPE ON [dbo].[ORBC_POWER_UNIT] ([POWER_UNIT_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_POWER_UNIT_PROVINCE ON [dbo].[ORBC_POWER_UNIT] ([PROVINCE_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_SPECIAL_AUTH_COMPANY_ID ON [permit].[ORBC_SPECIAL_AUTH] ([COMPANY_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_SPECIAL_AUTH_NO_FEE_TYPE ON [permit].[ORBC_SPECIAL_AUTH] ([NO_FEE_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_TRAILER_COMPANY ON [dbo].[ORBC_TRAILER] ([COMPANY_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_TRAILER_PROVINCE ON [dbo].[ORBC_TRAILER] ([PROVINCE_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_TRAILER_TRAILER_TYPE ON [dbo].[ORBC_TRAILER] ([TRAILER_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_USER_CONTACT ON [dbo].[ORBC_USER] ([CONTACT_ID]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_USER_DIRECTORY ON [dbo].[ORBC_USER] ([USER_DIRECTORY]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_USER_USER_AUTH_GROUP ON [dbo].[ORBC_USER] ([USER_AUTH_GROUP_TYPE]);
CREATE NONCLUSTERED INDEX IX_FK_ORBC_USER_USER_STATUS ON [dbo].[ORBC_USER] ([USER_STATUS_TYPE]);
CREATE NONCLUSTERED INDEX IX_ORBC_CFS_DETAILS_TRANSACTION_ID_FK ON [permit].[ORBC_CFS_TRANSACTION_DETAIL] ([TRANSACTION_ID]);
CREATE NONCLUSTERED INDEX IX_ORBC_CFS_TRANSACTION_DETAIL_FILE_STATUS_FK ON [permit].[ORBC_CFS_TRANSACTION_DETAIL] ([CFS_FILE_STATUS_TYPE]);
CREATE NONCLUSTERED INDEX IX_ORBC_DOCUMENT_COMPANY_ID_FK ON [dops].[ORBC_DOCUMENT] ([COMPANY_ID]);
CREATE NONCLUSTERED INDEX IX_ORBC_LOA_DETAILS_DOCUMENT_ID_FK ON [permit].[ORBC_LOA_DETAILS] ([DOCUMENT_ID]);
CREATE NONCLUSTERED INDEX IX_ORBC_LOA_VEHICLES_POWER_UNIT_ID_FK ON [permit].[ORBC_LOA_VEHICLES] ([POWER_UNIT_ID]);
CREATE NONCLUSTERED INDEX IX_ORBC_LOA_VEHICLES_TRAILER_ID_FK ON [permit].[ORBC_LOA_VEHICLES] ([TRAILER_ID]);
CREATE NONCLUSTERED INDEX IX_ORBC_PERMIT_TRANSACTION_PERMIT_ID_FK ON [permit].[ORBC_PERMIT_TRANSACTION] ([PERMIT_ID]);
CREATE NONCLUSTERED INDEX IX_ORBC_PERMIT_TRANSACTION_TRANSACTION_ID_FK ON [permit].[ORBC_PERMIT_TRANSACTION] ([TRANSACTION_ID]);
CREATE NONCLUSTERED INDEX IX_ORBC_RECEIPT_TRANSACTION_ID_FK ON [permit].[ORBC_RECEIPT] ([TRANSACTION_ID]);
CREATE NONCLUSTERED INDEX IX_ORBC_TRANSACTION_CARD_TYPE_FK ON [permit].[ORBC_TRANSACTION] ([PAYMENT_CARD_TYPE]);
CREATE NONCLUSTERED INDEX IX_ORBC_TRANSACTION_PAYMENT_METHOD_FK ON [permit].[ORBC_TRANSACTION] ([PAYMENT_METHOD_TYPE]);
CREATE NONCLUSTERED INDEX IX_ORBC_TRANSACTION_TYPE_FK ON [permit].[ORBC_TRANSACTION] ([TRANSACTION_TYPE]);
GO

-- Targeted indexes for permit search and sort
CREATE NONCLUSTERED INDEX [IX_PERMIT_NUMBER] ON [permit].[ORBC_PERMIT] ([PERMIT_NUMBER] ASC);
CREATE NONCLUSTERED INDEX [IX_START_DATE] ON [permit].[ORBC_PERMIT_DATA] ([START_DATE] ASC);
CREATE NONCLUSTERED INDEX [IX_EXPIRY_DATE] ON [permit].[ORBC_PERMIT_DATA] ([EXPIRY_DATE] ASC);
CREATE NONCLUSTERED INDEX [IX_UNIT_NUMBER] ON [permit].[ORBC_PERMIT_DATA] ([UNIT_NUMBER] ASC);
CREATE NONCLUSTERED INDEX [IX_PLATE] ON [permit].[ORBC_PERMIT_DATA] ([PLATE] ASC);
CREATE NONCLUSTERED INDEX [IX_VIN] ON [permit].[ORBC_PERMIT_DATA] ([VIN] ASC);
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Add indexes to all foreign key columns and permit sort columns'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (50, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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
