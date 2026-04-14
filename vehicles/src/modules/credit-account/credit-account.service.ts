import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, QueryRunner, Repository } from 'typeorm';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import {
  CreditAccountLimit,
  CreditAccountLimitType,
} from '../../common/enum/credit-account-limit.enum';
import {
  CreditAccountStatus,
  CreditAccountStatusType,
  CreditAccountStatusValid,
  CreditAccountStatusValidType,
} from '../../common/enum/credit-account-status-type.enum';
import { CreditAccountType } from '../../common/enum/credit-account-type.enum';
import { CreditAccountUserType } from '../../common/enum/credit-accounts.enum';
import {
  getCreditAccountActivityType,
  getCreditAccountStatusFromEGARMS,
  isActiveCreditAccount,
  isClosedCreditAccount,
} from '../../common/helper/credit-account.helper';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { Nullable } from '../../common/types/common';
import { CFSCreditAccountService } from '../common/cfsCreditAccountService';
import { DeleteDto } from '../common/dto/response/delete.dto';
import { CompanyService } from '../company-user-management/company/company.service';
import { Company } from '../company-user-management/company/entities/company.entity';
import { CreateCreditAccountUserDto } from './dto/request/create-credit-account-user.dto';
import { DeleteCreditAccountUserDto } from './dto/request/delete-credit-account-user.dto';
import { ReadCreditAccountUserDto } from './dto/response/read-credit-account-user.dto';
import { ReadCreditAccountDto } from './dto/response/read-credit-account.dto';
import { CreditAccountUser } from './entities/credit-account-user.entity';
import { CreditAccount } from './entities/credit-account.entity';
import {
  callDatabaseSequence,
  setBaseEntityProperties,
} from '../../common/helper/database.helper';
import { CreditAccountActivity } from './entities/credit-account-activity.entity';
import { CreditAccountActivityType } from '../../common/enum/credit-account-activity-type.enum';
import { User } from '../company-user-management/users/entities/user.entity';
import { DataNotFoundException } from '../../common/exception/data-not-found.exception';
import { PaymentMethodType as PaymentMethodTypeEnum } from '../../common/enum/payment-method-type.enum';
import { throwUnprocessableEntityException } from '../../common/helper/exception.helper';
import {
  ClientUserRole,
  IDIRUserRole,
  UserRole,
} from '../../common/enum/user-role.enum';
import { ReadCreditAccountActivityDto } from './dto/response/read-credit-account-activity.dto';
import { ReadCreditAccountMetadataDto } from './dto/response/read-credit-account-metadata.dto';
import { ReadCreditAccountUserDetailsDto } from './dto/response/read-credit-account-user-details.dto';
import { ReadCreditAccountLimitDto } from './dto/response/read-credit-account-limit.dto';
import { doesUserHaveRole } from '../../common/helper/auth.helper';
import { EGARMSCreditAccountService } from '../common/egarms.credit-account.service';
import {
  EGARMS_CREDIT_ACCOUNT_ACTIVE,
  EGARMS_CREDIT_ACCOUNT_CLOSED,
  EGARMS_CREDIT_ACCOUNT_HOLD,
  EGARMS_CREDIT_ACCOUNT_NOT_FOUND,
} from '../../common/constants/api.constant';
import { GarmsExtractFile } from './entities/garms-extract-file.entity';
import { GarmsExtractType } from '../../common/enum/garms-extract-type.enum';
import { getToDateForGarms } from '../../common/helper/garms.helper';
import { TransactionType } from '../../common/enum/transaction-type.enum';

/**
 * Service functions for credit account operations.
 */
@Injectable()
export class CreditAccountService {
  private readonly logger = new Logger(CreditAccountService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
    @InjectRepository(CreditAccount)
    private readonly creditAccountRepository: Repository<CreditAccount>,
    @InjectRepository(CreditAccountActivity)
    private readonly creditAccountActivityRepository: Repository<CreditAccountActivity>,
    @InjectRepository(CreditAccountUser)
    private readonly creditAccountUserRepository: Repository<CreditAccountUser>,
    private readonly cfsCreditAccountService: CFSCreditAccountService,
    private readonly egarmsCreditAccountService: EGARMSCreditAccountService,
    private readonly companyService: CompanyService,
    @InjectRepository(GarmsExtractFile)
    private readonly garmsExtractFileRepository: Repository<GarmsExtractFile>,
  ) {}

  /**
   * Creates a new credit account for a company based on an EGARMS credit account number.
   *
   * This method orchestrates the creation of a credit account by:
   * 1. Validating that the company does not already have a credit account
   * 2. Validating that the credit account number is not already mapped to another company
   * 3. Fetching and validating the credit account details from EGARMS
   * 4. Creating a new credit account entity with the appropriate status based on EGARMS response
   * 5. Persisting the credit account to the database within a transaction
   * 6. Recording the account creation activity
   * 7. Mapping the created account to a DTO and returning it
   *
   * @param {IUserJWT} currentUser - The current authenticated user creating the credit account.
   * @param {Object} params - Parameters for creating the credit account.
   * @param {number} params.companyId - The ID of the company for which the credit account is being created.
   * @param {string} params.creditAccountNumber - The credit account number from EGARMS to associate with the company.
   * @returns {Promise<ReadCreditAccountDto>} - The created credit account data transfer object.
   * @throws {UnprocessableEntityException} - If the company already has a credit account, the credit account number
   * is already mapped to another company, or the EGARMS credit account status is invalid.
   * @memberof CreditAccountService
   */
  @LogAsyncMethodExecution()
  async createCreditAccountViaGarms(
    currentUser: IUserJWT,
    {
      companyId,
      creditAccountNumber,
    }: { companyId: number; creditAccountNumber: string },
  ) {
    // Initiate async fetch of EGARMS credit account details in parallel
    const egarmsCreditAccountDetailsPromise =
      this.egarmsCreditAccountService.getCreditAccountDetailsFromEGARMS(
        creditAccountNumber,
      );

    // Validate that the company does not already have a credit account
    let creditAccount = await this.findCreditAccountDetails(
      companyId,
      currentUser,
    );

    if (creditAccount) {
      throwUnprocessableEntityException(
        `Company is already associated with a credit account ${creditAccount?.creditAccountNumber}.`,
      );
    }

    // Validate that the credit account number is not already mapped to another company
    creditAccount = await this.findOneByCreditAccountNumber(
      currentUser,
      creditAccountNumber,
    );
    if (creditAccount) {
      throwUnprocessableEntityException(
        `Credit account already exists mapped to company ${creditAccount?.company?.clientNumber}.`,
      );
    }

    // Await the EGARMS credit account details from the parallel request
    const egarmsCreditAccountDetails = await egarmsCreditAccountDetailsPromise;

    // Validate that the credit account status from EGARMS is in an acceptable state
    if (
      !(
        egarmsCreditAccountDetails?.PPABalance?.return_code ===
          EGARMS_CREDIT_ACCOUNT_ACTIVE ||
        egarmsCreditAccountDetails?.PPABalance?.return_code ===
          EGARMS_CREDIT_ACCOUNT_CLOSED ||
        egarmsCreditAccountDetails?.PPABalance?.return_code ===
          EGARMS_CREDIT_ACCOUNT_HOLD
      )
    ) {
      this.logger.error(
        `Error: Invalid Credit Account Status in eGARMS. eGARMS Return Code: ${egarmsCreditAccountDetails?.PPABalance?.return_code}`,
      );
      throwUnprocessableEntityException(
        'Credit account is unavailable',
        'CREDIT_ACCOUNT_UNAVAILABLE',
      );
    }

    // Fetch company information for account creation and audit purposes
    const companyInfo =
      await this.companyService.findOneCompanyWithAllDetails(companyId);

    const currentDateTime: Date = new Date();

    // Initialize the new credit account entity with EGARMS-derived status
    let newCreditAccount = new CreditAccount();
    newCreditAccount.creditAccountStatusType = getCreditAccountStatusFromEGARMS(
      egarmsCreditAccountDetails?.PPABalance?.return_code,
    );
    newCreditAccount.creditAccountType = CreditAccountType.UNSECURED;
    newCreditAccount.isVerified = false;
    newCreditAccount.company = new Company();
    newCreditAccount.company.companyId = companyId;
    newCreditAccount.creditAccountNumber = creditAccountNumber;
    setBaseEntityProperties<CreditAccount>({
      entity: newCreditAccount,
      currentUser,
      date: currentDateTime,
    });

    // Create a database transaction to ensure atomicity of account creation and activity logging
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Persist the new credit account to the database
      newCreditAccount = await queryRunner.manager.save(newCreditAccount);

      // Log the credit account creation activity for audit trail
      await this.logCreditAccountAndUserActivity({
        queryRunner,
        creditAccount,
        currentUser,
        currentDateTime,
        creditAccountActivityType: CreditAccountActivityType.ACCOUNT_OPENED,
        comment: `Opening account for client number: ${companyInfo.clientNumber}`,
      });

      // Commit the transaction if both save and logging succeed
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback all changes if any operation within the transaction fails
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      // Release the query runner resources
      await queryRunner.release();
    }

