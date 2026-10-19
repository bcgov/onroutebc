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

CREATE TABLE [permit].[ORBC_PBI_FILE] (
	[ID] [bigint] IDENTITY(1, 1) NOT NULL
	,[FILE_NAME] [nvarchar](100) NOT NULL
	,[DOCUMENT_ID] [bigint] NOT NULL
	,[DOWNLOAD_TIMESTAMP] [datetime2](7) NOT NULL
	,[IS_PROCESSED] [char](1) NOT NULL
	,[PROCESSED_TIMESTAMP] [datetime2](7) NULL
	,[APP_CREATE_TIMESTAMP] [datetime2](7) NULL
	,[APP_CREATE_USERID] [nvarchar](30) NULL
	,[APP_CREATE_USER_GUID] [char](32) NULL
	,[APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL
	,[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL
	,[APP_LAST_UPDATE_USERID] [nvarchar](30) NULL
	,[APP_LAST_UPDATE_USER_GUID] [char](32) NULL
	,[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL
	,[CONCURRENCY_CONTROL_NUMBER] [int] NULL
	,[DB_CREATE_USERID] [varchar](63) NULL
	,[DB_CREATE_TIMESTAMP] [datetime2](7) NULL
	,[DB_LAST_UPDATE_USERID] [varchar](63) NULL
	,[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL
	,CONSTRAINT [ORBC_PBI_FILE_PK] PRIMARY KEY CLUSTERED ([ID] ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		) ON [PRIMARY]
	) ON [PRIMARY]
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Unique auto-generated surrogate primary key'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1Name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'ID'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Name of the file downloaded from the PBI SFTP server'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1Name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'FILE_NAME'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The date and time the file was downloaded from the PBI SFTP server and uploaded to S3.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'DOWNLOAD_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The date and time the file was processed and details added to ORBC_PBI_FILE_DETAILS.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'PROCESSED_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Foreign key to the orbc_document table,identifying the document/txt that references the Document Management System (DMS)'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'DOCUMENT_ID'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Indicator of whether the record has been processed into the ORBC_PBI_FILE_DETAILS tables.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'IS_PROCESSED'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'CONCURRENCY_CONTROL_NUMBER'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The user or proxy account that created the record.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The date and time the record was created.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The user or proxy account that created or last updated the record.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The date and time the record was created or last updated.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PBI_FILE'
	,@level2type = N'COLUMN'
	,@level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE]
	WITH CHECK ADD CONSTRAINT [ORBC_PBI_FILE_DOCUMENT_ID_FK] FOREIGN KEY ([DOCUMENT_ID]) REFERENCES [dops].[ORBC_DOCUMENT]([ID])

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] CHECK CONSTRAINT [ORBC_PBI_FILE_DOCUMENT_ID_FK]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

CREATE NONCLUSTERED INDEX IX_FK_ORBC_PBI_FILE_DOCUMENT_ID ON [permit].[ORBC_PBI_FILE] ([DOCUMENT_ID]);
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

IF NOT EXISTS (
		SELECT 1
		FROM sys.indexes
		WHERE name = N'IX_ORBC_PBI_FILE_IS_PROCESSED'
			AND object_id = OBJECT_ID(N'permit.ORBC_PBI_FILE')
		)
BEGIN
	CREATE NONCLUSTERED INDEX [IX_ORBC_PBI_FILE_IS_PROCESSED] ON [permit].[ORBC_PBI_FILE] ([IS_PROCESSED]);
END
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] ADD CONSTRAINT [ORBC_PBI_FILE_FILE_NAME_UNIQUE] UNIQUE ([FILE_NAME]);

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] ADD CONSTRAINT [DF_ORBC_PBI_FILE_IS_PROCESSED_DEFAULT] DEFAULT('N')
FOR IS_PROCESSED
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] ADD DEFAULT(getutcdate())
FOR [APP_CREATE_TIMESTAMP]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] ADD DEFAULT(user_name())
FOR [APP_CREATE_USERID]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] ADD DEFAULT(getutcdate())
FOR [APP_LAST_UPDATE_TIMESTAMP]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] ADD DEFAULT(user_name())
FOR [APP_LAST_UPDATE_USERID]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] ADD CONSTRAINT [ORBC_PBI_FILE_DB_CREATE_USERID_DEF] DEFAULT(user_name())
FOR [DB_CREATE_USERID]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] ADD CONSTRAINT [ORBC_PBI_FILE_DB_CREATE_TIMESTAMP_DEF] DEFAULT(getutcdate())
FOR [DB_CREATE_TIMESTAMP]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] ADD CONSTRAINT [ORBC_PBI_FILE_DB_LAST_UPDATE_USERID_DEF] DEFAULT(user_name())
FOR [DB_LAST_UPDATE_USERID]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PBI_FILE] ADD CONSTRAINT [ORBC_PBI_FILE_DB_LAST_UPDATE_TIMESTAMP_DEF] DEFAULT(getutcdate())
FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

