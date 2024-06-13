import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { DataSource, Repository } from 'typeorm';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import {
  CreditAccountLimit,
  CreditAccountLimitType,
} from '../../common/enum/credit-account-limit.enum';
import { CreditAccountStatusType } from '../../common/enum/credit-account-status-type.enum';
import { CreditAccountType } from '../../common/enum/credit-account-type.enum';
import { BadRequestExceptionDto } from '../../common/exception/badRequestException.dto';
import {
  isActiveCreditAccount,
  isClosedCreditAccount,
} from '../../common/helper/credit-account.helper';
import { callDatabaseSequence } from '../../common/helper/database.helper';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { Nullable } from '../../common/types/common';
import { DeleteDto } from '../common/dto/response/delete.dto';
import { Company } from '../company-user-management/company/entities/company.entity';
import { cfsPostRequest } from './cfs-integration/api-helper';
import { CreateAccountRequestDto } from './cfs-integration/request/create-account.request.dto';
import { CreatePartyRequestDto } from './cfs-integration/request/create-party.request.dto';
import { CreateSiteContactRequestDto } from './cfs-integration/request/create-site-contact.request.dto';
import { CreateSiteRequestDto } from './cfs-integration/request/create-site.request.dto';
import { CreateAccountResponseDto } from './cfs-integration/response/create-account.response.dto';
import { CreatePartyResponseDto } from './cfs-integration/response/create-party.response.dto';
import { CreateSiteContactResponseDto } from './cfs-integration/response/create-site-contact.response.dto';
import { CreateSiteResponseDto } from './cfs-integration/response/create-site.response.dto';
import { CreateCreditAccountUserDto } from './dto/request/create-credit-account-user.dto';
import { DeleteCreditAccountUserDto } from './dto/request/delete-credit-account-user.dto';
import { ReadCreditAccountUserDto } from './dto/response/read-credit-account-user.dto';
import { CreditAccountUser } from './entities/credit-account-user.entity';
import { CreditAccount } from './entities/credit-account.entity';

@Injectable()
export class CreditAccountService {
  private readonly logger = new Logger(CreditAccountService.name);
  constructor(
    private dataSource: DataSource,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(CreditAccount)
    private readonly creditAccountRepository: Repository<CreditAccount>,
    @InjectRepository(CreditAccountUser)
    private readonly creditAccountUserRepository: Repository<CreditAccountUser>,
  ) {}

  async create(
    currentUser: IUserJWT,
    {
      companyId,
      creditLimit,
    }: { companyId: number; creditLimit: CreditAccountLimitType },
  ) {
    await this.validateCreateCreditAccount(companyId);

    const companyInfo = await this.dataSource
      .createQueryBuilder()
      .select(['company'])
      .leftJoinAndSelect('company.mailingAddress', 'mailingAddress')
      .leftJoinAndSelect('company.primaryContact', 'primaryContact')
      .leftJoinAndSelect('mailingAddress.province', 'province')
      .leftJoinAndSelect('province.country', 'country')
      .from(Company, 'company')
      .where('company.companyId = :companyId', {
        companyId,
      })
      .getOne();

    // 1) Create Party
    const partyResponse = await this.createParty(companyInfo);
    const { party_number: cfsPartyNumber, links: partiesLinks } = partyResponse;
    const { href: accountsURL } = partiesLinks.find(
      ({ rel }) => rel === 'accounts',
    );

    // 2) Create Account for the Party created in step 1.
    const {
      account_number: creditAccountNumber,
      links: accountsResponseLinks,
    } = await this.createAccount({
      url: accountsURL,
      clientNumber: companyInfo.clientNumber,
    });

    // 3) Create Site for the Party and Account created in steps 1 and 2.
    const { href: sitesURL } = accountsResponseLinks.find(
      ({ rel }) => rel === 'sites',
    );
    const sitesResponse = await this.createSite({ url: sitesURL, companyInfo });
    const siteCreated = Boolean(sitesResponse);

    let cfsSiteNumber: number;
    let siteContactCreated = false;

    // Only if site was created in step 3, step 4 can execute.
    if (siteCreated) {
      const { site_number, links: sitesResponseLinks } = sitesResponse;
      cfsSiteNumber = +site_number;

      // 4) Create Site Contact for the site created in step 3.
      const { href: siteContactURL } = sitesResponseLinks.find(
        ({ rel }) => rel === 'contacts',
      );
      siteContactCreated = await this.createSiteContact({
        url: siteContactURL,
        companyInfo,
      });
    }

    const savedCreditAccount = await this.creditAccountRepository.save({
      companyId: { companyId },
      cfsPartyNumber: +cfsPartyNumber,
      cfsSiteNumber: cfsSiteNumber ?? -1,
      creditAccountStatusType:
        siteCreated && siteContactCreated
          ? CreditAccountStatusType.ACCOUNT_ACTIVE
          : CreditAccountStatusType.ACCOUNT_SETUP_FAIL,
      creditLimit,
      creditAccountType:
        creditLimit === CreditAccountLimit.PREPAID
          ? CreditAccountType.PREPAID
          : CreditAccountType.SECURED,
      creditAccountNumber,
      createdUser: currentUser.userName,
      createdDateTime: new Date(),
      createdUserDirectory: currentUser.orbcUserDirectory,
      createdUserGuid: currentUser.userGUID,
      updatedUser: currentUser.userName,
      updatedDateTime: new Date(),
      updatedUserDirectory: currentUser.orbcUserDirectory,
      updatedUserGuid: currentUser.userGUID,
    });
    return savedCreditAccount;
  }

