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
CREATE SEQUENCE permit.ORBC_LOA_NUMBER_SEQ
    START WITH 100000
    INCREMENT BY 1 ;
GO

CREATE TABLE [permit].[ORBC_LOA_DETAILS] (
   LOA_ID [bigint] IDENTITY(1,1) NOT NULL,
   LOA_NUMBER [bigint] NOT NULL  DEFAULT (NEXT VALUE FOR permit.ORBC_LOA_NUMBER_SEQ),
   [COMPANY_ID] [int] NULL,
   START_DATE [varchar](10) NOT NULL,
   EXPIRY_DATE [varchar](10),
   DOCUMENT_ID [bigint],
   COMMENTS [nvarchar](4000),
   [IS_ACTIVE] [bit] NOT NULL DEFAULT(1),
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
   LOA_PERMIT_TYPE_ID [bigint] IDENTITY(1,1) NOT NULL,
   LOA_ID [bigint] NOT NULL,
   PERMIT_TYPE_ID [varchar](10) NOT NULL,
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
   LOA_VEHICLE_ID [bigint] IDENTITY(1,1) NOT NULL,
   LOA_ID [bigint] NOT NULL,
   POWER_UNIT_ID [bigint],
   TRAILER_ID [bigint],
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

DECLARE @VersionDescription VARCHAR(255)

SET @VersionDescription = '-- Add  Serive Account diretory type to ORBC_DIRECTORY_TYPE'

INSERT [dbo].[ORBC_SYS_VERSION] (
   [VERSION_ID],
   [DESCRIPTION],
   [UPDATE_SCRIPT],
   [REVERT_SCRIPT],
   [RELEASE_DATE]
   )
VALUES (
   31,
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