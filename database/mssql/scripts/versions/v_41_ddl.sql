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

IF @@ERROR <> 0
   SET NOEXEC ON
GO
    DROP TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS]
    DROP TABLE [permit].[ORBC_LOA_VEHICLES]
    DROP TABLE [permit].[ORBC_LOA_DETAILS]
    DROP SEQUENCE [permit].[ORBC_LOA_NUMBER_SEQ]
    
    CREATE SEQUENCE permit.ORBC_LOA_NUMBER_SEQ
    START WITH 100000
    INCREMENT BY 1 ;

CREATE TABLE [permit].[ORBC_LOA_DETAILS] (
   [LOA_ID] [int] IDENTITY(1,1) NOT NULL,
   [LOA_NUMBER] [int] NOT NULL  DEFAULT (NEXT VALUE FOR permit.ORBC_LOA_NUMBER_SEQ),
   [COMPANY_ID] [int] NOT NULL,
   [REVISION] [tinyint] NULL,
   [PREVIOUS_LOA_ID] [tinyint] NULL,
   [ORIGINAL_LOA_ID] [tinyint] NOT NULL,
   [START_DATE] [varchar](10) NOT NULL,
   [EXPIRY_DATE] [varchar](10),
   [DOCUMENT_ID] [bigint],
   [COMMENT] [nvarchar](4000),
   [IS_ACTIVE]  [char](1) NOT NULL DEFAULT('Y'),
   [APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT(getutcdate()),
   [APP_CREATE_USERID] [nvarchar](30) DEFAULT(user_name()),
   [APP_CREATE_USER_GUID] [char](32) NULL,
   [APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT(user_name()),
   [APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT(getutcdate()),
   [APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT(user_name()),
   [APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT(user_name()),
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [DB_CREATE_USERID] [varchar](63) NOT NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
   CONSTRAINT [PK_ORBC_LOA_DETAILS] PRIMARY KEY CLUSTERED ([LOA_ID] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY];

CREATE TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] (
   [LOA_PERMIT_TYPE_ID] [int] IDENTITY(1,1) NOT NULL,
   [LOA_ID] [int] NOT NULL,
   [PERMIT_TYPE_ID] [varchar](10) NOT NULL,
   [APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT(getutcdate()),
   [APP_CREATE_USERID] [nvarchar](30) DEFAULT(user_name()),
   [APP_CREATE_USER_GUID] [char](32) NULL,
   [APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT(user_name()),
   [APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT(getutcdate()),
   [APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT(user_name()),
   [APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT(user_name()),
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [DB_CREATE_USERID] [varchar](63) NOT NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
   CONSTRAINT [PK_ORBC_LOA_PERMIT_TYPE_DETAILS] PRIMARY KEY CLUSTERED ([LOA_PERMIT_TYPE_ID] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY];

CREATE TABLE [permit].[ORBC_LOA_VEHICLES] (
   [LOA_VEHICLE_ID] [int] IDENTITY(1,1) NOT NULL,
   [LOA_ID] [int] NOT NULL,
   [POWER_UNIT_ID] [bigint],
   [TRAILER_ID] [bigint],
   [APP_CREATE_TIMESTAMP] [datetime2](7) DEFAULT(getutcdate()),
   [APP_CREATE_USERID] [nvarchar](30) DEFAULT(user_name()),
   [APP_CREATE_USER_GUID] [char](32) NULL,
   [APP_CREATE_USER_DIRECTORY] [nvarchar](30) DEFAULT(user_name()),
   [APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) DEFAULT(getutcdate()),
   [APP_LAST_UPDATE_USERID] [nvarchar](30) DEFAULT(user_name()),
   [APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) DEFAULT(user_name()),
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [DB_CREATE_USERID] [varchar](63) NOT NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
   CONSTRAINT [PK_ORBC_LOA_VEHICLES] PRIMARY KEY CLUSTERED ([LOA_VEHICLE_ID] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY];

ALTER TABLE [permit].[ORBC_LOA_DETAILS] ADD CONSTRAINT [DF_ORBC_LOA_DETAILS_DB_CREATE_USERID] DEFAULT(user_name())
FOR [DB_CREATE_USERID]

ALTER TABLE [permit].[ORBC_LOA_DETAILS] ADD CONSTRAINT [DF_ORBC_LOA_DETAILS_DB_CREATE_TIMESTAMP] DEFAULT(getutcdate())
FOR [DB_CREATE_TIMESTAMP]

ALTER TABLE [permit].[ORBC_LOA_DETAILS] ADD CONSTRAINT [DF_ORBC_LOA_DETAILS_DB_LAST_UPDATE_USERID] DEFAULT(user_name())
FOR [DB_LAST_UPDATE_USERID]

ALTER TABLE [permit].[ORBC_LOA_DETAILS] ADD CONSTRAINT [DF_ORBC_LOA_DETAILS_DB_LAST_UPDATE_TIMESTAMP] DEFAULT(getutcdate())
FOR [DB_LAST_UPDATE_TIMESTAMP]

-- Check Contraints
ALTER TABLE [permit].[ORBC_LOA_DETAILS] WITH CHECK ADD  CONSTRAINT DK_ORBC_LOA_DETAILS_IS_ACTIVE_VAL CHECK ([IS_ACTIVE] IN ('Y','N'));
GO

ALTER TABLE [permit].[ORBC_LOA_DETAILS] ADD  CONSTRAINT [DF_ORBC_LOA_DETAILS_REVISION]  DEFAULT ((0)) FOR [REVISION]
ALTER TABLE [permit].[ORBC_LOA_DETAILS] ADD  CONSTRAINT [DF_ORBC_LOA_DETAILS_PREVIOUS_REVISION]  DEFAULT ((0)) FOR [PREVIOUS_LOA_ID]
ALTER TABLE [permit].[ORBC_LOA_DETAILS] ADD  CONSTRAINT [DF_ORBC_LOA_DETAILS_ORIGINAL_ID]  DEFAULT ((0)) FOR [ORIGINAL_LOA_ID]

ALTER TABLE [permit].[ORBC_LOA_DETAILS]  WITH CHECK ADD  CONSTRAINT [FK_ORBC_LOA_DETAILS_COMPANY] FOREIGN KEY([COMPANY_ID])
REFERENCES [dbo].[ORBC_COMPANY] ([COMPANY_ID])
ALTER TABLE [permit].[ORBC_LOA_DETAILS] CHECK CONSTRAINT [FK_ORBC_LOA_DETAILS_COMPANY]

ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] ADD CONSTRAINT [DF_ORBC_LOA_PERMIT_TYPE_DETAILS_DB_CREATE_USERID] DEFAULT(user_name())
FOR [DB_CREATE_USERID]

ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] ADD CONSTRAINT [DF_ORBC_LOA_PERMIT_TYPE_DETAILS_DB_CREATE_TIMESTAMP] DEFAULT(getutcdate())
FOR [DB_CREATE_TIMESTAMP]

ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] ADD CONSTRAINT [DF_ORBC_LOA_PERMIT_TYPE_DETAILS_DB_LAST_UPDATE_USERID] DEFAULT(user_name())
FOR [DB_LAST_UPDATE_USERID]

ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS] ADD CONSTRAINT [DF_ORBC_LOA_PERMIT_TYPE_DETAILS_DB_LAST_UPDATE_TIMESTAMP] DEFAULT(getutcdate())
FOR [DB_LAST_UPDATE_TIMESTAMP]

ALTER TABLE [permit].[ORBC_LOA_VEHICLES] ADD CONSTRAINT [DF_ORBC_LOA_VEHICLES_DB_CREATE_USERID] DEFAULT(user_name())
FOR [DB_CREATE_USERID]

ALTER TABLE [permit].[ORBC_LOA_VEHICLES] ADD CONSTRAINT [DF_ORBC_LOA_VEHICLES_DB_CREATE_TIMESTAMP] DEFAULT(getutcdate())
FOR [DB_CREATE_TIMESTAMP]

ALTER TABLE [permit].[ORBC_LOA_VEHICLES] ADD CONSTRAINT [DF_ORBC_LOA_VEHICLES_DB_LAST_UPDATE_USERID] DEFAULT(user_name())
FOR [DB_LAST_UPDATE_USERID]

ALTER TABLE [permit].[ORBC_LOA_VEHICLES] ADD CONSTRAINT [DF_ORBC_LOA_VEHICLES_DB_LAST_UPDATE_TIMESTAMP] DEFAULT(getutcdate())
FOR [DB_LAST_UPDATE_TIMESTAMP]

ALTER TABLE [permit].[ORBC_LOA_VEHICLES]
   WITH CHECK ADD CONSTRAINT [ORBC_LOA_VEHICLES_LOA_ID_FK] FOREIGN KEY ([LOA_ID]) REFERENCES [permit].[ORBC_LOA_DETAILS]([LOA_ID])  ON DELETE CASCADE

ALTER TABLE [permit].[ORBC_LOA_VEHICLES]
   WITH CHECK ADD CONSTRAINT [ORBC_LOA_VEHICLES_POWER_UNIT_ID_FK] FOREIGN KEY ([POWER_UNIT_ID]) REFERENCES [dbo].[ORBC_POWER_UNIT]([POWER_UNIT_ID])

ALTER TABLE [permit].[ORBC_LOA_VEHICLES]
   WITH CHECK ADD CONSTRAINT [ORBC_LOA_VEHICLES_TRAILER_ID_FK] FOREIGN KEY ([TRAILER_ID]) REFERENCES [dbo].[ORBC_TRAILER]([TRAILER_ID])

ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS]
   WITH CHECK ADD CONSTRAINT [ORBC_LOA_PERMIT_TYPES_PERMIT_TYPE_ID_FK] FOREIGN KEY ([PERMIT_TYPE_ID]) REFERENCES [permit].[ORBC_PERMIT_TYPE]([PERMIT_TYPE])

ALTER TABLE [permit].[ORBC_LOA_PERMIT_TYPE_DETAILS]
   WITH CHECK ADD CONSTRAINT [ORBC_LOA_PERMIT_TYPE_LOA_ID_FK] FOREIGN KEY ([LOA_ID]) REFERENCES [permit].[ORBC_LOA_DETAILS]([LOA_ID])  ON DELETE CASCADE

ALTER TABLE [permit].[ORBC_LOA_DETAILS]
   WITH CHECK ADD CONSTRAINT [ORBC_LOA_DETAILS_DOCUMENT_ID_FK] FOREIGN KEY ([DOCUMENT_ID]) REFERENCES [dops].[ORBC_DOCUMENT]([ID])

IF @@ERROR <> 0
   SET NOEXEC ON
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the LoA table' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'LOA_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Unique LoA Number' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'LOA_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the orbc_company table, identifying which company does this LoA belong to' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'COMPANY_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Start date of an LoA, cannot be null' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'START_DATE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'End date of an LoA, null value indicates LoA never expires' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'EXPIRY_DATE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to the orbc_document table,identifying the document/PDF that references the Document Management System (DMS)' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'DOCUMENT_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Additional notes or comment for LoA' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'COMMENT'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Deletion status of LOA' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'IS_ACTIVE'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'LoA revision' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'REVISION'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'previous LoA id' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'PREVIOUS_LOA_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Original LoA id' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_DETAILS', @level2type=N'COLUMN',@level2name=N'ORIGINAL_LOA_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the LoA Permit Type table' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_PERMIT_TYPE_DETAILS', @level2type=N'COLUMN',@level2name=N'LOA_PERMIT_TYPE_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to LoA details table' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_PERMIT_TYPE_DETAILS', @level2type=N'COLUMN',@level2name=N'LOA_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to permit type table, identifying the types of permit an LoA is applicable for' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_PERMIT_TYPE_DETAILS', @level2type=N'COLUMN',@level2name=N'PERMIT_TYPE_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Surrogate primary key for the LoA Vehicle table' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_VEHICLES', @level2type=N'COLUMN',@level2name=N'LOA_VEHICLE_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to LoA details table' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_VEHICLES', @level2type=N'COLUMN',@level2name=N'LOA_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to power unit table, identifying the power units allowed in an LoA' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_VEHICLES', @level2type=N'COLUMN',@level2name=N'POWER_UNIT_ID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Foreign key to trailer table, identifying the trailers allowed in an LoA' , @level0type=N'SCHEMA',@level0name=N'permit', @level1type=N'TABLE',@level1name=N'ORBC_LOA_VEHICLES', @level2type=N'COLUMN',@level2name=N'TRAILER_ID'

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = '-- Add LOA related tables to database'

INSERT [dbo].[ORBC_SYS_VERSION] (
   [VERSION_ID],
   [DESCRIPTION],
   [UPDATE_SCRIPT],
   [REVERT_SCRIPT],
   [RELEASE_DATE]
   )
VALUES (
   34,
   @VersionDescription,
   '$(UPDATE_SCRIPT)',
   '$(REVERT_SCRIPT)',
   getutcdate()
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