  async getCreditAccount(currentUser: IUserJWT, companyId: number) {
    return await this.creditAccountRepository.findOne({
      where: {
        company: { companyId },
      },
    });
  }

  async close(currentUser: IUserJWT, companyId: number) {
    return this.updateCreditAccountStatus(
      { companyId, statusToUpdateTo: CreditAccountStatusType.ACCOUNT_CLOSED },
      currentUser,
    );
  }

  async putOnHold(currentUser: IUserJWT, companyId: number) {
    return this.updateCreditAccountStatus(
      { companyId, statusToUpdateTo: CreditAccountStatusType.ACCOUNT_ON_HOLD },
      currentUser,
    );
  }

  async unHold(currentUser: IUserJWT, companyId: number) {
    return this.updateCreditAccountStatus(
      { companyId, statusToUpdateTo: CreditAccountStatusType.ACCOUNT_ACTIVE },
      currentUser,
    );
  }

  async reopen(currentUser: IUserJWT, companyId: number) {
    return this.updateCreditAccountStatus(
      { companyId, statusToUpdateTo: CreditAccountStatusType.ACCOUNT_ACTIVE },
      currentUser,
    );
  }

  private async updateCreditAccountStatus(
    {
      companyId,
      statusToUpdateTo,
    }: { companyId: number; statusToUpdateTo: CreditAccountStatusType },
    currentUser: IUserJWT,
  ) {
    const { affected } = await this.creditAccountRepository
      .createQueryBuilder('creditAccount')
      .update()
      .set({
        creditAccountStatusType: statusToUpdateTo,
        updatedUser: currentUser.userName,
        updatedDateTime: new Date(),
        updatedUserDirectory: currentUser.orbcUserDirectory,
        updatedUserGuid: currentUser.userGUID,
      })
      .where('company.companyId = :companyId', {
        companyId,
      })
      .andWhere('creditAccountStatusType = :creditAccountStatusType', {
        creditAccountStatusType: CreditAccountStatusType.ACCOUNT_ACTIVE,
      })
      .execute();
    if (affected === 1) {
      return await this.getCreditAccount(currentUser, companyId);
    } else {
      throw new BadRequestExceptionDto();
    }
  }

  private async getPaddedCreditAccountNumber(): Promise<string> {
    const rawCreditAccountSequenceNumber = await callDatabaseSequence(
      'permit.ORBC_CREDIT_ACCOUNT_NUMBER_SEQ',
      this.dataSource,
    );
    let paddedCreditAccountSequenceNumber = rawCreditAccountSequenceNumber;
    while (paddedCreditAccountSequenceNumber.length < 4) {
      paddedCreditAccountSequenceNumber =
        '0' + paddedCreditAccountSequenceNumber;
    }
    return paddedCreditAccountSequenceNumber;
  }

  private async createParty({
    companyId,
    ...companyInfo
  }: Company): Promise<CreatePartyResponseDto> {
    const BASE_URL = process.env.CREDIT_ACCOUNT_URL;
    const { status, statusText, data } = await this.processCFSPostRequest<
      CreatePartyRequestDto,
      CreatePartyResponseDto
    >({
      url: `${BASE_URL}/cfs/parties/`,
      data: {
        customer_name: companyInfo.clientNumber,
      } as CreatePartyRequestDto,
    });
    if (
      (status === HttpStatus.OK || status === HttpStatus.CREATED) &&
      data.party_number
    ) {
      return data;
    } else {
      this.logger.error('Step 1 - Unable to create a party for the company');
      throw new InternalServerErrorException(
        'Unable to create a party for the company.',
        statusText,
      );
    }
  }

