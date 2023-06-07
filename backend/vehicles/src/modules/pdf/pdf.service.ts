import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Permit } from 'src/modules/permit/entities/permit.entity';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import {
  CDOGS_RESPONSE_TYPE,
  ENCODING_TYPE,
  TEMPLATE_FILE_TYPE,
  TEMPLATE_NAME,
} from './constants/template.constant';
import { formatTemplateData } from './helpers/formatTemplateData.helper';
import {
  DownloadMode,
  PdfReturnType,
} from 'src/common/enum/pdf-return-type.enum';
import { KeycloakResponse } from './interface/keycloakResponse.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FullNames } from './interface/fullNames.interface';
import { PermitData } from './interface/permit.template.interface';
import { getFullNameFromCache } from 'src/common/helper/cache.helper';
import { DmsResponse } from 'src/common/interface/dms.interface';
import { CompanyService } from '../company-user-management/company/company.service';
import {
  createReadStream,
  createWriteStream,
  statSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import { Stream } from 'stream';

@Injectable()
export class PdfService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    private httpService: HttpService,
    private companyService: CompanyService,
  ) {}

  /**
   * Find one template from the ORBC database
   * @param permitType permit type, which equals the template name in the ORBC DB
   * @param templateVersion template version
   * @returns
   */
  private async findOne(
    permitType: string,
    templateVersion: number,
  ): Promise<Template> {
    return await this.templateRepository.findOne({
      where: { permitTypeId: permitType, templateVersion: templateVersion },
    });
  }

  /**
   * Queries the ORBC Template table using the permit type to get the reference to the associated template object in DMS
   * @param {string} permitType permit type. Example: 'TROS'
   * @param {number} templateVersion template version
   * @returns {string} a DMS reference ID used to retrieve the template in DMS
   */
  private async getTemplateRef(
    permitType: string,
    templateVersion: number,
  ): Promise<string> {
    const template = await this.findOne(permitType, templateVersion);
    return template.dmsRef;
  }

  /**
   * Get the template object from DMS by reference ID
   * @param {string} templateRef key used to look up template object in DMS. @see getTemplateRef
   * @returns {string} a DMS reference ID used to retrieve the template in DMS
   */
  private async getTemplate(
    access_token: string,
    templateRef: string,
  ): Promise<string> {
    // The DMS service returns an HTTP 201 containing a direct, temporary pre-signed S3 object URL location
    const dmsDocument = await lastValueFrom(
      this.httpService.get(`${process.env.DMS_URL}/dms/${templateRef}`, {
        headers: { Authorization: access_token },
        params: { download: 'url' },
      }),
    )
      .then((response) => {
        return response.data as DmsResponse;
      })
      .catch((error) => {
        console.log('dmsDocument error: ', error);
        throw new BadRequestException();
      });

    const url = dmsDocument.preSignedS3Url;

    // From the url provided by DMS, get the array buffer of the template
    const templateArrayBuffer = await lastValueFrom(
      this.httpService.get(url, {
        responseType: CDOGS_RESPONSE_TYPE,
      }),
    ).then((response) => {
      return response.data as Buffer;
    });

    // Decode array buffer to string
    const template = templateArrayBuffer.toString(ENCODING_TYPE);

    return template;
  }

  /**
   * Converts code names to full names by calling the cache manager.
   * Example: 'TROS' to 'Oversize: Term'
   * @param permit
   * @returns
   */
  private async getFullNamesFromCache(permit: Permit): Promise<FullNames> {
    const permitData = JSON.parse(permit.permitData.permitData) as PermitData;

    const vehicleTypeName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.vehicleDetails.vehicleType,
    )) as string;
    const vehicleSubTypeName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.vehicleDetails.vehicleSubType,
    )) as string;

    const mailingCountryName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.vehicleDetails.countryCode,
    )) as string;
    const mailingProvinceName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.vehicleDetails.provinceCode,
    )) as string;

    const vehicleCountryName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.mailingAddress.countryCode,
    )) as string;
    const vehicleProvinceName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.mailingAddress.provinceCode,
    )) as string;

    const permitName = (await getFullNameFromCache(
      this.cacheManager,
      permit.permitType,
    )) as string;

    return {
      vehicleTypeName,
      vehicleSubTypeName,
      mailingCountryName,
      mailingProvinceName,
      vehicleCountryName,
      vehicleProvinceName,
      permitName,
    };
  }

  /**
   * Generate pdf document using CDOGS and an inline template
   * @param {Permit} permit permit data
   * @param {Template} template template as a base64 string
   * @returns {ArrayBuffer} an Array Buffer of the pdf
   */
  private async createPDF(
    permit: Permit,
    template: string,
  ): Promise<ArrayBuffer> {
    const client_id = process.env.CDOGS_CLIENT_ID;
    const client_secret = process.env.CDOGS_CLIENT_SECRET;
    const token_url = process.env.CDOGS_TOKEN_URL;
    const cdogs_url = process.env.CDOGS_URL;

    // Format the template data to be used in the templated word documents
    const fullNames = await this.getFullNamesFromCache(permit);
    const companyInfo = await this.companyService.findOne(permit.companyId);
    const templateData = formatTemplateData(permit, fullNames, companyInfo);

    // We need the oidc api to generate a token for us
    const keycloak = await lastValueFrom(
      this.httpService.post(
        token_url,
        `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    ).then((response) => {
      return response.data as KeycloakResponse;
    });

    // Calls the CDOGS service, which converts the the template document into a pdf
    const cdogsResponse = await lastValueFrom(
      this.httpService.post(
        cdogs_url,
        JSON.stringify({
          data: templateData,
          template: {
            encodingType: ENCODING_TYPE,
            fileType: TEMPLATE_FILE_TYPE,
            content: template,
          },
          options: {
            cacheReport: false,
            convertTo: 'pdf',
            overwrite: true,
            reportName: `${TEMPLATE_NAME}.pdf`,
          },
        }),
        {
          headers: {
            Authorization: `Bearer ${keycloak.access_token}`,
            'Content-Type': 'application/json',
          },
          responseType: CDOGS_RESPONSE_TYPE,
        },
      ),
    );

    const pdf = (await cdogsResponse.data) as ArrayBuffer;

    return pdf;
  }

  /**
   * Saves the pdf in DMS using the DMS service
   * @param {ArrayBuffer} pdf
   * @returns a DMS reference ID
   */
  private async savePDF(
    access_token: string,
    pdf: ArrayBuffer,
    returnValue?: PdfReturnType,
  ): Promise<string> {
    // Convert Array Buffer to Blob to pass to DMS microservice
    const formData = new FormData();
    formData.append('file', new Blob([pdf]));

    const dmsResource = await lastValueFrom(
      this.httpService.post(`${process.env.DMS_URL}/dms/upload`, formData, {
        headers: { Authorization: access_token },
      }),
    )
      .then((response) => {
        return response.data as DmsResponse;
      })
      .catch((error) => {
        console.log('dmsResource error: ', error);
        throw new BadRequestException();
      });

    let returnVal: string;

    switch (returnValue) {
      case PdfReturnType.MIME_TYPE:
        returnVal = dmsResource.objectMimeType;
        break;
      case PdfReturnType.DMS_DOC_ID:
        returnVal = dmsResource.documentId;
        break;
      case PdfReturnType.PRESIGNED_URL:
        returnVal = dmsResource.preSignedS3Url;
        break;
      case PdfReturnType.S3_OBJ_ID:
        returnVal = dmsResource.s3ObjectId;
        break;
      default:
        returnVal = dmsResource.documentId;
    }

    return returnVal;
  }

  /**
   * Generate a PDF using the BC Government Common Document Generation Service (CDOGS).
   * This function uses a .docx template associated with the permit type (eg. 'TROS') which is stored in the Document Management Service (DMS),
   * then populates the template with permit json data, then creates and saves the PDF in the DMS.
   *
   * {@link CDOGS https://digital.gov.bc.ca/bcgov-common-components/common-document-generation-service/}
   * {@link COMS https://digital.gov.bc.ca/bcgov-common-components/common-object-management-service/}
   *
   * @param {Permit} permit permit data
   * @param {number} templateVersion template version
   * @param {PdfReturnType} returnValue optional parameter to choose the return type
   * @returns {string} value of returnValue type. Defaults to DMS Document Reference ID
   */
  public async generatePDF(
    access_token: string,
    permit: Permit,
    templateVersion: number,
    returnValue?: PdfReturnType,
  ): Promise<string> {
    // Call ORBC Template table to get the DMS Reference of the associated template/permit type
    const templateRef = await this.getTemplateRef(
      permit.permitType,
      templateVersion,
    );

    // Call DMS to get the template
    const template = await this.getTemplate(access_token, templateRef);

    // Call CDOGS to generate the pdf
    const pdf = await this.createPDF(permit, template);

    // Call DMS to store the pdf
    const dms = await this.savePDF(access_token, pdf, returnValue);

    return dms;
  }

  private async createFile(data: Stream) {
    const streamReadPromise = new Promise<Buffer>((resolve) => {
      const chunks = [];
      data.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk));
      });
      data.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });
    return await streamReadPromise;
  }

  public async findPDFbyDocumentId(
    access_token: string,
    documentId: string,
    downloadMode: DownloadMode = DownloadMode.URL,
  ): Promise<DmsResponse> {
    // Determine response type based on download mode
    const resType = downloadMode === DownloadMode.PROXY ? 'stream' : 'json';

    // TODO: handle redirect option
    const dmsDocument = await lastValueFrom(
      this.httpService.get(`${process.env.DMS_URL}/dms/${documentId}`, {
        headers: { Authorization: access_token },
        params: { download: downloadMode },
        responseType: resType,
      }),
    )
      .then(async (response) => {
        if (downloadMode === DownloadMode.PROXY) {
          const file = await this.createFile(response.data);
          response.data.file = file;
        }
        return response.data as DmsResponse;
      })
      .catch((error) => {
        console.log('dmsDocument error: ', error);
        throw new BadRequestException();
      });

    return dmsDocument;
  }
}
