import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Permit } from 'src/modules/permit/entities/permit.entity';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import * as fs from 'fs';
import {
  CDOGS_RESPONSE_TYPE,
  ENCODING_TYPE,
  TEMPLATE_FILE_PATH,
  TEMPLATE_FILE_TYPE,
  TEMPLATE_NAME,
} from './constants/template.constant';
import { formatTemplateData } from './helpers/formatTemplateData.helper';
import { TemplateVersion } from 'src/common/enum/pdf-template-version.enum';
import { FullNames } from '../cache/interface/fullNames.interface';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    private httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Find one template from the ORBC database
   * @param permitType
   * @param version
   * @returns
   */
  private async findOne(
    permitType: string,
    templateVersion: string,
  ): Promise<Template> {
    return await this.templateRepository.findOne({
      where: { templateName: permitType, templateVersion: templateVersion },
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
    templateVersion: string = TemplateVersion.LATEST,
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

    // TODO: get template url from DMS
    const url =
      'https://moti-int.objectstore.gov.bc.ca/tran_api_orbc_docs_dev/tran_api_orbc_docs_dev%40moti-int.objectstore.gov.bc.ca/7a52ba18-eaa8-4e94-bcff-849a491da67e?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=tran_api_orbc_docs_dev%2F20230526%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230526T193233Z&X-Amz-Expires=30000&X-Amz-Signature=eb2000bc1040229f7ddfafd9c2b7e0d82d2a58616d30cbb0031e1bfffae4020c&X-Amz-SignedHeaders=host&x-id=GetObject';

    // From the url provided by DMS, get the array buffer of the template
    const templateArrayBuffer = await lastValueFrom(
      this.httpService.get(url, {
        responseType: CDOGS_RESPONSE_TYPE,
      }),
    )

    // Encode array buffer to base64
    const template = templateArrayBuffer.data.toString(ENCODING_TYPE);

    return template;
  }

  /**
   * Converts code name to full name by calling the ORBC database.
   * Example: 'TROS' to 'Oversize: Term'
   * @param permit
   * @returns
   */
  private async getFullNamesFromDatabase(permit: Permit): Promise<FullNames> {
    return await this.cacheService.getFullNamesFromDatabase(permit);
  }

  /**
   * Generate pdf document from inline Template
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

    const pdf : ArrayBuffer = await cdogsResponse.data;

    return pdf;
  }

  /**
   * Saves the pdf object in DMS
   * @param {ArrayBuffer} pdf the pdf object
   * @returns a DMS reference ID
   */
  private async savePDF(pdf: ArrayBuffer): Promise<string> {
    // TODO: Should we save the permit pdf including the attachments?
    // TODO: S3 versioning
    // TODO: Temp - saves a pdf file - the CDOGS output.
    fs.writeFileSync(
      `${TEMPLATE_FILE_PATH}/${TEMPLATE_NAME}.pdf`,
      Buffer.from(pdf),
      'binary',
    );

    return '';
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
   * @returns {string} a DMS reference ID used to retrieve the template in DMS
   */
  public async generatePDF(
    permit: Permit,
    templateVersion: string = TemplateVersion.LATEST,
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
    const pdfRef = await this.savePDF(pdf);

    return pdfRef;
  }
}
