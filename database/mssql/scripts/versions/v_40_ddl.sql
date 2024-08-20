CREATE SCHEMA [case]
GO

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

CREATE TABLE [case].[ORBC_CASE_STATUS_TYPE] (
   [CASE_STATUS_TYPE] [nvarchar](12) NOT NULL,
   [DESCRIPTION] [nvarchar](100) NULL,
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_CASE_STATUS_TYPE] PRIMARY KEY CLUSTERED ([CASE_STATUS_TYPE] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO

-- Descriptions for all ORBC_CASE_STATUS_TYPE columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The type of case status.' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_STATUS_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_STATUS_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Description of the credit account type.' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_STATUS_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'DESCRIPTION'
-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_STATUS_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_STATUS_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_STATUS_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_STATUS_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_STATUS_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'

-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_STATUS_TYPE] ADD  CONSTRAINT [DF_ORBC_CASE_STATUS_TYPE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_STATUS_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_STATUS_TYPE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_STATUS_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_STATUS_TYPE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_STATUS_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_STATUS_TYPE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]


INSERT [case].[ORBC_CASE_STATUS_TYPE] (
   [CASE_STATUS_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'OPEN',
   N'Open'
   )

INSERT [case].[ORBC_CASE_STATUS_TYPE] (
   [CASE_STATUS_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'CLOSED',
   N'Closed'
   )

INSERT [case].[ORBC_CASE_STATUS_TYPE] (
   [CASE_STATUS_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'IN_PROGRESS',
   N'In Progress'
   )     

IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [case].[ORBC_CASE_TYPE] (
   [CASE_TYPE] [nvarchar](10) NOT NULL,
 --  [CASE_STATUS_TYPE] [nvarchar](12) NOT NULL, --Maybe the linking should be in a different table?TBD in future? Would need a composite key if the mapping remains in this table
   [DESCRIPTION] [nvarchar](100) NULL,
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_CASE_TYPE] PRIMARY KEY CLUSTERED ([CASE_TYPE] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- -- FK constraints
-- ALTER TABLE [case].[ORBC_CASE_TYPE]  
--    WITH CHECK ADD  CONSTRAINT [FK_ORBC_CASE_TYPE_CASE_STATUS_TYPE] 
--    FOREIGN KEY([CASE_STATUS_TYPE])
--    REFERENCES [case].[ORBC_CASE_STATUS_TYPE] ([CASE_STATUS_TYPE])
-- GO
-- ALTER TABLE [case].[ORBC_CASE_TYPE] CHECK CONSTRAINT [FK_ORBC_CASE_TYPE_CASE_STATUS_TYPE]

GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Descriptions for all ORBC_CASE_TYPE columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The type of cases.' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Description of the credit account type.' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'DESCRIPTION'
-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'


-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_TYPE] ADD  CONSTRAINT [DF_ORBC_CASE_TYPE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_TYPE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_TYPE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_TYPE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]


INSERT [case].[ORBC_CASE_TYPE] (
   [CASE_TYPE],
 --  [CASE_STATUS_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'DEFAULT',
  -- N'OPEN',
   N'Default'
   )

-- INSERT [case].[ORBC_CASE_TYPE] (
--    [CASE_TYPE],
--    --[CASE_STATUS_TYPE],
--    [DESCRIPTION]
--    )
-- VALUES (
--    N'DEFAULT',
--    --N'CLOSED',
--    N'Default'
--    )

-- INSERT [case].[ORBC_CASE_TYPE] (
--    [CASE_TYPE],
--    --[CASE_STATUS_TYPE],
--    [DESCRIPTION]
--    )
-- VALUES (
--    N'DEFAULT',
--    --N'IN_PROGRESS',
--    N'Default'
--    )   

IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [case].[ORBC_CASE_EVENT_TYPE] (
   [CASE_EVENT_TYPE] [nvarchar](20) NOT NULL,
   [DESCRIPTION] [nvarchar](100) NULL,
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_CASE_EVENT_TYPE] PRIMARY KEY CLUSTERED ([CASE_EVENT_TYPE] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO

-- Descriptions for all ORBC_CASE_EVENT_TYPE columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The type of case events.' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_EVENT_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_EVENT_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Description of the credit account type.' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_EVENT_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'DESCRIPTION'
-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_EVENT_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_EVENT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_EVENT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_EVENT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_EVENT_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'

-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_EVENT_TYPE] ADD  CONSTRAINT [DF_ORBC_CASE_EVENT_TYPE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_EVENT_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_EVENT_TYPE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_EVENT_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_EVENT_TYPE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_EVENT_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_EVENT_TYPE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]


/*
 A record of when the case was submitted to the queue.
*/
INSERT [case].[ORBC_CASE_EVENT_TYPE] (
   [CASE_EVENT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'OPENED', 
   N'Case Opened'
   )

/*
 A record for tracking the datetime, userid whenever the case is claimed/assigned/reassigned to a user.
*/
INSERT [case].[ORBC_CASE_EVENT_TYPE] (
   [CASE_EVENT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'ASSIGNMENT',
   N'Case claimed/assigned/reassigned'
   )

/* When a case is claimed by the user the very first time. i.e When the case is first picked up from the queue
 */
INSERT [case].[ORBC_CASE_EVENT_TYPE] (
   [CASE_EVENT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'WORKFLOW_STARTED',
   N'Workflow started'
   )


/* Can query the activity table when workflow_completed to find the outcome/decision. i.e whether its approved/rejected or withdrawn.  
 */
INSERT [case].[ORBC_CASE_EVENT_TYPE] (
   [CASE_EVENT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'WORKFLOW_COMPLETED', 
   N'Workflow Completed'
   )   

/* A dummy CLOSED event is created when WORKFLOW_COMPLETED
 */
INSERT [case].[ORBC_CASE_EVENT_TYPE] (
   [CASE_EVENT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'CLOSED',
   N'Case Closed'
   )   

/* A record of when Notes are attached to the case
 */
INSERT [case].[ORBC_CASE_EVENT_TYPE] (
   [CASE_EVENT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'NOTE_CREATED',
   N'Note Created'
   )

/* A record of when documents are attached to the case
 */
INSERT [case].[ORBC_CASE_EVENT_TYPE] (
   [CASE_EVENT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'DOCUMENT_ADDED',
   N'Document Added'
   )   

/* A record of when documents are deleted wrst to a case
 */
INSERT [case].[ORBC_CASE_EVENT_TYPE] (
   [CASE_EVENT_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'DOCUMENT_DELETED',
   N'Document Deleted'
   )

IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [case].[ORBC_CASE_ACTIVITY_TYPE] (
   [CASE_ACTIVITY_TYPE] [nvarchar](10) NOT NULL,
   [DESCRIPTION] [nvarchar](100) NULL,
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_CASE_ACTIVITY_TYPE] PRIMARY KEY CLUSTERED ([CASE_ACTIVITY_TYPE] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO

-- Descriptions for all ORBC_CASE_ACTIVITY_TYPE columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The type of case events.' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_ACTIVITY_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_ACTIVITY_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Description of the credit account type.' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_ACTIVITY_TYPE', 
   @level2type=N'COLUMN',
   @level2name=N'DESCRIPTION'
-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_ACTIVITY_TYPE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_ACTIVITY_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_ACTIVITY_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_ACTIVITY_TYPE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_ACTIVITY_TYPE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'



-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY_TYPE] ADD  CONSTRAINT [DF_ORBC_CASE_ACTIVITY_TYPE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_ACTIVITY_TYPE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_ACTIVITY_TYPE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY_TYPE]  ADD  CONSTRAINT [DF_ORBC_CASE_ACTIVITY_TYPE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]

INSERT [case].[ORBC_CASE_ACTIVITY_TYPE] (
   [CASE_ACTIVITY_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'APPROVED',
   N'Approved'
   )

INSERT [case].[ORBC_CASE_ACTIVITY_TYPE] (
   [CASE_ACTIVITY_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'REJECTED',
   N'Rejected'
   )

INSERT [case].[ORBC_CASE_ACTIVITY_TYPE] (
   [CASE_ACTIVITY_TYPE],
   [DESCRIPTION]
   )
VALUES (
   N'WITHDRAWN',
   N'Withdrawn'
   )



IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [case].[ORBC_CASE] (
   [CASE_ID] [int] IDENTITY(1, 1) NOT NULL,
   [ORIGINAL_CASE_ID] [int] NULL,
   [PREVIOUS_CASE_ID] [int] NULL,
   [PERMIT_ID] [bigint] NOT NULL,   
   [CASE_TYPE] [nvarchar](10) NOT NULL,
   [CASE_STATUS_TYPE] [nvarchar](12) NOT NULL,   
   [ASSIGNED_USER_GUID] [char](32) NULL, -- Claimed or assigned?
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_CREATE_USERID] [nvarchar](30) NULL,
   [APP_CREATE_USER_GUID] [char](32) NULL,
   [APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_LAST_UPDATE_USERID] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_CASE] PRIMARY KEY CLUSTERED ([CASE_ID] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- FK constraints
ALTER TABLE [case].[ORBC_CASE]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_ORIGINAL_CASE_ID] 
   FOREIGN KEY([ORIGINAL_CASE_ID])
   REFERENCES [case].[ORBC_CASE] ([CASE_ID])
GO
ALTER TABLE [case].[ORBC_CASE] CHECK CONSTRAINT [FK_ORBC_CASE_ORIGINAL_CASE_ID]

GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [case].[ORBC_CASE]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_PREVIOUS_CASE_ID] 
   FOREIGN KEY([PREVIOUS_CASE_ID])
   REFERENCES [case].[ORBC_CASE] ([CASE_ID])
GO
ALTER TABLE [case].[ORBC_CASE] CHECK CONSTRAINT [FK_ORBC_CASE_PREVIOUS_CASE_ID]

GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [case].[ORBC_CASE]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_PERMIT_ID] 
   FOREIGN KEY([PERMIT_ID])
   REFERENCES [permit].[ORBC_PERMIT] ([ID])
GO
ALTER TABLE [case].[ORBC_CASE] CHECK CONSTRAINT [FK_ORBC_CASE_PERMIT_ID]

GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [case].[ORBC_CASE]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_CASE_TYPE] 
   FOREIGN KEY([CASE_TYPE])
   REFERENCES [case].[ORBC_CASE_TYPE] ([CASE_TYPE])
GO
ALTER TABLE [case].[ORBC_CASE] CHECK CONSTRAINT [FK_ORBC_CASE_CASE_TYPE]

GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [case].[ORBC_CASE]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_CASE_STATUS_TYPE] 
   FOREIGN KEY([CASE_STATUS_TYPE])
   REFERENCES [case].[ORBC_CASE_STATUS_TYPE] ([CASE_STATUS_TYPE])
GO
ALTER TABLE [case].[ORBC_CASE] CHECK CONSTRAINT [FK_ORBC_CASE_CASE_STATUS_TYPE]

-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE] ADD  CONSTRAINT [DF_ORBC_CASE_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE]  ADD  CONSTRAINT [DF_ORBC_CASE_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE]  ADD  CONSTRAINT [DF_ORBC_CASE_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE]  ADD  CONSTRAINT [DF_ORBC_CASE_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]


-- Descriptions for all ORBC_CASE columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Unique auto-generated surrogate primary key' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Original case id' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE', 
   @level2type=N'COLUMN',
   @level2name=N'ORIGINAL_CASE_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Previous version of the case id' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE', 
   @level2type=N'COLUMN',
   @level2name=N'PREVIOUS_CASE_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Permit id of the application' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE',
   @level2type=N'COLUMN',
   @level2name=N'PERMIT_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The type of case' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The status type of the case' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_STATUS_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The userid of the person currently assigned to the case' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE', 
   @level2type=N'COLUMN',
   @level2name=N'ASSIGNED_USER_GUID'    
-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'




IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [case].[ORBC_CASE_EVENT] (
   [CASE_EVENT_ID] [int] IDENTITY(1, 1) NOT NULL,
   [CASE_ID] [int] NOT NULL,
   [CASE_EVENT_TYPE] [nvarchar](20) NOT NULL,
   [EVENT_DATE] [datetime2](7) NOT NULL,
   [EVENT_USER_GUID] [char](32) NULL, 
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_CREATE_USERID] [nvarchar](30) NULL,
   [APP_CREATE_USER_GUID] [char](32) NULL,
   [APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_LAST_UPDATE_USERID] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_CASE_EVENT] PRIMARY KEY CLUSTERED ([CASE_EVENT_ID] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO

ALTER TABLE [case].[ORBC_CASE_EVENT]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_EVENT_CASE_EVENT_TYPE] 
   FOREIGN KEY([CASE_EVENT_TYPE])
   REFERENCES [case].[ORBC_CASE_EVENT_TYPE] ([CASE_EVENT_TYPE])
GO
ALTER TABLE [case].[ORBC_CASE_EVENT] CHECK CONSTRAINT [FK_ORBC_CASE_EVENT_CASE_EVENT_TYPE]

-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_EVENT] ADD  CONSTRAINT [DF_ORBC_CASE_EVENT_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_EVENT]  ADD  CONSTRAINT [DF_ORBC_CASE_EVENT_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_EVENT]  ADD  CONSTRAINT [DF_ORBC_CASE_EVENT_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_EVENT]  ADD  CONSTRAINT [DF_ORBC_CASE_EVENT_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]


-- Descriptions for all ORBC_CASE_EVENT columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Unique auto-generated surrogate primary key' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_EVENT', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_EVENT_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Reference to ORBC_CASE.CASE_ID' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_EVENT', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The type of case event' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_EVENT', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_EVENT_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The date time of the event occurrence' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_EVENT',
   @level2type=N'COLUMN',
   @level2name=N'EVENT_DATE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The userid that triggered the event' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_EVENT', 
   @level2type=N'COLUMN',
   @level2name=N'EVENT_USER_GUID'
-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_EVENT', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_EVENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_EVENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_EVENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_EVENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'

IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [case].[ORBC_CASE_NOTES] (
   [CASE_NOTES_ID] [int] IDENTITY(1, 1) NOT NULL,
   [CASE_ID] [int] NOT NULL,
   [CASE_EVENT_ID] [int] NOT NULL,
   [USER_GUID] [char](32) NULL,
   [NOTES_DATE] [datetime2](7) NOT NULL,
   [NOTES] [nvarchar](4000) NOT NULL,   
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_CREATE_USERID] [nvarchar](30) NULL,
   [APP_CREATE_USER_GUID] [char](32) NULL,
   [APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_LAST_UPDATE_USERID] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_CASE_NOTES] PRIMARY KEY CLUSTERED ([CASE_NOTES_ID] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO

ALTER TABLE [case].[ORBC_CASE_NOTES]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_NOTES_CASE_ID] 
   FOREIGN KEY([CASE_ID])
   REFERENCES [case].[ORBC_CASE] ([CASE_ID])
GO
ALTER TABLE [case].[ORBC_CASE_NOTES] CHECK CONSTRAINT [FK_ORBC_CASE_NOTES_CASE_ID]

ALTER TABLE [case].[ORBC_CASE_NOTES]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_NOTES_CASE_EVENT_ID] 
   FOREIGN KEY([CASE_EVENT_ID])
   REFERENCES [case].[ORBC_CASE_EVENT] ([CASE_EVENT_ID])
GO
ALTER TABLE [case].[ORBC_CASE_NOTES] CHECK CONSTRAINT [FK_ORBC_CASE_NOTES_CASE_EVENT_ID]


-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_NOTES] ADD  CONSTRAINT [DF_ORBC_CASE_NOTES_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_NOTES]  ADD  CONSTRAINT [DF_ORBC_CASE_NOTES_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_NOTES]  ADD  CONSTRAINT [DF_ORBC_CASE_NOTES_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_NOTES]  ADD  CONSTRAINT [DF_ORBC_CASE_NOTES_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]

-- Descriptions for all ORBC_CASE_NOTES columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Unique auto-generated surrogate primary key' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_NOTES', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_NOTES_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Reference to ORBC_CASE.CASE_ID' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_NOTES', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Reference to ORBC_CASE_EVENT.CASE_EVENT_ID' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_NOTES', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_EVENT_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The userid associated with the notes' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_NOTES', 
   @level2type=N'COLUMN',
   @level2name=N'USER_GUID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The date time of the notes' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_NOTES',
   @level2type=N'COLUMN',
   @level2name=N'NOTES_DATE'     
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Notes, if any' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_NOTES', 
   @level2type=N'COLUMN',
   @level2name=N'NOTES'

-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_NOTES', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_NOTES', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_NOTES', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_NOTES', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_NOTES', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'


IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [case].[ORBC_CASE_ACTIVITY] (
   [CASE_ACTIVITY_ID] [int] IDENTITY(1, 1) NOT NULL,
   [CASE_ID] [int] NOT NULL,
   [CASE_EVENT_ID] [int] NOT NULL,
   [CASE_ACTIVITY_TYPE] [nvarchar](10) NOT NULL,
   [CASE_NOTES_ID] [int] NULL,   
   [DATETIME] [datetime2](7) NOT NULL,
   [USER_GUID] [char](32) NULL,
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_CREATE_USERID] [nvarchar](30) NULL,
   [APP_CREATE_USER_GUID] [char](32) NULL,
   [APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_LAST_UPDATE_USERID] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_CASE_ACTIVITY] PRIMARY KEY CLUSTERED ([CASE_ACTIVITY_ID] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO


ALTER TABLE [case].[ORBC_CASE_ACTIVITY]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_ACTIVITY_CASE_ID] 
   FOREIGN KEY([CASE_ID])
   REFERENCES [case].[ORBC_CASE] ([CASE_ID])
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY] CHECK CONSTRAINT [FK_ORBC_CASE_ACTIVITY_CASE_ID]

ALTER TABLE [case].[ORBC_CASE_ACTIVITY]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_ACTIVITY_CASE_EVENT_ID] 
   FOREIGN KEY([CASE_EVENT_ID])
   REFERENCES [case].[ORBC_CASE_EVENT] ([CASE_EVENT_ID])
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY] CHECK CONSTRAINT [FK_ORBC_CASE_ACTIVITY_CASE_EVENT_ID]

