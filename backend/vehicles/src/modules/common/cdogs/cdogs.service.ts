import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Permit } from 'src/modules/permit/entities/permit.entity';
//import * as fs from 'fs';

interface Template {
  content: string;
  encodingType: 'base64';
  fileType: 'docx';
}

@Injectable()
export class CDOGSService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Queries the ORBC Template table using the permit type to get the reference to the associated template object in COMS
   * @param {string} permitType permit type. Example: 'TROS'
   * @param {string} version template version. Defaults to latest version
   * @param {string} variation optional query parameter for the variation of a template
   * @returns {string} a COMS reference ID used to retrieve the template in COMS
   */
  private async getTemplateRef(
    permitType: string,
    version: string = 'latest',
    variation?: string,
  ): Promise<string> {
    return '';
  }

  /**
   * Get the template object from COMS by reference ID
   * @param {string} templateRef key used to look up template object in COMS. @see getTemplateRef
   * @returns {string} a COMS reference ID used to retrieve the template in COMS
   */
  private async getTemplate(templateRef: string): Promise<Template> {
    const todo: Template = {
      content: 'PGI+SGVsbG8gV29ybGRcITwvYj4=',
      encodingType: 'base64',
      fileType: 'docx',
    };
    return todo;
  }

  /**
   * Generate pdf document from inline Template
   * @param {Permit} data permit data
   * @param {Template} template template version. Defaults to latest version
   * @returns {ArrayBuffer} an Array Buffer of the pdf
   */
  private async createPDF(
    permit: Permit,
    template: Template,
  ): Promise<ArrayBuffer> {
    const client_id = process.env.CDOGS_CLIENT_ID;
    const client_secret = process.env.CDOGS_CLIENT_SECRET;
    const token_url = process.env.CDOGS_TOKEN_URL;
    const cdogs_url = process.env.CDOGS_URL;

    // TODO: Map the permit data to template data? Or can I just pass all of the data to cdogs?
    console.log('permit', permit);

    // We need the oidc api to generate a token for us
    // Use 'lastValueFrom' to make the nestjs HttpService use a promise instead of on RxJS Observable
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

    const cdogsResponse = await fetch(cdogs_url, {
      method: 'POST',
      body: JSON.stringify({
        data: permit,
        template: {
          encodingType: 'base64',
          fileType: 'docx',
          content: template.content,
        },
        options: {
          cacheReport: false,
          convertTo: 'pdf',
          overwrite: true,
          reportName: `${permit.permitNumber}.pdf`,
        },
      }),
      headers: {
        Authorization: `Bearer ${keycloak.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const pdf = await cdogsResponse.arrayBuffer();

    return pdf;
  }

  /**
   * Saves the pdf object in COMS
   * @param {ArrayBuffer} pdf the pdf object
   * @returns a COMS reference ID
   */
  private async savePDF(pdf: ArrayBuffer): Promise<string> {
    // TODO: Should we save the permit pdf including the attachments?
    // TODO: S3 versioning
    return '';
  }

  /**
   * Generate a PDF using the BC Government Common Document Generation Service (CDOGS).
   * This function uses a .docx template associated with the permit type (eg. 'TROS') which is stored in the Common Object Management Service (COMS),
   * then populates the template with permit json data, then creates and saves the PDF in the COMS.
   *
   * {@link CDOGS https://digital.gov.bc.ca/bcgov-common-components/common-document-generation-service/}
   * {@link COMS https://digital.gov.bc.ca/bcgov-common-components/common-object-management-service/}
   *
   * @param {Permit} permit permit data
   * @param {string} permitType permit type. Example: 'TROS'
   * @param {string} version template version. Defaults to latest version
   * @param {string} variation optional query parameter for the variation of a template
   * @returns {string} a COMS reference ID used to retrieve the template in COMS
   */
  public async generatePDF(
    permit: Permit,
    permitType: string,
    version: string = 'latest',
    variation?: string,
  ): Promise<string> {
    const templateRef = await this.getTemplateRef(
      permitType,
      version,
      variation,
    );

    const template = await this.getTemplate(templateRef);

    const pdf = await this.createPDF(permit, template);

    const pdfRef = await this.savePDF(pdf);

    return pdfRef;
  }
}
