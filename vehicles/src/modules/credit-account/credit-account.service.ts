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
import {
  CreditAccountLimit,
  CreditAccountLimitType,
} from '../../common/enum/credit-account-limit.enum';
import { CreditAccountStatusType } from '../../common/enum/credit-account-status-type.enum';
import { CreditAccountType } from '../../common/enum/credit-account-type.enum';
import { BadRequestExceptionDto } from '../../common/exception/badRequestException.dto';
import { callDatabaseSequence } from '../../common/helper/database.helper';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
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
}