ALTER TABLE [case].[ORBC_CASE_ACTIVITY]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_ACTIVITY_CASE_ACTIVITY_TYPE] 
   FOREIGN KEY([CASE_ACTIVITY_TYPE])
   REFERENCES [case].[ORBC_CASE_ACTIVITY_TYPE] ([CASE_ACTIVITY_TYPE])
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY] CHECK CONSTRAINT [FK_ORBC_CASE_ACTIVITY_CASE_ACTIVITY_TYPE]


-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY] ADD  CONSTRAINT [DF_ORBC_CASE_ACTIVITY_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY]  ADD  CONSTRAINT [DF_ORBC_CASE_ACTIVITY_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY]  ADD  CONSTRAINT [DF_ORBC_CASE_ACTIVITY_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_ACTIVITY]  ADD  CONSTRAINT [DF_ORBC_CASE_ACTIVITY_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]


-- Descriptions for all ORBC_CASE_HISTORY columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Unique auto-generated surrogate primary key' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_ACTIVITY_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Reference to ORBC_CASE.CASE_ID' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Reference to ORBC_CASE_EVENT.CASE_EVENT_ID' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_EVENT_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Reference to ORBC_CASE_ACTIVITY_TYPE.CASE_ACTIVITY_TYPE' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_ACTIVITY',
   @level2type=N'COLUMN',
   @level2name=N'CASE_ACTIVITY_TYPE'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The date time of the ACTIVITY' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_ACTIVITY',
   @level2type=N'COLUMN',
   @level2name=N'DATETIME'   
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'The userid associated with the ACTIVITY' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'USER_GUID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Comments related to the ACTIVITY, references ORBC_CASE_NOTES' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_ACTIVITY', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_NOTES_ID'

