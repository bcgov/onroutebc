SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

-- Altered trigger has switched to use a cursor due to the additional
-- functionality required to resolve the following issues:
-- 1. Migrated amendments not marking the previous TPS permits SUPERSEDED
-- 2. Possibility of inserting duplicate records into ORBC_PERMIT
-- 3. Not maintaining exact ORBC permit number across amendments
-- All three issues are resolved with this new trigger
ALTER TRIGGER [tps].[ORBC_TPS_MIGRATED_PERMITS_TRG] 
   ON  [tps].[ORBC_TPS_MIGRATED_PERMITS] 
   AFTER INSERT AS 

SET NOCOUNT ON

-- Columns from inserted records
DECLARE @permit_type varchar(50)
DECLARE @permit_number varchar(19)
DECLARE @tps_permit_number varchar(11)
DECLARE @revision smallint
DECLARE @permit_issue_date_time datetime2(7)
DECLARE @start_date date
DECLARE @end_date date
DECLARE @plate varchar(50)
DECLARE @vin varchar(17)
DECLARE @permit_status_type varchar(50)
DECLARE @client_hash varchar(64)

-- Intermediate variables
DECLARE @company_id int
DECLARE @legal_name varchar(500)
DECLARE @client_number char(13)
DECLARE @permit_data nvarchar(4000)
DECLARE @prev_rev_count int
DECLARE @prev_permit_number varchar(19)
DECLARE @original_id int
DECLARE @previous_id int

DECLARE permit_cursor CURSOR FOR
	SELECT 
		PERMIT_TYPE, 
		NEW_PERMIT_NUMBER, 
		PERMIT_NUMBER, 
		PERMIT_GENERATION - 1, 
		ISSUED_DATE, 
		START_DATE, 
		END_DATE, 
		PLATE, 
		VIN, 
		CASE WHEN SERVICE = 'V' THEN 'VOIDED' ELSE 'ISSUED' END,
		CLIENT_HASH
	FROM inserted
	FOR READ ONLY
	
OPEN permit_cursor
	
FETCH NEXT FROM permit_cursor
INTO 
	@permit_type, 
	@permit_number, 
	@tps_permit_number, 
	@revision, 
	@permit_issue_date_time, 
	@start_date, 
	@end_date, 
	@plate, 
	@vin, 
	@permit_status_type,
	@client_hash

WHILE @@FETCH_STATUS=0
BEGIN
	-- Check if permit already exists in permit table, using combination
	-- of TPS permit ID and revision number as the unique identifier.
	-- If permit already exists, do not migrate a duplicate into the 
	-- ORBC_PERMIT table. Note we are not capturing modifications to the
	-- permit since these will come across as amendments for the changes
	-- we are interested in here (those that alter the permit PDF).
	IF NOT EXISTS (
		SELECT 
			ID 
		FROM 
			permit.ORBC_PERMIT p 
		WHERE 
			p.TPS_PERMIT_NUMBER = @tps_permit_number 
		AND 
			p.REVISION = @revision
	)

	BEGIN
		-- Grab company info of the permit holder, based on the
		-- TPS client ID hash
		SELECT
			@company_id = COMPANY_ID,
			@legal_name = LEGAL_NAME,
			@client_number = CLIENT_NUMBER
		FROM
			dbo.ORBC_COMPANY
		WHERE
			TPS_CLIENT_HASH = @client_hash

		-- Retrieve details of previous TPS revision, if any, which
		-- was migrated earlier.
		SET @original_id = NULL
		SET @previous_id = NULL
		SELECT @prev_rev_count = COUNT(ID) FROM permit.ORBC_PERMIT WHERE TPS_PERMIT_NUMBER = @tps_permit_number AND REVISION = (@revision - 1)
		-- If a previous TPS migrated permit revision exists in the database
		-- and has a valid ORBC permit number, make the incoming permit
		-- number match the previous one (except for the -AXX suffix).
		IF @prev_rev_count = 1 AND LEN(@permit_number) = 19
		BEGIN
			SELECT 
				@prev_permit_number = PERMIT_NUMBER,
				@original_id = ORIGINAL_ID,
				@previous_id = ID
			FROM 
				permit.ORBC_PERMIT 
			WHERE 
				TPS_PERMIT_NUMBER = @tps_permit_number AND REVISION = (@revision - 1)

			-- Maintain the pattern of matching the previous revision's orbc permit
			-- number exactly, with the exception of the revision number suffix
			SET @permit_number = SUBSTRING(@prev_permit_number, 1, 15) + SUBSTRING(@permit_number, 16, 4)
		END

		-- Add the migrated TPS permit into the ORBC_PERMIT table
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
		VALUES( 
			@company_id,
			@permit_type,
			@permit_number,
			@tps_permit_number,
			@revision,
			@permit_issue_date_time,
			'TPS',
			@permit_status_type)

		IF @revision = 0
			-- Set original ID value for rev0 permits
			UPDATE permit.ORBC_PERMIT SET ORIGINAL_ID = ID WHERE PERMIT_NUMBER = @permit_number
		ELSE
			-- Set both original ID value and previous rev ID value for amended permits.
			-- These will both be null if the previous TPS revision is not in ORBC
			-- (and this is acceptable).
			UPDATE permit.ORBC_PERMIT SET ORIGINAL_ID = @original_id, PREVIOUS_REV_ID = @previous_id WHERE PERMIT_NUMBER = @permit_number

		-- Construct JSON permit data for migrated permit
		SET @permit_data = CONCAT('{"companyName":"', STRING_ESCAPE(@legal_name, 'json'), '",',
				'"clientNumber":"', STRING_ESCAPE(@client_number, 'json'), '",',
				'"startDate":"', @start_date, '",',
				'"expiryDate":"', @end_date, '",',
				'"permitDuration":', DATEDIFF(day, @start_date, @end_date) + 1, ',',
				'"vehicleDetails":{',
					'"plate":"', STRING_ESCAPE(@plate, 'json'), '",',
					'"vin":"', STRING_ESCAPE(@vin, 'json'), '"',
				'}}')

		-- Insert permit data with JSON structure
		INSERT INTO
			permit.ORBC_PERMIT_DATA(
				PERMIT_ID,
				PERMIT_DATA)
		VALUES( 
			SCOPE_IDENTITY(), -- ID of permit from insert into ORBC_PERMIT table
			@permit_data)

		-- Set all previous revisions of TPS permits to superseded (if any)
		UPDATE 
			permit.ORBC_PERMIT 
		SET 
			PERMIT_STATUS_TYPE = 'SUPERSEDED' 
		WHERE 
			TPS_PERMIT_NUMBER = @tps_permit_number
		AND 
			REVISION = (@revision - 1)

	END -- IF NOT EXISTS

	FETCH NEXT FROM permit_cursor
	INTO 
		@permit_type, 
		@permit_number, 
		@tps_permit_number, 
		@revision, 
		@permit_issue_date_time, 
		@start_date, 
		@end_date, 
		@plate, 
		@vin, 
		@permit_status_type,
		@client_hash

END -- WHILE @@FETCH_STATUS=0

CLOSE permit_cursor
DEALLOCATE permit_cursor
GO

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Update TPS permit migration trigger.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (12, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate())