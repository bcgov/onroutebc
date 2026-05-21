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

IF OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_CLIENTS_TRG', N'TR') IS NOT NULL
BEGIN
    DROP TRIGGER [tps].[ORBC_TPS_MIGRATED_CLIENTS_TRG]
END
GO

IF OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_USERS_TRG', N'TR') IS NOT NULL
BEGIN
    DROP TRIGGER [tps].[ORBC_TPS_MIGRATED_USERS_TRG]
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_CLIENTS', N'ERROR_MESSAGE') IS NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
        ADD [ERROR_MESSAGE] nvarchar(1000) NULL;
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_CLIENTS', N'PROCESSING_START_UTC') IS NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
        ADD [PROCESSING_START_UTC] [datetime2](7) NULL;
END
GO


UPDATE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
SET [PROCESSED] = 0
WHERE [PROCESSED] IS NULL;
GO


ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
    ALTER COLUMN [PROCESSED] bit NOT NULL;
GO


ALTER TABLE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
    ADD CONSTRAINT [DF_ORBC_TPS_MIGRATED_CLIENTS_PROCESSED] DEFAULT 0 FOR [PROCESSED];
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_CLIENTS_PROCESSED' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_CLIENTS'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_ORBC_TPS_MIGRATED_CLIENTS_PROCESSED] 
        ON [tps].[ORBC_TPS_MIGRATED_CLIENTS] ([PROCESSED]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_CLIENTS_ERR_MSG' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_CLIENTS'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_ORBC_TPS_MIGRATED_CLIENTS_ERR_MSG] 
        ON [tps].[ORBC_TPS_MIGRATED_CLIENTS] ([PROCESSED])
        WHERE [ERROR_MESSAGE] IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_CLIENTS_PENDING' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_CLIENTS'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_ORBC_TPS_MIGRATED_CLIENTS_PENDING]
        ON [tps].[ORBC_TPS_MIGRATED_CLIENTS] ([PROCESSING_START_UTC], [MIGRATION_ID])
        INCLUDE ([ID], [CLIENT_HASH], [LEGAL_NAME], [EMAIL], [PHONE], [FAX], [ADDR_LINE1], [ADDR_LINE2], [CITY], [PROVINCE_ID], [POSTAL_CODE], [GUID], [REGION], [NEW_CLIENT_NUMBER])
        WHERE [PROCESSED] = 0 AND [ERROR_MESSAGE] IS NULL;
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_USERS', N'ERROR_MESSAGE') IS NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS]
        ADD [ERROR_MESSAGE] nvarchar(1000) NULL;
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_USERS', N'PROCESSING_START_UTC') IS NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS]
        ADD [PROCESSING_START_UTC] [datetime2](7) NULL;
END
GO

IF COL_LENGTH(N'tps.ORBC_TPS_MIGRATED_USERS', N'PROCESSED') IS NULL
BEGIN
    ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS]
        ADD [PROCESSED] bit NULL;
END
GO

UPDATE [tps].[ORBC_TPS_MIGRATED_USERS]
SET [PROCESSED] = 0
WHERE [PROCESSED] IS NULL;
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS]
    ALTER COLUMN [PROCESSED] bit NOT NULL;
GO

ALTER TABLE [tps].[ORBC_TPS_MIGRATED_USERS]
    ADD CONSTRAINT [DF_ORBC_TPS_MIGRATED_USERS_PROCESSED] DEFAULT 0 FOR [PROCESSED];
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_USERS_PROCESSED' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_USERS'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_ORBC_TPS_MIGRATED_USERS_PROCESSED]
        ON [tps].[ORBC_TPS_MIGRATED_USERS] ([PROCESSED]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_USERS_ERR_MSG' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_USERS'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_ORBC_TPS_MIGRATED_USERS_ERR_MSG]
        ON [tps].[ORBC_TPS_MIGRATED_USERS] ([PROCESSED])
        WHERE [ERROR_MESSAGE] IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ORBC_TPS_MIGRATED_USERS_PENDING' AND object_id = OBJECT_ID(N'tps.ORBC_TPS_MIGRATED_USERS'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_ORBC_TPS_MIGRATED_USERS_PENDING]
        ON [tps].[ORBC_TPS_MIGRATED_USERS] ([PROCESSING_START_UTC], [MIGRATION_ID])
        INCLUDE ([CLIENT_ID], [FIRST_NAME], [LAST_NAME], [GUID])
        WHERE [PROCESSED] = 0 AND [ERROR_MESSAGE] IS NULL;
END
GO

