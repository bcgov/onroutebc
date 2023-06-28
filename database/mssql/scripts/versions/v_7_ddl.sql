SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
BEGIN TRANSACTION

CREATE TABLE [permit].[ORBC_PAYMENT_METHODS](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[PAYMENT_METHOD_NAME] [varchar] (2) NOT NULL,
	[PAYMENT_METHOD_DESCRIPTION] [varchar] (20) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [PK_ORBC_PAYMENT_METHODS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [permit].[ORBC_TRANSACTION](
	[TRANSACTION_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[TRANSACTION_TYPE] [varchar] (3) NOT NULL,
	[TRANSACTION_ORDER_NUMBER] [varchar](10) NOT NULL,
	[PROVIDER_TRANSACTION_ID] [bigint] NULL,
	[TRANSACTION_AMOUNT] [decimal] (9, 2) NULL,
	[TRANSACTION_APPROVED] [tinyint] NULL CHECK (TRANSACTION_APPROVED BETWEEN 0 AND 1),
	[AUTH_CODE] [varchar] (32) NULL,
	[TRANSACTION_CARD_TYPE] [nvarchar](2) NULL,
	[TRANSACTION_SUBMIT_DATE] [datetime2](7) NULL,
	[TRANSACTION_DATE] [datetime2](7) NULL,
	[CVD_ID] [tinyint] NULL CHECK (CVD_ID BETWEEN 1 AND 6),
	[PAYMENT_METHOD_ID] [int] NULL,
	[MESSAGE_ID] [int] NULL,
	[MESSAGE_TEXT] [varchar](100) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [PK_ORBC_TRANSACTION] PRIMARY KEY CLUSTERED 
(
	[TRANSACTION_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [permit].[ORBC_PERMIT_TRANSACTION](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_ID] [bigint] NOT NULL,
	[TRANSACTION_ID] [bigint] NOT NULL,
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

ALTER TABLE [permit].[ORBC_TRANSACTION]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_TRANSACTION_PAYMENT_METHOD] FOREIGN KEY([PAYMENT_METHOD_ID])
REFERENCES [permit].[ORBC_PAYMENT_METHODS] ([ID])
GO

ALTER TABLE [permit].[ORBC_PERMIT_TRANSACTION]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_TRANSACTION_PERMIT_ID] FOREIGN KEY([PERMIT_ID])
REFERENCES [permit].[ORBC_PERMIT] ([ID])
GO

ALTER TABLE [permit].[ORBC_PERMIT_TRANSACTION]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_PERMIT_TRANSACTION_TRANSACTION_ID] FOREIGN KEY([TRANSACTION_ID])
REFERENCES [permit].[ORBC_TRANSACTION] ([TRANSACTION_ID])
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Primary key for payment method metadata record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PAYMENT_METHODS', @level2type=N'COLUMN',@level2name=N'ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Payment method name' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PAYMENT_METHODS', @level2type=N'COLUMN',@level2name=N'PAYMENT_METHOD_NAME'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Payment method description' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PAYMENT_METHODS', @level2type=N'COLUMN',@level2name=N'PAYMENT_METHOD_DESCRIPTION'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Primary key for the transaction metadata record' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The original value sent to indicate the type of transaction to perform' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_TYPE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The value of trnOrderNumber submitted in the transaction request' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_ORDER_NUMBER'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Bambora-assigned eight-digit unique id number used to identify an individual transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PROVIDER_TRANSACTION_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The amount of the transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_AMOUNT'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Transaction approved or refused identifier' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_APPROVED'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'If the transaction is approved this parameter will contain a unique bank-issued code' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'AUTH_CODE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The type of card used in the transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_CARD_TYPE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time that user submitted the transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_SUBMIT_DATE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time that the transaction was processed' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_DATE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Card verification match ID' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'CVD_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Payment method ID' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PAYMENT_METHOD_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The message id references a detailed approved/declined transaction response message' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'MESSAGE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A basic approved/declined message which may be displayed to the customer on a confirmation page' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_TRANSACTION', @level2type=N'COLUMN',@level2name=N'MESSAGE_TEXT'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Permit ID relates to a transaction' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_TRANSACTION', @level2type=N'COLUMN',@level2name=N'PERMIT_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Transaction ID relates to a permit' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_ID'
GO


DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Initial creation of entities for Permit Payment'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [DDL_FILE_SHA1], [RELEASE_DATE]) VALUES (7, @VersionDescription, '$(FILE_HASH)', getdate())


COMMIT