    // Map the created credit account entity to the response DTO
    const createdCreditAccountDto = await this.classMapper.mapAsync(
      newCreditAccount,
      CreditAccount,
      ReadCreditAccountDto,
      {
        extraArgs: () => ({
          currentUser: currentUser,
        }),
      },
    );

    return createdCreditAccountDto;
  }

  /**
   * Creates a new credit account for a company.
   *
   * The `createCreditAccountViaCFS` method orchestrates the creation of a new credit account, including the creation
   * of associated entities such as Party, Account, Site, and Site Contact within the CFS system.
   * The method ensures that the credit account is created with the proper references and initial
   * data, and then saves it to the local repository.
   *
   * @param {IUserJWT} currentUser - The current user creating the credit account.
   * @param {Object} createParams - Parameters required for creating the credit account.
   * @param {number} createParams.companyId - The ID of the company for which the credit account is being created.
   * @param {CreditAccountLimitType} createParams.creditLimit - The credit limit type for the new account.
   * @returns {Promise<ReadCreditAccountDto>} - The created credit account data transfer object.
   * @throws {UnprocessableEntityException} - If validation of the credit account creation fails.
   * @throws {InternalServerErrorException} - If the creation of any required entity in the CFS system fails.
   * @memberof CreditAccountService
   */
  @LogAsyncMethodExecution()
  async createCreditAccountViaCFS(
    currentUser: IUserJWT,
    {
      companyId,
      creditLimit,
    }: { companyId: number; creditLimit: CreditAccountLimitType },
  ) {
    await this.validateCreateCreditAccount(companyId);
    const companyInfo =
      await this.companyService.findOneCompanyWithAllDetails(companyId);

    /**
     * There are 4 steps in credit account creation in the CFS system
     * 1. Create Party
     * 2. Create Account
     * 3. Create Site
     * 4. Create Site Contact
     */

    // 1) Create Party
    const partyResponse = await this.cfsCreditAccountService.createParty({
      url: `${process.env.CFS_CREDIT_ACCOUNT_URL}/cfs/parties/`,
      clientNumber: companyInfo.clientNumber,
    });
    if (!partyResponse) {
      this.logger.error('Unable to create a party for the company.');
      throw new InternalServerErrorException();
    }
    const { party_number: cfsPartyNumber, links: partiesLinks } = partyResponse;
    const { href: accountsURL } = partiesLinks.find(
      ({ rel }) => rel === 'accounts',
    );

    // 2) Create Account for the Party created in step 1.
    const creditAccountNumber = await this.getCreditAccountNumber();
    const accountResponse = await this.cfsCreditAccountService.createAccount({
      url: accountsURL,
      clientNumber: companyInfo.clientNumber,
      creditAccountNumber,
    });
    const accountCreated = Boolean(accountResponse);

    let siteCreated: boolean;
    let cfsSiteNumber: number;
    let siteContactCreated: boolean;
    // Only if step 2 succeeded, we can move on to step 3 and 4.
    if (accountCreated) {
      const { links: accountsResponseLinks } = accountResponse;

      // 3) Create Site for the Party and Account created in steps 1 and 2.
      const { href: sitesURL } = accountsResponseLinks.find(
        ({ rel }) => rel === 'sites',
      );
      const sitesResponse = await this.cfsCreditAccountService.createSite({
        url: sitesURL,
        mailingAddress: companyInfo.mailingAddress,
      });
      siteCreated = Boolean(sitesResponse);

      // Only if site was created in step 3, step 4 can execute.
      if (siteCreated) {
        const { site_number, links: sitesResponseLinks } = sitesResponse;
        cfsSiteNumber = +site_number;

        // 4) Create Site Contact for the site created in step 3.
        const { href: siteContactURL } = sitesResponseLinks.find(
          ({ rel }) => rel === 'contacts',
        );
        siteContactCreated =
          await this.cfsCreditAccountService.createSiteContact({
            url: siteContactURL,
            companyInfo,
          });
      }
    } else {
      this.logger.error('Account not created for the company.');
    }
    let creditAccountStatusType: CreditAccountStatusType;
    if (siteCreated && siteContactCreated) {
      creditAccountStatusType = CreditAccountStatus.ACCOUNT_ACTIVE;
    } else {
      creditAccountStatusType = CreditAccountStatus.ACCOUNT_SETUP_FAIL;
    }

    const savedCreditAccount = await this.creditAccountRepository.save({
      company: { companyId },
      cfsPartyNumber: +cfsPartyNumber,
      cfsSiteNumber,
      creditAccountStatusType,
      creditAccountType:
        creditLimit === CreditAccountLimit.PREPAID
          ? CreditAccountType.PREPAID
          : CreditAccountType.UNSECURED,
      creditAccountNumber,
      creditAccountUsers: [],
      createdUser: currentUser.userName,
      createdDateTime: new Date(),
      createdUserDirectory: currentUser.orbcUserDirectory,
      createdUserGuid: currentUser.userGUID,
      updatedUser: currentUser.userName,
      updatedDateTime: new Date(),
      updatedUserDirectory: currentUser.orbcUserDirectory,
      updatedUserGuid: currentUser.userGUID,
    });

    if (creditAccountStatusType === CreditAccountStatus.ACCOUNT_ACTIVE) {
      try {
        const savedActivity = await this.creditAccountActivityRepository.save({
          idirUser: { userGUID: currentUser.userGUID },
          creditAccountActivityType: CreditAccountActivityType.ACCOUNT_OPENED,
          creditAccountActivityDateTime: new Date(),
          creditAccount: {
            creditAccountId: savedCreditAccount.creditAccountId,
          },
          comment: `Opening account for client number: ${companyInfo.clientNumber}`,
          createdUser: currentUser.userName,
          createdDateTime: new Date(),
          createdUserDirectory: currentUser.orbcUserDirectory,
          createdUserGuid: currentUser.userGUID,
          updatedUser: currentUser.userName,
          updatedDateTime: new Date(),
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        });
        if (!savedActivity?.activityId) {
          this.logger.error(
            `Could not save ${CreditAccountActivityType.ACCOUNT_OPENED} activity to the database for companyId: ${companyId}.`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Could not save ${CreditAccountActivityType.ACCOUNT_OPENED} activity to the database for companyId: ${companyId}.`,
        );
        this.logger.error(error);
      }
    }

    const createdCreditAccountDto = await this.classMapper.mapAsync(
      savedCreditAccount,
      CreditAccount,
      ReadCreditAccountDto,
      {
        extraArgs: () => ({
          currentUser: currentUser,
        }),
      },
    );

    return createdCreditAccountDto;
  }

  /**
   * Retrieves detailed information about a credit account for a given company and user.
   *
   * This method fetches the credit account details based on company ID and optionally credit account ID.
   * If the credit account does not exist, it throws a DataNotFoundException. It then maps the credit account
   * details to a ReadCreditAccountDto with additional parameters derived from the user context.
   *
   * @param {number} companyId - The ID of the company.
   * @param {Nullable<number>} creditAccountId - The optional ID of the credit account.
   * @param {IUserJWT} currentUser - The current authenticated user.
   * @returns {Promise<ReadCreditAccountDto>} - The data transfer object containing credit account details.
   * @throws {DataNotFoundException} - If the specified credit account is not found.
   */
  @LogAsyncMethodExecution()
  async getCreditAccount({
    companyId,
    creditAccountId,
    currentUser,
  }: {
    companyId: number;
    creditAccountId?: Nullable<number>;
    currentUser: IUserJWT;
  }): Promise<ReadCreditAccountDto> {
    const creditAccount = await this.findCreditAccountDetails(
      companyId,
      currentUser,
      creditAccountId,
    );

    if (!creditAccount) {
      throw new DataNotFoundException();
    } else if (
      doesUserHaveRole(currentUser.orbcUserRole, [
        ClientUserRole.COMPANY_ADMINISTRATOR,
      ]) &&
      creditAccount?.company.companyId !== companyId
    ) {
      // Throw exception if companyId is a Credit Account User and user is Company Admin.
      throw new ForbiddenException();
    } else if (
      creditAccount?.company?.companyId === companyId &&
      creditAccount?.creditAccountStatusType ===
        CreditAccountStatus.ACCOUNT_CLOSED &&
      !(
        doesUserHaveRole(currentUser.orbcUserRole, [
          IDIRUserRole.HQ_ADMINISTRATOR,
          IDIRUserRole.SYSTEM_ADMINISTRATOR,
          IDIRUserRole.FINANCE,
          IDIRUserRole.PPC_CLERK,
          IDIRUserRole.CTPO,
        ]) ||
        doesUserHaveRole(currentUser.orbcUserRole, [
          ClientUserRole.COMPANY_ADMINISTRATOR,
        ])
      )
    ) {
      throw new DataNotFoundException();
    }

    const readCreditAccountDto = await this.classMapper.mapAsync(
      creditAccount,
      CreditAccount,
      ReadCreditAccountDto,
      {
        extraArgs: () => ({
          currentUser: currentUser,
        }),
      },
    );

    return readCreditAccountDto;
  }

  /**
   * Retrieves detailed information about a credit account for a given company and user.
   *
   * This method fetches the credit account details based on company ID and optionally credit account ID.
   * If the credit account does not exist, it throws a DataNotFoundException. It then maps the credit account
   * details to a ReadCreditAccountDto with additional parameters derived from the user context.
   *
   * @param {number} companyId - The ID of the company.
   * @param {Nullable<number>} creditAccountId - The optional ID of the credit account.
   * @param {IUserJWT} currentUser - The current authenticated user.
   * @returns {Promise<ReadCreditAccountDto>} - The data transfer object containing credit account details.
   * @throws {DataNotFoundException} - If the specified credit account is not found.
   */
  @LogAsyncMethodExecution()
  async getCreditAccountMetadata({
    companyId,
    creditAccountId,
    currentUser,
  }: {
    companyId: number;
    creditAccountId?: Nullable<number>;
    currentUser: IUserJWT;
  }): Promise<ReadCreditAccountMetadataDto> {
    const creditAccount = await this.findCreditAccountDetails(
      companyId,
      currentUser,
      creditAccountId,
    );

    if (!creditAccount) {
      throw new DataNotFoundException();
    } else if (
      creditAccount?.company?.companyId === companyId &&
      creditAccount?.creditAccountStatusType ===
        CreditAccountStatus.ACCOUNT_CLOSED &&
      !(
        doesUserHaveRole(currentUser.orbcUserRole, [
          IDIRUserRole.HQ_ADMINISTRATOR,
          IDIRUserRole.SYSTEM_ADMINISTRATOR,
          IDIRUserRole.FINANCE,
          IDIRUserRole.PPC_CLERK,
          IDIRUserRole.CTPO,
        ]) ||
        doesUserHaveRole(currentUser.orbcUserRole, [
          ClientUserRole.COMPANY_ADMINISTRATOR,
        ])
      )
    ) {
      throw new DataNotFoundException();
    }

    creditAccount.creditAccountUsers =
      creditAccount?.creditAccountUsers?.filter(
        (creditAccountUser) => creditAccountUser.isActive,
      );

    const readCreditAccountMetadataDto = new ReadCreditAccountMetadataDto();
    readCreditAccountMetadataDto.creditAccountId =
      creditAccount.creditAccountId;

    if (creditAccount?.company?.companyId === companyId)
      readCreditAccountMetadataDto.userType =
        CreditAccountUserType.ACCOUNT_HOLDER;
    else {
      readCreditAccountMetadataDto.userType =
        CreditAccountUserType.ACCOUNT_USER;
    }

    if (
      creditAccount?.creditAccountStatusType ===
        CreditAccountStatus.ACCOUNT_ACTIVE &&
      !creditAccount?.company.isSuspended &&
      creditAccount?.isVerified
    ) {
      readCreditAccountMetadataDto.isValidPaymentMethod = true;
      try {
        const egarmsCreditAccountDetails =
          await this.egarmsCreditAccountService.getCreditAccountDetailsFromEGARMS(
            creditAccount.creditAccountNumber,
          );

        readCreditAccountMetadataDto.egarmsReturnCode =
          egarmsCreditAccountDetails?.PPABalance?.return_code;

        if (
          readCreditAccountMetadataDto.egarmsReturnCode ===
          EGARMS_CREDIT_ACCOUNT_ACTIVE
        ) {
          readCreditAccountMetadataDto.isValidPaymentMethod = true;
        } else {
          readCreditAccountMetadataDto.isValidPaymentMethod = false;
        }
      } catch (error) {
        readCreditAccountMetadataDto.isValidPaymentMethod = false;
        this.logger.error(error);
      }
    } else {
      readCreditAccountMetadataDto.isValidPaymentMethod = false;
    }
    return readCreditAccountMetadataDto;
  }

  /**
   * Generates a unique credit account number.
   *
   * This method interacts with the database to retrieve a sequence value and formats it
   * to produce a unique credit account number. The formatted number starts with
   * the prefix 'WS' followed by a zero-padded sequence number.
   *
   * @returns {Promise<string>} The generated credit account number.
   * @throws {InternalServerErrorException} If the sequence retrieval fails.
   */
  private async getCreditAccountNumber(): Promise<string> {
    const rawCreditAccountSequenceNumber = await callDatabaseSequence(
      'permit.ORBC_CREDIT_ACCOUNT_NUMBER_SEQ',
      this.dataSource,
    );
    return `WS${rawCreditAccountSequenceNumber.padStart(4, '0')}`;
  }

  /**
   * Updates the status of a credit account.
   *
   * This method changes the status of a specified credit account to a new status.
   * It validates the new status and ensures the status transition is permissible.
   * The method also updates the audit fields of the credit account with the information
   * of the user who performed the update. If the update is successful, the method records
   * the activity corresponding to the status change.
   *
   * @param {Object} params - The parameters for updating the credit account status.
   * @param {number} params.creditAccountHolderId - The ID of the holder of the credit account.
   * @param {number} params.creditAccountId - The ID of the credit account.
   * @param {CreditAccountStatusType} params.statusToUpdateTo - The new status to update the credit account to.
   * @param {string} params.comment - A comment detailing the reason for the status change.
   * @param {IUserJWT} currentUser - The current user performing the update.
   * @returns {Promise<ReadCreditAccountDto>} - The updated credit account data transfer object.
   * @throws {UnprocessableEntityException} - If validation fails (e.g., invalid transitions or account not found).
   * @memberof CreditAccountService
   */
  @LogAsyncMethodExecution()
  public async updateCreditAccountStatus(
    currentUser: IUserJWT,
    {
      creditAccountHolderId,
      creditAccountId,
      statusToUpdateTo,
      comment,
    }: {
      creditAccountHolderId: number;
      creditAccountId: number;
      statusToUpdateTo: CreditAccountStatusValidType;
      comment: string;
    },
  ): Promise<ReadCreditAccountDto> {
    // Retrieve the credit account using credit account ID and holder ID
    const creditAccount = await this.findOneByCreditAccountIdAndAccountHolder(
      creditAccountId,
      creditAccountHolderId,
    );

    if (!creditAccount) {
      // If no credit account is found, throw UnprocessableEntityException
      throwUnprocessableEntityException(
        'Invalid CreditAccount/Company combination',
      );
    }

    if (statusToUpdateTo === creditAccount.creditAccountStatusType) {
      throwUnprocessableEntityException(
        `Credit Account already in status: ${statusToUpdateTo}`,
      );
    }

    if (
      statusToUpdateTo === CreditAccountStatusValid.ACCOUNT_ON_HOLD &&
      isClosedCreditAccount(creditAccount)
    ) {
      throwUnprocessableEntityException(
        'Cannot move a closed Credit Account to on hold',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentDateTime: Date = new Date();
      const { affected } = await queryRunner.manager.update(
        CreditAccount,
        { creditAccountId: creditAccountId },
        {
          creditAccountStatusType: statusToUpdateTo,
          updatedUser: currentUser.userName,
          updatedDateTime: currentDateTime,
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        },
      );

      if (affected === 1) {
        if (statusToUpdateTo === CreditAccountStatusValid.ACCOUNT_CLOSED) {
          await queryRunner.manager.update(
            CreditAccountUser,
            { creditAccount: { creditAccountId } },
            {
              isActive: false,
              updatedUser: currentUser.userName,
              updatedDateTime: currentDateTime,
              updatedUserDirectory: currentUser.orbcUserDirectory,
              updatedUserGuid: currentUser.userGUID,
            },
          );
        }

        const creditAccountActivityType = getCreditAccountActivityType(
          creditAccount,
          statusToUpdateTo,
        );

        await this.logCreditAccountAndUserActivity({
          queryRunner,
          creditAccount,
          currentUser,
          currentDateTime,
          creditAccountActivityType,
          comment,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
    return await this.getCreditAccount({
      currentUser,
      companyId: creditAccountHolderId,
    });
  }

  /**
   * Verifies a credit account.
   *
   * This method marks a specified credit account as verified.
   * It ensures that an unverified credit account can be marked as verified,
   * updates the audit fields with the user's details, and records the verification activity.
   * If the account is already verified or doesn't exist, appropriate errors are thrown.
   *
   * @param {Object} params - The parameters for verifying the credit account.
   * @param {number} params.creditAccountHolderId - The ID of the holder of the credit account.
   * @param {number} params.creditAccountId - The ID of the credit account.
   * @param {string} params.comment - A comment detailing the reason for the verification.
   * @param {IUserJWT} currentUser - The current user performing the verification.
   * @returns {Promise<ReadCreditAccountDto>} - The updated credit account data transfer object.
   * @throws {UnprocessableEntityException} - If the account is already verified or not found.
   * @memberof CreditAccountService
   */
  @LogAsyncMethodExecution()
  public async verifyCreditAccount(
    currentUser: IUserJWT,
    {
      creditAccountHolderId,
      creditAccountId,
      comment,
    }: {
      creditAccountHolderId: number;
      creditAccountId: number;
      comment: string;
    },
  ): Promise<ReadCreditAccountDto> {
    // Retrieve the credit account using credit account ID and holder ID
    const creditAccount = await this.findOneByCreditAccountIdAndAccountHolder(
      creditAccountId,
      creditAccountHolderId,
    );

    if (!creditAccount) {
      // If no credit account is found, throw UnprocessableEntityException
      throwUnprocessableEntityException(
        'Invalid CreditAccount/Company combination',
      );
    }

    if (creditAccount?.isVerified) {
      throwUnprocessableEntityException(
        'Credit Account is already in verified status',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentDateTime: Date = new Date();
      const { affected } = await queryRunner.manager.update(
        CreditAccount,
        { creditAccountId: creditAccountId },
        {
          isVerified: true,
          updatedUser: currentUser.userName,
          updatedDateTime: currentDateTime,
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        },
      );

      if (affected === 1) {
        await this.logCreditAccountAndUserActivity({
          queryRunner,
          creditAccount,
          currentUser,
          currentDateTime,
          creditAccountActivityType: CreditAccountActivityType.ACCOUNT_VERIFIED,
          comment,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
    return await this.getCreditAccount({
      currentUser,
      companyId: creditAccountHolderId,
    });
  }

  /**
   * Validates the creation of a credit account for a company.
   *
   * This method checks whether the company associated with the provided company ID is already a user
   * of another credit account or if the company already has a credit account. If either condition
   * is met, it throws a UnprocessableEntityException to prevent the creation of a duplicate credit account.
   *
   * @param {number} companyId - The ID of the company for which the credit account is being created.
   * @throws {UnprocessableEntityException} - If the company is already a user of another credit account
   *                                 or if the company already has a credit account.
   * @private
   * @memberof CreditAccountService
   */
  private async validateCreateCreditAccount(companyId: number): Promise<void> {
    const companyIsAlreadyAUser = await this.creditAccountUserRepository.exists(
      {
        where: { company: { companyId }, isActive: true },
      },
    );
    if (companyIsAlreadyAUser) {
      throwUnprocessableEntityException(
        'Company is already a user of another credit account.',
      );
    }

    //TODO Change from exists to find
    const companyAlreadyHasCreditAccount =
      await this.creditAccountRepository.exists({
        where: {
          company: { companyId },
          // What to do if there's a credit account not in ACTIVE status?
          // creditAccountStatusType: In([CreditAccountStatusType.ACCOUNT_ACTIVE, ]),
        },
      });
    if (companyAlreadyHasCreditAccount) {
      throwUnprocessableEntityException(
        'Company already has a credit account.',
      );
    }
  }

  /**
   * Adds or activates a credit account user.
   *
   * @param currentUser - The current user performing the action.
   * @param accountHolderId - The ID of the credit account holder.
   * @param creditAccountId - The ID of the credit account.
   * @param createUserDto - The data transfer object for creating a user.
   * @returns {Promise<ReadCreditAccountUserDto>} - The result of the add or activate process.
   * @throws UnprocessableEntityException - If the credit account or company combination is invalid.
   * @throws InternalServerErrorException - If user update or creation fails.
   */
  @LogAsyncMethodExecution()
  public async addOrActivateCreditAccountUser(
    currentUser: IUserJWT,
    accountHolderId: number,
    creditAccountId: number,
    createUserDto: CreateCreditAccountUserDto,
  ): Promise<ReadCreditAccountUserDto> {
    const creditAccount = await this.findOneByCreditAccountIdAndAccountHolder(
      creditAccountId,
      accountHolderId,
    );

    this.validateCreditAccountForUserAddition(creditAccount);

    const { accountUserMappedToAccount } =
      await this.findOrCheckExistingAccount(
        createUserDto.companyId,
        creditAccountId,
      );

    const currentDateTime = new Date();

    return accountUserMappedToAccount && !accountUserMappedToAccount.isActive
      ? await this.activateExistingCreditAccountUser(
          currentUser,
          creditAccount,
          accountUserMappedToAccount,
          currentDateTime,
        )
      : await this.createNewCreditAccountUser(
          currentUser,
          creditAccount,
          createUserDto,
          creditAccountId,
          currentDateTime,
        );
  }

  private validateCreditAccountForUserAddition(
    creditAccount: CreditAccount,
  ): void {
    if (!creditAccount) {
      throwUnprocessableEntityException(
        'Invalid CreditAccount/Company combination',
      );
    }

    if (isClosedCreditAccount(creditAccount)) {
      throwUnprocessableEntityException(
        'Credit Account closed - Cannot add user',
      );
    }
  }

  private async findOrCheckExistingAccount(
    companyId: number,
    creditAccountId: number,
  ): Promise<{
    existingAccountUsers: CreditAccountUser[];
    accountUserMappedToAccount: CreditAccountUser;
  }> {
    const existingAccountAsHolder =
      await this.findOneByIdAndAccountHolder(companyId);

    let existingActiveAccount =
      isActiveCreditAccount(existingAccountAsHolder) && existingAccountAsHolder;
    let existingAccountUsers: CreditAccountUser[] = null;

    if (!existingActiveAccount) {
      existingAccountUsers = await this.findManyCreditAccountUsers(companyId);
      existingActiveAccount = existingAccountUsers?.find(
        (accountUser) => accountUser.isActive,
      )?.creditAccount;
    }

    if (existingActiveAccount) {
      const existingAccountUserDetails = await this.classMapper.mapAsync(
        existingActiveAccount,
        CreditAccount,
        ReadCreditAccountUserDetailsDto,
      );
      throwUnprocessableEntityException(
        'Client already associated with an active Credit Account',
        null,
        existingAccountUserDetails,
      );
    }

    const accountUserMappedToAccount = existingAccountUsers?.find(
      (accountUser) =>
        accountUser.company.companyId === companyId &&
        accountUser.creditAccount.creditAccountId === creditAccountId,
    );

    return { existingAccountUsers, accountUserMappedToAccount };
  }

  /**
   * Activates an existing credit account user.
   *
   * This helper updates the existing credit account user record to set it active,
   * updates audit fields with the current user, logs the activation activity,
   * and then returns the refreshed mapped DTO.
   *
   * @param currentUser - The user performing the activation.
   * @param creditAccount - The credit account that the user belongs to.
   * @param accountUserMappedToAccount - The existing credit account user record.
   * @param currentDateTime - The timestamp used for auditing.
   * @returns The activated credit account user DTO.
   */
  private async activateExistingCreditAccountUser(
    currentUser: IUserJWT,
    creditAccount: CreditAccount,
    accountUserMappedToAccount: CreditAccountUser,
    currentDateTime: Date,
  ): Promise<ReadCreditAccountUserDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { affected } = await queryRunner.manager.update(
        CreditAccountUser,
        {
          creditAccountUserId: accountUserMappedToAccount.creditAccountUserId,
        },
        {
          isActive: true,
          updatedUserGuid: currentUser.userGUID,
          updatedDateTime: currentDateTime,
          updatedUser: currentUser.userName,
          updatedUserDirectory: currentUser.orbcUserDirectory,
        },
      );

      if (affected === 0) {
        throw new InternalServerErrorException(
          'Credit Account user update failed!!',
        );
      }

      if (affected === 1) {
        await this.logCreditAccountAndUserActivity({
          queryRunner,
          creditAccount,
          currentUser,
          currentDateTime,
          creditAccountActivityType:
            CreditAccountActivityType.ACCOUNT_USER_ADDED,
          comment: `onRouteBC Client No.: ${accountUserMappedToAccount?.company?.clientNumber}`,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }

    const updatedAccountUserInfo = await this.findManyCreditAccountUsers(
      null,
      null,
      null,
      accountUserMappedToAccount.creditAccountUserId,
      true,
    );
    return await this.classMapper.mapAsync(
      updatedAccountUserInfo?.at(0),
      CreditAccountUser,
      ReadCreditAccountUserDto,
    );
  }

  /**
   * Creates a new credit account user and logs the associated activity.
   *
   * This helper maps the incoming DTO to a new CreditAccountUser entity, persists it
   * within a transaction, records an ACCOUNT_USER_ADDED activity, and returns the
   * mapped ReadCreditAccountUserDto.
   *
   * @param currentUser - The user performing the creation.
   * @param creditAccount - The credit account to which the new user belongs.
   * @param createUserDto - The incoming DTO containing new user details.
   * @param creditAccountId - The credit account id the user is being added to.
   * @param currentDateTime - The timestamp used for auditing.
   * @returns The newly created credit account user DTO.
   */
  private async createNewCreditAccountUser(
    currentUser: IUserJWT,
    creditAccount: CreditAccount,
    createUserDto: CreateCreditAccountUserDto,
    creditAccountId: number,
    currentDateTime: Date,
  ): Promise<ReadCreditAccountUserDto> {
    let newAccountUser = await this.classMapper.mapAsync(
      createUserDto,
      CreateCreditAccountUserDto,
      CreditAccountUser,
      {
        extraArgs: () => ({
          creditAccountId: creditAccountId,
          userName: currentUser.userName,
          directory: currentUser.orbcUserDirectory,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
        }),
      },
    );

    const companyInfo = await this.companyService.findOneCompanyWithAllDetails(
      newAccountUser?.company?.companyId,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      newAccountUser =
        await queryRunner.manager.save<CreditAccountUser>(newAccountUser);

      await this.logCreditAccountAndUserActivity({
        queryRunner,
        creditAccount,
        currentUser,
        currentDateTime,
        creditAccountActivityType: CreditAccountActivityType.ACCOUNT_USER_ADDED,
        comment: `onRouteBC Client No.: ${companyInfo?.clientNumber}`,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }

    const newAccountUserInfo = await this.findManyCreditAccountUsers(
      null,
      null,
      null,
      newAccountUser.creditAccountUserId,
      true,
    );
    return this.classMapper.mapAsync(
      newAccountUserInfo?.at(0),
      CreditAccountUser,
      ReadCreditAccountUserDto,
    );
  }

  /**
   * Persists a credit account and user activity record within the provided query runner.
   *
   * This helper creates a CreditAccountActivity entity, populates it with the
   * supplied activity type and comment, applies base audit fields, and saves it.
   *
   * @param queryRunner - The active query runner for the transaction.
   * @param creditAccount - The credit account related to the activity.
   * @param currentUser - The user that triggered the activity.
   * @param currentDateTime - The timestamp used for audit fields.
   * @param creditAccountActivityType - The type of credit account activity.
   * @param comment - The activity comment text.
   */
  private async logCreditAccountAndUserActivity({
    queryRunner,
    creditAccount,
    currentUser,
    currentDateTime,
    creditAccountActivityType,
    comment,
  }: {
    queryRunner: QueryRunner;
    creditAccount: CreditAccount;
    currentUser: IUserJWT;
    currentDateTime: Date;
    creditAccountActivityType: CreditAccountActivityType;
    comment: string;
  }): Promise<void> {
    const creditAccountActivity: CreditAccountActivity =
      new CreditAccountActivity();

    creditAccountActivity.creditAccount = creditAccount;
    creditAccountActivity.idirUser = new User();
    creditAccountActivity.idirUser.userGUID = currentUser.userGUID;
    creditAccountActivity.creditAccountActivityType = creditAccountActivityType;
    creditAccountActivity.comment = comment;
    creditAccountActivity.creditAccountActivityDateTime = currentDateTime;
    setBaseEntityProperties<CreditAccountActivity>({
      entity: creditAccountActivity,
      currentUser,
      date: currentDateTime,
    });
    await queryRunner.manager.save(creditAccountActivity);
  }

  /**
   * Deactivates users of a credit account for specified companies.
   *
   * @param currentUser - The current user performing the deactivation.
   * @param creditAccountHolderId - The ID of the holder of the credit account.
   * @param creditAccountId - The ID of the credit account.
   * @param companyData - Object containing company IDs for deactivation.
   * @returns {Promise<DeleteDto>} - The result of the deactivation process.
   * @throws UnprocessableEntityException - If the credit account or company combination is invalid.
   * @throws InternalServerErrorException - If deactivation fails.
   */
  @LogAsyncMethodExecution()
  public async deactivateCreditAccountUser(
    currentUser: IUserJWT,
    creditAccountHolderId: number,
    creditAccountId: number,
    { companyIds }: DeleteCreditAccountUserDto,
  ): Promise<DeleteDto> {
    const deleteDto: DeleteDto = new DeleteDto();
    deleteDto.failure = [];
    deleteDto.success = [];

    // Retrieve the credit account using credit account ID and holder ID
    const creditAccount = await this.findOneByCreditAccountIdAndAccountHolder(
      creditAccountId,
      creditAccountHolderId,
    );

    if (!creditAccount) {
      // If no credit account is found, throw UnprocessableEntityException
      throwUnprocessableEntityException(
        'Invalid CreditAccount/Company combination',
      );
    }

    // Retrieve all credit accounts associated with the given company IDs
    const creditAccountsByHolder =
      await this.findManyByCreditAccountHolders(companyIds);

    // Filter companies that are within the list of company IDs
    const companiesWithinIds = creditAccountsByHolder
      .map((creditAccount) => creditAccount.company)
      .filter((company) => companyIds.includes(company.companyId));

    // Extract the IDs of credit account holders from the filtered companies
    const companyIdsWithinList = companiesWithinIds.map(
      (company) => company?.companyId,
    );

    // Add holder IDs to the failure array
    deleteDto.failure.push(...companyIdsWithinList.map(String));

    // Filter out IDs that are not part of the credit account holder list
    let remainingCompanyIds = companyIds.filter(
      (companyId) => !companyIdsWithinList?.includes(companyId),
    );

    // Retrieve existing valid users associated with the credit account
    const activeCreditAccountUsers = await this.creditAccountUserRepository
      .createQueryBuilder('creditAccountUser')
      .leftJoinAndSelect('creditAccountUser.creditAccount', 'creditAccount')
      .leftJoinAndSelect('creditAccount.company', 'creditAccountHolder')
      .leftJoinAndSelect(
        'creditAccountUser.company',
        'creditAccountUserCompany',
      )
      .where('creditAccountUser.isActive = :isActive', { isActive: 'Y' })
      .andWhere('creditAccount.creditAccountId = :creditAccountId', {
        creditAccountId: creditAccountId,
      })
      .andWhere('creditAccountHolder.companyId = :creditAccountHolder', {
        creditAccountHolder: creditAccountHolderId,
      })
      .andWhere('creditAccountUserCompany.companyId IN (:...companyIds)', {
        companyIds: companyIds || [],
      })
      .getMany();

    // Extract user company IDs from existing valid account users
    const activeUserCompanyIds = activeCreditAccountUsers.map(
      (creditAccountUser) => creditAccountUser?.company?.companyId,
    );

    // Update remaining company IDs by excluding those already associated with valid users
    remainingCompanyIds = remainingCompanyIds.filter(
      (companyId) => !activeUserCompanyIds?.includes(companyId),
    );

    // Add remaining company IDs to the failure array
    deleteDto.failure.push(...remainingCompanyIds.map(String));

    // Extract IDs of credit account users to be deactivated
    // const creditAccountUsersToDeactivate = activeCreditAccountUsers.map(
    //   (creditAccountUser) => ({
    //     creditAccountUserId: creditAccountUser.creditAccountUserId,
    //     companyId: creditAccountUser?.company?.companyId,
    //     clientNumber: creditAccountUser?.clientNumber,
    //   }),
    // );

    if (activeCreditAccountUsers?.length) {
      const currentDateTime: Date = new Date();
      // Deactivate credit account users and update audit fields
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      try {
        for (const creditAccountUser of activeCreditAccountUsers) {
          await queryRunner.startTransaction();
          const { affected } = await queryRunner.manager.update(
            CreditAccountUser,
            {
              creditAccountUserId: creditAccountUser?.creditAccountUserId,
            },
            {
              isActive: false,
              updatedUserGuid: currentUser.userGUID,
              updatedDateTime: currentDateTime,
              updatedUser: currentUser.userName,
              updatedUserDirectory: currentUser.orbcUserDirectory,
            },
          );

          if (affected === 0) {
            deleteDto?.failure?.includes(
              creditAccountUser?.company?.companyId?.toString(),
            );
          }

          if (affected === 1) {
            await this.logCreditAccountAndUserActivity({
              queryRunner,
              creditAccount,
              currentUser,
              currentDateTime,
              creditAccountActivityType:
                CreditAccountActivityType.ACCOUNT_USER_REMOVED,
              comment: `onRouteBC Client No.: ${creditAccountUser?.company?.clientNumber}`,
            });
          }
          await queryRunner.commitTransaction();
        }
      } catch (error) {
        await queryRunner.rollbackTransaction();
        this.logger.error(error);
        throw error;
      } finally {
        await queryRunner.release();
      }

      // Add deactivated user IDs to the success array
      deleteDto.success.push(
        ...companyIds
          .filter(
            (companyId) => !deleteDto?.failure?.includes(companyId?.toString()),
          )
          .map(String),
      );
    }

    // Return the result of the deactivation process
    return deleteDto;
  }

  /**
   * Finds one credit account by its ID and account holder.
   *
   * @param creditAccountId - The ID of the credit account to find.
   * @param creditAccountHolder - The ID of the account holder to find.
   * @returns {Promise<CreditAccount | null>} - The found credit account or null.
   */
  @LogAsyncMethodExecution()
  public async findOneByCreditAccountIdAndAccountHolder(
    creditAccountId: number,
    creditAccountHolder: number,
  ) {
    return await this.creditAccountRepository.findOne({
      where: {
        creditAccountId: creditAccountId,
        company: { companyId: creditAccountHolder },
      },
      relations: {
        company: true,
      },
    });
  }

  /**
   * Finds one credit account by account holder.
   *
   * @param creditAccountHolder - The ID of the account holder to find.
   * @returns {Promise<CreditAccount | null>} - The found credit account or null.
   */
  @LogAsyncMethodExecution()
  public async findOneByIdAndAccountHolder(creditAccountHolder: number) {
    return await this.creditAccountRepository.findOne({
      where: {
        company: { companyId: creditAccountHolder },
      },
      relations: {
        company: true,
      },
    });
  }

  /**
   * Finds many credit accounts by account holders.
   *
   * @param creditAccountHolder - An array of account holder IDs to find.
   * @returns {Promise<CreditAccount[]>} - The found credit accounts.
   */
  @LogAsyncMethodExecution()
  public async findManyByCreditAccountHolders(creditAccountHolder: number[]) {
    return await this.creditAccountRepository
      .createQueryBuilder('creditAccount')
      .leftJoinAndSelect('creditAccount.company', 'company')
      .where('company.companyId IN (:...companyId)', {
        companyId: creditAccountHolder || [],
      })
      .getMany();
  }

  /**
   * Finds many credit account users with optional filters.
   *
   * @param creditAccountUserCompanyId - The ID of the user's company to filter by.
   * @param creditAccountHolderCompanyId - The ID of the holder's company to filter by.
   * @param creditAccountId - The ID of the credit account to filter by.
   * @param creditAccountUserId - The ID of the credit account user to filter by.
   * @param isActive - The active status to filter by.
   * @returns {Promise<CreditAccountUser[]>} - The found credit account users.
   */
  private async findManyCreditAccountUsers(
    creditAccountUserCompanyId?: Nullable<number>,
    creditAccountHolderCompanyId?: Nullable<number>,
    creditAccountId?: Nullable<number>,
    creditAccountUserId?: Nullable<number>,
    isActive?: Nullable<boolean>,
  ) {
    // Initializing query builder for credit account user repository.
    const creditAccountUserQB = this.creditAccountUserRepository
      .createQueryBuilder('creditAccountUser')
      .leftJoinAndSelect(
        'creditAccountUser.company',
        'creditAccountUserCompany',
      )
      .leftJoinAndSelect('creditAccountUser.creditAccount', 'creditAccount')
      .leftJoinAndSelect('creditAccount.company', 'creditAccountHolderCompany');

    /* Conditional WHERE clause for creditAccountUserId. If creditAccountUserId is provided, the
       WHERE clause is creditAccountUser.creditAccountUserId = :creditAccountUserId; otherwise, it is 1=1 to
       include all credit account users. */
    creditAccountUserQB.where(
      creditAccountUserId
        ? 'creditAccountUser.creditAccountUserId = :creditAccountUserId'
        : '1=1',
      {
        creditAccountUserId: creditAccountUserId,
      },
    );

    // Adding condition if creditAccountId is provided.
    if (creditAccountId) {
      creditAccountUserQB.andWhere(
        'creditAccount.creditAccountId = :creditAccountId',
        {
          creditAccountId: creditAccountId,
        },
      );
    }

    // Adding condition if creditAccountHolderCompanyId is provided.
    if (creditAccountHolderCompanyId) {
      creditAccountUserQB.andWhere(
        'creditAccountHolderCompany.companyId = :creditAccountHolderCompanyId',
        {
          creditAccountHolderCompanyId: creditAccountHolderCompanyId,
        },
      );
    }

    // Adding condition if creditAccountUserCompanyId is provided.
    if (creditAccountUserCompanyId) {
      creditAccountUserQB.andWhere(
        'creditAccountUserCompany.companyId = :creditAccountUserCompanyId',
        {
          creditAccountUserCompanyId: creditAccountUserCompanyId,
        },
      );
    }

    // Adding condition to filter out disbled creditAccount Users.
    if (isActive === true || isActive === false) {
      creditAccountUserQB.andWhere('creditAccountUser.isActive = :isActive', {
        isActive: isActive ? 'Y' : 'N',
      });
    }

    // Executing the query and returning the results.
    return await creditAccountUserQB.getMany();
  }

  /**
   * Retrieves credit account users based on account holder and credit account ID.
   *
   * @param creditAccountHolder - The ID of the account holder.
   * @param creditAccountId - The ID of the credit account.
   * @param includeAccountHolder - Whether to include the account holder's information.
   * @returns {Promise<ReadCreditAccountUserDto[]>} - The list of credit account users.
   */
  @LogAsyncMethodExecution()
  public async getCreditAccountUsers({
    companyId,
    creditAccountId,
    currentUser,
    includeAccountHolder,
  }: {
    companyId: number;
    creditAccountId: number;
    currentUser: IUserJWT;
    includeAccountHolder?: Nullable<boolean>;
  }): Promise<ReadCreditAccountUserDto[]> {
    const creditAccount = await this.findCreditAccountDetails(
      companyId,
      currentUser,
      creditAccountId,
    );

    if (!creditAccount) {
      throw new DataNotFoundException();
    } else if (
      doesUserHaveRole(currentUser.orbcUserRole, [
        ClientUserRole.COMPANY_ADMINISTRATOR,
      ]) &&
      creditAccount?.company.companyId !== companyId
    ) {
      // Throw exception if companyId is a Credit Account User and user is Company Admin.
      throw new ForbiddenException();
    } else if (
      doesUserHaveRole(currentUser.orbcUserRole, [
        ClientUserRole.COMPANY_ADMINISTRATOR,
      ]) &&
      !creditAccount?.isVerified
    ) {
      // Throw exception credit account is unverified.
      throw new ForbiddenException();
    } else if (
      creditAccount?.company?.companyId === companyId &&
      creditAccount?.creditAccountStatusType ===
        CreditAccountStatus.ACCOUNT_CLOSED &&
      !(
        doesUserHaveRole(currentUser.orbcUserRole, [
          IDIRUserRole.HQ_ADMINISTRATOR,
          IDIRUserRole.SYSTEM_ADMINISTRATOR,
          IDIRUserRole.FINANCE,
          IDIRUserRole.PPC_CLERK,
          IDIRUserRole.CTPO,
        ]) ||
        doesUserHaveRole(currentUser.orbcUserRole, [
          ClientUserRole.COMPANY_ADMINISTRATOR,
        ])
      )
    ) {
      throw new DataNotFoundException();
    }

    creditAccount.creditAccountUsers =
      creditAccount?.creditAccountUsers?.filter(
        (creditAccountUser) => creditAccountUser.isActive,
      );

    let readCreditAccountUserDtoList: ReadCreditAccountUserDto[] = [];
    if (creditAccount?.creditAccountUsers?.length) {
      readCreditAccountUserDtoList = await this.classMapper.mapArrayAsync(
        creditAccount?.creditAccountUsers,
        CreditAccountUser,
        ReadCreditAccountUserDto,
      );
    }
    if (includeAccountHolder) {
      const mappedCreditAccountHolderInfo = await this.classMapper.mapAsync(
        creditAccount?.company,
        Company,
        ReadCreditAccountUserDto,
      );

      if (readCreditAccountUserDtoList?.length) {
        readCreditAccountUserDtoList?.unshift(mappedCreditAccountHolderInfo);
      } else {
        readCreditAccountUserDtoList = [mappedCreditAccountHolderInfo];
      }
    }

    return readCreditAccountUserDtoList;
  }

  /**
   * Retrieves credit account limit information based on account holder and credit account ID.
   *
   * @param companyId - The ID of the company.
   * @param creditAccountId - The ID of the credit account.
   * @param currentUser - The current authenticated user.
   * @returns {Promise<ReadCreditAccountLimitDto>} - The details of the credit account limit.
   * @throws {DataNotFoundException} - If the credit account is not found.
   * @throws {ForbiddenException} - If the user is a Company Admin but the company is a Credit Account User.
   */
  @LogAsyncMethodExecution()
  public async getCreditAccountLimit({
    companyId,
    creditAccountId,
    currentUser,
    mapBasedonRole,
  }: {
    companyId: number;
    creditAccountId: number;
    currentUser: IUserJWT;
    mapBasedonRole?: Nullable<boolean>;
  }): Promise<ReadCreditAccountLimitDto> {
    const creditAccount = await this.findCreditAccountDetails(
      companyId,
      currentUser,
      creditAccountId,
    );

    if (!creditAccount) {
      throw new DataNotFoundException();
    } else if (
      creditAccount?.creditAccountStatusType ===
        CreditAccountStatus.ACCOUNT_ON_HOLD &&
      doesUserHaveRole(currentUser.orbcUserRole, [
        ClientUserRole.COMPANY_ADMINISTRATOR,
      ]) &&
      creditAccount?.company.companyId === companyId
    ) {
      // Throw exception if companyId is a Credit Account Holder and user is Company Admin.
      throw new ForbiddenException();
    } else if (
      doesUserHaveRole(currentUser.orbcUserRole, [
        ClientUserRole.COMPANY_ADMINISTRATOR,
      ]) &&
      !creditAccount?.isVerified
    ) {
      // Throw exception credit account is unverified.
      throw new ForbiddenException();
    } else if (
      creditAccount?.company?.companyId === companyId &&
      creditAccount?.creditAccountStatusType ===
        CreditAccountStatus.ACCOUNT_CLOSED &&
      !doesUserHaveRole(currentUser.orbcUserRole, [
        IDIRUserRole.HQ_ADMINISTRATOR,
        IDIRUserRole.SYSTEM_ADMINISTRATOR,
        IDIRUserRole.FINANCE,
        IDIRUserRole.PPC_CLERK,
        IDIRUserRole.CTPO,
      ])
    ) {
      throw new DataNotFoundException();
    } else if (
      doesUserHaveRole(currentUser.orbcUserRole, [
        ClientUserRole.COMPANY_ADMINISTRATOR,
      ]) &&
      creditAccount?.company.companyId !== companyId
    ) {
      // Throw exception if companyId is a Credit Account User and user is Company Admin.
      throw new ForbiddenException();
    }

    const egarmsCreditAccountDetails =
      await this.egarmsCreditAccountService.getCreditAccountDetailsFromEGARMS(
        creditAccount.creditAccountNumber,
      );

    const orbcAmountToAdjust = await this.getCreditAccountAmountToAdjust(
      creditAccount.creditAccountId,
    );

    return await this.classMapper.mapAsync(
      creditAccount,
      CreditAccount,
      ReadCreditAccountLimitDto,
      {
        extraArgs: () => ({
          currentUser: currentUser,
          egarmsCreditAccountDetails: egarmsCreditAccountDetails,
          orbcAmountToAdjust: orbcAmountToAdjust,
          mapBasedonRole: mapBasedonRole,
        }),
      },
    );
  }

  /**
   * Validates a credit account payment transaction.
   *
   * This method checks if a transaction can be processed on a credit account. It first verifies the account status and activity,
   * ensuring the account is not closed. It also checks for sufficient balance if the transaction type is not a refund, which bypasses this validation.
   * Finally, it maps the current credit account details to a DTO for additional data comparison and validation.
   *
   * @param companyId - The ID of the company.
   * @param currentUser - The current authenticated user.
   * @param transacationType - The type of transaction being processed.
   * @param totalTransactionAmount - The total amount of the transaction.
   * @returns {Promise<CreditAccount>} - The credit account details, confirming the transaction can proceed.
   * @throws {UnprocessableEntityException} - If the account is closed, in an invalid state, or if there is insufficient balance.
   */
  @LogAsyncMethodExecution()
  public async validateCreditAccountPayment({
    companyId,
    currentUser,
    transacationType,
    totalTransactionAmount,
  }: {
    companyId: number;
    currentUser: IUserJWT;
    transacationType: TransactionType;
    totalTransactionAmount: number;
  }): Promise<CreditAccount> {
    const creditAccount = await this.findCreditAccountDetails(
      companyId,
      currentUser,
    );

    if (!creditAccount) {
      this.logger.error('Credit account does not exist.');
      throwUnprocessableEntityException(
        'Credit account is unavailable',
        'CREDIT_ACCOUNT_UNAVAILABLE',
      );
    }

    const egarmsCreditAccountDetails =
      await this.egarmsCreditAccountService.getCreditAccountDetailsFromEGARMS(
        creditAccount?.creditAccountNumber,
      );

    if (
      egarmsCreditAccountDetails?.PPABalance?.return_code ===
      EGARMS_CREDIT_ACCOUNT_NOT_FOUND
    ) {
      this.logger.error('Credit account does not exist in eGARMS.');
      throwUnprocessableEntityException(
        'Credit account is unavailable',
        'CREDIT_ACCOUNT_UNAVAILABLE',
      );
    }

    if (
      // Check if the transaction type is a REFUND and the credit account status is CLOSED
      transacationType === TransactionType.REFUND &&
      (creditAccount?.creditAccountStatusType ===
        CreditAccountStatus.ACCOUNT_CLOSED ||
        // Check if eGARMS credit account details indicate the account is CLOSED
        egarmsCreditAccountDetails?.PPABalance?.return_code ===
          EGARMS_CREDIT_ACCOUNT_CLOSED)
    ) {
      // Log an error for attempting a refund on a closed credit account
      this.logger.error('Cannot refund to a closed Credit account.');
      // Throw an exception indicating the credit account is unavailable for refund
      throwUnprocessableEntityException(
        'Credit account is unavailable',
        'CREDIT_ACCOUNT_UNAVAILABLE',
      );
    } else if (transacationType === TransactionType.REFUND) {
      // If it's a REFUND transaction but the account is not closed, return the account ID
      return creditAccount;
    } else if (
      creditAccount?.company?.isSuspended ||
      // Check if the credit account is not verified, or is not active
      !creditAccount?.isVerified ||
      creditAccount?.creditAccountStatusType !==
        CreditAccountStatus.ACCOUNT_ACTIVE ||
      // Check if eGARMS does not indicate the account is ACTIVE
      egarmsCreditAccountDetails?.PPABalance?.return_code !==
        EGARMS_CREDIT_ACCOUNT_ACTIVE
    ) {
      // Log an error for the credit account being in an invalid state
      this.logger.error('Credit account is in an invalid state.');
      // Throw an exception indicating the credit account is unavailable
      throwUnprocessableEntityException(
        'Credit account is unavailable',
        'CREDIT_ACCOUNT_UNAVAILABLE',
      );
    }
    const orbcAmountToAdjust = await this.getCreditAccountAmountToAdjust(
      creditAccount.creditAccountId,
    );

    // Map current credit account details to DTO.
    const readCreditAccountLimitDto = await this.classMapper.mapAsync(
      creditAccount,
      CreditAccount,
      ReadCreditAccountLimitDto,
      {
        extraArgs: () => ({
          currentUser: currentUser,
          egarmsCreditAccountDetails: egarmsCreditAccountDetails,
          orbcAmountToAdjust: orbcAmountToAdjust,
        }),
      },
    );

    // Check if the transaction exceeds available credit limit.
    if (
      +readCreditAccountLimitDto?.creditLimit <
      readCreditAccountLimitDto?.creditBalance + totalTransactionAmount
    ) {
      throwUnprocessableEntityException(
        `Credit account has insufficient balance.`,
        'CREDIT_ACCOUNT_INSUFFICIENT_BALANCE',
      );
    }

    return creditAccount;
  }

  /**
   * Retrieves credit account activity based on account holder and credit account ID.
   *
   * @param companyId - The ID of the company.
   * @param creditAccountId - The ID of the credit account.
   * @param currentUser - The current user.
   * @returns {Promise<ReadCreditAccountActivityDto[]>} - The list of credit account activities.
   */
  @LogAsyncMethodExecution()
  public async getCreditAccountActivity({
    companyId,
    creditAccountId,
    currentUser,
  }: {
    companyId: number;
    creditAccountId: number;
    currentUser: IUserJWT;
  }): Promise<ReadCreditAccountActivityDto[]> {
    const creditAccount = await this.findCreditAccountDetails(
      companyId,
      currentUser,
      creditAccountId,
    );

    if (!creditAccount) {
      throw new DataNotFoundException();
    } else if (creditAccount?.company.companyId !== companyId) {
      // Throw exception if companyId is a Credit Account User.
      // History is only available to Credit Account Holders
      throw new ForbiddenException();
    }

    if (creditAccount?.creditAccountActivities?.length) {
      return await this.classMapper.mapArrayAsync(
        creditAccount?.creditAccountActivities,
        CreditAccountActivity,
        ReadCreditAccountActivityDto,
      );
    }
  }

  /**
   * Finds detailed information about a credit account for a given Holder/User.
   *
   * This method retrieves credit account details based on the company ID, user information,
   * and an optional credit account ID. It considers user roles and account statuses to return relevant account information.
   *
   * @param {number} companyId - The ID of the company.
   * @param {IUserJWT} currentUser - The current user authenticated with JWT.
   * @param {Nullable<number>} [creditAccountId] - The optional ID of the credit account.
   * @returns {Promise<CreditAccount | null>} - The detailed information about the credit account, or null if not found.
   */
  @LogAsyncMethodExecution()
  public async findCreditAccountDetails(
    companyId: number,
    currentUser: IUserJWT,
    creditAccountId?: Nullable<number>,
  ) {
    let creditAccount = await this.creditAccountRepository.findOne({
      where: {
        ...(creditAccountId && { creditAccountId }),
        company: { companyId },
      },
      relations: this.granularAccessControl(
        CreditAccountUserType.ACCOUNT_HOLDER,
        currentUser.orbcUserRole,
      ),
    });

    if (
      !creditAccount ||
      creditAccount?.creditAccountStatusType ===
        CreditAccountStatus.ACCOUNT_CLOSED
    ) {
      const accountDetailsForUser = await this.creditAccountRepository.findOne({
        where: {
          creditAccountUsers: {
            ...(creditAccountId && { creditAccount: { creditAccountId } }),
            company: { companyId },
            isActive: true,
          },
        },
        relations: this.granularAccessControl(
          CreditAccountUserType.ACCOUNT_USER,
          currentUser.orbcUserRole,
        ),
      });
      if (accountDetailsForUser) {
        creditAccount = accountDetailsForUser;
      }
    }
    return creditAccount;
  }

  /**
   * Finds one credit account by account number.
   *
   * @param {IUserJWT} currentUser - The current user authenticated with JWT.
   * @param creditAccountNumber - The number of the credit account to find.
   * @returns {Promise<CreditAccount | null>} - The found credit account or null.
   */
  @LogAsyncMethodExecution()
  public async findOneByCreditAccountNumber(
    currentUser: IUserJWT,
    creditAccountNumber: string,
  ): Promise<CreditAccount | null> {
    const creditAccount = await this.creditAccountRepository.findOne({
      where: {
        creditAccountNumber: creditAccountNumber?.trim()?.toUpperCase(),
      },
      relations: this.granularAccessControl(
        CreditAccountUserType.ACCOUNT_HOLDER,
        currentUser.orbcUserRole,
      ),
    });
    return creditAccount;
  }

  /**
   * Controls access to various functionalities based on user type and authorization group.
   *
   * This method provides granular access control to credit account data and functionalities.
   * It evaluates the type of user and their authorization group, then returns an object
   * specifying their access permissions.
   *
   * @param {CreditAccountUserType} creditAccountUserType - The type of the credit account user.
   * @param {UserRole} userRole - The authorization group of the user.
   * @returns {Object} - An object representing the access permissions for the user.
   */
  private granularAccessControl(
    creditAccountUserType: CreditAccountUserType,
    userRole: UserRole,
  ) {
    switch (creditAccountUserType) {
      // Check if the user is an ACCOUNT_HOLDER
      case CreditAccountUserType.ACCOUNT_HOLDER:
        switch (userRole) {
          // Grant full finance access
          case IDIRUserRole.FINANCE:
            return {
              company: true,
              creditAccountUsers: { company: true },
              creditAccountActivities: { idirUser: true },
            };
          // Grant access to SYSTEM_ADMINISTRATOR, HQ_ADMINISTRATOR, PPC_CLERK, PPC_SUPERVISOR, and COMPANY_ADMINISTRATOR groups
          case IDIRUserRole.SYSTEM_ADMINISTRATOR:
          case IDIRUserRole.HQ_ADMINISTRATOR:
          case IDIRUserRole.PPC_CLERK:
          case IDIRUserRole.CTPO:
          case ClientUserRole.COMPANY_ADMINISTRATOR:
            return {
              company: true,
              creditAccountUsers: { company: true },
            };
          case ClientUserRole.PERMIT_APPLICANT:
            return { company: true };
        }
        break;
      // Check if the user is an ACCOUNT_USER
      case CreditAccountUserType.ACCOUNT_USER:
        switch (userRole) {
          // Grant full finance access
          case IDIRUserRole.FINANCE:
            return {
              company: true,
              creditAccountUsers: { company: true },
            };
          // Grant partial access to SYSTEM_ADMINISTRATOR, HQ_ADMINISTRATOR, PPC_CLERK, PPC_SUPERVISOR, COMPANY_ADMINISTRATOR, and PERMIT_APPLICANT groups
          case IDIRUserRole.SYSTEM_ADMINISTRATOR:
          case IDIRUserRole.HQ_ADMINISTRATOR:
          case IDIRUserRole.PPC_CLERK:
          case IDIRUserRole.CTPO:
            return {
              company: true,
              creditAccountUsers: { company: true },
            };
          case ClientUserRole.COMPANY_ADMINISTRATOR:
          case ClientUserRole.PERMIT_APPLICANT:
            return { company: true };
        }
        break;
    }
  }

  /**
   * Searches for an unsubmitted GARMS file based on the provided transaction type.
   *
   * @param {GarmsExtractType} transactionType - The type of GARMS transaction to search for.
   * @returns {Promise<Nullable<GarmsExtractFile>>} A promise that resolves to the GARMS extract file or null if not found.
   */
  @LogAsyncMethodExecution()
  async findUnsubmittedGarmsFile(
    transactionType: GarmsExtractType,
  ): Promise<Nullable<GarmsExtractFile>> {
    return this.garmsExtractFileRepository.findOne({
      where: {
        fileSubmitTimestamp: IsNull(),
        garmsExtractType: transactionType,
      },
    });
  }

  /**
   * Calculates the total adjustment amount for a credit account by summing up transactions
   * between certain time ranges, based on transaction type.
   *
   * @param {number} creditAccountId - The ID of the credit account for which the amount needs to be adjusted.
   * @returns {Promise<number>} A promise resolving to the total adjustment amount.
   */
  @LogAsyncMethodExecution()
  async getCreditAccountAmountToAdjust(
    creditAccountId: number,
  ): Promise<number> {
    // Get the current timestamp for comparison purposes
    const toTimestamp = getToDateForGarms();
    // Find an unsubmitted GARMS file for CREDIT transaction type, if exists
    const unsubmittedGarmsFile = await this.findUnsubmittedGarmsFile(
      GarmsExtractType.CREDIT,
    );

    const queryBuilder = this.creditAccountRepository
      .createQueryBuilder('creditAccount')
      .innerJoinAndSelect('creditAccount.transactions', 'transactions')
      // Filter transactions by the payment method type
      .where('transactions.paymentMethodTypeCode = :paymentMethodTypeCode', {
        paymentMethodTypeCode: PaymentMethodTypeEnum.ACCOUNT,
      })
      // Filter transactions belonging to the specific credit account
      .andWhere('creditAccount.creditAccountId = :creditAccountId', {
        creditAccountId: creditAccountId,
      });

    // If there's a fromTimestamp in unsubmitted GARMS file, include it in the filter
    if (unsubmittedGarmsFile?.fromTimestamp) {
      queryBuilder.andWhere(
        'transactions.transactionApprovedDate >= :fromTimestamp',
        { fromTimestamp: unsubmittedGarmsFile?.fromTimestamp },
      );
    }

    // Get all transactions within the date range under consideration
    queryBuilder.andWhere(
      'transactions.transactionApprovedDate < :toTimestamp',
      {
        toTimestamp: toTimestamp,
      },
    );

    const creditAccount = await queryBuilder.getOne();

    // Calculate the total transaction amount, adjusting based on the transaction type
    const totalTransactionAmount = creditAccount?.transactions?.reduce(
      (accumulator, { transactionTypeId, totalTransactionAmount }) =>
        transactionTypeId === TransactionType.PURCHASE
          ? accumulator + totalTransactionAmount
          : accumulator - totalTransactionAmount,
      0,
    );

    // Return the calculated result
    return totalTransactionAmount;
  }
}
