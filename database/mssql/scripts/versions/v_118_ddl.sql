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


IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [dops].[ORBC_DOCUMENT_STORAGE_TYPE](
	[STORAGE_TYPE] [varchar](20) NOT NULL,
	[DESCRIPTION] [nvarchar](500) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_DOCUMENT_STORAGE_TYPE] PRIMARY KEY CLUSTERED 
(
	[STORAGE_TYPE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO


ALTER TABLE [dops].[ORBC_DOCUMENT_STORAGE_TYPE] ADD  CONSTRAINT [DF_ORBC_DOCUMENT_STORAGE_TYPE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [dops].[ORBC_DOCUMENT_STORAGE_TYPE] ADD  CONSTRAINT [DF_ORBC_DOCUMENT_STORAGE_TYPE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [dops].[ORBC_DOCUMENT_STORAGE_TYPE] ADD  CONSTRAINT [DF_ORBC_DOCUMENT_STORAGE_TYPE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [dops].[ORBC_DOCUMENT_STORAGE_TYPE] ADD  CONSTRAINT [DF_ORBC_DOCUMENT_STORAGE_TYPE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO


EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table enumerating all possible document storage types' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT_STORAGE_TYPE'

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique ID of the document storage type' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT_STORAGE_TYPE', @level2type=N'COLUMN',@level2name=N'STORAGE_TYPE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Description of the document storage type' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT_STORAGE_TYPE', @level2type=N'COLUMN',@level2name=N'DESCRIPTION'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT_STORAGE_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT_STORAGE_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT_STORAGE_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT_STORAGE_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_DOCUMENT_STORAGE_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'


IF @@ERROR <> 0 SET NOEXEC ON
GO


INSERT [dops].[ORBC_DOCUMENT_STORAGE_TYPE] ([STORAGE_TYPE], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'EXTERNAL_URL', N'External URL', NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())

INSERT [dops].[ORBC_DOCUMENT_STORAGE_TYPE] ([STORAGE_TYPE], [DESCRIPTION], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP]) VALUES (N'INTERNAL_S3', N'Internal S3', NULL, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())


IF @@ERROR <> 0 SET NOEXEC ON
GO


CREATE TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_CONDITION] [varchar](50) NOT NULL,
	[STORAGE_TYPE] [varchar](20) NOT NULL,	
	[EXTERNAL_DOCUMENT_ID] [bigint] NULL,
	[S3_DOCUMENT_ID] [bigint] NULL,
	[APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_CREATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_CREATE_USER_GUID] [char](32) NULL,
	[APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT (getutcdate()),
	[APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT (user_name()),
	[APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
	[APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT (user_name()),
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_PERMIT_CONDITION_DOCUMENT] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT]  WITH CHECK ADD  CONSTRAINT [ORBC_PERMIT_CONDITION_DOCUMENT_STORAGE_TYPE_FK] FOREIGN KEY([STORAGE_TYPE])
REFERENCES [dops].[ORBC_DOCUMENT_STORAGE_TYPE] ([STORAGE_TYPE])

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT]  WITH CHECK ADD  CONSTRAINT [ORBC_PERMIT_CONDITION_DOCUMENT_EXTERNAL_DOCUMENT_ID_FK] FOREIGN KEY([EXTERNAL_DOCUMENT_ID])
REFERENCES [dops].[ORBC_EXTERNAL_DOCUMENT] ([ID])


IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT]  WITH CHECK ADD  CONSTRAINT [ORBC_PERMIT_CONDITION_DOCUMENT_S3_DOCUMENT_ID_FK] FOREIGN KEY([S3_DOCUMENT_ID])
REFERENCES [dops].[ORBC_DOCUMENT] ([ID])

ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT]
ADD CONSTRAINT [ORBC_PERMIT_CONDITION_DOCUMENT_UK] UNIQUE (PERMIT_CONDITION);

IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT]
ADD CONSTRAINT [ORBC_PERMIT_CONDITION_DOCUMENT_DOCUMENT_ID_CK]
CHECK (
    [EXTERNAL_DOCUMENT_ID] IS NOT NULL
    OR [S3_DOCUMENT_ID] IS NOT NULL
);
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT] ADD  CONSTRAINT [ORBC_PERMIT_CONDITION_DOCUMENT_DB_CREATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT] ADD  CONSTRAINT [ORBC_PERMIT_CONDITION_DOCUMENT_DB_CREATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT] ADD  CONSTRAINT [ORBC_PERMIT_CONDITION_DOCUMENT_DB_LAST_UPDATE_USERID_DEF]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT] ADD  CONSTRAINT [ORBC_PERMIT_CONDITION_DOCUMENT_DB_LAST_UPDATE_TIMESTAMP_DEF]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the document metadata record' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_CONDITION_DOCUMENT', @level2type=N'COLUMN',@level2name=N'ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The permit condition name' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_CONDITION_DOCUMENT', @level2type=N'COLUMN',@level2name=N'PERMIT_CONDITION'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The type of document storage' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_CONDITION_DOCUMENT', @level2type=N'COLUMN',@level2name=N'STORAGE_TYPE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The document Id in ORBC_EXTERNAL_DOCUMENT' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_CONDITION_DOCUMENT', @level2type=N'COLUMN',@level2name=N'EXTERNAL_DOCUMENT_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The document Id in ORBC_DOCUMENT' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_CONDITION_DOCUMENT', @level2type=N'COLUMN',@level2name=N'S3_DOCUMENT_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_CONDITION_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_CONDITION_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_CONDITION_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_CONDITION_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Table recording metadata of documents external to ORBC' , @level0type=N'SCHEMA',@level0name=N'dops', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_CONDITION_DOCUMENT'



CREATE SEQUENCE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT_H_ID_SEQ] AS [bigint] START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 50;

