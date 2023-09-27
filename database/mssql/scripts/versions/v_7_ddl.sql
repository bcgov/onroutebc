SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO


CREATE TABLE [permit].[ORBC_VT_TRANSACTION_TYPE](
	[ID] [varchar](3) NOT NULL,
	[DESCRIPTION] [varchar] (50) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_VT_TRANSACTION_TYPE] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [permit].[ORBC_VT_TRANSACTION_TYPE] ADD  CONSTRAINT [ORBC_TRANSACTION_TYPE_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [permit].[ORBC_VT_TRANSACTION_TYPE] ADD  CONSTRAINT [ORBC_TRANSACTION_TYPE_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [permit].[ORBC_VT_TRANSACTION_TYPE] ADD  CONSTRAINT [ORBC_TRANSACTION_TYPE_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [permit].[ORBC_VT_TRANSACTION_TYPE] ADD  CONSTRAINT [ORBC_TRANSACTION_TYPE_DB_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Transaction Type mirroring Bambora values' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_VT_TRANSACTION_TYPE', @level2type=N'COLUMN',@level2name=N'ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The description of Transaction Type.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_VT_TRANSACTION_TYPE', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_VT_TRANSACTION_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_VT_TRANSACTION_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_VT_TRANSACTION_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_VT_TRANSACTION_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_VT_TRANSACTION_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

INSERT [permit].[ORBC_VT_TRANSACTION_TYPE] ([ID], [DESCRIPTION], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'P', N'Payment Transaction', N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT [permit].[ORBC_VT_TRANSACTION_TYPE] ([ID], [DESCRIPTION], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'R', N'Refund Transaction', N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT [permit].[ORBC_VT_TRANSACTION_TYPE] ([ID], [DESCRIPTION], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'Z', N'Zero Amount Transaction', N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO

CREATE TABLE [permit].[ORBC_VT_PAYMENT_METHOD](
	[PAYMENT_METHOD_ID] [int] IDENTITY(1,1) NOT NULL,
	[NAME] [varchar] (20) NOT NULL,
	[DESCRIPTION] [varchar] (50) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [ORBC_VT_PAYMENT_METHOD_PK] PRIMARY KEY CLUSTERED 
(
	[PAYMENT_METHOD_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET IDENTITY_INSERT [permit].[ORBC_VT_PAYMENT_METHOD] ON 
INSERT [permit].[ORBC_VT_PAYMENT_METHOD] ([PAYMENT_METHOD_ID], [NAME], [DESCRIPTION], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (1, N'MOTI Pay', N'MOTI Pay with credit card', N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
GO
SET IDENTITY_INSERT [permit].[ORBC_VT_PAYMENT_METHOD] OFF 

CREATE TABLE [permit].[ORBC_TRANSACTION](
	[TRANSACTION_ID] [bigint] IDENTITY(20000000,1) NOT NULL,
	[TRANSACTION_TYPE_ID] [varchar] (3) NOT NULL,
	[PAYMENT_METHOD_ID] [int] NOT NULL,
	[TOTAL_TRANSACTION_AMOUNT] [decimal] (9, 2) NOT NULL,
	[TRANSACTION_SUBMIT_DATE] [datetime2](7) NOT NULL,
	[TRANSACTION_ORDER_NUMBER] [varchar](30) NOT NULL,
	[PG_TRANSACTION_ID] [bigint] NULL,
	[PG_TRANSACTION_APPROVED] [tinyint] NULL CHECK (PG_TRANSACTION_APPROVED BETWEEN 0 AND 1),
	[PG_AUTH_CODE] [varchar] (32) NULL,
	[PG_TRANSACTION_CARD_TYPE] [nvarchar](2) NULL,
	[PG_TRANSACTION_DATE] [datetime2](7) NULL,
	[PG_CVD_ID] [tinyint] NULL CHECK (PG_CVD_ID BETWEEN 1 AND 6),
	[PG_PAYMENT_METHOD] [varchar] (2) NULL,	
	[PG_MESSAGE_ID] [int] NULL,
	[PG_MESSAGE_TEXT] [varchar](100) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [ORBC_TRANSACTION_PK] PRIMARY KEY CLUSTERED 
(
	[TRANSACTION_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [permit].[ORBC_RECEIPT](
	[RECEIPT_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[RECEIPT_NUMBER] [varchar](19) NOT NULL,
	[TRANSACTION_ID] [bigint] NOT NULL,
	[RECEIPT_DOCUMENT_ID] [varchar](10) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [ORBC_RECEIPT_PK] PRIMARY KEY CLUSTERED 
(
	[RECEIPT_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [permit].[ORBC_TRANSACTION] ADD  CONSTRAINT [ORBC_TRANSACTION_TRX_SUBMIT_DATE_DEF]  DEFAULT (getutcdate()) FOR [TRANSACTION_SUBMIT_DATE]
ALTER TABLE [permit].[ORBC_TRANSACTION] ADD  CONSTRAINT [ORBC_TRANSACTION_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [permit].[ORBC_TRANSACTION] ADD  CONSTRAINT [ORBC_TRANSACTION_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [permit].[ORBC_TRANSACTION] ADD  CONSTRAINT [ORBC_TRANSACTION_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [permit].[ORBC_TRANSACTION] ADD  CONSTRAINT [ORBC_TRANSACTION_DB_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

CREATE TABLE [permit].[ORBC_PERMIT_TRANSACTION](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_ID] [bigint] NOT NULL,
	[TRANSACTION_ID] [bigint] NOT NULL,
	[TRANSACTION_AMOUNT] [decimal] (9, 2) NOT NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [PK_ORBC_PAYMENT_TRANSACTIONS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [permit].[ORBC_PERMIT_TRANSACTION] ADD  CONSTRAINT [ORBC_PERMIT_TRANSACTION_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [permit].[ORBC_PERMIT_TRANSACTION] ADD  CONSTRAINT [ORBC_PERMIT_TRANSACTION_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [permit].[ORBC_PERMIT_TRANSACTION] ADD  CONSTRAINT [ORBC_PERMIT_TRANSACTION_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [permit].[ORBC_PERMIT_TRANSACTION] ADD  CONSTRAINT [ORBC_PERMIT_TRANSACTION_DB_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
ALTER TABLE [permit].[ORBC_RECEIPT] ADD  CONSTRAINT [ORBC_RECEIPT_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [permit].[ORBC_RECEIPT] ADD  CONSTRAINT [ORBC_RECEIPT_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [permit].[ORBC_RECEIPT] ADD  CONSTRAINT [ORBC_RECEIPT_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [permit].[ORBC_RECEIPT] ADD  CONSTRAINT [ORBC_RECEIPT_DB_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
ALTER TABLE [permit].[ORBC_TRANSACTION]  WITH CHECK ADD  CONSTRAINT [ORBC_TRANSACTION_PAYMENT_METHOD_FK] FOREIGN KEY([PAYMENT_METHOD_ID])
REFERENCES [permit].[ORBC_VT_PAYMENT_METHOD] ([PAYMENT_METHOD_ID])
ALTER TABLE [permit].[ORBC_TRANSACTION]  WITH CHECK ADD  CONSTRAINT [ORBC_TRANSACTION_TYPE_ID_FK] FOREIGN KEY([TRANSACTION_TYPE_ID])
REFERENCES [permit].[ORBC_VT_TRANSACTION_TYPE] ([ID])
ALTER TABLE [permit].[ORBC_PERMIT_TRANSACTION]  WITH CHECK ADD  CONSTRAINT [ORBC_PERMIT_TRANSACTION_PERMIT_ID_FK] FOREIGN KEY([PERMIT_ID])
REFERENCES [permit].[ORBC_PERMIT] ([ID])
ALTER TABLE [permit].[ORBC_PERMIT_TRANSACTION]  WITH CHECK ADD  CONSTRAINT [ORBC_PERMIT_TRANSACTION_TRANSACTION_ID_FK] FOREIGN KEY([TRANSACTION_ID])
REFERENCES [permit].[ORBC_TRANSACTION] ([TRANSACTION_ID])
ALTER TABLE [permit].[ORBC_RECEIPT]  WITH CHECK ADD  CONSTRAINT [ORBC_RECEIPT_TRANSACTION_ID_FK] FOREIGN KEY([TRANSACTION_ID])
REFERENCES [permit].[ORBC_TRANSACTION] ([TRANSACTION_ID])
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Primary key for payment method metadata record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PAYMENT_METHOD', @level2type=N'COLUMN',@level2name=N'PAYMENT_METHOD_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Payment method name' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PAYMENT_METHOD', @level2type=N'COLUMN',@level2name=N'NAME'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Payment method description' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_VT_PAYMENT_METHOD', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Primary key for the transaction metadata record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The original value sent to indicate the type of transaction to perform' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_TYPE_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The value of trnOrderNumber submitted in the transaction request' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_ORDER_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Bambora-assigned eight-digit unique id number used to identify an individual transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PG_TRANSACTION_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The total amount of the transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TOTAL_TRANSACTION_AMOUNT'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Transaction approved or refused identifier' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PG_TRANSACTION_APPROVED'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'If the transaction is approved this parameter will contain a unique bank-issued code' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PG_AUTH_CODE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The type of card used in the transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PG_TRANSACTION_CARD_TYPE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time that user submitted the transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_SUBMIT_DATE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time that the transaction was processed' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PG_TRANSACTION_DATE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Card verification match ID' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PG_CVD_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'2 characters that Bambora sends back references interac online transaction or credit card transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PG_PAYMENT_METHOD'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Payment method identifier of the user selected payment method' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PAYMENT_METHOD_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The message id references a detailed approved/declined transaction response message' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PG_MESSAGE_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A basic approved/declined message which may be displayed to the customer on a confirmation page' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PG_MESSAGE_TEXT'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Permit ID relates to a transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PERMIT_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Transaction ID relates to a permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The amount of the transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_AMOUNT'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Receipt ID for a payment transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_RECEIPT', @level2type=N'COLUMN',@level2name=N'RECEIPT_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Receipt number for a payment transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_RECEIPT', @level2type=N'COLUMN',@level2name=N'RECEIPT_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Transaction ID of the payment receipt' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_RECEIPT', @level2type=N'COLUMN',@level2name=N'TRANSACTION_ID'
GO

CREATE SEQUENCE [permit].[ORBC_RECEIPT_NUMBER_SEQ] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE 1
 MAXVALUE 99999999
 CACHE 
GO

CREATE SEQUENCE [permit].[ORBC_TRANSACTION_NUMBER_SEQ] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE 1
 MAXVALUE 9999999999
 CACHE 
GO 

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for Permit Payment'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (7, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
