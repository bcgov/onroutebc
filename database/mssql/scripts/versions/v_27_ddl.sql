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

CREATE TABLE [dbo].[ORBC_CGI_BATCH_HEADER](	
	[CGI_FILE_ID] [int] IDENTITY(1,1) NOT NULL,
	[BATCH_NUMBER] [nvarchar](50) NOT NULL,
 CONSTRAINT [ORBC_CGI_BATCH_HEADER_PK] PRIMARY KEY CLUSTERED 
(
	[CGI_FILE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- SET NOCOUNT ON
-- GO
-- SET IDENTITY_INSERT [dbo].[ORBC_CGI_BATCH_HEADER] ON 

-- EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'cgi', @level1type=N'TABLE',@level1name=N'CGI_BATCH_HEADER', @level2type=N'COLUMN',@level2name=N'CGI_FILE_ID'
-- EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'cgi', @level1type=N'TABLE',@level1name=N'CGI_BATCH_HEADER', @level2type=N'COLUMN',@level2name=N'BATCH_NUMBER'
-- GO
-- IF @@ERROR <> 0 SET NOEXEC ON
-- GO



CREATE TABLE [dbo].[ORBC_CGI_JOURNAL_HEADER](	
	[BATCH_ID] [int] IDENTITY(1,1) NOT NULL,
	[JOURNAL_BATCH_NAME] [nvarchar](50) NOT NULL,
   [FLOW_THROUGH] [nvarchar](50) NOT NULL,
 CONSTRAINT [ORBC_CGI_JOURNAL_HEADER_PK] PRIMARY KEY CLUSTERED 
(
	[BATCH_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- SET NOCOUNT ON
-- GO
-- SET IDENTITY_INSERT [dbo].[ORBC_CGI_JOURNAL_HEADER] ON 

-- EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'cgi', @level1type=N'TABLE',@level1name=N'CGI_BATCH_HEADER', @level2type=N'COLUMN',@level2name=N'BATCH_ID'
-- EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'cgi', @level1type=N'TABLE',@level1name=N'CGI_BATCH_HEADER', @level2type=N'COLUMN',@level2name=N'JOURNAL_BATCH_NAME'
-- EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'cgi', @level1type=N'TABLE',@level1name=N'CGI_BATCH_HEADER', @level2type=N'COLUMN',@level2name=N'FLOW_THROUGH'
-- GO
-- IF @@ERROR <> 0 SET NOEXEC ON
-- GO




CREATE TABLE [dbo].[ORBC_CGI_JOURNAL_VOUCHER](	
	[JOURNAL_HEADER_ID] [int] IDENTITY(1,1) NOT NULL,
	[JV_LINE_NUMBER] [nvarchar](50) NOT NULL,
   [TRANSACTION_ID] [nvarchar](50) NOT NULL,
 CONSTRAINT [ORBC_CGI_JOURNAL_VOUCHER_PK] PRIMARY KEY CLUSTERED 
(
	[JOURNAL_HEADER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

SET NOCOUNT ON
GO
SET IDENTITY_INSERT [dbo].[ORBC_CGI_JOURNAL_VOUCHER] ON 

-- EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'cgi', @level1type=N'TABLE',@level1name=N'CGI_BATCH_HEADER', @level2type=N'COLUMN',@level2name=N'JOURNAL_HEADER_ID'
-- EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'cgi', @level1type=N'TABLE',@level1name=N'CGI_BATCH_HEADER', @level2type=N'COLUMN',@level2name=N'JV_LINE_NUMBER'
-- EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique auto-generated surrogate primary key' , @level0type=N'SCHEMA',@level0name=N'cgi', @level1type=N'TABLE',@level1name=N'CGI_BATCH_HEADER', @level2type=N'COLUMN',@level2name=N'TRANSACTION_ID'
-- GO
-- IF @@ERROR <> 0 SET NOEXEC ON
-- GO


CREATE TABLE [dbo].[ORBC_CGI_FILE_LOG](	
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FILE_NAME] [nvarchar](50) NOT NULL,
   [ACK_FILE] [nvarchar](50) NOT NULL,
 CONSTRAINT [ORBC_CGI_FILE_LOG_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- SET NOCOUNT ON
-- GO
-- SET IDENTITY_INSERT [dbo].[ORBC_CGI_FILE_LOG] ON 





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