CREATE SEQUENCE [permit].[ORBC_PBI_FILE_H_ID_SEQ] AS [bigint] START
	WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 50;

CREATE TABLE [permit].[ORBC_PBI_FILE_HIST] (
	_PBI_FILES_HIST_ID [bigint] DEFAULT(NEXT VALUE FOR [permit].[ORBC_PBI_FILE_H_ID_SEQ]) NOT NULL
	,EFFECTIVE_DATE_HIST [datetime] NOT NULL DEFAULT getutcdate()
	,END_DATE_HIST [datetime]
	,[ID] BIGINT NOT NULL
	,[FILE_NAME] NVARCHAR(100) NOT NULL
	,[DOCUMENT_ID] BIGINT NOT NULL
	,[DOWNLOAD_TIMESTAMP] DATETIME2 NOT NULL
	,[IS_PROCESSED] CHAR(1) NOT NULL
	,[PROCESSED_TIMESTAMP] DATETIME2 NULL
	,[APP_CREATE_TIMESTAMP] DATETIME2 NULL
	,[APP_CREATE_USERID] NVARCHAR(30) NULL
	,[APP_CREATE_USER_GUID] CHAR(32) NULL
	,[APP_CREATE_USER_DIRECTORY] NVARCHAR(30) NULL
	,[APP_LAST_UPDATE_TIMESTAMP] DATETIME2 NULL
	,[APP_LAST_UPDATE_USERID] NVARCHAR(30) NULL
	,[APP_LAST_UPDATE_USER_GUID] CHAR(32) NULL
	,[APP_LAST_UPDATE_USER_DIRECTORY] NVARCHAR(30) NULL
	,[CONCURRENCY_CONTROL_NUMBER] INT NULL
	,[DB_CREATE_USERID] VARCHAR(63) NULL
	,[DB_CREATE_TIMESTAMP] DATETIME2 NULL
	,[DB_LAST_UPDATE_USERID] VARCHAR(63) NULL
	,[DB_LAST_UPDATE_TIMESTAMP] DATETIME2 NULL
	)

ALTER TABLE [permit].[ORBC_PBI_FILE_HIST] ADD CONSTRAINT ORBC_27_H_PK PRIMARY KEY CLUSTERED (_PBI_FILES_HIST_ID);

ALTER TABLE [permit].[ORBC_PBI_FILE_HIST] ADD CONSTRAINT ORBC_27_H_UK UNIQUE (
	_PBI_FILES_HIST_ID
	,END_DATE_HIST
	)
GO

CREATE TRIGGER ORBC_PBIFL_A_S_IUD_TR ON [permit].[ORBC_PBI_FILE]
FOR INSERT
	,UPDATE
	,DELETE
AS
SET NOCOUNT ON

