CREATE SCHEMA [tps]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

CREATE TABLE [tps].[ETL_PROCESS_TYPE](
	[PROCESS_TYPE] [char](3) NOT NULL,
	[DESCRIPTION] [nvarchar](50) NULL,
 CONSTRAINT [PK_ETL_PROCESS_TYPE] PRIMARY KEY CLUSTERED 
(
	[PROCESS_TYPE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

INSERT [tps].[ETL_PROCESS_TYPE] ([PROCESS_TYPE], [DESCRIPTION]) VALUES (N'CLI', N'Client Data')
GO
INSERT [tps].[ETL_PROCESS_TYPE] ([PROCESS_TYPE], [DESCRIPTION]) VALUES (N'PER', N'Permits')
GO

CREATE TABLE [tps].[ETL_PROCESS_ERROR](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[ERROR_DATE] [datetime2](7) NULL,
	[ERROR_MESSAGE] [nvarchar](1000) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ETL_PROCESS_ERROR] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [tps].[ETL_PROCESS_ERROR] ADD  CONSTRAINT [DF_ETL_PROCESS_ERROR_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO

ALTER TABLE [tps].[ETL_PROCESS_ERROR] ADD  CONSTRAINT [DF_ETL_PROCESS_ERROR_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO

ALTER TABLE [tps].[ETL_PROCESS_ERROR] ADD  CONSTRAINT [DF_ETL_PROCESS_ERROR_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO

ALTER TABLE [tps].[ETL_PROCESS_ERROR] ADD  CONSTRAINT [DF_ETL_PROCESS_ERROR_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

CREATE TABLE [tps].[ETL_PROCESSES](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[PROCESS_TYPE] [char](3) NOT NULL,
	[START_DATE] [datetime2](0) NULL,
	[END_DATE] [datetime2](0) NULL,
	[FILTER_FROM] [datetime2](0) NULL,
	[FILTER_TO] [datetime2](0) NULL,
	[NUM_RECORDS_MIGRATED] [int] NULL,
	[NUM_RECORDS_MIGRATED_SEC] [int] NULL,
	[ERROR_STATUS] [bit] NULL,
	[ORBC_PROCESSED] [bit] NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ETL_PROCESSES] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [tps].[ETL_PROCESSES] ADD  CONSTRAINT [DF_ETL_PROCESSES_ORBC_PROCESSED]  DEFAULT ((0)) FOR [ORBC_PROCESSED]
GO

ALTER TABLE [tps].[ETL_PROCESSES] ADD  CONSTRAINT [DF_ETL_PROCESSES_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO

ALTER TABLE [tps].[ETL_PROCESSES] ADD  CONSTRAINT [DF_ETL_PROCESSES_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO

ALTER TABLE [tps].[ETL_PROCESSES] ADD  CONSTRAINT [DF_ETL_PROCESSES_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO

ALTER TABLE [tps].[ETL_PROCESSES] ADD  CONSTRAINT [DF_ETL_PROCESSES_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

ALTER TABLE [tps].[ETL_PROCESSES]  WITH CHECK ADD  CONSTRAINT [FK_ETL_PROCESSES_ETL_PROCESS_TYPE] FOREIGN KEY([PROCESS_TYPE])
REFERENCES [tps].[ETL_PROCESS_TYPE] ([PROCESS_TYPE])
GO

ALTER TABLE [tps].[ETL_PROCESSES] CHECK CONSTRAINT [FK_ETL_PROCESSES_ETL_PROCESS_TYPE]
GO

CREATE TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS](
	[MIGRATION_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ID] [bigint] NULL,
	[CLIENT_HASH] [nvarchar](64) NULL,
	[LEGAL_NAME] [nvarchar](101) NULL,
	[EMAIL] [nvarchar](320) NULL,
	[PHONE] [nvarchar](30) NULL,
	[FAX] [nvarchar](30) NULL,
	[ADDR_LINE1] [nvarchar](44) NULL,
	[ADDR_LINE2] [nvarchar](44) NULL,
	[CITY] [nvarchar](44) NULL,
	[PROVINCE_ID] [nvarchar](5) NULL,
	[POSTAL_CODE] [nvarchar](7) NULL,
	[GUID] [nvarchar](64) NULL,
	[REGION] [nchar](1) NULL,
	[NEW_CLIENT_NUMBER] [char](13) NULL,
	[LCV] [nvarchar](10) NULL,
	[NOFEE] [nvarchar](10) NULL,
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[PROCESSED] [bit] NULL,
	[PROCESSED_DATE] [datetime2](7) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_TPS_MIGRATED_CLIENTS] PRIMARY KEY CLUSTERED 
(
	[MIGRATION_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_CLIENTS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_CLIENTS_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_CLIENTS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_CLIENTS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

CREATE TRIGGER [tps].[ORBC_TPS_MIGRATED_CLIENTS_TRG] 
   ON  [tps].[ORBC_TPS_MIGRATED_CLIENTS] 
   AFTER INSERT AS 

SET NOCOUNT ON

-- Columns from inserted records
DECLARE @tps_id int
DECLARE @client_hash varchar(64)
DECLARE @legal_name varchar(101)
DECLARE @email varchar(320)
DECLARE @phone varchar(30)
DECLARE @fax varchar(30)
DECLARE @addr_line1 varchar(44)
DECLARE @addr_line2 varchar(44)
DECLARE @city varchar(44)
DECLARE @province_id varchar(5)
DECLARE @postal_code varchar(7)
DECLARE @guid varchar(64)
DECLARE @region char(1)
DECLARE @new_client_number char(13)

-- Intermediate variables
DECLARE @addr_id int
DECLARE @companyId int
DECLARE @directory varchar(10)

DECLARE client_cursor CURSOR FOR
	SELECT ID, CLIENT_HASH, LEGAL_NAME, EMAIL, PHONE, FAX, ADDR_LINE1, ADDR_LINE2, 
			CITY, PROVINCE_ID, POSTAL_CODE, GUID, REGION, NEW_CLIENT_NUMBER
	FROM inserted
	FOR READ ONLY
	
OPEN client_cursor
	
FETCH NEXT FROM client_cursor
INTO @tps_id, @client_hash, @legal_name, @email, @phone, @fax, @addr_line1, @addr_line2,
		@city, @province_id, @postal_code, @guid, @region, @new_client_number

WHILE @@FETCH_STATUS=0
BEGIN
	-- Retreive the company ID from the ORBC company table if this TPS client
	-- has already been migrated into ORBC
	SELECT 
		@companyId = COMPANY_ID
	FROM
		dbo.ORBC_COMPANY
	WHERE
		TPS_CLIENT_HASH = @client_hash

	IF @companyId IS NULL
		-- The company does not already exist in the ORBC database
		BEGIN
			-- Create the address record
			INSERT INTO 
				ORBC_ADDRESS(
					ADDRESS_LINE_1, 
					ADDRESS_LINE_2, 
					CITY, 
					PROVINCE_TYPE, 
					POSTAL_CODE)
			VALUES (
				@addr_line1,
				@addr_line2,
				@city,
				(SELECT ISNULL((SELECT TOP 1 PROVINCE_TYPE from ORBC_PROVINCE_TYPE WHERE PROVINCE_TYPE=@province_id), 'XX-XX')),
				@postal_code)

			-- Retrieve the newly created address id
			SELECT
				@addr_id = ADDRESS_ID
			FROM
				dbo.ORBC_ADDRESS
			WHERE
				ADDRESS_ID = SCOPE_IDENTITY()

			-- Create a new company guid if the business guid is null
			IF @guid IS NULL
				BEGIN
					SET @guid = CONVERT(varchar(32), REPLACE(CONVERT(varchar(36), NEWID()), '-', ''))
					SET @directory = 'ORBC'
				END
			ELSE
				BEGIN
					-- Guid is set in TPS, this is a Business BCEID guid
					SET @directory = 'BBCEID'
				END


			INSERT INTO
				ORBC_COMPANY(
					COMPANY_GUID, 
					CLIENT_NUMBER, 
					TPS_CLIENT_HASH,
					LEGAL_NAME,
					COMPANY_DIRECTORY, 
					MAILING_ADDRESS_ID, 
					PHONE, 
					FAX, 
					EMAIL,
					ACCOUNT_REGION,
					ACCOUNT_SOURCE)
			VALUES (
				@guid,
				@new_client_number,
				@client_hash,
				@legal_name,
				@directory,
				@addr_id,
				@phone,
				@fax,
				@email,
				@region,
				1)
			
		END -- BEGIN

	FETCH NEXT FROM client_cursor
	INTO @tps_id, @client_hash, @legal_name, @email, @phone, @fax, @addr_line1, @addr_line2,
			@city, @province_id, @postal_code, @guid, @region, @new_client_number

END -- WHILE @@FETCH_STATUS=0

CLOSE client_cursor
DEALLOCATE client_cursor

GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS] ENABLE TRIGGER [ORBC_TPS_MIGRATED_CLIENTS_TRG]
GO

CREATE TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS](
	[MIGRATION_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[PERMIT_TYPE] [nvarchar](50) NULL,
	[START_DATE] [date] NULL,
	[END_DATE] [date] NULL,
	[VOID_DATE] [datetime2](7) NULL,
	[ISSUED_DATE] [datetime2](7) NULL,
	[CLIENT_HASH] [nvarchar](64) NULL,
	[PLATE] [nvarchar](50) NULL,
	[VIN] [nvarchar](17) NULL,
	[PERMIT_NUMBER] [nvarchar](11) NULL,
	[NEW_PERMIT_NUMBER] [varchar](19) NULL,
	[PERMIT_GENERATION] [smallint] NULL,
	[PERMIT_DOCUMENT_NAME] [nvarchar](60) NULL,
	[SERVICE] [nvarchar](50) NULL,
	[PERMIT_LAST_MODIFIED_DATE] [datetime2](7) NULL,
	[PDF] [varbinary](max) NULL,
	[S3_UPLOAD_STATUS] [varchar](20) DEFAULT ('PENDING'),
	[RETRY_COUNT] [smallint] DEFAULT (0),
	[ETL_PROCESS_ID] [varchar](38) NULL,
	[PROCESSED] [bit] NULL,
	[PROCESSED_DATE] [datetime2](7) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
	   CONSTRAINT chk_S3_UPLOAD_STATUS CHECK (S3_UPLOAD_STATUS IN ('PENDING', 'PROCESSING', 'PROCESSED', 'ERROR'))
,
 CONSTRAINT [PK_ORBC_TPS_MIGRATED_PERMITS] PRIMARY KEY CLUSTERED 
(
	[MIGRATION_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TRIGGER [tps].[ORBC_TPS_MIGRATED_PERMITS_TRG] 
   ON  [tps].[ORBC_TPS_MIGRATED_PERMITS] 
   AFTER INSERT AS 

SET NOCOUNT ON

INSERT INTO 
	permit.ORBC_PERMIT(
		COMPANY_ID, 
		PERMIT_TYPE, 
		PERMIT_NUMBER,
		TPS_PERMIT_NUMBER,
		REVISION, 
		PERMIT_ISSUE_DATE_TIME, 
		PERMIT_APPROVAL_SOURCE_TYPE,
		PERMIT_STATUS_TYPE)
SELECT 
	c.COMPANY_ID,
	i.PERMIT_TYPE,
	i.NEW_PERMIT_NUMBER,
	i.PERMIT_NUMBER,
	i.PERMIT_GENERATION - 1,
	i.ISSUED_DATE,
	'TPS',
	CASE WHEN i.SERVICE = 'V' THEN 'VOIDED' ELSE 'ISSUED' END
FROM
	Inserted i,
	dbo.ORBC_COMPANY c
WHERE 
	i.CLIENT_HASH = c.TPS_CLIENT_HASH


INSERT INTO
	permit.ORBC_PERMIT_DATA(
		PERMIT_ID,
		PERMIT_DATA)
SELECT 
	p.ID,
	CONCAT( 
		'{"companyName":"', STRING_ESCAPE(c.LEGAL_NAME, 'json'), '",',
		'"clientNumber":"', STRING_ESCAPE(c.CLIENT_NUMBER, 'json'), '",',
		'"startDate":"', i.START_DATE, '",',
		'"expiryDate":"', i.END_DATE, '",',
		'"permitDuration":', DATEDIFF(day, i.START_DATE, i.END_DATE) + 1, ',',
		'"vehicleDetails":{',
			'"plate":"', STRING_ESCAPE(i.PLATE, 'json'), '",',
			'"vin":"', STRING_ESCAPE(i.VIN, 'json'), '"',
		'}}')
FROM
	Inserted i,
	permit.ORBC_PERMIT p,
	dbo.ORBC_COMPANY c
WHERE
	i.NEW_PERMIT_NUMBER = p.PERMIT_NUMBER
AND
	c.COMPANY_ID = p.COMPANY_ID
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS] ENABLE TRIGGER [ORBC_TPS_MIGRATED_PERMITS_TRG]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_PERMITS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_PERMITS_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_PERMITS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_PERMITS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

CREATE TABLE [tps].[ORBC_TPS_MIGRATED_USERS](
	[MIGRATION_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[CLIENT_ID] [bigint] NULL,
	[FIRST_NAME] [nvarchar](50) NULL,
	[LAST_NAME] [nvarchar](50) NULL,
	[EMAIL] [nvarchar](320) NULL,
	[PHONE_NUMBER] [nvarchar](30) NULL,
	[FAX_NUMBER] [nvarchar](30) NULL,
	[GUID] [nvarchar](32) NULL,
	[CONCURRENCY_CONTROL_NUMBER] [int] NULL,
	[DB_CREATE_USERID] [varchar](63) NOT NULL,
	[DB_CREATE_TIMESTAMP] [datetime2](7) NOT NULL,
	[DB_LAST_UPDATE_USERID] [varchar](63) NOT NULL,
	[DB_LAST_UPDATE_TIMESTAMP] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ORBC_TPS_MIGRATED_USERS] PRIMARY KEY CLUSTERED 
(
	[MIGRATION_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TRIGGER [tps].[ORBC_TPS_MIGRATED_USERS_TRG] 
   ON  [tps].[ORBC_TPS_MIGRATED_USERS] 
   AFTER INSERT AS 

SET NOCOUNT ON

-- Columns from inserted records
DECLARE @company_id int
DECLARE @first_name varchar(50)
DECLARE @last_name varchar(50)
DECLARE @user_guid varchar(32)

-- Intermediate variables
DECLARE @existing_count int

DECLARE user_cursor CURSOR FOR
	SELECT c.COMPANY_ID, i.FIRST_NAME, i.LAST_NAME, i.GUID
	FROM inserted i, dbo.ORBC_COMPANY c, tps.ORBC_TPS_MIGRATED_CLIENTS cli
	WHERE i.CLIENT_ID = cli.ID
	AND cli.CLIENT_HASH = c.TPS_CLIENT_HASH
	FOR READ ONLY
	
OPEN user_cursor
	
FETCH NEXT FROM user_cursor
INTO @company_id, @first_name, @last_name, @user_guid

WHILE @@FETCH_STATUS=0
BEGIN
	-- Retreive the company ID from the ORBC company table if this TPS client
	-- has already been migrated into ORBC
	SELECT 
		@existing_count = count(*)
	FROM
		dbo.ORBC_PENDING_USER
	WHERE
		USER_GUID = @user_guid
	AND
		COMPANY_ID = @company_id

	IF @existing_count = 0
		-- The user has not already been added to the pending user table
		BEGIN
			-- Create the pending user record
			INSERT INTO 
				dbo.ORBC_PENDING_USER(
					COMPANY_ID, 
					USERNAME, 
					USER_GUID, 
					USER_AUTH_GROUP_TYPE,
					FIRST_NAME, 
					LAST_NAME)
			VALUES (
				@company_id,
				'TPS Migrated User',
				@user_guid,
				'ORGADMIN',
				@first_name,
				@last_name)
			
		END -- BEGIN

	FETCH NEXT FROM user_cursor
	INTO @company_id, @first_name, @last_name, @user_guid

END -- WHILE @@FETCH_STATUS=0

CLOSE user_cursor
DEALLOCATE user_cursor

GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS] ENABLE TRIGGER [ORBC_TPS_MIGRATED_USERS_TRG]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_USERS_DB_CREATE_USERID]  DEFAULT (user_name()) FOR [DB_CREATE_USERID]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_USERS_DB_CREATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_CREATE_TIMESTAMP]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_USERS_DB_LAST_UPDATE_USERID]  DEFAULT (user_name()) FOR [DB_LAST_UPDATE_USERID]
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS] ADD  CONSTRAINT [DF_ORBC_TPS_MIGRATED_USERS_DB_LAST_UPDATE_TIMESTAMP]  DEFAULT (getutcdate()) FOR [DB_LAST_UPDATE_TIMESTAMP]
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Creation of tables to store TPS migration staging data.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (9, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())
