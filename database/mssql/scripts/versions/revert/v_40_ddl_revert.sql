SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

SET XACT_ABORT ON

BEGIN TRY
  BEGIN TRANSACTION
    UPDATE [permit].[ORBC_NO_FEE_TYPE] set NO_FEE_TYPE = 'ANY_USA_GOVT' WHERE NO_FEE_TYPE = 'OTHER_USA_GOVT'
    UPDATE [permit].[ORBC_NO_FEE_TYPE] set NO_FEE_TYPE = 'USA_GOVT' WHERE NO_FEE_TYPE = 'USA_FEDERAL_GOVT'
    UPDATE [permit].[ORBC_NO_FEE_TYPE] set NO_FEE_TYPE = 'MUNICPALITY' WHERE NO_FEE_TYPE = 'MUNICIPALITY'
    ALTER TABLE [permit].[ORBC_SPECIAL_AUTH] DROP CONSTRAINT [FK_ORBC_SPECIAL_AUTH_NO_FEE_TYPE]
    ALTER TABLE [permit].[ORBC_NO_FEE_TYPE] DROP CONSTRAINT [PK_ORBC_NO_FEE_TYPE]
    ALTER TABLE [permit].[ORBC_NO_FEE_TYPE] ALTER COLUMN NO_FEE_TYPE VARCHAR(12) NOT NULL
    ALTER TABLE [permit].[ORBC_SPECIAL_AUTH_HIST] ALTER COLUMN NO_FEE_TYPE VARCHAR(12) NULL
    ALTER TABLE [permit].[ORBC_SPECIAL_AUTH] ALTER COLUMN NO_FEE_TYPE VARCHAR(12) NULL
    ALTER TABLE [permit].[ORBC_NO_FEE_TYPE] ADD CONSTRAINT PK_ORBC_NO_FEE_TYPE PRIMARY KEY CLUSTERED ([NO_FEE_TYPE]);
    ALTER TABLE [permit].[ORBC_SPECIAL_AUTH]
    WITH CHECK ADD CONSTRAINT [FK_ORBC_SPECIAL_AUTH_NO_FEE_TYPE] FOREIGN KEY ([NO_FEE_TYPE]) REFERENCES [permit].[ORBC_NO_FEE_TYPE]([NO_FEE_TYPE])
    ALTER TABLE [permit].[ORBC_SPECIAL_AUTH] CHECK CONSTRAINT [FK_ORBC_SPECIAL_AUTH_NO_FEE_TYPE]
    COMMIT
END TRY

BEGIN CATCH
  IF @@TRANCOUNT > 0 
    ROLLBACK;
  THROW
END CATCH

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Updating no fee type column length'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (39, @VersionDescription, getutcdate())
