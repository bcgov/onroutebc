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


IF OBJECT_ID(N'tps.PROCESS_MIGRATED_TPS_CLIENTS_AND_USERS', N'P') IS NOT NULL
BEGIN
    DROP PROCEDURE [tps].PROCESS_MIGRATED_TPS_CLIENTS_AND_USERS
END
GO


IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_CLIENTS_PROCESSED' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_CLIENTS'))
BEGIN
 DROP INDEX [tps].[ORBC_TPS_MIGRATED_CLIENTS].[IX_ORBC_TPS_MIGRATED_CLIENTS_PROCESSED];
END
GO


IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_CLIENTS_ERR_MSG' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_CLIENTS'))
BEGIN
 DROP INDEX [tps].[ORBC_TPS_MIGRATED_CLIENTS].[IX_ORBC_TPS_MIGRATED_CLIENTS_ERR_MSG];
END
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_CLIENTS_PENDING' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_CLIENTS'))
BEGIN
 DROP INDEX [tps].[ORBC_TPS_MIGRATED_CLIENTS].[IX_ORBC_TPS_MIGRATED_CLIENTS_PENDING];
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_CLIENTS', N'ERROR_MESSAGE') IS NOT NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
        DROP COLUMN [ERROR_MESSAGE];
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_CLIENTS', N'PROCESSING_START_UTC') IS NOT NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
        DROP COLUMN [PROCESSING_START_UTC];
END
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
    DROP CONSTRAINT [DF_ORBC_TPS_MIGRATED_CLIENTS_PROCESSED];
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
    ALTER COLUMN [PROCESSED] bit NULL;
GO

UPDATE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
SET [PROCESSED] = NULL
WHERE [PROCESSED] IS NOT NULL;
GO


CREATE OR ALTER TRIGGER [tps].[ORBC_TPS_MIGRATED_CLIENTS_TRG] 
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


IF @@ERROR <> 0 SET NOEXEC ON
GO


IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_USERS_PROCESSED' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_USERS'))
BEGIN
 DROP INDEX [tps].[ORBC_TPS_MIGRATED_USERS].[IX_ORBC_TPS_MIGRATED_USERS_PROCESSED];
END
GO


IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_USERS_ERR_MSG' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_USERS'))
BEGIN
 DROP INDEX [tps].[ORBC_TPS_MIGRATED_USERS].[IX_ORBC_TPS_MIGRATED_USERS_ERR_MSG];
END
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_USERS_PENDING' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_USERS'))
BEGIN
 DROP INDEX [tps].[ORBC_TPS_MIGRATED_USERS].[IX_ORBC_TPS_MIGRATED_USERS_PENDING];
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_USERS', N'ERROR_MESSAGE') IS NOT NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS]
        DROP COLUMN [ERROR_MESSAGE];
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_USERS', N'PROCESSING_START_UTC') IS NOT NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS]
        DROP COLUMN [PROCESSING_START_UTC];
END
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS]
    DROP CONSTRAINT [DF_ORBC_TPS_MIGRATED_USERS_PROCESSED];
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS]
    ALTER COLUMN [PROCESSED] bit NULL;
GO

UPDATE [tps].[ORBC_TPS_MIGRATED_USERS]
SET [PROCESSED] = NULL
WHERE [PROCESSED] IS NOT NULL;
GO

CREATE OR ALTER TRIGGER [tps].[ORBC_TPS_MIGRATED_USERS_TRG] 
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


IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting updates to ORBC_TPS_MIGRATED_CLIENTS_TRG & ORBC_TPS_MIGRATED_USERS_TRG trigger.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (94, @VersionDescription, getutcdate())
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

COMMIT TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @Success AS BIT
SET @Success = 1
SET NOEXEC OFF
IF (@Success = 1) PRINT 'The database revert succeeded'
ELSE BEGIN
   IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
   PRINT 'The database revert failed'
END
GO