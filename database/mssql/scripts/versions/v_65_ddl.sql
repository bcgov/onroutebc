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

ALTER TABLE permit.ORBC_PERMIT_TYPE
ADD GARMS_SERVICE_CODE char(4) NULL;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Service code for this permit type used when sending transactions to GARMS' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_TYPE', @level2type=N'COLUMN',@level2name=N'GARMS_SERVICE_CODE'
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [permit].[ORBC_GARMS_EXTRACT_TYPE](
	[GARMS_EXTRACT_TYPE] [nvarchar](10) NOT NULL,
	[DESCRIPTION] [nvarchar](100) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USERID] [nvarchar](30) NULL,
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USERID] [nvarchar](30) NULL,
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [GARMS_EXTRACT_TYPE] PRIMARY KEY CLUSTERED 
(
	[GARMS_EXTRACT_TYPE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_TYPE] ADD  DEFAULT (getutcdate()) FOR [APP_CREATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_TYPE] ADD  DEFAULT (user_name()) FOR [APP_CREATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_TYPE] ADD  DEFAULT (getutcdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_TYPE] ADD  DEFAULT (user_name()) FOR [APP_LAST_UPDATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_TYPE] ADD  CONSTRAINT [ORBC_GARMS_EXTRACT_TYPE_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_TYPE] ADD  CONSTRAINT [ORBC_GARMS_EXTRACT_TYPE_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_TYPE] ADD  CONSTRAINT [ORBC_GARMS_EXTRACT_TYPE_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_TYPE] ADD  CONSTRAINT [ORBC_GARMS_EXTRACT_TYPE_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Type of the GARMS extract file, foreign key to the ORBC_GARMS_EXTRACT_TYPE table' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_TYPE', @level2type=N'COLUMN',@level2name=N'GARMS_EXTRACT_TYPE'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Long-form description of the extract file type, optional' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_TYPE', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

INSERT INTO [permit].[ORBC_GARMS_EXTRACT_TYPE] ([GARMS_EXTRACT_TYPE], [DESCRIPTION])
VALUES ('CASH', 'File type for all payment methods except credit account')
GO
INSERT INTO [permit].[ORBC_GARMS_EXTRACT_TYPE] ([GARMS_EXTRACT_TYPE], [DESCRIPTION])
VALUES ('CREDIT', 'File type for credit account payment method')
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [permit].[ORBC_GARMS_EXTRACT_FILE](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[GARMS_EXTRACT_TYPE] [nvarchar](10) NOT NULL,
	[SUBMIT_TIMESTAMP] [datetime2](7) NULL,
	[TRANSACTION_DATE_FROM] [datetime2](7) NULL,
	[TRANSACTION_DATE_TO] [datetime2](7) NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USERID] [nvarchar](30) NULL,
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USERID] [nvarchar](30) NULL,
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE] ADD  DEFAULT (getutcdate()) FOR [APP_CREATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE] ADD  DEFAULT (user_name()) FOR [APP_CREATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE] ADD  DEFAULT (getutcdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE] ADD  DEFAULT (user_name()) FOR [APP_LAST_UPDATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE] ADD  CONSTRAINT [ORBC_GARMS_EXTRACT_FILE_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE] ADD  CONSTRAINT [ORBC_GARMS_EXTRACT_FILE_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE] ADD  CONSTRAINT [ORBC_GARMS_EXTRACT_FILE_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE] ADD  CONSTRAINT [ORBC_GARMS_EXTRACT_FILE_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_GARMS_EXTRACT_FILE_ORBC_GARMS_EXTRACT_TYPE] FOREIGN KEY([GARMS_EXTRACT_TYPE])
REFERENCES [permit].[ORBC_GARMS_EXTRACT_TYPE] ([GARMS_EXTRACT_TYPE])
GO

ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE] CHECK CONSTRAINT [FK_ORBC_GARMS_EXTRACT_FILE_ORBC_GARMS_EXTRACT_TYPE]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique primary key' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_FILE', @level2type=N'COLUMN',@level2name=N'ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Type of the GARMS extract file, foreign key to the ORBC_GARMS_EXTRACT_TYPE table' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_FILE', @level2type=N'COLUMN',@level2name=N'GARMS_EXTRACT_TYPE'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Timestamp when the file was confirmed submitted to GARMS, null if file has not been submitted or if submission fails' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_FILE', @level2type=N'COLUMN',@level2name=N'SUBMIT_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Opening datetime range of the transactions in this file (earliest possible transaction timestamp)' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_FILE', @level2type=N'COLUMN',@level2name=N'TRANSACTION_DATE_FROM'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Closing datetime range of the transactions in this file (latest possible transaction timestamp)' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_FILE', @level2type=N'COLUMN',@level2name=N'TRANSACTION_DATE_TO'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_FILE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_FILE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_FILE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_FILE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_EXTRACT_FILE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE SEQUENCE [permit].[ORBC_GARMS_EXTRACT_FILE_H_ID_SEQ] AS [bigint] START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 50;
GO

