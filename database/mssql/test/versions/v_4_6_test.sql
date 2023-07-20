SET NOCOUNT ON

SET IDENTITY_INSERT $(DB_NAME).[permit].[ORBC_PERMIT] ON 
INSERT INTO $(DB_NAME).permit.ORBC_PERMIT(ID, PERMIT_TYPE_ID, APPLICATION_ORIGIN_ID, PERMIT_APPROVAL_SOURCE_ID, APPLICATION_NUMBER, PERMIT_NUMBER) VALUES(35, 'TROS', 'ONLINE', 'PPC', 'A2-00000035-321', 'P1-00000035-123')
INSERT INTO $(DB_NAME).permit.ORBC_PERMIT(ID, PERMIT_TYPE_ID, APPLICATION_ORIGIN_ID, REVISION, PREVIOUS_REV_ID,  PERMIT_APPROVAL_SOURCE_ID, APPLICATION_NUMBER) VALUES(36, 'TROS', 'ONLINE', 1, 35, 'PPC', 'A2-00000035-123-R01')
SET IDENTITY_INSERT $(DB_NAME).[permit].[ORBC_PERMIT] OFF

SELECT PERMIT_NUMBER FROM $(DB_NAME).permit.ORBC_PERMIT WHERE ID = 36

-- Clean up
DELETE FROM $(DB_NAME).[permit].[ORBC_PERMIT]