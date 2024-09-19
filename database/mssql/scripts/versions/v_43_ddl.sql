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

CREATE TABLE [permit].[ORBC_PERMIT_LOA] (
  [PERMIT_LOA_ID] [int] IDENTITY(1,1) NOT NULL,
  [PERMIT_ID] [bigint] NOT NULL,
  [LOA_ID] [int] NOT NULL,
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
    CONSTRAINT [PK_ORBC_PERMIT_LOA] PRIMARY KEY CLUSTERED (
        [PERMIT_ID] ASC,
        [LOA_ID] ASC
    ) WITH (
        PAD_INDEX = OFF,
        STATISTICS_NORECOMPUTE = OFF,
        IGNORE_DUP_KEY = OFF,
        ALLOW_ROW_LOCKS = ON,
        ALLOW_PAGE_LOCKS = ON
    ) ON [PRIMARY],
) ON [PRIMARY];
GO

-- Descriptions for all ORBC_PERMIT_LOA columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Permit Id.' , 
   @level0type=N'SCHEMA',
   @level0name=N'permit', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_PERMIT_LOA', 
   @level2type=N'COLUMN',
   @level2name=N'PERMIT_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'LoA Id.' , 
   @level0type=N'SCHEMA',
   @level0name=N'permit', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_PERMIT_LOA', 
   @level2type=N'COLUMN',
   @level2name=N'LOA_ID'
-- Audit column descriptions (boilerplate)

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created by the application.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'APP_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The userid of the application user that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The guid of the application user that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_GUID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory of the application user that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'APP_CREATE_USER_DIRECTORY'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was last updated by the application.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The userid of the application user that last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The guid of the application user that last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_GUID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The directory of the application user that last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'APP_LAST_UPDATE_USER_DIRECTORY'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1Name=N'ORBC_PERMIT_LOA', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'

-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_PERMIT_LOA] ADD  CONSTRAINT [DF_ORBC_PERMIT_LOA_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_PERMIT_LOA]  ADD  CONSTRAINT [DF_ORBC_PERMIT_LOA_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_PERMIT_LOA]  ADD  CONSTRAINT [DF_ORBC_PERMIT_LOA_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_PERMIT_LOA]  ADD  CONSTRAINT [DF_ORBC_PERMIT_LOA_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [permit].[ORBC_PERMIT_LOA] WITH CHECK ADD CONSTRAINT [FK_ORBC_PERMIT_LOA_LOA_ID] FOREIGN KEY ([LOA_ID]) REFERENCES [permit].[ORBC_LOA_DETAILS]([LOA_ID]) 
ALTER TABLE [permit].[ORBC_PERMIT_LOA] CHECK CONSTRAINT [FK_ORBC_PERMIT_LOA_LOA_ID]
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [permit].[ORBC_PERMIT_LOA] WITH CHECK ADD CONSTRAINT [FK_ORBC_PERMIT_LOA_PERMIT_ID] FOREIGN KEY ([PERMIT_ID]) REFERENCES [permit].[ORBC_PERMIT] ([ID])
ALTER TABLE [permit].[ORBC_PERMIT_LOA] CHECK CONSTRAINT [FK_ORBC_PERMIT_LOA_PERMIT_ID]
IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE SEQUENCE [permit].[ORBC_PERMIT_LOA_H_ID_SEQ] AS [bigint] START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 50;

CREATE TABLE [permit].[ORBC_PERMIT_LOA_HIST](
  _PERMIT_LOA_HIST_ID [bigint] DEFAULT (NEXT VALUE FOR [permit].[ORBC_PERMIT_LOA_H_ID_SEQ]) NOT NULL
  ,EFFECTIVE_DATE_HIST [datetime] NOT NULL default getutcdate()
  ,END_DATE_HIST [datetime]
  , [PERMIT_LOA_ID] int NOT NULL, [PERMIT_ID] bigint NOT NULL, [LOA_ID] int NOT NULL, [APP_CREATE_TIMESTAMP] datetime2 NULL, [APP_CREATE_USERID] nvarchar(30) NULL, [APP_CREATE_USER_GUID] char(32) NULL, [APP_CREATE_USER_DIRECTORY] nvarchar(30) NULL, [APP_LAST_UPDATE_TIMESTAMP] datetime2 NULL, [APP_LAST_UPDATE_USERID] nvarchar(30) NULL, [APP_LAST_UPDATE_USER_GUID] char(32) NULL, [APP_LAST_UPDATE_USER_DIRECTORY] nvarchar(30) NULL, [CONCURRENCY_CONTROL_NUMBER] int NULL, [DB_CREATE_USERID] varchar(63) NULL, [DB_CREATE_TIMESTAMP] datetime2 NULL, [DB_LAST_UPDATE_USERID] varchar(63) NULL, [DB_LAST_UPDATE_TIMESTAMP] datetime2 NULL
  )
ALTER TABLE [permit].[ORBC_PERMIT_LOA_HIST] ADD CONSTRAINT ORBC_PERMIT_LOA_HIST_PK PRIMARY KEY CLUSTERED (_PERMIT_LOA_HIST_ID);  
ALTER TABLE [permit].[ORBC_PERMIT_LOA_HIST] ADD CONSTRAINT ORBC_PERMIT_LOA_HIST_UK UNIQUE (_PERMIT_LOA_HIST_ID,END_DATE_HIST)
GO
CREATE TRIGGER ORBC_PERMIT_LOA_A_S_IUD_TR ON [permit].[ORBC_PERMIT_LOA] FOR INSERT, UPDATE, DELETE AS
SET NOCOUNT ON
BEGIN TRY
DECLARE @curr_date datetime;
SET @curr_date = getutcdate();
  IF NOT EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted) 
    RETURN;

  -- historical
  IF EXISTS(SELECT * FROM deleted)
    update [permit].[ORBC_PERMIT_LOA_HIST] set END_DATE_HIST = @curr_date where LOA_ID in (select LOA_ID from deleted) and END_DATE_HIST is null;
  
  IF EXISTS(SELECT * FROM inserted)
    insert into [permit].[ORBC_PERMIT_LOA_HIST] ([PERMIT_LOA_ID], [PERMIT_ID], [LOA_ID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], _PERMIT_LOA_HIST_ID, END_DATE_HIST, EFFECTIVE_DATE_HIST)
      select [PERMIT_LOA_ID], [PERMIT_ID], [LOA_ID], [APP_CREATE_TIMESTAMP], [APP_CREATE_USERID], [APP_CREATE_USER_GUID], [APP_CREATE_USER_DIRECTORY], [APP_LAST_UPDATE_TIMESTAMP], [APP_LAST_UPDATE_USERID], [APP_LAST_UPDATE_USER_GUID], [APP_LAST_UPDATE_USER_DIRECTORY], [CONCURRENCY_CONTROL_NUMBER], [DB_CREATE_USERID], [DB_CREATE_TIMESTAMP], [DB_LAST_UPDATE_USERID], [DB_LAST_UPDATE_TIMESTAMP], (next value for [permit].[ORBC_PERMIT_LOA_H_ID_SEQ]) as [_PERMIT_LOA_HIST_ID], null as [END_DATE_HIST], @curr_date as [EFFECTIVE_DATE_HIST] from inserted;

END TRY
BEGIN CATCH
   IF @@trancount > 0 ROLLBACK TRANSACTION
   EXEC orbc_error_handling
END CATCH;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Assign LoA to permit related Db objects.'
INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (43, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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