CREATE OR ALTER PROCEDURE [tps].[PROCESS_MIGRATED_TPS_CLIENTS_AND_USERS]    
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @BatchSize int = 500;
    DECLARE @ClaimTimeoutMinutes int = 30;

    DECLARE @MigrationId bigint;
    DECLARE @ClientHash nvarchar(64);
    DECLARE @LegalName nvarchar(101);
    DECLARE @Email nvarchar(320);
    DECLARE @Phone varchar(30);
    DECLARE @Fax varchar(30);
    DECLARE @AddrLine1 varchar(44);
    DECLARE @AddrLine2 varchar(44);
    DECLARE @City varchar(44);
    DECLARE @ProvinceId varchar(5);
    DECLARE @PostalCode varchar(7);
    DECLARE @Guid varchar(64);
    DECLARE @Region char(1);
    DECLARE @NewClientNumber char(13);

    DECLARE @CompanyId int;
    DECLARE @AddrId int;    
    DECLARE @Directory varchar(10);
    DECLARE @GeneratedGuid varchar(64);
    DECLARE @ErrorMessage nvarchar(1000);
    DECLARE @Msg nvarchar(1000);

    -- Table to hold batch rows for cursor processing
    DECLARE @Work TABLE (
        MIGRATION_ID bigint PRIMARY KEY,
        CLIENT_HASH nvarchar(64),
        LEGAL_NAME nvarchar(101),
        EMAIL nvarchar(320),
        PHONE varchar(30),
        FAX varchar(30),
        ADDR_LINE1 varchar(44),
        ADDR_LINE2 varchar(44),
        CITY varchar(44),
        PROVINCE_ID varchar(5),
        POSTAL_CODE varchar(7),
        GUID varchar(64),
        REGION char(1),
        NEW_CLIENT_NUMBER char(13)
    );

    WHILE 1 = 1
    BEGIN
        -- Clear the work table for this batch
        DELETE FROM @Work;

        -- Phase 1: pick the next batch and mark them as claimed
        ;WITH NextBatch AS (
            SELECT TOP (@BatchSize)
                t.MIGRATION_ID,
                t.CLIENT_HASH,
                t.LEGAL_NAME,
                t.EMAIL,
                t.PHONE,
                t.FAX,
                t.ADDR_LINE1,
                t.ADDR_LINE2,
                t.CITY,
                t.PROVINCE_ID,
                t.POSTAL_CODE,
                t.GUID,
                t.REGION,
                t.NEW_CLIENT_NUMBER
            FROM [tps].[ORBC_TPS_MIGRATED_CLIENTS] AS t WITH (READPAST, UPDLOCK, ROWLOCK)
            WHERE t.PROCESSED = 0
              AND (t.PROCESSING_START_UTC IS NULL OR t.PROCESSING_START_UTC < DATEADD(MINUTE, -@ClaimTimeoutMinutes, GETUTCDATE()))
              AND t.ERROR_MESSAGE IS NULL
            ORDER BY t.MIGRATION_ID
        )
        UPDATE t
        SET PROCESSING_START_UTC = GETUTCDATE()
        OUTPUT
            inserted.MIGRATION_ID,
            inserted.CLIENT_HASH,
            inserted.LEGAL_NAME,
            inserted.EMAIL,
            inserted.PHONE,
            inserted.FAX,
            inserted.ADDR_LINE1,
            inserted.ADDR_LINE2,
            inserted.CITY,
            inserted.PROVINCE_ID,
            inserted.POSTAL_CODE,
            inserted.GUID,
            inserted.REGION,
            inserted.NEW_CLIENT_NUMBER
        INTO @Work
        FROM [tps].[ORBC_TPS_MIGRATED_CLIENTS] AS t
        JOIN NextBatch nb
            ON nb.MIGRATION_ID = t.MIGRATION_ID;

        -- If no rows were claimed, we are done
        IF @@ROWCOUNT = 0
            BREAK;

        -- Phase 2: loop over each row in this batch
        DECLARE work_cursor CURSOR LOCAL FAST_FORWARD FOR
            SELECT MIGRATION_ID,
                   CLIENT_HASH,
                   LEGAL_NAME,
                   EMAIL,
                   PHONE,
                   FAX,
                   ADDR_LINE1,
                   ADDR_LINE2,
                   CITY,
                   PROVINCE_ID,
                   POSTAL_CODE,
                   GUID,
                   REGION,
                   NEW_CLIENT_NUMBER
            FROM @Work
            ORDER BY MIGRATION_ID;

        OPEN work_cursor;

        FETCH NEXT FROM work_cursor INTO
            @MigrationId, @ClientHash, @LegalName, @Email, @Phone, @Fax,
            @AddrLine1, @AddrLine2, @City, @ProvinceId, @PostalCode,
            @Guid, @Region, @NewClientNumber;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Try to process this single record
            BEGIN TRY
                DECLARE @NewAddr TABLE (AddrId int);
                BEGIN TRANSACTION;

                -- Reset variables for this record
                SET @CompanyId = NULL;
                SET @AddrId = NULL;
                SET @Directory = NULL;
                SET @GeneratedGuid = NULL;
                SET @Msg = NULL;

                -- Retrieve the company ID from the ORBC company table if this TPS client
                -- has already been migrated into ORBC
                SELECT 
                    @CompanyId = COMPANY_ID
                FROM dbo.ORBC_COMPANY
                WHERE TPS_CLIENT_HASH = @ClientHash;

                -- Fail fast if there is a company mapping for this TPS client hash.
                IF @CompanyId IS NOT NULL
				BEGIN					
					SET @Msg = CONCAT('Company already exists for TPS_CLIENT_HASH=', ISNULL(@ClientHash, '<NULL>'));
					THROW 51000, @Msg, 1;
				END


                IF @CompanyId IS NULL
                BEGIN
                    -- The company does not already exist in the ORBC database

                    -- Create the address record
                    INSERT INTO dbo.ORBC_ADDRESS(
                        ADDRESS_LINE_1, 
                        ADDRESS_LINE_2, 
                        CITY, 
                        PROVINCE_TYPE, 
                        POSTAL_CODE)
                    OUTPUT inserted.ADDRESS_ID INTO @NewAddr(AddrId)                        
                    VALUES (
                        @AddrLine1,
                        @AddrLine2,
                        @City,
                        (SELECT ISNULL((SELECT TOP 1 PROVINCE_TYPE FROM dbo.ORBC_PROVINCE_TYPE WHERE PROVINCE_TYPE = @ProvinceId), 'XX-XX')),
                        @PostalCode);

                    -- Retrieve the newly created address id
                    SELECT @AddrId = AddrId FROM @NewAddr;

                    -- Create a new company guid if the business guid is null
                    IF @Guid IS NULL
                    BEGIN
                        SET @GeneratedGuid = CONVERT(varchar(32), REPLACE(CONVERT(varchar(36), NEWID()), '-', ''));
                        SET @Directory = 'ORBC';
                    END
                    ELSE
                    BEGIN
                        -- Guid is set in TPS, this is a Business BCEID guid
                        SET @GeneratedGuid = @Guid;
                        SET @Directory = 'BBCEID';
                    END

                    -- Insert the new company
                    INSERT INTO dbo.ORBC_COMPANY(
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
                        @GeneratedGuid,
                        @NewClientNumber,
                        @ClientHash,
                        @LegalName,
                        @Directory,
                        @AddrId,
                        @Phone,
                        @Fax,
                        @Email,
                        @Region,
                        1);
                END

                -- Mark the source row as successfully processed
                UPDATE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
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
                --SET @ErrorMessage = LEFT(ERROR_MESSAGE(), 1000);

                SET @ErrorMessage = LEFT(CONCAT('Error ',ERROR_NUMBER(),' at line ',ERROR_LINE(),': ',ERROR_MESSAGE()),1000);

                -- Mark the record with the error.
                -- Clear PROCESSING_START_UTC so the row can be retried later.
                UPDATE [tps].[ORBC_TPS_MIGRATED_CLIENTS]
                SET ERROR_MESSAGE = @ErrorMessage,
                    PROCESSING_START_UTC = NULL,
                    DB_LAST_UPDATE_TIMESTAMP = GETUTCDATE()
                WHERE MIGRATION_ID = @MigrationId;
            END CATCH;

            -- Next row
            FETCH NEXT FROM work_cursor INTO
                @MigrationId, @ClientHash, @LegalName, @Email, @Phone, @Fax,
                @AddrLine1, @AddrLine2, @City, @ProvinceId, @PostalCode,
                @Guid, @Region, @NewClientNumber;
        END

        -- Clean up cursor
        CLOSE work_cursor;
        DEALLOCATE work_cursor;
    END

    -- Process migrated TPS users as well
    DECLARE @UserMigrationId bigint;
    DECLARE @UserClientId bigint;
    DECLARE @UserFirstName nvarchar(50);
    DECLARE @UserLastName nvarchar(50);
    DECLARE @UserGuid nvarchar(32);
    DECLARE @ExistingCount int;

    DECLARE @UserWork TABLE (
        MIGRATION_ID bigint PRIMARY KEY,
        CLIENT_ID bigint,
        FIRST_NAME nvarchar(50),
        LAST_NAME nvarchar(50),
        GUID nvarchar(32)
    );

    WHILE 1 = 1
    BEGIN
        DELETE FROM @UserWork;

        ;WITH NextUserBatch AS (
            SELECT TOP (@BatchSize)
                t.MIGRATION_ID,
                t.CLIENT_ID,
                t.FIRST_NAME,
                t.LAST_NAME,
                t.GUID
            FROM [tps].[ORBC_TPS_MIGRATED_USERS] AS t WITH (READPAST, UPDLOCK, ROWLOCK)
            WHERE t.PROCESSED = 0
              AND (t.PROCESSING_START_UTC IS NULL OR t.PROCESSING_START_UTC < DATEADD(MINUTE, -@ClaimTimeoutMinutes, GETUTCDATE()))
              AND t.ERROR_MESSAGE IS NULL
            ORDER BY t.MIGRATION_ID
        )
        UPDATE t
        SET PROCESSING_START_UTC = GETUTCDATE()
        OUTPUT
            inserted.MIGRATION_ID,
            inserted.CLIENT_ID,
            inserted.FIRST_NAME,
            inserted.LAST_NAME,
            inserted.GUID
        INTO @UserWork
        FROM [tps].[ORBC_TPS_MIGRATED_USERS] AS t
        JOIN NextUserBatch nub
            ON nub.MIGRATION_ID = t.MIGRATION_ID;

        IF @@ROWCOUNT = 0
            BREAK;

        DECLARE user_cursor CURSOR LOCAL FAST_FORWARD FOR
            SELECT MIGRATION_ID,
                   CLIENT_ID,
                   FIRST_NAME,
                   LAST_NAME,
                   GUID
            FROM @UserWork
            ORDER BY MIGRATION_ID;

        OPEN user_cursor;

        FETCH NEXT FROM user_cursor INTO
            @UserMigrationId, @UserClientId, @UserFirstName, @UserLastName, @UserGuid;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            BEGIN TRY
                SET @CompanyId = NULL;
                SET @ClientHash = NULL;
                SET @Msg = NULL;
                SET @ExistingCount = 0;

                SELECT @CompanyId = c.COMPANY_ID, 
                       @ClientHash = cli.CLIENT_HASH
                FROM dbo.ORBC_COMPANY c
                JOIN tps.ORBC_TPS_MIGRATED_CLIENTS cli
                  ON cli.CLIENT_HASH = c.TPS_CLIENT_HASH
                WHERE cli.ID = @UserClientId;

                -- Fail fast if there is no company mapping for this TPS client hash.
                IF @CompanyId IS NULL
				BEGIN					
					SET @Msg = CONCAT('Missing company mapping for TPS_CLIENT_HASH=', ISNULL(@ClientHash, '<NULL>'));
					THROW 51000, @Msg, 1;
				END                
              
                BEGIN
                    BEGIN TRANSACTION;

                    SELECT @ExistingCount = COUNT(1)
                    FROM dbo.ORBC_PENDING_USER
                    WHERE USER_GUID = @UserGuid
                      AND COMPANY_ID = @CompanyId;

                    IF @ExistingCount = 0
                    BEGIN
                        INSERT INTO dbo.ORBC_PENDING_USER(
                            COMPANY_ID,
                            USERNAME,
                            USER_GUID,
                            USER_AUTH_GROUP_TYPE,
                            FIRST_NAME,
                            LAST_NAME)
                        VALUES (
                            @CompanyId,
                            'TPS Migrated User',
                            @UserGuid,
                            'ORGADMIN',
                            @UserFirstName,
                            @UserLastName);
                    END

                    UPDATE [tps].[ORBC_TPS_MIGRATED_USERS]
                    SET PROCESSED = 1,
                        PROCESSING_START_UTC = NULL,
                        ERROR_MESSAGE = NULL
                    WHERE MIGRATION_ID = @UserMigrationId;

                    COMMIT TRANSACTION;
                END
            END TRY
            BEGIN CATCH
                IF XACT_STATE() <> 0
                    ROLLBACK TRANSACTION;

                SET @ErrorMessage = LEFT(CONCAT('Error ', ERROR_NUMBER(), ' at line ', ERROR_LINE(), ': ', ERROR_MESSAGE()), 1000);

                UPDATE [tps].[ORBC_TPS_MIGRATED_USERS]
                SET ERROR_MESSAGE = @ErrorMessage,
                    PROCESSING_START_UTC = NULL,
                    DB_LAST_UPDATE_TIMESTAMP = GETUTCDATE()
                WHERE MIGRATION_ID = @UserMigrationId;
            END CATCH;

            FETCH NEXT FROM user_cursor INTO
                @UserMigrationId, @UserClientId, @UserFirstName, @UserLastName, @UserGuid;
        END

        CLOSE user_cursor;
        DEALLOCATE user_cursor;
    END
END
GO


DECLARE @VersionDescription VARCHAR(255);
SET @VersionDescription = 'Replace ORBC_TPS_MIGRATED_CLIENTS and ORBC_TPS_MIGRATED_USERS_TRG trigger with batch stored procedure and error tracking.';

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [UPDATE_SCRIPT], [REVERT_SCRIPT], [RELEASE_DATE]) VALUES (95  , @VersionDescription, '$(UPDATE_SCRIPT)', '$(REVERT_SCRIPT)', getutcdate());
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