import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosResponse, AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { GovCommonServices } from '../../common/enum/gov-common-services.enum';
import { getAccessToken } from '../../common/helper/gov-common-services.helper';
import { Company } from '../company-user-management/company/entities/company.entity';
import { CreateAccountRequestDto } from '../credit-account/cfs-integration/request/create-account.request.dto';
import { CreatePartyRequestDto } from '../credit-account/cfs-integration/request/create-party.request.dto';
import { CreateSiteContactRequestDto } from '../credit-account/cfs-integration/request/create-site-contact.request.dto';
import { CreateSiteRequestDto } from '../credit-account/cfs-integration/request/create-site.request.dto';
import { CreateAccountResponseDto } from '../credit-account/cfs-integration/response/create-account.response.dto';
import { CreatePartyResponseDto } from '../credit-account/cfs-integration/response/create-party.response.dto';
import { CreateSiteContactResponseDto } from '../credit-account/cfs-integration/response/create-site-contact.response.dto';
import { CreateSiteResponseDto } from '../credit-account/cfs-integration/response/create-site.response.dto';
import { Address } from './entities/address.entity';
import { lastValueFrom } from 'rxjs';
import { Nullable } from '../../common/types/common';

@Injectable()
export class CFSCreditAccountService {
  private readonly logger = new Logger(CFSCreditAccountService.name);
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Determines if the provided HTTP status code represents a successful response.
   *
   * @param {number} status - The HTTP status code to check.
   *
   * @returns {boolean}
   * Returns `true` if the status code is either `HttpStatus.OK` (200) or `HttpStatus.CREATED` (201);
   * otherwise, returns `false`.
   */
  private static isSuccess(status: number) {
    return (
      (status as HttpStatus) === HttpStatus.OK ||
      (status as HttpStatus) === HttpStatus.CREATED
    );
  }

  /**
   * Creates a new party by making a POST request to the provided URL with the client's number.
   *
   * @param {Object} params - The parameters for creating a party.
   * @param {string} params.url - The URL to which the request will be made.
   * @param {string} params.clientNumber - The client number to be used in the request.
   *
   * @returns {Promise<CreatePartyResponseDto>}
   * A promise that resolves to an instance of CreatePartyResponseDto containing the party data
   * if the request is successful, or null if the request fails.
   *
   * @throws {Error}
   * Throws an error if there is any issue with the HTTP request or response.
   */
  @LogAsyncMethodExecution()
  public async createParty({
    clientNumber,
    url,
  }: {
    url: string;
    clientNumber: string;
  }): Promise<CreatePartyResponseDto> {
    const partyResponse = await this.cfsPostRequest<
      CreatePartyRequestDto,
      CreatePartyResponseDto
    >({
      url,
      data: {
        customer_name: clientNumber,
      } as CreatePartyRequestDto,
      responseType: 'stream'
    });

    const data = partyResponse?.data as CreatePartyResponseDto;
    if (
      CFSCreditAccountService.isSuccess(partyResponse.status) &&
      data.party_number
    ) {
      return data;
    } else {
      this.logger.error('Step 1 - Unable to create a party for the company');
      return null;
    }
  }

  /**
   * Creates a new account by making a POST request to the provided URL with the client's number and credit account number.
   *
   * @param {Object} params - The parameters for creating an account.
   * @param {string} params.url - The URL to which the request will be made.
   * @param {string} params.clientNumber - The client number to be used in the request.
   * @param {string} params.creditAccountNumber - The credit account number to be used in the request.
   *
   * @returns {Promise<CreateAccountResponseDto | null>}
   * A promise that resolves to an instance of CreateAccountResponseDto containing the account data
   * if the request is successful, or null if the request fails.
   *
   * @throws {Error}
   * Throws an error if there is any issue with the HTTP request or response.
   */
  @LogAsyncMethodExecution()
  public async createAccount({
    url,
    clientNumber,
    creditAccountNumber,
  }: {
    url: string;
    clientNumber: string;
    creditAccountNumber: string;
  }) {
    const partyResponse = await this.cfsPostRequest<
      CreateAccountRequestDto,
      CreateAccountResponseDto
    >({
      url,
      data: {
        account_number: creditAccountNumber,
        account_description: `OnRouteBC Credit Account for ${clientNumber}`,
      } as CreateAccountRequestDto,
      responseType: 'stream'
    });
    const data = partyResponse?.data as CreateAccountResponseDto;
    if (
      CFSCreditAccountService.isSuccess(partyResponse?.status) &&
      data.account_number
    ) {
      return data;
    } else {
      this.logger.error('Step 2 - Unable to create an account for the company');
      return null;
    }
  }