-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_ACTIVITY', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_ACTIVITY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_ACTIVITY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_ACTIVITY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_ACTIVITY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'


IF @@ERROR <> 0 SET NOEXEC ON
GO
CREATE TABLE [case].[ORBC_CASE_DOCUMENT] (
   [CASE_DOCUMENT_ID] [int] IDENTITY(1, 1) NOT NULL,
   [CASE_ID] [int] NOT NULL,
   [CASE_EVENT_ID] [int] NOT NULL,
   [DOCUMENT_ID] [bigint] NOT NULL,   
   [CONCURRENCY_CONTROL_NUMBER] [int] NULL,
   [APP_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_CREATE_USERID] [nvarchar](30) NULL,
   [APP_CREATE_USER_GUID] [char](32) NULL,
   [APP_CREATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   [APP_LAST_UPDATE_USERID] [nvarchar](30) NULL,
   [APP_LAST_UPDATE_USER_GUID] [char](32) NULL,
   [APP_LAST_UPDATE_USER_DIRECTORY] [nvarchar](30) NULL,
   [DB_CREATE_USERID] [varchar](63) NULL,
   [DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
   [DB_LAST_UPDATE_USERID] [varchar](63) NULL,
   [DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
   CONSTRAINT [PK_ORBC_CASE_DOCUMENT] PRIMARY KEY CLUSTERED ([CASE_DOCUMENT_ID] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
      ) ON [PRIMARY]
   ) ON [PRIMARY]
GO


ALTER TABLE [case].[ORBC_CASE_DOCUMENT]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_DOCUMENT_CASE_ID] 
   FOREIGN KEY([CASE_ID])
   REFERENCES [case].[ORBC_CASE] ([CASE_ID])
GO
ALTER TABLE [case].[ORBC_CASE_DOCUMENT] CHECK CONSTRAINT [FK_ORBC_CASE_DOCUMENT_CASE_ID]

ALTER TABLE [case].[ORBC_CASE_DOCUMENT]  
   WITH CHECK ADD CONSTRAINT [FK_ORBC_CASE_DOCUMENT_CASE_EVENT_ID] 
   FOREIGN KEY([CASE_EVENT_ID])
   REFERENCES [case].[ORBC_CASE_EVENT] ([CASE_EVENT_ID])
GO
ALTER TABLE [case].[ORBC_CASE_DOCUMENT] CHECK CONSTRAINT [FK_ORBC_CASE_DOCUMENT_CASE_EVENT_ID]

-- Default values for audit columns (boilerplate)
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_DOCUMENT] ADD  CONSTRAINT [DF_ORBC_CASE_DOCUMENT_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_DOCUMENT]  ADD  CONSTRAINT [DF_ORBC_CASE_DOCUMENT_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_DOCUMENT]  ADD  CONSTRAINT [DF_ORBC_CASE_DOCUMENT_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]

IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [case].[ORBC_CASE_DOCUMENT]  ADD  CONSTRAINT [DF_ORBC_CASE_DOCUMENT_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]


-- Descriptions for all ORBC_CASE_DOCUMENT columns
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Unique auto-generated surrogate primary key' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_DOCUMENT', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_DOCUMENT_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Reference to ORBC_CASE.CASE_ID' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_DOCUMENT', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Reference to ORBC_CASE_EVENT.CASE_EVENT_ID' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_DOCUMENT', 
   @level2type=N'COLUMN',
   @level2name=N'CASE_EVENT_ID'
EXEC sys.sp_addextendedproperty 
   @name=N'MS_Description', 
   @value=N'Reference to ORBC_DOCUMENT' , 
   @level0type=N'SCHEMA',
   @level0name=N'case', 
   @level1type=N'TABLE',
   @level1Name=N'ORBC_CASE_DOCUMENT',
   @level2type=N'COLUMN',
   @level2name=N'DOCUMENT_ID'

-- Audit column descriptions (boilerplate)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Application code is responsible for retrieving the row and then incrementing the value of the CONCURRENCY_CONTROL_NUMBER column by one prior to issuing an update. If this is done then the update will succeed, provided that the row was not updated by any other transactions in the period between the read and the update operations.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_DOCUMENT', @level2type=N'COLUMN',@level2name=N'CONCURRENCY_CONTROL_NUMBER'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'case', @level1type=N'TABLE',@level1Name=N'ORBC_CASE_DOCUMENT', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'



IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Case/Queue management and related Db objects.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (40, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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