  private async createAccount({
    url,
    clientNumber,
  }: {
    url: string;
    clientNumber: string;
  }) {
    const paddedCreditAccountSequenceNumber =
      await this.getPaddedCreditAccountNumber();
    const creditAccountNumber = `WS${paddedCreditAccountSequenceNumber}`;
    const { status, statusText, data } = await this.processCFSPostRequest<
      CreateAccountRequestDto,
      CreateAccountResponseDto
    >({
      url,
      data: {
        account_number: creditAccountNumber,
        account_description: `OnRouteBC Credit Account for ${clientNumber}`,
      } as CreateAccountRequestDto,
    });
    if (
      (status === HttpStatus.OK || status === HttpStatus.CREATED) &&
      data.account_number
    ) {
      return data;
    } else {
      this.logger.error('Step 2 - Unable to create an account for the company');
      throw new InternalServerErrorException(
        'Unable to create an account for the company.',
        statusText,
      );
    }
  }

  private async createSite({
    url,
    companyInfo,
  }: {
    url: string;
    companyInfo: Company;
  }) {
    const { status, statusText, data } = await this.processCFSPostRequest<
      CreateSiteRequestDto,
      CreateSiteResponseDto
    >({
      url,
      data: {
        customer_site_id: 'orbc-default',
        site_name: 'DEFAULT SITE',
        primary_bill_to: 'Y',
        address_line_1: companyInfo.mailingAddress.addressLine1,
        address_line_2: companyInfo.mailingAddress.addressLine2,
        city: companyInfo.mailingAddress.city,
        postal_code: companyInfo.mailingAddress.postalCode,
        province: companyInfo.mailingAddress.province.provinceCode,
        country: companyInfo.mailingAddress.province.country.countryCode,
        customer_profile_class: 'CAS_IND_DEFAULT',
      } as CreateSiteRequestDto,
    });
    if (
      (status === HttpStatus.OK || status === HttpStatus.CREATED) &&
      data.site_number
    ) {
      return data;
    } else {
      this.logger.error('Step 3 - Unable to create a site for the company');
      // Returning null here because, we can still save the
      // outcome of step 1 and 2 in the DB and account status can be
      return null;
    }
  }

  private async createSiteContact({
    url,
    companyInfo,
  }: {
    url: string;
    companyInfo: Company;
  }) {
    const { status, statusText, data } = await this.processCFSPostRequest<
      CreateSiteContactRequestDto,
      CreateSiteContactResponseDto
    >({
      url,
      data: {
        first_name: companyInfo.primaryContact.firstName,
        last_name: companyInfo.primaryContact.lastName,
        phone_number: companyInfo.phone,
        email_address: companyInfo.email,
      } as CreateSiteContactRequestDto,
    });
    if (
      (status === HttpStatus.OK || status === HttpStatus.CREATED) &&
      data.contact_number
    ) {
      return true;
    } else {
      this.logger.error(
        'Step 4 - Unable to create a site contact for the company',
      );
    }
  }

  private async validateCreateCreditAccount(companyId: number): Promise<void> {
    const companyIsAlreadyAUser = await this.creditAccountUserRepository.exists(
      {
        where: { company: { companyId }, isActive: true },
      },
    );
    if (companyIsAlreadyAUser) {
      throw new BadRequestException(
        'Company is already a user of another credit account.',
      );
    }

    const companyAlreadyHasCreditAccount =
      await this.creditAccountRepository.exists({
        where: {
          company: { companyId },
          // What to do if there's a credit account not in ACTIVE status?
          // creditAccountStatusType: In([CreditAccountStatusType.ACCOUNT_ACTIVE, ]),
        },
      });
    if (companyAlreadyHasCreditAccount) {
      throw new BadRequestException('Company already has a credit account.');
    }
  }

  private async processCFSPostRequest<Request, Response>({
    url,
    data,
  }: {
    url: string;
    data: Request;
  }) {
    return await cfsPostRequest<Request, Response>(
      { httpService: this.httpService, cacheManager: this.cacheManager },
      { url, data },
    );
  }

