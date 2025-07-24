## Summary of Scripted Incremental Database Changes by Version

### Version 1:
- Initialize versions system table

### Version 2:
- Initial creation of schema entities for manage vehicles feature

### Version 3:
- Initial creation of schema entities for manage profile feature

### Version 4:
- Initial creation of entities for applying for and issuing permits

### Version 5:
- Initial creation of entities for generating a document

### Version 6:
- Initial creation of entities for Document Management System (DMS)

### Version 7:
- Initial creation of entities for Permit Payment

### Version 8:
- Creation of full text search index on ORBC_PERMIT_DATA table.

### Version 9:
- Creation of tables to store TPS migration staging data.

### Version 10:
- Create function to format a UTC date into Pacific time for reports.

### Version 11:
- Add audit and history tables, with triggers

### Version 12:
- Update TPS permit migration trigger.

### Version 13:
- Include auth groups HQADMIN and FINANCE

### Version 14:
- Initial creation of entities for feature flag

### Version 15:
- Allow for company suspensions

### Version 16:
- Addition of user status to company user table

### Version 17:
- Remove unused IDIRBASIC auth group

### Version 18:
- Addition of deleted status to permit status table

### Version 19:
- Merge ORBC_IDIR_USER table into ORBC_USER

### Version 20:
- Addition of new power unit type to power unit types table

### Version 21:
- Add VIN derived column to Permit Data and drop APPLICANT column

### Version 22:
- Include auth groups CTPO

### Version 23:
- Rename CVCLIENT to PAPPLICANT

### Version 24:
- Update the name of permit template documents

### Version 25:
- Add ORBC-SEND-NOTIFICATION role

### Version 26:
- Add IN_CART - shopping cart status

### Version 27:
- Create Table - ORBC_CFS_TRANSACTION_DETAIL

### Version 28:
- Objects for Credit Accounts

### Version 29:
- Policy configuration table creation plus history tables for v28 and v27

### Version 30:
- Add  Serive Account diretory type to ORBC_DIRECTORY_TYPE

### Version 31:
- Add GL_CODE col to ORBC_PERMIT_TYPE

### Version 32:
- Add APP_LAST_UPDATE_USERID cols to ORBC_POLICY_CONFIGURATION

### Version 33:
- Add ORBC-READ-CREDIT-ACCOUNT to PPCCLERK, CTPO, and HQADMIN

### Version 34:
- Add LOA related tables to database

### Version 35:
- Assign auth roles to auth groups

### Version 36:
- Credit Account roles for PAPPLICANT

### Version 37:
- Creation of orbc special authorization tables

### Version 38:
- Update credit account sequence to avoid duplicates in dev and test

### Version 39:
- Default values for  ORBC_SPECIAL_AUTH for Db related columns.

### Version 40:
- Updating no fee type column length.

### Version 41:
- Add previous loa id and original load id columns to LoA table

### Version 42:
- Case/Queue management and related Db objects.

### Version 43:
- STOS permit templates.

### Version 44:
- MFP permit templates.

### Version 45:
- Add GL_PROJ_CODE col to ORBC_PAYMENT_METHOD_TYPE

### Version 46:
- Add GL Type and GL Code Type tables

### Version 47:
- Update permit name of permit type MFP

### Version 48:
- Add QRFR and STFR permit types to ORBC_PERMIT_TYPE table

### Version 49:
- Add index to permit history table to resolve deadlocks

### Version 50:
- Add indexes to all foreign key columns and permit sort columns

### Version 51:
- Updates to policy configuration table for config versioning

### Version 52:
- Updates to policy configuration JSON for lcv

### Version 53:
- Update all permit templates to v2 to fix rev history

### Version 54:
- Alter table permit.ORBC_RECEIPT:
  - Drop foreign key column TRANSACTION_ID
  - Alter trigger ORBC_RCPT_A_S_IUD_TR to remove column TRANSACTION_ID references
  - Alter (disabled) trigger ORBC_RCPT_I_S_U_TR to remove column TRANSACTION_ID references

- Alter table permit.ORBC_RECEIPT_HIST:
  - Make column TRANSACTION_ID nullable