BEGIN TRY
	DECLARE @curr_date DATETIME;

	SET @curr_date = getutcdate();

	IF NOT EXISTS (
			SELECT *
			FROM inserted
			)
		AND NOT EXISTS (
			SELECT *
			FROM deleted
			)
		RETURN;

	-- historical
	IF EXISTS (
			SELECT *
			FROM deleted
			)
		UPDATE [permit].[ORBC_PBI_FILE_HIST]
		SET END_DATE_HIST = @curr_date
		WHERE ID IN (
				SELECT ID
				FROM deleted
				)
			AND END_DATE_HIST IS NULL;

	IF EXISTS (
			SELECT *
			FROM inserted
			)
		INSERT INTO [permit].[ORBC_PBI_FILE_HIST] (
			[ID]
			,[FILE_NAME]
			,[DOCUMENT_ID]
			,[DOWNLOAD_TIMESTAMP]
			,[IS_PROCESSED]
			,[PROCESSED_TIMESTAMP]
			,[APP_CREATE_TIMESTAMP]
			,[APP_CREATE_USERID]
			,[APP_CREATE_USER_GUID]
			,[APP_CREATE_USER_DIRECTORY]
			,[APP_LAST_UPDATE_TIMESTAMP]
			,[APP_LAST_UPDATE_USERID]
			,[APP_LAST_UPDATE_USER_GUID]
			,[APP_LAST_UPDATE_USER_DIRECTORY]
			,[CONCURRENCY_CONTROL_NUMBER]
			,[DB_CREATE_USERID]
			,[DB_CREATE_TIMESTAMP]
			,[DB_LAST_UPDATE_USERID]
			,[DB_LAST_UPDATE_TIMESTAMP]
			,_PBI_FILES_HIST_ID
			,END_DATE_HIST
			,EFFECTIVE_DATE_HIST
			)
		SELECT [ID]
			,[FILE_NAME]
			,[DOCUMENT_ID]
			,[DOWNLOAD_TIMESTAMP]
			,[IS_PROCESSED]
			,[PROCESSED_TIMESTAMP]
			,[APP_CREATE_TIMESTAMP]
			,[APP_CREATE_USERID]
			,[APP_CREATE_USER_GUID]
			,[APP_CREATE_USER_DIRECTORY]
			,[APP_LAST_UPDATE_TIMESTAMP]
			,[APP_LAST_UPDATE_USERID]
			,[APP_LAST_UPDATE_USER_GUID]
			,[APP_LAST_UPDATE_USER_DIRECTORY]
			,[CONCURRENCY_CONTROL_NUMBER]
			,[DB_CREATE_USERID]
			,[DB_CREATE_TIMESTAMP]
			,[DB_LAST_UPDATE_USERID]
			,[DB_LAST_UPDATE_TIMESTAMP]
			,(
				NEXT value FOR [permit].[ORBC_PBI_FILE_H_ID_SEQ]
				) AS [_PBI_FILES_HIST_ID]
			,NULL AS [END_DATE_HIST]
			,@curr_date AS [EFFECTIVE_DATE_HIST]
		FROM inserted;
END TRY

BEGIN CATCH
	IF @@trancount > 0
		ROLLBACK TRANSACTION

	EXEC orbc_error_handling
END CATCH;
GO

