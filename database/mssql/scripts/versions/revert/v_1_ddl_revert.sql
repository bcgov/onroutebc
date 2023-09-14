SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

-- Note since we are reverting to version zero, there is no longer a version table to update
DROP TABLE [dbo].[ORBC_SYS_VERSION]