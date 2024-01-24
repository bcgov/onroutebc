SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

-- Add new auth groups
INSERT [access].[ORBC_USER_AUTH_GROUP_TYPE] ([USER_AUTH_GROUP_TYPE], [DISPLAY_NAME], [DESCRIPTION], [STAFF_FLAG], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'HQADMIN', N'MOTI HQ Administrator', N'MOTI HQ administrator not part of the permit centre', 1, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT [access].[ORBC_USER_AUTH_GROUP_TYPE] ([USER_AUTH_GROUP_TYPE], [DISPLAY_NAME], [DESCRIPTION], [STAFF_FLAG], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'FINANCE', N'Finance Staff', N'Finance team at the permit centre', 1, NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO

-- Add new auth roles
INSERT [access].[ORBC_ROLE_TYPE] ([ROLE_TYPE], [ROLE_DESCRIPTION]) VALUES (N'ORBC-READ-SPECIAL-AUTH', NULL)
INSERT [access].[ORBC_ROLE_TYPE] ([ROLE_TYPE], [ROLE_DESCRIPTION]) VALUES (N'ORBC-READ-NOFEE', NULL)
INSERT [access].[ORBC_ROLE_TYPE] ([ROLE_TYPE], [ROLE_DESCRIPTION]) VALUES (N'ORBC-WRITE-NOFEE', NULL)
INSERT [access].[ORBC_ROLE_TYPE] ([ROLE_TYPE], [ROLE_DESCRIPTION]) VALUES (N'ORBC-READ-LCV-FLAG', NULL)
INSERT [access].[ORBC_ROLE_TYPE] ([ROLE_TYPE], [ROLE_DESCRIPTION]) VALUES (N'ORBC-WRITE-LCV-FLAG', NULL)
INSERT [access].[ORBC_ROLE_TYPE] ([ROLE_TYPE], [ROLE_DESCRIPTION]) VALUES (N'ORBC-READ-LOA', NULL)
INSERT [access].[ORBC_ROLE_TYPE] ([ROLE_TYPE], [ROLE_DESCRIPTION]) VALUES (N'ORBC-WRITE-LOA', NULL)
GO

-- Assign auth roles to new auth groups
-- HQADMIN roles
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-READ-SELF')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-READ-ORG')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-READ-SPECIAL-AUTH')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-READ-NOFEE')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-WRITE-NOFEE')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-READ-LCV-FLAG')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-WRITE-LCV-FLAG')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-READ-LOA')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-WRITE-LOA')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-GENERATE-REPORT')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-GENERATE-TRANSACTION-REPORT')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-GENERATE-TRANSACTION-REPORT-ALL')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-READ-BILLING')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-STAFF')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'HQADMIN', N'ORBC-READ-USER')
-- FINANCE roles
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-READ-SELF')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-READ-ORG')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-READ-SPECIAL-AUTH')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-READ-NOFEE')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-WRITE-NOFEE')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-READ-PERMIT')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-GENERATE-REPORT')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-GENERATE-TRANSACTION-REPORT')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-GENERATE-TRANSACTION-REPORT-ALL')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-READ-BILLING')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-READ-PAYMENT')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-STAFF')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-READ-USER')
INSERT [access].[ORBC_GROUP_ROLE] ([USER_AUTH_GROUP_TYPE], [ROLE_TYPE]) VALUES (N'FINANCE', N'ORBC-READ-DOCUMENT')
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Include auth groups HQADMIN and FINANCE'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (13, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())