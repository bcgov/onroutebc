import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
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
import { TemplateVersion } from 'src/common/enum/pdf-template-version.enum';
import { FullNames } from '../cache/interface/fullNames.interface';
import { CacheService } from '../cache/cache.service';
import { DmsService } from '../dms/dms.service';
import { IFile } from '../../common/interface/file.interface';
import { PdfReturnType } from 'src/common/enum/pdf-return-type.enum';

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    private httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly dmsService: DmsService,
  ) {}

  /**
   * Find one template from the ORBC database
   * @param permitType permit type, which equals the template name in the ORBC DB
   * @param version template version
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
   * @param {string} templateVersion template version. Defaults to latest version
   * @returns {string} a DMS reference ID used to retrieve the template in DMS
   */
  private async getTemplateRef(
    permitType: string,
    templateVersion: number = TemplateVersion.LATEST,
  ): Promise<string> {
    const template = await this.findOne(permitType, templateVersion);
    return template.dmsRef;
  }

  /**
   * Get the template object from DMS by reference ID
   * @param {string} templateRef key used to look up template object in DMS. @see getTemplateRef
   * @returns {string} a DMS reference ID used to retrieve the template in DMS
   */
  private async getTemplate(templateRef: string): Promise<string> {
    // The DMS service returns an HTTP 201 containing a direct, temporary pre-signed S3 object URL location
    const dmsDocument = await this.dmsService.findOne(templateRef);
    const url = dmsDocument.preSignedS3Url;

    // From the url provided by DMS, get the array buffer of the template
    const templateArrayBuffer = await lastValueFrom(
      this.httpService.get(url, {
        responseType: CDOGS_RESPONSE_TYPE,
      }),
    );

    // Decode array buffer to base64
    const template = templateArrayBuffer.data.toString(ENCODING_TYPE);

    return template;
  }

  /**
   * Converts code names to full names by calling the ORBC database.
   * Example: 'TROS' to 'Oversize: Term'
   * @param permit
   * @returns
   */
  private async getFullNamesFromDatabase(permit: Permit): Promise<FullNames> {
    return await this.cacheService.getFullNamesFromDatabase(permit);
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
    const fullNames = await this.getFullNamesFromDatabase(permit);
    const templateData = await formatTemplateData(permit, fullNames);

    // We need the oidc api to generate a token for us
    const oidcResponse = await lastValueFrom(
      this.httpService.post(
        token_url,
        `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );
    const keycloak = await oidcResponse.data;

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

    const pdf: ArrayBuffer = await cdogsResponse.data;

    return pdf;
  }

  /**
   * Saves the pdf in DMS using the DMS service
   * @param {ArrayBuffer} pdf
   * @returns a DMS reference ID
   */
  private async savePDF(pdf: ArrayBuffer, returnValue?: PdfReturnType): Promise<string> {
    const file: IFile = {
      buffer: pdf,
      originalname: TEMPLATE_NAME,
      mimetype: 'application/pdf',
    };

    const readFileDto = await this.dmsService.create(file);

    let returnVal : string;

    switch(returnValue) {
      case PdfReturnType.MIME_TYPE:
        returnVal = readFileDto.objectMimeType;
        break;
      case PdfReturnType.DMS_DOC_ID:
        returnVal = readFileDto.documentId;
        break;
      case PdfReturnType.PRESIGNED_URL:
        returnVal = readFileDto.preSignedS3Url;
        break;
      case PdfReturnType.S3_OBJ_ID:
        returnVal = readFileDto.s3ObjectId;
        break;
      default:
        returnVal = readFileDto.documentId;
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
   * @param {string} templateVersion template version. Defaults to latest version
   * @param {PdfReturnType} returnValue optional parameter to choose the return type
   * @returns {string} a DMS reference ID used to retrieve the template in DMS
   */
  public async generatePDF(
    permit: Permit,
    templateVersion: number = TemplateVersion.LATEST,
    returnValue?: PdfReturnType,
  ): Promise<string> {
    // Call ORBC Template table to get the DMS Reference of the associated template/permit type
    const templateRef = await this.getTemplateRef(
      permit.permitType,
      templateVersion,
    );

    // Call DMS to get the template
    const template = await this.getTemplate(templateRef);

    // Call CDOGS to generate the pdf
    const pdf = await this.createPDF(permit, template);

    // Call DMS to store the pdf
    const dmsRef = await this.savePDF(pdf, returnValue);

    return dmsRef;
  }
}
