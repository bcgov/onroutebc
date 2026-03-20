SET NOCOUNT ON
GO
SET QUOTED_IDENTIFIER ON
GO

INSERT INTO permit.ORBC_PERMIT_DATA (
  PERMIT_ID, 
  PERMIT_DATA)
VALUES (
  (SELECT ID FROM permit.ORBC_PERMIT WHERE PERMIT_NUMBER = 'P0-12345678-004'),
  N'{"companyName":"Grimes-Spinka Trucking","clientNumber":"E3-000082-403","startDate":"2025-01-01","expiryDate":"2025-01-30","permitDuration":30,"vehicleDetails":{"plate":"A66001","vin":"12333"}}')

INSERT INTO permit.ORBC_PERMIT_DATA (
  PERMIT_ID, 
  PERMIT_DATA)
VALUES (
  (SELECT ID FROM permit.ORBC_PERMIT WHERE PERMIT_NUMBER = 'P0-12345678-005'),
  N'{"companyName":"Bartell and Sons Trucking","clientNumber":"R3-000089-389","startDate":"2025-01-01","expiryDate":"2025-01-30","permitDuration":30,"vehicleDetails":{"plate":"A66001","vin":"12333"}}')

INSERT INTO permit.ORBC_PERMIT_DATA (
  PERMIT_ID, 
  PERMIT_DATA)
VALUES (
  (SELECT ID FROM permit.ORBC_PERMIT WHERE PERMIT_NUMBER = 'P0-12345678-006'),
  N'{"companyName":"Kemmer-Stiedemann Trucking","clientNumber":"B3-000003-406","startDate":"2025-01-01","expiryDate":"2025-01-30","permitDuration":30,"vehicleDetails":{"plate":"A66001","vin":"12333"}}')

INSERT INTO permit.ORBC_PERMIT_DATA (
  PERMIT_ID, 
  PERMIT_DATA)
VALUES (
  (SELECT ID FROM permit.ORBC_PERMIT WHERE PERMIT_NUMBER = 'P0-12345678-007'),
  N'{"companyName":"Rodriguez-Kertzmann Trucking","clientNumber":"R1-000010-277","startDate":"2025-01-01","expiryDate":"2025-01-30","permitDuration":30,"vehicleDetails":{"plate":"A66001","vin":"12333"}}')

INSERT INTO permit.ORBC_PERMIT_DATA (
  PERMIT_ID, 
  PERMIT_DATA)
VALUES (
  (SELECT ID FROM permit.ORBC_PERMIT WHERE PERMIT_NUMBER = 'P0-12345678-008'),
  N'{"companyName":"Texas Flood","clientNumber":"E3-000082-999","startDate":"2025-01-01","expiryDate":"2025-01-30","permitDuration":30,"vehicleDetails":{"plate":"A66001","vin":"12333"}}')

GO