- Alter table permit.ORBC_TRANSACTION:
  - Add indexed optional foreign key referencing permit.ORBC_RECEIPT
  - Alter trigger ORBC_TXN_A_S_IUD_TR to include column RECEIPT_ID (this is my guess about how it has changed)
  - Alter (disabled) trigger ORBC_TXN_I_S_U_TR to include column RECEIPT_ID (this is my guess about how it has changed)
  - Initialize value of new column RECEIPT_ID

- Alter table permit.ORBC_TRANSACTION_HIST:
  - Add nullable column RECEIPT_ID

- Add version 54 row to dbo.ORBC_SYS_VERSION ("Add RECEIPT_ID col to ORBC_TRANSACTION and Drop TRANSACTION_ID from ORBC_RECEIPT")

### Version 55:
- Updates to policy configuration JSON allowing lcv for TROS and TROW

### Version 56:
- Configure the MV4001 external form in OnRouteBC

### Version 57:
- Configure new templates for TROS and TROW

### Version 58:
- Updates to support new vehicle types for TROS and TROW

### Version 59:
- Configure ICBC (QRFR & STFR) permit templates

### Version 60:
- Configure the APV96 external form in OnRouteBC

### Version 61:
- Configure NRQCL & NRSCL permit templates

### Version 62:
- Database Schema Updates
  - Added new column TRANSACTION_APPROVED_DATE to track approval timestamps in ORBC transactions
  - Downtime Required - Yes
  - Data patch script for existing records - Included
  - Technical Details
  - Column Specifications:
  - Data Type: datetime2(7)
  - Nullability: Nullable
  - Default Value: Current UTC date/time using getutcdate()
- Tables Modified:
  - permit.ORBC_TRANSACTION
  - permit.ORBC_TRANSACTION_HIST
- Trigger Enhancements
  - Updated ORBC_TXN_A_S_IUD_TR to maintain historical records
  - Modified ORBC_TXN_I_S_U_TR for proper update handling

### Version 63:
- Database Schema Updates
  - Replaced ID-based relationships with type-based categorization for power units and trailers in ORBC_LOA_VEHICLES
- Downtime Required - Yes
- Data patch script for existing records - N/A as there is no data in the table in the PRODUCTION DB
- Technical Details
 - Column Specifications:
  - ADD - POWER_UNIT_TYPE: char(7), Nullable
  - ADD - TRAILER_TYPE: char(7), Nullable
  - DROP - POWER_UNIT_ID: bigint, Nullable
  - DROP - TRAILER_ID: bigint, Nullable
- Tables Modified:
  - permit.ORBC_LOA_VEHICLES
  - permit.ORBC_LOA_VEHICLES_HIST
- Trigger Enhancements
  - Updated ORBC_LOA_VEHICLES_A_S_IUD_TR to handle new column structure
  - Modified historical record maintenance logic

### Version 64:
- Update/Config LOA in all permit template files.

### Version 65:
- Support for new GARMS file upload and processing 
  - Add GARMS_SERVICE_CODE column to ORBC_PERMIT_TYPE table
  - Add ORBC_GARMS_EXTRACT_TYPE table to define the two types of extract, CASH and CREDIT
  - Add ORBC_GARMS_EXTRACT_FILE table to represent a file sent to GARMS of one of the two extract types
  - Add ORBC_GARMS_FILE_TRANSACTION table to associate transactions to the GARMS file they have been sent in

### Version 66:
- Update email and receipt template to reflect MOTT logo

#### Version 67:
- Update policy configuration and vehicle types to reflect changes from business review
  - Added 2 new trailer types to trailer type table
  - Updated 3 trailer types to be inactive (IS_ACTIVE=0)
  - Updated 3 power unit types to be inactive (IS_ACTIVE=0)
  - Inserted new policy configuration json with updated permittable vehicles and STOS dimension set

### Version 68:
- Update MPF permit templates to fix total distance.