  /**
   * Creates a new site by making a POST request to the provided URL with the specified mailing address.
   *
   * @param {Object} params - The parameters for creating a site.
   * @param {string} params.url - The URL to which the request will be made.
   * @param {Address} params.mailingAddress - The mailing address to be used in the request.
   *
   * @returns {Promise<CreateSiteResponseDto | null>}
   * A promise that resolves to an instance of CreateSiteResponseDto containing the site data
   * if the request is successful, or null if the request fails.
   *
   * @throws {Error}
   * Throws an error if there is any issue with the HTTP request or response.
   */
  @LogAsyncMethodExecution()
  public async createSite({
    url,
    mailingAddress,
  }: {
    url: string;
    mailingAddress: Address;
  }) {
    const partyResponse = await this.cfsPostRequest<
      CreateSiteRequestDto,
      CreateSiteResponseDto
    >({
      url,
      data: {
        customer_site_id: 'orbc-default',
        site_name: 'DEFAULT SITE',
        primary_bill_to: 'Y',
        address_line_1: mailingAddress.addressLine1,
        address_line_2: mailingAddress.addressLine2,
        city: mailingAddress.city,
        postal_code: mailingAddress.postalCode,
        province: mailingAddress.province.provinceCode,
        country: mailingAddress.province.country.countryCode,
        customer_profile_class: 'CAS_IND_DEFAULT',
      } as CreateSiteRequestDto,
    });
    const data = partyResponse?.data as CreateSiteResponseDto;
    if (
      CFSCreditAccountService.isSuccess(partyResponse?.status) &&
      data.site_number
    ) {
      return data;
    } else {
      this.logger.error('Step 3 - Unable to create a site for the company');
      // Returning null here because, we can still save the
      // outcome of step 1 and 2 in the DB and account status can be SETUP_FAIL
      return null;
    }
  }

  /**
   * Creates a new site contact by making a POST request to the provided URL with the specified company information.
   *
   * @param {Object} params - The parameters for creating a site contact.
   * @param {string} params.url - The URL to which the request will be made.
   * @param {Company} params.companyInfo - The company information to be used in the request.
   *
   * @returns {Promise<boolean>}
   * A promise that resolves to a boolean indicating success (true) or failure (false) of the site contact creation.
   *
   * @throws {Error}
   * Throws an error if there is any issue with the HTTP request or response.
   */
  @LogAsyncMethodExecution()
  public async createSiteContact({
    url,
    companyInfo,
  }: {
    url: string;
    companyInfo: Company;
  }) {
    const partyResponse = await this.cfsPostRequest<
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

    const data = partyResponse?.data as CreateSiteContactResponseDto;
    if (
      CFSCreditAccountService.isSuccess(partyResponse?.status) &&
      data.contact_number
    ) {
      return true;
    } else {
      this.logger.error(
        'Step 4 - Unable to create a site contact for the company',
      );
      return false;
    }
  }

  /**
   * Makes a POST request to the specified URL with the given data and returns the response.
   *
   * @template Request - The type of the request payload.
   * @template Response - The type of the response payload.
   *
   * @param {Object} params - The parameters for the POST request.
   * @param {string} params.url - The URL to which the request will be made.
   * @param {Request} params.data - The data to be sent in the POST request.
   *
   * @returns {Promise<AxiosResponse<Response>>}
   * A promise that resolves to the Axios response containing the response data if the request is successful.
   *
   * @throws {Error}
   * Throws an error if there is any issue with the HTTP request or response.
   */
  private async cfsPostRequest<Request, Response>({
    url,
    data,
    responseType,
  }: {
    url: string;
    data: Request;
    responseType?: Nullable<string>;
  }) {
    const token = await getAccessToken(
      GovCommonServices.CREDIT_ACCOUNT_SERVICE,
      this.httpService,
      this.cacheManager,
    );
    const response = await lastValueFrom(
      this.httpService.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        responseType: responseType === 'stream' ? responseType : undefined,
      }),
    )
      .then((response) => {
        return response;
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          this.logger.error(
            `Error response from CFS: ${error.response.status} ${error.response.statusText} `,
          );
        } else {
          this.logger.error(error?.message, error?.stack);
        }
        throw new InternalServerErrorException('Error posting to CFS');
      });
    if (responseType === 'stream') {
      const jsonData = await this.extractJSONfromSteam(
        response.data as NodeJS.ReadableStream,
      );
      response.data = JSON.parse(jsonData) as JSON;
    }
    return response;
  }

  private async extractJSONfromSteam(data: NodeJS.ReadableStream) {
    return new Promise<string>((resolve, reject) => {
      const dataChunks: string[] = [];

      data.on('data', (chunk) => {
        // Convert buffer to string and append to dataChunks
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        dataChunks.push(chunk.toString());
      });
      data.on('end', () => resolve(dataChunks.join('')));
      data.on('error', (err) => reject(err));
    });
  }

  /**
   * Makes a GET request to the specified URL and returns the response.
   *
   * @template Response - The type of the response payload.
   *
   * @param {Object} params - The parameters for the GET request.
   * @param {string} params.url - The URL to which the request will be made.
   *
   * @returns {Promise<AxiosResponse<Response>>}
   * A promise that resolves to the Axios response containing the response data if the request is successful.
   *
   * @throws {Error}
   * Throws an error if there is any issue with the HTTP request or response.
   */
  async cfsGetRequest<Response>({ url }: { url: string }) {
    const token = await getAccessToken(
      GovCommonServices.CREDIT_ACCOUNT_SERVICE,
      this.httpService,
      this.cacheManager,
    );
    const response = await this.httpService.axiosRef.get<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AxiosResponse<Response, any>,
      Request
    >(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}