CREATE TABLE [permit].[ORBC_GARMS_EXTRACT_FILE_HIST](
  _GARMS_EXTRACT_FILE_HIST_ID [bigint] DEFAULT (NEXT VALUE FOR [permit].[ORBC_GARMS_EXTRACT_FILE_H_ID_SEQ]) NOT NULL
  ,EFFECTIVE_DATE_HIST [datetime] NOT NULL default getutcdate()
  ,END_DATE_HIST [datetime]
  , [ID] bigint NOT NULL, [GARMS_EXTRACT_TYPE] nvarchar(10) NOT NULL, [SUBMIT_TIMESTAMP] datetime2 NULL, [TRANSACTION_DATE_FROM] datetime2 NULL, [TRANSACTION_DATE_TO] datetime2 NULL, [APP_CREATE_TIMESTAMP] datetime2 NULL, [APP_CREATE_USERID] nvarchar(30) NULL, [APP_CREATE_USER_GUID] char(32) NULL, [APP_CREATE_USER_DIRECTORY] nvarchar(30) NULL, [APP_LAST_UPDATE_TIMESTAMP] datetime2 NULL, [APP_LAST_UPDATE_USERID] nvarchar(30) NULL, [APP_LAST_UPDATE_USER_GUID] char(32) NULL, [APP_LAST_UPDATE_USER_DIRECTORY] nvarchar(30) NULL, [CONCURRENCY_CONTROL_NUMBER] int NULL, [DB_CREATE_USERID] varchar(63) NULL, [DB_CREATE_TIMESTAMP] datetime2 NULL, [DB_LAST_UPDATE_USERID] varchar(63) NULL, [DB_LAST_UPDATE_TIMESTAMP] datetime2 NULL
  )
ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE_HIST] ADD CONSTRAINT ORBC_19_H_PK PRIMARY KEY CLUSTERED (_GARMS_EXTRACT_FILE_HIST_ID);  
ALTER TABLE [permit].[ORBC_GARMS_EXTRACT_FILE_HIST] ADD CONSTRAINT ORBC_19_H_UK UNIQUE (_GARMS_EXTRACT_FILE_HIST_ID,END_DATE_HIST)
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[GARMS_EXTRACT_FILE_ID] [bigint] NOT NULL,
	[TRANSACTION_ID] [bigint] NOT NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_CREATE_USERID] [nvarchar](30) NULL,
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL,
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
	[APP_LAST_UPDATE_USERID] [nvarchar](30) NULL,
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [PK_ORBC_GARMS_FILE_TRANSACTION] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION] ADD  DEFAULT (getutcdate()) FOR [APP_CREATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION] ADD  DEFAULT (user_name()) FOR [APP_CREATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION] ADD  DEFAULT (getutcdate()) FOR [APP_LAST_UPDATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION] ADD  DEFAULT (user_name()) FOR [APP_LAST_UPDATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION] ADD  CONSTRAINT [ORBC_GARMS_FILE_TRANSACTION_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION] ADD  CONSTRAINT [ORBC_GARMS_FILE_TRANSACTION_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION] ADD  CONSTRAINT [ORBC_GARMS_FILE_TRANSACTION_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION] ADD  CONSTRAINT [ORBC_GARMS_FILE_TRANSACTION_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_GARMS_FILE_TRANSACTION_ORBC_GARMS_EXTRACT_FILE] FOREIGN KEY([GARMS_EXTRACT_FILE_ID])
REFERENCES [permit].[ORBC_GARMS_EXTRACT_FILE] ([ID])
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION] CHECK CONSTRAINT [FK_ORBC_GARMS_FILE_TRANSACTION_ORBC_GARMS_EXTRACT_FILE]
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_GARMS_FILE_TRANSACTION_ORBC_TRANSACTION] FOREIGN KEY([TRANSACTION_ID])
REFERENCES [permit].[ORBC_TRANSACTION] ([TRANSACTION_ID])
GO

ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION] CHECK CONSTRAINT [FK_ORBC_GARMS_FILE_TRANSACTION_ORBC_TRANSACTION]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique primary key' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_FILE_TRANSACTION', @level2type=N'COLUMN',@level2name=N'ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the file used to send the transaction to GARMS' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_FILE_TRANSACTION', @level2type=N'COLUMN',@level2name=N'GARMS_EXTRACT_FILE_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID of the transaction sent to GARMS' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_FILE_TRANSACTION', @level2type=N'COLUMN',@level2name=N'TRANSACTION_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_FILE_TRANSACTION', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_FILE_TRANSACTION', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_FILE_TRANSACTION', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_FILE_TRANSACTION', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_GARMS_FILE_TRANSACTION', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE SEQUENCE [permit].[ORBC_GARMS_FILE_TRANSACTION_H_ID_SEQ] AS [bigint] START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 50;
GO

