SET
  NOCOUNT ON
GO
SET
  IDENTITY_INSERT [dbo].[ORBC_FEATURE_FLAG] ON
INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '1',
    'CREDIT-ACCOUNT',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '2',
    'APPLICATION-SEARCH',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '3',
    'POLICY-CONFIG',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '4',
    'LOA',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

  INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '5',
    'APPLICATION-QUEUE',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

   INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '6',
    'TROS',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '7',
    'TROW',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

   INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '8',
    'STOS',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );


INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '9',
    'MFP',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );
  
INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '10',
    'LCV',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '11',
    'NO-FEE',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '12',
    'STAFF-CAN-PAY',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );
INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '13',
    'CVCLIENT-PAY-IN-PERSON',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );
INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '14',
    'BRIDGE-FORMULA-CALCULATION-TOOL',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '15',
    'STFR',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '16',
    'QRFR',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '17',
    'GARMS_CASH_CRON_JOB',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );    

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '18',
    'GARMS_CREDIT_CRON_JOB',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '19',
    'NRSCV',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '20',
    'NRQCV',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );

INSERT INTO
  [dbo].[ORBC_FEATURE_FLAG] (
    [FEATURE_ID],
    [FEATURE_KEY],
    [FEATURE_VALUE],
    [CONCURRENCY_CONTROL_NUMBER],
    [DB_CREATE_USERID],
    [DB_CREATE_TIMESTAMP],
    [DB_LAST_UPDATE_USERID],
    [DB_LAST_UPDATE_TIMESTAMP]
  )
VALUES
  (
    '21',
    'AUDIT_LOGIN',
    'ENABLED',
    NULL,
    N'dbo',
    GETUTCDATE(),
    N'dbo',
    GETUTCDATE()
  );


SET
  IDENTITY_INSERT [dbo].[ORBC_FEATURE_FLAG] OFF
GO