CREATE TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] (
	[ID] [bigint] IDENTITY(1, 1) NOT NULL
	,[PBI_FILE_ID] [bigint] NOT NULL
	,[ACCOUNT_NUMBER] [nvarchar](20) NOT NULL --12
	,[DEPOSIT_AMOUNT] [decimal](11, 2) NOT NULL --9,2
	,[EFFECTIVE_PAYMENT_DATE] DATE NOT NULL
	,[DEPOSIT_DATE] DATE NOT NULL
	,[APP_CREATE_TIMESTAMP] [datetime2](7) NULL
	,[APP_CREATE_USERID] [nvarchar](30) NULL
	,[APP_CREATE_USER_GUID] [char](32) NULL
	,[APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL
	,[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL
	,[APP_LAST_UPDATE_USERID] [nvarchar](30) NULL
	,[APP_LAST_UPDATE_USER_GUID] [char](32) NULL
	,[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL
	,[CONCURRENCY_CONTROL_NUMBER] [int] NULL
	,[DB_CREATE_USERID] [varchar](63) NULL
	,[DB_CREATE_TIMESTAMP] [datetime2](7) NULL
	,[DB_LAST_UPDATE_USERID] [varchar](63) NULL
	,[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL
	,CONSTRAINT [ORBC_PREPAID_ACCOUNT_DEPOSIT_PK] PRIMARY KEY CLUSTERED ([ID] ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		) ON [PRIMARY]
	) ON [PRIMARY]
GO


EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Unique auto-generated surrogate primary key'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1Name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'ID'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Foreign key to the ORBC_PBI_FILE table,identifying the PBI file that the deposit record was extracted from.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'PBI_FILE_ID'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Prepaid account number that the deposit is being applied to.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1Name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'ACCOUNT_NUMBER'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The amount of the deposit being applied to the prepaid account.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'DEPOSIT_AMOUNT'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Date payment made by Client.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'EFFECTIVE_PAYMENT_DATE'
GO


EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Date deposit made to your account.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'DEPOSIT_DATE'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'CONCURRENCY_CONTROL_NUMBER'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The user or proxy account that created the record.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The date and time the record was created.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The user or proxy account that created or last updated the record.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name = N'MS_Description'
	,@value = N'The date and time the record was created or last updated.'
	,@level0type = N'SCHEMA'
	,@level0name = N'permit'
	,@level1type = N'TABLE'
	,@level1name = N'ORBC_PREPAID_ACCOUNT_DEPOSIT'
	,@level2type = N'COLUMN'
	,@level2name = N'DB_LAST_UPDATE_TIMESTAMP'
GO


ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] ADD DEFAULT(getutcdate())
FOR [APP_CREATE_TIMESTAMP]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] ADD DEFAULT(user_name())
FOR [APP_CREATE_USERID]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] ADD DEFAULT(getutcdate())
FOR [APP_LAST_UPDATE_TIMESTAMP]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] ADD DEFAULT(user_name())
FOR [APP_LAST_UPDATE_USERID]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] ADD CONSTRAINT [ORBC_PREPAID_ACCOUNT_DEPOSIT_DB_CREATE_USERID_DEF] DEFAULT(user_name())
FOR [DB_CREATE_USERID]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] ADD CONSTRAINT [ORBC_PREPAID_ACCOUNT_DEPOSIT_DB_CREATE_TIMESTAMP_DEF] DEFAULT(getutcdate())
FOR [DB_CREATE_TIMESTAMP]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] ADD CONSTRAINT [ORBC_PREPAID_ACCOUNT_DEPOSIT_DB_LAST_UPDATE_USERID_DEF] DEFAULT(user_name())
FOR [DB_LAST_UPDATE_USERID]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] ADD CONSTRAINT [ORBC_PREPAID_ACCOUNT_DEPOSIT_DB_LAST_UPDATE_TIMESTAMP_DEF] DEFAULT(getutcdate())
FOR [DB_LAST_UPDATE_TIMESTAMP]
GO


IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT]
	WITH CHECK ADD CONSTRAINT [ORBC_PREPAID_ACCOUNT_DEPOSIT_PBI_FILE_ID_FK] FOREIGN KEY ([PBI_FILE_ID]) REFERENCES [permit].[ORBC_PBI_FILE]([ID])

IF @@ERROR <> 0
	SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] CHECK CONSTRAINT [ORBC_PREPAID_ACCOUNT_DEPOSIT_PBI_FILE_ID_FK]
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

CREATE NONCLUSTERED INDEX IX_FK_ORBC_PREPAID_ACCOUNT_DEPOSIT_PBI_FILE_ID ON [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] ([PBI_FILE_ID]);
GO

IF @@ERROR <> 0
	SET NOEXEC ON
GO

CREATE SEQUENCE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT_H_ID_SEQ] AS [bigint] START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 50;

