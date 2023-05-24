import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Permit } from 'src/modules/permit/entities/permit.entity';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import * as fs from 'fs';
import { ITemplate } from './interface/template.interface';
import {
  ENCODING_TYPE,
  TEMPLATE_FILE_PATH,
  TEMPLATE_FILE_TYPE,
  TEMPLATE_NAME,
} from './constants/template.constant';
import { PowerUnitTypesService } from '../vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from '../vehicles/trailer-types/trailer-types.service';
import { formatTemplateData } from './helpers/formatTemplateData';
import { Country } from '../common/entities/country.entity';
import { Province } from '../common/entities/province.entity';

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    private httpService: HttpService,
    private powerUnitTypeService: PowerUnitTypesService,
    private trailerTypeService: TrailerTypesService,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
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
   * Queries the ORBC Template table using the permit type to get the reference to the associated template object in COMS
   * @param {string} permitType permit type. Example: 'TROS'
   * @param {string} templateVersion template version. Defaults to latest version
   * @returns {string} a COMS reference ID used to retrieve the template in COMS
   */
  private async getTemplateRef(
    permitType: string,
    templateVersion: string = 'latest',
  ): Promise<string> {
    const template = await this.findOne(permitType, templateVersion);
    return template.comsRef;
  }

  /**
   * Get the template object from COMS by reference ID
   * @param {string} templateRef key used to look up template object in COMS. @see getTemplateRef
   * @returns {string} a COMS reference ID used to retrieve the template in COMS
   */
  private async getTemplate(templateRef: string): Promise<ITemplate> {
    // TODO: implement
    const todo: ITemplate = {
      content: 'TODO',
      encodingType: ENCODING_TYPE,
      fileType: TEMPLATE_FILE_TYPE,
    };
    return todo;
  }

  /**
   * Generate pdf document from inline Template
   * @param {Permit} permit permit data
   * @param {Template} template template version. Defaults to latest version
   * @returns {ArrayBuffer} an Array Buffer of the pdf
   */
  private async createPDF(
    permit: Permit,
    template: ITemplate,
  ): Promise<ArrayBuffer> {
    const client_id = process.env.CDOGS_CLIENT_ID;
    const client_secret = process.env.CDOGS_CLIENT_SECRET;
    const token_url = process.env.CDOGS_TOKEN_URL;
    const cdogs_url = process.env.CDOGS_URL;

    // TODO: Map/format the permit data to template data
    // Parse permitData string into JSON
    const templateData = await formatTemplateData(
      permit,
      this.powerUnitTypeService, //TODO: fix prop drilling?
      this.trailerTypeService, //TODO: fix prop drilling?
      this.countryRepository, //TODO: fix prop drilling?
      this.provinceRepository, //TODO: fix prop drilling?
    );

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

    // TODO: get this from COMS and use the passed in template variable
    // Temp helper function
    const encode = (file: string) => {
      const contents = fs.readFileSync(file);
      return contents.toString(ENCODING_TYPE);
    };

    // TODO: get this from COMS
    const templateContent = encode(
      `${TEMPLATE_FILE_PATH}/${TEMPLATE_NAME}.${TEMPLATE_FILE_TYPE}`,
    );

    // TODO: Change to use axios/httpService
    const cdogsResponse = await fetch(cdogs_url, {
      method: 'POST',
      body: JSON.stringify({
        data: templateData,
        template: {
          encodingType: ENCODING_TYPE,
          fileType: TEMPLATE_FILE_TYPE,
          content: templateContent,
        },
        options: {
          cacheReport: false,
          convertTo: 'pdf',
          overwrite: true,
          reportName: `${TEMPLATE_NAME}.pdf`,
        },
      }),
      headers: {
        Authorization: `Bearer ${keycloak.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    // TODO: which format does COMS/DMS expect? Currently set to array buffer
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
   * This function uses a .docx template associated with the permit type (eg. 'TROS') which is stored in the Common Object Management Service (COMS),
   * then populates the template with permit json data, then creates and saves the PDF in the COMS.
   *
   * {@link CDOGS https://digital.gov.bc.ca/bcgov-common-components/common-document-generation-service/}
   * {@link COMS https://digital.gov.bc.ca/bcgov-common-components/common-object-management-service/}
   *
   * @param {Permit} permit permit data
   * @param {string} templateVersion template version. Defaults to latest version
   * @returns {string} a COMS reference ID used to retrieve the template in COMS
   */
  public async generatePDF(
    permit: Permit,
    templateVersion: string = 'latest',
  ): Promise<string> {
    const templateRef = await this.getTemplateRef(
      permit.permitType,
      templateVersion,
    );

    const template = await this.getTemplate(templateRef);

    const pdf = await this.createPDF(permit, template);

    const pdfRef = await this.savePDF(pdf);

    return pdfRef;
  }
}
