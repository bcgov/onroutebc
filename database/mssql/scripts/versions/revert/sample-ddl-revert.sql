-- This is a typical revert script
-- Each migration script in the versions folder should also include a revert script

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

SET XACT_ABORT ON

-- Sample of rolling back a Table creation wrapped in a TRANSACTION
--BEGIN TRY
--  BEGIN TRANSACTION
--    DROP TABLE [dbo].[ORBC_NEW_TABLE]
--  COMMIT
--END TRY

--BEGIN CATCH
--  IF @@TRANCOUNT > 0 
--    ROLLBACK;
--  THROW
--END CATCH

-- Also remember to rollback the version number from your migration!
DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = '*** Enter description of DB change here ***'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (/*<<REPLACE VERSION NUMBER HERE>>*/, @VersionDescription, getutcdate())