CREATE TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT_HIST](
  _PREPAID_ACCOUNT_DEPOSIT_HIST_ID [bigint] DEFAULT (NEXT VALUE FOR [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT_H_ID_SEQ]) NOT NULL
  ,EFFECTIVE_DATE_HIST [datetime] NOT NULL default getutcdate()
  ,END_DATE_HIST [datetime]
  , [ID] bigint NOT NULL, [PBI_FILE_ID] bigint NOT NULL, [ACCOUNT_NUMBER] nvarchar(20) NOT NULL, [DEPOSIT_AMOUNT] decimal NOT NULL, [EFFECTIVE_PAYMENT_DATE] date NOT NULL, [DEPOSIT_DATE] date NOT NULL, [APP_CREATE_TIMESTAMP] datetime2 NULL, [APP_CREATE_USERID] nvarchar(30) NULL, [APP_CREATE_USER_GUID] char(32) NULL, [APP_CREATE_USER_DIRECTORY] nvarchar(30) NULL, [APP_LAST_UPDATE_TIMESTAMP] datetime2 NULL, [APP_LAST_UPDATE_USERID] nvarchar(30) NULL, [APP_LAST_UPDATE_USER_GUID] char(32) NULL, [APP_LAST_UPDATE_USER_DIRECTORY] nvarchar(30) NULL, [CONCURRENCY_CONTROL_NUMBER] int NULL, [DB_CREATE_USERID] varchar(63) NULL, [DB_CREATE_TIMESTAMP] datetime2 NULL, [DB_LAST_UPDATE_USERID] varchar(63) NULL, [DB_LAST_UPDATE_TIMESTAMP] datetime2 NULL
  )

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT_HIST] ADD CONSTRAINT ORBC_37_H_PK PRIMARY KEY CLUSTERED (_PREPAID_ACCOUNT_DEPOSIT_HIST_ID);  

ALTER TABLE [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT_HIST] ADD CONSTRAINT ORBC_37_H_UK UNIQUE (_PREPAID_ACCOUNT_DEPOSIT_HIST_ID,END_DATE_HIST)
go

CREATE TRIGGER ORBC_PRPDACNDEP_A_S_IUD_TR ON [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
BEGIN TRY
DECLARE @curr_date datetime;
SET @curr_date = getutcdate();
  IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted) 
    RETURN;

  -- historical
  IF EXISTS(SELECT * FROM deleted)
    update [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT_HIST] set END_DATE_HIST = @curr_date where ID in (select ID from deleted) and END_DATE_HIST is null;
  
  IF EXISTS(SELECT * FROM inserted)
    insert into [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT_HIST] ([ID], [PBI_FILE_ID], [ACCOUNT_NUMBER], [DEPOSIT_AMOUNT], [EFFECTIVE_PAYMENT_DATE], [DEPOSIT_DATE], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], _PREPAID_ACCOUNT_DEPOSIT_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
      select [ID], [PBI_FILE_ID], [ACCOUNT_NUMBER], [DEPOSIT_AMOUNT], [EFFECTIVE_PAYMENT_DATE], [DEPOSIT_DATE], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], (next value for [permit].[ORBC_PREPAID_ACCOUNT_DEPOSIT_H_ID_SEQ]) as [_PREPAID_ACCOUNT_DEPOSIT_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
go

IF @@ERROR <> 0
	SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = 'Tables for PBI integration'

INSERT [dbo].[ORBC_SYS_VERSION] (
	[VERSION_ID]
	,[DESCRIPTION]
	,[UPDATE_SCRIPT]
	,[REVERT_SCRIPT]
	,[RELEASE_DATE]
	)
VALUES (
	117
	,@VersionDescription
	,'$(UPDATE_SCRIPT)'
	,'$(REVERT_SCRIPT)'
	,getutcdate()
	)

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
	PRINT 'The database update succeeded'
ELSE
BEGIN
	IF @@TRANCOUNT > 0
		ROLLBACK TRANSACTION

	PRINT 'The database update failed'
END
GO