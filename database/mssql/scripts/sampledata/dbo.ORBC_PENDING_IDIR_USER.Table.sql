SET NOCOUNT ON
GO
INSERT [dbo].[ORBC_PENDING_IDIR_USER] ([USERNAME],[USER_AUTH_GROUP_TYPE]) VALUES ('$(IDIR_USERNAME)','$(AUTH_GROUP)')
GO