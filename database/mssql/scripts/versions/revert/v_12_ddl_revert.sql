SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

ALTER TRIGGER [tps].[ORBC_TPS_MIGRATED_PERMITS_TRG] 
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

DECLARE @VersionDescription VARCHAR(255)
SET @VersionDescription = 'Reverting update to TPS permit migration trigger.'

INSERT [dbo].[ORBC_SYS_VERSION] ([VERSION_ID], [DESCRIPTION], [RELEASE_DATE]) VALUES (11, @VersionDescription, getutcdate())
