import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditAccount } from './entities/credit-account.entity';
import { DataSource, Repository } from 'typeorm';
import { CreditAccountStatusType } from '../../common/enum/credit-account-status-type.enum';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { BadRequestExceptionDto } from '../../common/exception/badRequestException.dto';
import {
  CreditAccountLimit,
  CreditAccountLimitType,
} from '../../common/enum/credit-account-limit.enum';
import { getCreditAccessToken } from '../../common/helper/gov-common-services.helper';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Nullable } from '../../common/types/common';
import { CompanyService } from '../company-user-management/company/company.service';
import { CreditAccountType } from '../../common/enum/credit-account-type.enum';
import { callDatabaseSequence } from '../../common/helper/database.helper';
import { CreditAccountUser } from './entities/credit-account-user.entity';
import { Company } from '../company-user-management/company/entities/company.entity';

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
    const token = await getCreditAccessToken(
      this.httpService,
      this.cacheManager,
    );

    const companyIsAlreadyAUser = await this.creditAccountUserRepository.exists(
      {
        where: { company: { companyId } },
      },
    );
    if (companyIsAlreadyAUser) {
      throw new BadRequestException(
        'Company is already a user of another credit account.',
      );
    }

    const companyAlreadyHasCreditAccount =
      await this.creditAccountRepository.exists({
        where: { company: { companyId } },
      });
    if (companyAlreadyHasCreditAccount) {
      throw new BadRequestException('Company already has a credit account.');
    }

    const companyInfo = await this.dataSource
      .createQueryBuilder()
      .select(['company'])
      .leftJoinAndSelect('company.mailingAddress', 'mailingAddress')
      .leftJoinAndSelect('company.primaryContact', 'primaryContact')
      .from(Company, 'company')
      .where('company.companyId = :companyId', {
        companyId,
      })
      .getOne();
    // const companyInfo = await this.companyService.findOne(companyId);

    const BASE_URL = process.env.CREDIT_ACCOUNT_URL;
    const partiesResponse = await this.httpService.axiosRef.post(
      `${BASE_URL}/cfs/parties/`,
      { customer_name: companyInfo.clientNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (partiesResponse.status === HttpStatus.OK) {
      const { data } = partiesResponse;
      const { party_number: cfsPartyNumber, links } = data as {
        party_number: string;
        business_number: Nullable<string>;
        customer_name: string;
        links: Array<{ rel: string; href: string }>;
      };

      const rawCreditAccountSequenceNumber = await callDatabaseSequence(
        'permit.ORBC_CREDIT_ACCOUNT_NUMBER_SEQ',
        this.dataSource,
      );
      let paddedCreditAccountSequenceNumber = rawCreditAccountSequenceNumber;
      while (paddedCreditAccountSequenceNumber.length < 4) {
        paddedCreditAccountSequenceNumber =
          '0' + paddedCreditAccountSequenceNumber;
      }
      const creditAccountNumber = `WS${paddedCreditAccountSequenceNumber}`;
      const { href: accountsURL } = links.find(({ rel }) => rel === 'accounts');
      const accountsResponse = await this.httpService.axiosRef.post(
        accountsURL,
        {
          account_number: creditAccountNumber,
          account_description: 'OnRouteBC Credit Account',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (accountsResponse.status === HttpStatus.OK) {
        const { data } = accountsResponse;
        const { account_number: accountNumber, links } = data as {
          account_number: string;
          party_number: string;
          account_description: string;
          customer_profile_class: 'CAS_CORP_DEFAULT';
          links: Array<{ rel: string; href: string }>;
        };
        const { href: sitesURL } = links.find(({ rel }) => rel === 'sites');
        const sitesResponse = await this.httpService.axiosRef.post(
          sitesURL,
          {
            customer_site_id: 'orbc-default',
            site_name: 'DEFAULT SITE',
            primary_bill_to: 'Y',
            address_line_1: companyInfo.mailingAddress.addressLine1,
            address_line_2: companyInfo.mailingAddress.addressLine2,
            city: companyInfo.mailingAddress.city,
            postal_code: companyInfo.mailingAddress.postalCode,
            province: companyInfo.mailingAddress.province.provinceCode,
            country: companyInfo.mailingAddress.province.country,
            customer_profile_class: 'CAS_IND_DEFAULT',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (sitesResponse.status === HttpStatus.OK) {
          const { data } = sitesResponse;
          const { site_number: cfsSiteNumber, links } = data as {
            site_number: string;
            party_number: string;
            account_number: string;
            customer_site_id: string;
            site_name: string;
            primary_bill_to: Nullable<'Y' | 'N'>;
            address_line_1: string;
            address_line_2: Nullable<string>;
            address_line_3: Nullable<string>;
            city: string;
            postal_code: string;
            province: Nullable<string>;
            state: Nullable<string>;
            country: string;
            customer_profile_class: 'CAS_IND_DEFAULT';
            receipt_method: null;
            provider: 'Transportation and Infrastructure';
            links: Array<{ rel: string; href: string }>;
          };

          const { href: siteContactURL } = links.find(
            ({ rel }) => rel === 'contacts',
          );

          const siteContactResponse = await this.httpService.axiosRef.post(
            siteContactURL,
            {
              first_name: companyInfo.primaryContact.firstName,
              middle_name: '',
              last_name: companyInfo.primaryContact.lastName,
              phone_number: companyInfo.phone,
              email_address: companyInfo.email,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          );
          if (siteContactResponse.status === HttpStatus.OK) {
            const { data } = siteContactResponse;
            data as {
              contact_number: string;
              party_number: string;
              account_number: string;
              site_number: string;
              full_name: string;
              first_name: string;
              middle_name: Nullable<string>;
              last_name: string;
              phone_number: string;
              email_address: string;
              provider: 'Transportation and Infrastructure';
              links: Array<{ rel: string; href: string }>;
            };
          }

          const savedCreditAccount = await this.creditAccountRepository.save({
            companyId: { companyId },
            cfsPartyNumber: +cfsPartyNumber,
            cfsSiteNumber: +cfsSiteNumber,
            creditAccountStatusType: CreditAccountStatusType.ACCOUNT_ACTIVE,
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
      }
    }

    return 'created';
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

  async updateCreditAccountStatus(
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
}