CREATE TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT_HIST](
  _PERMIT_CONDITION_DOCUMENT_HIST_ID [bigint] DEFAULT (NEXT VALUE FOR [dops].[ORBC_PERMIT_CONDITION_DOCUMENT_H_ID_SEQ]) NOT NULL
  ,EFFECTIVE_DATE_HIST [datetime] NOT NULL default getutcdate()
  ,END_DATE_HIST [datetime]
  , [ID] bigint NOT NULL, [PERMIT_CONDITION] varchar(50) NOT NULL, [STORAGE_TYPE] varchar(20) NOT NULL, [EXTERNAL_DOCUMENT_ID] bigint NULL, [S3_DOCUMENT_ID] bigint NULL, [APP_CREATE_TIMESTAMP] datetime2 NULL, [APP_CREATE_USERID] nvarchar(30) NULL, [APP_CREATE_USER_GUID] char(32) NULL, [APP_CREATE_USER_DIRECTORY] nvarchar(30) NULL, [APP_LAST_UPDATE_TIMESTAMP] datetime2 NULL, [APP_LAST_UPDATE_USERID] nvarchar(30) NULL, [APP_LAST_UPDATE_USER_GUID] char(32) NULL, [APP_LAST_UPDATE_USER_DIRECTORY] nvarchar(30) NULL, [CONCURRENCY_CONTROL_NUMBER] int NULL, [DB_CREATE_USERID] varchar(63) NOT NULL, [DB_CREATE_TIMESTAMP] datetime2 NOT NULL, [DB_LAST_UPDATE_USERID] varchar(63) NOT NULL, [DB_LAST_UPDATE_TIMESTAMP] datetime2 NOT NULL
  )
ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT_HIST] ADD CONSTRAINT ORBC_31_H_PK PRIMARY KEY CLUSTERED (_PERMIT_CONDITION_DOCUMENT_HIST_ID);  
ALTER TABLE [dops].[ORBC_PERMIT_CONDITION_DOCUMENT_HIST] ADD CONSTRAINT ORBC_31_H_UK UNIQUE (_PERMIT_CONDITION_DOCUMENT_HIST_ID,END_DATE_HIST)
go


CREATE TRIGGER [ORBC_PMTCNDT_DOC_A_S_IUD_TR] ON [dops].[ORBC_PERMIT_CONDITION_DOCUMENT] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
BEGIN TRY
DECLARE @curr_date datetime;
SET @curr_date = getutcdate();
  IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted) 
    RETURN;

  -- historical
  IF EXISTS(SELECT * FROM deleted)
    update [dops].[ORBC_PERMIT_CONDITION_DOCUMENT_HIST] set END_DATE_HIST = @curr_date where ID in (select ID from deleted) and END_DATE_HIST is null;
  
  IF EXISTS(SELECT * FROM inserted)
    insert into [dops].[ORBC_PERMIT_CONDITION_DOCUMENT_HIST] ([ID], [PERMIT_CONDITION], [STORAGE_TYPE], [EXTERNAL_DOCUMENT_ID], [S3_DOCUMENT_ID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], _PERMIT_CONDITION_DOCUMENT_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
      select [ID], [PERMIT_CONDITION], [STORAGE_TYPE], [EXTERNAL_DOCUMENT_ID], [S3_DOCUMENT_ID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], (next value for [dops].[ORBC_PERMIT_CONDITION_DOCUMENT_H_ID_SEQ]) as [_PERMIT_CONDITION_DOCUMENT_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
go

IF @@ERROR <> 0 SET NOEXEC ON
GO
INSERT INTO [dops].[ORBC_PERMIT_CONDITION_DOCUMENT]
(
    [PERMIT_CONDITION],
    [STORAGE_TYPE],
    [EXTERNAL_DOCUMENT_ID]
)
SELECT
    ed.[DOCUMENT_NAME],
    'EXTERNAL_URL',
    ed.[ID]
FROM [dops].[ORBC_EXTERNAL_DOCUMENT] AS ed ORDER by ID;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @NewGuid UNIQUEIDENTIFIER;
SET @NewGuid = NEWID();

INSERT [dops].[ORBC_DOCUMENT] ( 
    [S3_OBJECT_ID], 
    [S3_VERSION_ID], 
    [S3_LOCATION], 
    [OBJECT_MIME_TYPE], 
    [FILE_NAME], 
    [DMS_VERSION_ID], 
    [CONCURRENCY_CONTROL_NUMBER], 
    [DB_CREATE_USERID], 
    [DB_CREATE_TIMESTAMP], 
    [DB_LAST_UPDATE_USERID], 
    [DB_LAST_UPDATE_TIMESTAMP]
)
VALUES (
    @NewGuid,
    NULL,
    N'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev@moti-int.objectstore.gov.bc.ca/' + CONVERT(NVARCHAR(36), @NewGuid),
    N'application/pdf',
    N'eptop-template-addt-condt-v1.pdf',
    1,
    1,
    N'dops',
    GETUTCDATE(),
    N'dops',
    GETUTCDATE()
)

-- Capture the identity generated by the insert above.
DECLARE @DocumentId BIGINT;
SET @DocumentId = CONVERT(BIGINT, SCOPE_IDENTITY());

INSERT INTO [dops].[ORBC_PERMIT_CONDITION_DOCUMENT]
(
    [PERMIT_CONDITION],
    [STORAGE_TYPE],
    [S3_DOCUMENT_ID]
)
VALUES(
    'EPTOP-ADDT-CONDT',
    'INTERNAL_S3',
    @DocumentId)
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Introduce a new type of document storage to support external url and internal s3'

INSERT [dbo].[ORBC_SYS_VERSION]
    ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE])
VALUES (118, @VersionDescription,
    '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', GETUTCDATE())
GO
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
