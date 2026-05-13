SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO
SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL READ COMMITTED
GO
BEGIN TRANSACTION
GO

IF OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_PERMITS_TRG', N'TR') IS NOT NULL
BEGIN
    DROP TRIGGER [tps].[ORBC_TPS_MIGRATED_PERMITS_TRG]
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_PERMITS', N'ERROR_MESSAGE') IS NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS]
        ADD [ERROR_MESSAGE] nvarchar(1000) NULL;
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_PERMITS', N'PROCESSING_START_UTC') IS NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS]
        ADD [PROCESSING_START_UTC] [datetime2](7) NULL;
END
GO


UPDATE [tps].[ORBC_TPS_MIGRATED_PERMITS]
SET [PROCESSED] = 0
WHERE [PROCESSED] IS NULL;
GO


ALTER TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS]
    ALTER COLUMN [PROCESSED] bit NOT NULL;
GO


ALTER TABLE [tps].[ORBC_TPS_MIGRATED_PERMITS]
    ADD CONSTRAINT [DF_ORBC_TPS_MIGRATED_PERMITS_PROCESSED] DEFAULT 0 FOR [PROCESSED];
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_PERMITS_PROCESSED' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_PERMITS'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_ORBC_TPS_MIGRATED_PERMITS_PROCESSED] 
        ON [tps].[ORBC_TPS_MIGRATED_PERMITS] ([PROCESSED]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_PERMITS_ERR_MSG' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_PERMITS'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_ORBC_TPS_MIGRATED_PERMITS_ERR_MSG] 
        ON [tps].[ORBC_TPS_MIGRATED_PERMITS] ([PROCESSED])
        WHERE [ERROR_MESSAGE] IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_PERMITS_PENDING' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_PERMITS'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_ORBC_TPS_MIGRATED_PERMITS_PENDING]
        ON [tps].[ORBC_TPS_MIGRATED_PERMITS] ([PROCESSING_START_UTC], [MIGRATION_ID])
        INCLUDE ([PERMIT_TYPE], [NEW_PERMIT_NUMBER], [PERMIT_NUMBER], [PERMIT_GENERATION], [ISSUED_DATE], [START_DATE], [END_DATE], [PLATE], [VIN], [SERVICE], [CLIENT_HASH])
        WHERE [PROCESSED] = 0 AND [PROCESSING_START_UTC] IS NULL;
END
GO

