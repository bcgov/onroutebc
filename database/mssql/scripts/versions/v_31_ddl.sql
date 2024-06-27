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
	[HOLIDAY_YEAR] [int] NULL,
	[HOLIDAYS] [nvarchar](4000) NULL,
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

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The year of the bc statutory holidays.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_HOLIDAY', @level2type=N'COLUMN',@level2name=N'HOLIDAY_YEAR'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The holidays of the bc statutory holidays associated with the year.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ORBC_HOLIDAY', @level2type=N'COLUMN',@level2name=N'HOLIDAYS'
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
INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAYS]) 
VALUES (2024, N'{
    "province": {
        "id": "BC",
        "nameEn": "British Columbia",
        "nameFr": "Colombie-Britannique",
        "sourceLink": "https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/statutory-holidays#body",
        "sourceEn": "Statutory Holidays in British Columbia",
        "holidays": [
            {
                "id": 1,
                "date": "2024-01-01",
                "nameEn": "New Year''s Day",
                "nameFr": "Jour de l''An",
                "federal": 1,
                "observedDate": "2024-01-01"
            },
            {
                "id": 2,
                "date": "2024-02-19",
                "nameEn": "Family Day",
                "nameFr": "Fête de la famille",
                "federal": 0,
                "observedDate": "2024-02-19"
            },
            {
                "id": 3,
                "date": "2024-03-29",
                "nameEn": "Good Friday",
                "nameFr": "Vendredi saint",
                "federal": 1,
                "observedDate": "2024-03-29"
            },
            {
                "id": 4,
                "date": "2024-05-20",
                "nameEn": "Victoria Day",
                "nameFr": "Fête de la Reine",
                "federal": 1,
                "observedDate": "2024-05-20"
            },
            {
                "id": 5,
                "date": "2024-07-01",
                "nameEn": "Canada Day",
                "nameFr": "Fête du Canada",
                "federal": 1,
                "observedDate": "2024-07-01"
            },
            {
                "id": 6,
                "date": "2024-08-05",
                "nameEn": "British Columbia Day",
                "nameFr": "Jour de Colombie-Britannique",
                "federal": 0,
                "observedDate": "2024-08-05"
            },
            {
                "id": 7,
                "date": "2024-09-02",
                "nameEn": "Labour Day",
                "nameFr": "Fête du travail",
                "federal": 1,
                "observedDate": "2024-09-02"
            },
            {
                "id": 8,
                "date": "2024-09-30",
                "nameEn": "National Day for Truth and Reconciliation",
                "nameFr": "Journée nationale de la vérité et de la réconciliation",
                "federal": 1,
                "observedDate": "2024-09-30"
            },
            {
                "id": 9,
                "date": "2024-10-14",
                "nameEn": "Thanksgiving",
                "nameFr": "Action de grâce",
                "federal": 1,
                "observedDate": "2024-10-14"
            },
            {
                "id": 10,
                "date": "2024-11-11",
                "nameEn": "Remembrance Day",
                "nameFr": "Jour du Souvenir",
                "federal": 1,
                "observedDate": "2024-11-11"
            },
            {
                "id": 11,
                "date": "2024-12-25",
                "nameEn": "Christmas Day",
                "nameFr": "Noël",
                "federal": 1,
                "observedDate": "2024-12-25"
            }
        ]
    }
}');

INSERT INTO [dbo].[ORBC_HOLIDAY] ([HOLIDAY_YEAR], [HOLIDAYS]) 
VALUES (2025, N'{
    "province": {
        "id": "BC",
        "nameEn": "British Columbia",
        "nameFr": "Colombie-Britannique",
        "sourceLink": "https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/statutory-holidays#body",
        "sourceEn": "Statutory Holidays in British Columbia",
        "holidays": [
            {
                "id": 1,
                "date": "2025-01-01",
                "nameEn": "New Year''s Day",
                "nameFr": "Jour de l''An",
                "federal": 1,
                "observedDate": "2025-01-01"
            },
            {
                "id": 2,
                "date": "2025-02-17",
                "nameEn": "Family Day",
                "nameFr": "Fête de la famille",
                "federal": 0,
                "observedDate": "2025-02-17"
            },
            {
                "id": 3,
                "date": "2025-04-18",
                "nameEn": "Good Friday",
                "nameFr": "Vendredi saint",
                "federal": 1,
                "observedDate": "2025-04-18"
            },
            {
                "id": 4,
                "date": "2025-05-19",
                "nameEn": "Victoria Day",
                "nameFr": "Fête de la Reine",
                "federal": 1,
                "observedDate": "2025-05-19"
            },
            {
                "id": 5,
                "date": "2025-07-01",
                "nameEn": "Canada Day",
                "nameFr": "Fête du Canada",
                "federal": 1,
                "observedDate": "2025-07-01"
            },
            {
                "id": 6,
                "date": "2025-08-04",
                "nameEn": "British Columbia Day",
                "nameFr": "Jour de Colombie-Britannique",
                "federal": 0,
                "observedDate": "2025-08-04"
            },
            {
                "id": 7,
                "date": "2025-09-01",
                "nameEn": "Labour Day",
                "nameFr": "Fête du travail",
                "federal": 1,
                "observedDate": "2025-09-01"
            },
            {
                "id": 8,
                "date": "2025-09-30",
                "nameEn": "National Day for Truth and Reconciliation",
                "nameFr": "Journée nationale de la vérité et de la réconciliation",
                "federal": 1,
                "observedDate": "2025-09-30"
            },
            {
                "id": 9,
                "date": "2025-10-13",
                "nameEn": "Thanksgiving",
                "nameFr": "Action de grâce",
                "federal": 1,
                "observedDate": "2025-10-13"
            },
            {
                "id": 10,
                "date": "2025-11-11",
                "nameEn": "Remembrance Day",
                "nameFr": "Jour du Souvenir",
                "federal": 1,
                "observedDate": "2025-11-11"
            },
            {
                "id": 11,
                "date": "2025-12-25",
                "nameEn": "Christmas Day",
                "nameFr": "Noël",
                "federal": 1,
                "observedDate": "2025-12-25"
            }
        ]
    }
}');

GO


DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Holiday table creation plus history tables for v31'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (31, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
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