CREATE TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION_HIST](
  _GARMS_FILE_TRANSACTION_HIST_ID [bigint] DEFAULT (NEXT VALUE FOR [permit].[ORBC_GARMS_FILE_TRANSACTION_H_ID_SEQ]) NOT NULL
  ,EFFECTIVE_DATE_HIST [datetime] NOT NULL default getutcdate()
  ,END_DATE_HIST [datetime]
  , [ID] bigint NOT NULL, [GARMS_EXTRACT_FILE_ID] bigint NOT NULL, [TRANSACTION_ID] bigint NOT NULL, [APP_CREATE_TIMESTAMP] datetime2 NULL, [APP_CREATE_USERID] nvarchar(30) NULL, [APP_CREATE_USER_GUID] char(32) NULL, [APP_CREATE_USER_DIRECTORY] nvarchar(30) NULL, [APP_LAST_UPDATE_TIMESTAMP] datetime2 NULL, [APP_LAST_UPDATE_USERID] nvarchar(30) NULL, [APP_LAST_UPDATE_USER_GUID] char(32) NULL, [APP_LAST_UPDATE_USER_DIRECTORY] nvarchar(30) NULL, [CONCURRENCY_CONTROL_NUMBER] int NULL, [DB_CREATE_USERID] varchar(63) NULL, [DB_CREATE_TIMESTAMP] datetime2 NULL, [DB_LAST_UPDATE_USERID] varchar(63) NULL, [DB_LAST_UPDATE_TIMESTAMP] datetime2 NULL
  )
ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION_HIST] ADD CONSTRAINT ORBC_20_H_PK PRIMARY KEY CLUSTERED (_GARMS_FILE_TRANSACTION_HIST_ID);  
ALTER TABLE [permit].[ORBC_GARMS_FILE_TRANSACTION_HIST] ADD CONSTRAINT ORBC_20_H_UK UNIQUE (_GARMS_FILE_TRANSACTION_HIST_ID,END_DATE_HIST)
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TRIGGER ORBC_GRM_EXT_FL_A_S_IUD_TR ON [permit].[ORBC_GARMS_EXTRACT_FILE] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
BEGIN TRY
DECLARE @curr_date datetime;
SET @curr_date = getutcdate();
  IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted) 
    RETURN;

  -- historical
  IF EXISTS(SELECT * FROM deleted)
    update [permit].[ORBC_GARMS_EXTRACT_FILE_HIST] set END_DATE_HIST = @curr_date where ID in (select ID from deleted) and END_DATE_HIST is null;
  
  IF EXISTS(SELECT * FROM inserted)
    insert into [permit].[ORBC_GARMS_EXTRACT_FILE_HIST] ([ID], [GARMS_EXTRACT_TYPE], [SUBMIT_TIMESTAMP], [TRANSACTION_DATE_FROM], [TRANSACTION_DATE_TO], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], _GARMS_EXTRACT_FILE_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
      select [ID], [GARMS_EXTRACT_TYPE], [SUBMIT_TIMESTAMP], [TRANSACTION_DATE_FROM], [TRANSACTION_DATE_TO], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], (next value for [permit].[ORBC_GARMS_EXTRACT_FILE_H_ID_SEQ]) as [_GARMS_EXTRACT_FILE_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
go
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TRIGGER ORBC_GRM_FL_TRANS_A_S_IUD_TR ON [permit].[ORBC_GARMS_FILE_TRANSACTION] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
BEGIN TRY
DECLARE @curr_date datetime;
SET @curr_date = getutcdate();
  IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted) 
    RETURN;

  -- historical
  IF EXISTS(SELECT * FROM deleted)
    update [permit].[ORBC_GARMS_FILE_TRANSACTION_HIST] set END_DATE_HIST = @curr_date where ID in (select ID from deleted) and END_DATE_HIST is null;
  
  IF EXISTS(SELECT * FROM inserted)
    insert into [permit].[ORBC_GARMS_FILE_TRANSACTION_HIST] ([ID], [GARMS_EXTRACT_FILE_ID], [TRANSACTION_ID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], _GARMS_FILE_TRANSACTION_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
      select [ID], [GARMS_EXTRACT_FILE_ID], [TRANSACTION_ID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], (next value for [permit].[ORBC_GARMS_FILE_TRANSACTION_H_ID_SEQ]) as [_GARMS_FILE_TRANSACTION_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
go
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Support for new GARMS file upload and processing'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (65, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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
