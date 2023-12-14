SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

CREATE FUNCTION [dbo].[ORBC_FORMAT_UTC_TO_PACIFIC_FN] 
(
	@inputUtcDate datetime2(7)
)
RETURNS varchar(61)
AS
BEGIN
	DECLARE @formattedRawDate varchar(30)
	DECLARE @timeZoneLabel varchar(30)
	DECLARE @timeZoneTarget varchar(30) = 'Pacific Standard Time'
	DECLARE @timeFormat varchar(30) = 'MMM. d yyyy h:mm:ss tt'

	SELECT @formattedRawDate = FORMAT(@inputUtcDate AT TIME ZONE 'UTC' AT TIME ZONE @timeZoneTarget, @timeFormat);
	SELECT @timeZoneLabel = CASE
								DATEPART(TZOFFSET, @inputUtcDate AT TIME ZONE 'UTC' AT TIME ZONE @timeZoneTarget) 
								WHEN (-8*60) THEN 'PST'
								WHEN (-7*60) THEN 'PDT' 
							END;

	-- Return the result of the function
	RETURN CONCAT(@formattedRawDate, ' ', @timeZoneLabel)

END
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Create function to format a UTC date into Pacific time for reports.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (10, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