  /**
   * Adds or activates a credit account user.
   *
   * @param currentUser - The current user performing the action.
   * @param creditAccountHolderId - The ID of the credit account holder.
   * @param creditAccountId - The ID of the credit account.
   * @param companyId - The ID of the company in CreateCreditAccountUserDto.
   * @returns {Promise<string>} - The result of the add or activate process.
   * @throws BadRequestException - If the credit account or company combination is invalid.
   * @throws InternalServerErrorException - If user update or creation fails.
   */
  @LogAsyncMethodExecution()
  public async addOrActivateCreditAccountUser(
    currentUser: IUserJWT,
    creditAccountHolderId: number,
    creditAccountId: number,
    createCreditAccountUserDto: CreateCreditAccountUserDto,
  ): Promise<ReadCreditAccountUserDto> {
    // Find the credit account by creditAccountId and creditAccountHolderId
    const creditAccount =
      await this.findOneCreditAccountByCreditAccountIdAndAccountHolder(
        creditAccountId,
        creditAccountHolderId,
      );

    if (!creditAccount) {
      // If no credit account is found, throw an exception
      throw new BadRequestException(
        'Invalid CreditAccount/Company combination',
      );
    }

    if (isClosedCreditAccount(creditAccount)) {
      throw new BadRequestException('Credit Account closed - Cannot add user');
    }

    // Find if there is an existing credit account by companyId as holder
    const existingCreditAccountAsHolder =
      await this.findOneCreditAccountByCreditAccountHolder(
        createCreditAccountUserDto.companyId,
      );

    let existingCreditAccountUserList: CreditAccountUser[] = null;
    // If the credit account is not active, find many credit account users by companyId
    if (!isActiveCreditAccount(existingCreditAccountAsHolder)) {
      existingCreditAccountUserList = await this.findManyCreditAccountUsers(
        createCreditAccountUserDto.companyId,
      );
    }

    // Check if there is an active credit account or if there are any active credit account users
    if (
      isActiveCreditAccount(existingCreditAccountAsHolder) ||
      existingCreditAccountUserList?.filter(
        (creditAccountUser) => creditAccountUser.isActive,
      )?.length
    ) {
      // If so, throw an exception
      throw new BadRequestException(
        'Client already associated with an active Credit Account',
      );
    }

    // Find if there is a credit account user mapped to the credit account with the same companyId
    const creditAccountUserMappedToCreditAccount =
      existingCreditAccountUserList?.find(
        (creditAccountUser) =>
          creditAccountUser.company.companyId ===
            createCreditAccountUserDto.companyId &&
          creditAccountUser.creditAccount.creditAccountId === creditAccountId,
      );
    if (creditAccountUserMappedToCreditAccount?.isActive) {
      // If the user is active, throw an exception
      throw new BadRequestException(
        'Client already associated with the Credit Account',
      );
    } else if (
      creditAccountUserMappedToCreditAccount &&
      !creditAccountUserMappedToCreditAccount.isActive
    ) {
      // If the user is not active, update the user to be active and save changes
      const { affected } = await this.creditAccountUserRepository.update(
        {
          creditAccountUserId:
            creditAccountUserMappedToCreditAccount.creditAccountUserId,
        },
        {
          isActive: true,
          updatedUserGuid: currentUser.userGUID,
          updatedDateTime: new Date(),
          updatedUser: currentUser.userName,
          updatedUserDirectory: currentUser.orbcUserDirectory,
        },
      );
      if (affected === 0) {
        // If no rows are affected, throw an exception
        throw new InternalServerErrorException(
          'Credit Account user update failed!!',
        );
      }

      const updatedCreditAccountUserInfo =
        await this.findManyCreditAccountUsers(
          null,
          null,
          null,
          creditAccountUserMappedToCreditAccount.creditAccountUserId,
        );
      return this.classMapper.mapAsync(
        updatedCreditAccountUserInfo?.at(0),
        CreditAccountUser,
        ReadCreditAccountUserDto,
      );
    } else {
      // If no user is found, create a new credit account user
      let newCreditAccountUser = await this.classMapper.mapAsync(
        createCreditAccountUserDto,
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

      newCreditAccountUser =
        await this.creditAccountUserRepository.save(newCreditAccountUser);

      const newCreditAccountUserInfo = await this.findManyCreditAccountUsers(
        null,
        null,
        null,
        newCreditAccountUser.creditAccountUserId,
      );
      return this.classMapper.mapAsync(
        newCreditAccountUserInfo?.at(0),
        CreditAccountUser,
        ReadCreditAccountUserDto,
      );
    }
  }

  @LogAsyncMethodExecution()
  /**
   * Deactivates users of a credit account for specified companies.
   *
   * @param currentUser - The current user performing the deactivation.
   * @param creditAccountHolderId - The ID of the holder of the credit account.
   * @param creditAccountId - The ID of the credit account.
   * @param companyData - Object containing company IDs for deactivation.
   * @returns {Promise<DeleteDto>} - The result of the deactivation process.
   * @throws BadRequestException - If the credit account or company combination is invalid.
   * @throws InternalServerErrorException - If deactivation fails.
   */
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
    const creditAccount =
      await this.findOneCreditAccountByCreditAccountIdAndAccountHolder(
        creditAccountId,
        creditAccountHolderId,
      );

    if (!creditAccount) {
      // If no credit account is found, throw BadRequestException
      throw new BadRequestException(
        'Invalid CreditAccount/Company combination',
      );
    }

    // Retrieve all credit accounts associated with the given company IDs
    const creditAccountsByHolder =
      await this.findManyCreditAccountByCreditAccountHolders(companyIds);

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
    const userIdsToDeactivate = activeCreditAccountUsers.map(
      (creditAccountUser) => creditAccountUser.creditAccountUserId,
    );

    if (userIdsToDeactivate?.length) {
      // Deactivate credit account users and update audit fields
      const { affected } = await this.creditAccountUserRepository
        .createQueryBuilder('creditAccountUser')
        .update()
        .set({
          isActive: false,
          updatedUser: currentUser.userName,
          updatedDateTime: new Date(),
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        })
        .where('creditAccountUserId IN (:...userIdsToDeactivate)', {
          userIdsToDeactivate: userIdsToDeactivate,
        })
        .execute();
      if (affected === 0) {
        // If no records are updated, throw InternalServerErrorException
        throw new InternalServerErrorException(
          'Credit Account user deactivation failed!!',
        );
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
  public async findOneCreditAccountByCreditAccountIdAndAccountHolder(
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
  public async findOneCreditAccountByCreditAccountHolder(
    creditAccountHolder: number,
  ) {
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
  public async findManyCreditAccountByCreditAccountHolders(
    creditAccountHolder: number[],
  ) {
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
   * @returns {Promise<CreditAccountUser[]>} - The found credit account users.
   */
  private async findManyCreditAccountUsers(
    creditAccountUserCompanyId?: Nullable<number>,
    creditAccountHolderCompanyId?: Nullable<number>,
    creditAccountId?: Nullable<number>,
    creditAccountUserId?: Nullable<number>,
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

    // Executing the query and returning the results.
    return await creditAccountUserQB.getMany();
  }

  /**
   * Retrieves credit account users based on account holder and credit account ID.
   *
   * @param creditAccountHolder - The ID of the account holder.
   * @param creditAccountId - The ID of the credit account.
   * @returns {Promise<CreditAccountUser[]>} - The found credit account users.
   */
  @LogAsyncMethodExecution()
  private async getCreditAccountUsersEntity(
    creditAccountHolder: number,
    creditAccountId: number,
  ) {
    return await this.findManyCreditAccountUsers(
      null,
      creditAccountHolder,
      creditAccountId,
    );
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
  public async getCreditAccountUsers(
    creditAccountHolder: number,
    creditAccountId: number,
    includeAccountHolder?: Nullable<boolean>,
  ): Promise<ReadCreditAccountUserDto[]> {
    const creditAccountUsers = await this.getCreditAccountUsersEntity(
      creditAccountHolder,
      creditAccountId,
    );

    const readCreditAccountUserDtoList = await this.classMapper.mapArrayAsync(
      creditAccountUsers,
      CreditAccountUser,
      ReadCreditAccountUserDto,
    );

    if (includeAccountHolder) {
      const creditAccountHolderInfo =
        creditAccountUsers?.at(0)?.creditAccount?.company;
      const mappedCreditAccountHolderInfo = await this.classMapper.mapAsync(
        creditAccountHolderInfo,
        Company,
        ReadCreditAccountUserDto,
      );

      readCreditAccountUserDtoList.push(mappedCreditAccountHolderInfo);
    }
    return readCreditAccountUserDtoList;
  }
}