CREATE OR ALTER PROCEDURE [tps].[ProcessMigratedTPSPermits]    
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT OFF;

    DECLARE @BatchSize int = 500;

    DECLARE @MigrationId bigint;
    DECLARE @PermitType nvarchar(50);
    DECLARE @NewPermitNumber varchar(19);
    DECLARE @TpsPermitNumber nvarchar(11);
    DECLARE @Revision smallint;
    DECLARE @PermitIssueDateTime datetime2(7);
    DECLARE @StartDate date;
    DECLARE @EndDate date;
    DECLARE @Plate nvarchar(50);
    DECLARE @Vin nvarchar(17);
    DECLARE @PermitStatusType nvarchar(50);
    DECLARE @ClientHash nvarchar(64);

    DECLARE @CompanyId int;
    DECLARE @LegalName nvarchar(500);
    DECLARE @ClientNumber char(13);
    DECLARE @PermitData nvarchar(4000);
    DECLARE @PrevRevisionCount int;
    DECLARE @PrevPermitNumber varchar(19);
    DECLARE @OriginalId int;
    DECLARE @PreviousId int;
    DECLARE @InsertedPermitId int;
    DECLARE @ErrorMessage nvarchar(1000);

    -- Table to hold batch rows for cursor processing
    DECLARE @Work TABLE (
        MIGRATION_ID bigint PRIMARY KEY,
        PERMIT_TYPE nvarchar(50),
        NEW_PERMIT_NUMBER varchar(19),
        PERMIT_NUMBER nvarchar(11),
        PERMIT_GENERATION smallint,
        ISSUED_DATE datetime2(7),
        START_DATE date,
        END_DATE date,
        PLATE nvarchar(50),
        VIN nvarchar(17),
        PERMIT_STATUS_TYPE nvarchar(50),
        CLIENT_HASH nvarchar(64)
    );

    -- For cleaner OUTPUT into scalar variable
    DECLARE @InsertedIds TABLE (ID int NOT NULL);

    WHILE 1 = 1
    BEGIN
        -- Clear the work table for this batch
        DELETE FROM @Work;

        -- Phase 1: pick the next batch and mark them as claimed
        ;WITH NextBatch AS (
            SELECT TOP (@BatchSize)
                t.MIGRATION_ID,
                t.PERMIT_TYPE,
                t.NEW_PERMIT_NUMBER,
                t.PERMIT_NUMBER,
                t.PERMIT_GENERATION,
                t.ISSUED_DATE,
                t.START_DATE,
                t.END_DATE,
                t.PLATE,
                t.VIN,
                CASE WHEN t.SERVICE = 'V' THEN 'VOIDED' ELSE 'ISSUED' END AS PERMIT_STATUS_TYPE,
                t.CLIENT_HASH
            FROM [tps].[ORBC_TPS_MIGRATED_PERMITS] AS t WITH (READPAST, UPDLOCK, ROWLOCK)
            WHERE t.PROCESSED = 0
              AND t.PROCESSING_START_UTC IS NULL
              AND t.ERROR_MESSAGE IS NULL
            ORDER BY t.MIGRATION_ID
        )
        UPDATE t
        SET PROCESSING_START_UTC = GETUTCDATE()
        OUTPUT
            inserted.MIGRATION_ID,
            inserted.PERMIT_TYPE,
            inserted.NEW_PERMIT_NUMBER,
            inserted.PERMIT_NUMBER,
            inserted.PERMIT_GENERATION,
            inserted.ISSUED_DATE,
            inserted.START_DATE,
            inserted.END_DATE,
            inserted.PLATE,
            inserted.VIN,
            CASE WHEN inserted.SERVICE = 'V' THEN 'VOIDED' ELSE 'ISSUED' END,
            inserted.CLIENT_HASH
        INTO @Work
        FROM [tps].[ORBC_TPS_MIGRATED_PERMITS] AS t
        JOIN NextBatch nb
            ON nb.MIGRATION_ID = t.MIGRATION_ID;

        -- If no rows were claimed, we are done
        IF @@ROWCOUNT = 0
            BREAK;

        -- Phase 2: loop over each row in this batch
        DECLARE work_cursor CURSOR LOCAL FAST_FORWARD FOR
            SELECT MIGRATION_ID,
                   PERMIT_TYPE,
                   NEW_PERMIT_NUMBER,
                   PERMIT_NUMBER,
                   PERMIT_GENERATION,
                   ISSUED_DATE,
                   START_DATE,
                   END_DATE,
                   PLATE,
                   VIN,
                   PERMIT_STATUS_TYPE,
                   CLIENT_HASH
            FROM @Work
            ORDER BY MIGRATION_ID;

        OPEN work_cursor;

        FETCH NEXT FROM work_cursor INTO
            @MigrationId, @PermitType, @NewPermitNumber, @TpsPermitNumber,
            @Revision, @PermitIssueDateTime, @StartDate, @EndDate,
            @Plate, @Vin, @PermitStatusType, @ClientHash;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Try to process this single record
            BEGIN TRY
                BEGIN TRANSACTION;

                -- Reset variables for this record
                SET @CompanyId = NULL;
                SET @LegalName = NULL;
                SET @ClientNumber = NULL;
                SET @PermitData = NULL;
                SET @PrevRevisionCount = 0;
                SET @PrevPermitNumber = NULL;
                SET @OriginalId = NULL;
                SET @PreviousId = NULL;
                SET @InsertedPermitId = NULL;
                DELETE FROM @InsertedIds;

                -- Look up the company
                SELECT
                    @CompanyId = COMPANY_ID,
                    @LegalName = LEGAL_NAME,
                    @ClientNumber = CLIENT_NUMBER
                FROM dbo.ORBC_COMPANY
                WHERE TPS_CLIENT_HASH = @ClientHash;

                -- Fail fast if there is no company mapping for this TPS client hash.
                IF @CompanyId IS NULL
				BEGIN
					DECLARE @Msg nvarchar(1000);
					SET @Msg = CONCAT('Missing company mapping for TPS_CLIENT_HASH=', ISNULL(@ClientHash, '<NULL>'));
					THROW 51000, @Msg, 1;
				END

                -- Only insert if this revision does not exist already
                IF NOT EXISTS (
                    SELECT 1
                    FROM permit.ORBC_PERMIT p
                    WHERE p.TPS_PERMIT_NUMBER = @TpsPermitNumber
                      AND p.REVISION = @Revision
                )
                BEGIN
                    -- Count previous revision (Revision - 1)
                    SELECT @PrevRevisionCount = COUNT_BIG(1)
                    FROM permit.ORBC_PERMIT
                    WHERE TPS_PERMIT_NUMBER = @TpsPermitNumber
                      AND REVISION = @Revision - 1;

						-- If a previous TPS migrated permit revision exists in the database
						-- and has a valid ORBC permit number, make the incoming permit
						-- number match the previous one (except for the -AXX suffix).
                    IF @PrevRevisionCount = 1 AND LEN(@NewPermitNumber) = 19
                    BEGIN
                        SELECT
                            @PrevPermitNumber = PERMIT_NUMBER,
                            @OriginalId = ORIGINAL_ID,
                            @PreviousId = ID
                        FROM permit.ORBC_PERMIT
                        WHERE TPS_PERMIT_NUMBER = @TpsPermitNumber
                          AND REVISION = @Revision - 1;
                    
						-- If this is an amendment and both are 19‑char numbers,
						-- reuse the original 15‑char base + new 4‑char suffix.                  
                        SET @NewPermitNumber = SUBSTRING(@PrevPermitNumber, 1, 15)
                                             + SUBSTRING(@NewPermitNumber, 16, 4);					
					END
                   

                    -- Insert the migrated permit
                    INSERT INTO permit.ORBC_PERMIT (
                        COMPANY_ID,
                        PERMIT_TYPE,
                        PERMIT_NUMBER,
                        TPS_PERMIT_NUMBER,
                        REVISION,
                        PERMIT_ISSUE_DATE_TIME,
                        PERMIT_APPROVAL_SOURCE_TYPE,
                        PERMIT_STATUS_TYPE
                    )
                    OUTPUT inserted.ID INTO @InsertedIds(ID)
                    VALUES (
                        @CompanyId,
                        @PermitType,
                        @NewPermitNumber,
                        @TpsPermitNumber,
                        @Revision,
                        @PermitIssueDateTime,
                        'TPS',
                        @PermitStatusType
                    );

                    SELECT TOP (1) @InsertedPermitId = ID
                    FROM @InsertedIds;

                    -- For revision 0: set ORIGINAL_ID to itself
                    IF @Revision = 0
                    BEGIN
                        UPDATE permit.ORBC_PERMIT
                        SET ORIGINAL_ID = ID
                        WHERE ID = @InsertedPermitId;
                    END
                    ELSE
                    BEGIN
                        -- For amendments, link to ORIGINAL_ID and previous revision
                        UPDATE permit.ORBC_PERMIT
                        SET ORIGINAL_ID = @OriginalId,
                            PREVIOUS_REV_ID = @PreviousId
                        WHERE ID = @InsertedPermitId;
                    END

                    -- Build JSON‑style permit data
                    SET @PermitData = CONCAT(
                        '{"companyName":"', STRING_ESCAPE(ISNULL(@LegalName, ''), 'json'), '",
                        "clientNumber":"', STRING_ESCAPE(ISNULL(@ClientNumber, ''), 'json'), '",
                        "startDate":"', CONVERT(varchar(10), @StartDate, 23), '",
                        "expiryDate":"', CONVERT(varchar(10), @EndDate, 23), '",
                        "permitDuration":', DATEDIFF(day, @StartDate, @EndDate) + 1, ',
                        "vehicleDetails":{
                            "plate":"', STRING_ESCAPE(ISNULL(@Plate, ''), 'json'), '",
                            "vin":"', STRING_ESCAPE(ISNULL(@Vin, ''), 'json'), '"
                        }}'
                    );

                    -- Store the permit data
                    INSERT INTO permit.ORBC_PERMIT_DATA (
                        PERMIT_ID,
                        PERMIT_DATA
                    )
                    VALUES (
                        @InsertedPermitId,
                        @PermitData
                    );

                    -- Mark previous revision as superseded
                    UPDATE permit.ORBC_PERMIT
                    SET PERMIT_STATUS_TYPE = 'SUPERSEDED'
                    WHERE TPS_PERMIT_NUMBER = @TpsPermitNumber
                      AND REVISION = @Revision - 1;
                END

                -- Mark the source row as successfully processed
                UPDATE [tps].[ORBC_TPS_MIGRATED_PERMITS]
                SET PROCESSED = 1,
                    PROCESSED_DATE = GETUTCDATE(),
                    PROCESSING_START_UTC = NULL,  -- Clear claimed flag
                    ERROR_MESSAGE = NULL
                WHERE MIGRATION_ID = @MigrationId;

                COMMIT TRANSACTION;
            END TRY
            BEGIN CATCH
                -- Something went wrong for this record
                IF XACT_STATE() <> 0
                    ROLLBACK TRANSACTION;

                -- Capture the error message
                SET @ErrorMessage = LEFT(ERROR_MESSAGE(), 1000);

                -- Mark the record with the error.
                -- Clear PROCESSING_START_UTC so the row can be retried later.
                UPDATE [tps].[ORBC_TPS_MIGRATED_PERMITS]
                SET ERROR_MESSAGE = @ErrorMessage,
                    PROCESSING_START_UTC = NULL,
                    DB_LAST_UPDATE_TIMESTAMP = GETUTCDATE()
                WHERE MIGRATION_ID = @MigrationId;
            END CATCH;

            -- Next row
            FETCH NEXT FROM work_cursor INTO
                @MigrationId, @PermitType, @NewPermitNumber, @TpsPermitNumber,
                @Revision, @PermitIssueDateTime, @StartDate, @EndDate,
                @Plate, @Vin, @PermitStatusType, @ClientHash;
        END

        -- Clean up cursor
        CLOSE work_cursor;
        DEALLOCATE work_cursor;
    END
END
GO

DECLARE @VersionDescription VARCHAR(255);
SET @VersionDescription = 'Replace ORBC_TPS_MIGRATED_PERMITS trigger with batch stored procedure and error tracking.';

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (94, @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate());
IF @@ERROR <> 0 SET NOEXEC ON
GO

COMMIT TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @Success AS BIT;
SET @Success = 1;
SET NOEXEC OFF;
IF (@Success = 1) PRINT 'The database update succeeded';
ELSE BEGIN
   IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
   PRINT 'The database update failed';
END
GO