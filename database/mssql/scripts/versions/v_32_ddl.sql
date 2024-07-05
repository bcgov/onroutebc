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

--------------------------------------
-- Holiday table creation
--------------------------------------
CREATE TABLE [dbo].[ORBC_HOLIDAY](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[HOLIDAY_YEAR] [int] NOT NULL,
	[HOLIDAY_MONTH] [tinyint] NOT NULL,
	[HOLIDAY_DAY] [tinyint] NOT NULL,
	[DB_CREATE_USERID] [varchar](63) NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NULL,
 CONSTRAINT [PK_ORBC_HOLIDAY] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The year of the bc statutory holiday.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_HOLIDAY', @level2type=N'COLUMN',@level2name=N'HOLIDAY_YEAR'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The month of the bc statutory holiday.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_HOLIDAY', @level2type=N'COLUMN',@level2name=N'HOLIDAY_MONTH'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The day of the bc statutory holiday.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_HOLIDAY', @level2type=N'COLUMN',@level2name=N'HOLIDAY_DAY'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_HOLIDAY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_HOLIDAY', @level2type=N'COLUMN',@level2name=N'DB_CREATE_TIMESTAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The user or proxy account that created or last updated the record.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_HOLIDAY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_USERID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date and time the record was created or last updated.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_HOLIDAY', @level2type=N'COLUMN',@level2name=N'DB_LAST_UPDATE_TIMESTAMP'
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Add new holidays 
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 1, 1, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 2, 19, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 3, 29, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 5, 20, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 7, 1, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 8, 5, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 9, 2, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 9, 30, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 10, 14, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 11, 11, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2024, 12, 25, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())

INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 1, 1, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 2, 17, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 4, 18, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 5, 19, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 7, 1, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 8, 4, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 9, 1, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 9, 30, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 10, 13, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 11, 11, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAY_MONTH], [HOLIDAY_DAY], 
         [DB_CREATE_USERID],
         [DB_CREATE_TIMESTAMP],
         [DB_LAST_UPDATE_USERID],
         [DB_LAST_UPDATE_TIMESTAMP]) VALUES (2025, 12, 25, N'dbo', GETUTCDATE(), N'dbo', GETUTCDATE())


DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Holiday table creation plus history tables for v32'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (32, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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