### Version 69:
- Include support for synchronizing TPS accounts to ORBC
  - Create tps.ORBC_TPS_MIGRATED_CREDIT_ACCOUNT table to store account numbers, owner, and status
  - Create tps.ORBC_TPS_MIGRATED_CREDIT_USER table to store clients permitted to use the account
  - Create tps.ORBC_TPS_MIGRATED_CREDIT_STATUS table to store amounts not yet posted to GARMS and account status
  - Add 2 new credit account activity types to permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_TYPE:
    - MIGRATED to indicate an account was migrated from TPS
    - VERIFIED to indicate that staff have verified the company account with the client in ORBC
  - Add new 'UNVERIFIED' type to the permit.ORBC_CREDIT_ACCOUNT_TYPE table to indicate that we cannot determine whether an account is secured, unsecured, or prepaid based on the migrated data from TPS
  - Add a new 'CRE' type to the tps.ETL_PROCESS_TYPE table to indicate a credit account migration process
  - Make non-nullable columns nullable, based on data we do not need with GARMS vs. CFS:
    - permit.ORBC_CREDIT_ACCOUNT.CFS_PARTY_NUMBER
    - permit.ORBC_CREDIT_ACCOUNT_ACTIVITY_HIST.IDIR_USER_GUID
    - permit.ORBC_CREDIT_ACCOUNT_ACTIVITY.IDIR_USER_GUID
  - Add IS_VERIFIED column with valid values 'Y' and 'N' to the permit.ORBC_CREDIT_ACCOUNT table, with default value of 'N', to indicate whether a company with a credit account has yet been verified by staff.
  - Add EXTERNAL_ADJUSTMENT column to store the unposted credit total to the permit.ORBC_CREDIT_ACCOUNT table

 ### Version 70:
- Add OUTAGE_NOTIFICATION table

 ### Version 71:
- Update table dbo.ORBC_ADDRESS change column POSTAL_CODE length from 7 to 15 

 ### Version 72:
- Add Payment Receipt Template v3 

### Version 73:
- Remove NRQCL & NRSCL permit templates and configure NRQCV & NRSCV

### Version 74:
- DDL changes to dops.ORBC_DOCUMENT_TEMPLATE to align it with BCBOX
  - Following coulumns are added to dops.ORBC_DOCUMENT_TEMPLATE
    - IS_ACTIVE Char(1) - Default N - non-nullable
    - FILE_NAME Varchar(50) - non-nullable
- Downtime is required for prod deployment

### Version 75:
- Updates to policy validation rules for NRQCV and NRSCV, MFP cost updates

### Version 76:
- Configure STOS v4 template (bugfixes)

### Version 77:
- Update TPS credit account staging table schemas
  - Create `ORBC_TPS_MIGRATED_CREDIT_ACCOUNT`, `ORBC_TPS_MIGRATED_CREDIT_STATUS`, `ORBC_TPS_MIGRATED_CREDIT_UNPOSTED`, `ORBC_TPS_MIGRATED_CREDIT_USER` tables
  - Procedure to copy migrated credit accounts

### Version 78:
- DDL changes to add CASE_OPENED_DATE_TIME column to case.ORBC_CASE table

### Version 79:
- Configure ORBC_LOGIN tables

### Version 80:
- Alter size of  ORBC_DOCUMENT.FILE_NAME to allow longer file names

### Version 81:
- DDL changes to permit.ORBC_PERMIT to have clean computed values of PERMIT_NUMBER and TPS_PERMIT_NUMBER
  - Following coulumns are added to permit.ORBC_PERMIT
    - COMPUTED_PERMIT_NUMBER NVARCHAR(19) - COMPUTED
    - COMPUTED_TPS_PERMIT_NUMBER NVARCHAR(11) - COMPUTED
  - Following indexes are added to permit.ORBC_PERMIT
    - IX_ORBC_PERMIT_COMPUTED_PERMIT_NUMBER ON COMPUTED_PERMIT_NUMBER
    - IX_ORBC_PERMIT_COMPUTED_TPS_PERMIT_NUMBER ON COMPUTED_TPS_PERMIT_NUMBER
- Downtime is required for prod deployment

### Version 82:
- Configure STOW permit templates

### Version 83:
- Updated policy config json to support fixed cost for NR conditional permits