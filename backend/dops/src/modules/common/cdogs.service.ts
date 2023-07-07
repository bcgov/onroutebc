/**
 * Service responsible for interacting with CDOGS (Common Document Generation
 * Service).
 */
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { IUserJWT } from '../../interface/user-jwt.interface';
import { CreateGeneratedDocumentDto } from '../dgen/dto/request/create-generated-document.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKey } from '../../enum/cache-key.enum';
import { TemplateFile } from '../../interface/template-file.interface';
import { getAccessToken } from '../../helper/gov-common-services.helper';
import { GovCommonServices } from '../../enum/gov-common-services.enum';
import { IFile } from '../../interface/file.interface';

@Injectable()
export class CdogsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Generates a document from template via CDOGS.
   * @param currentUser - The current user details of type {@link IUserJWT}
   * @param createGeneratedDocumentDto - The template details and data of type 
   *               {@link CreateGeneratedDocumentDto}.
   * @returns A Promise that resolves to an array of ReadCOMSDto objects
   *          representing the created objects.
   */
  async generateDocument(
    currentUser: IUserJWT,
    createGeneratedDocumentDto: CreateGeneratedDocumentDto,
  ): Promise<IFile> {
    const documentTemplates: TemplateFile[] = await this.cacheManager.get(
      CacheKey.DOCUMENT_TEMPLATE,
    );

    // The below implemenation is a fail proof version to always get the latest version --start
    const filteredTemplateFiles = documentTemplates.filter((element) => {
      return element.templateName === createGeneratedDocumentDto.templateName &&
        createGeneratedDocumentDto.templateVersion
        ? element.templateVersion === createGeneratedDocumentDto.templateVersion
        : true;
    });
    if (!filteredTemplateFiles?.length) {
      throw new Error('Template not found!');
    }

    if (filteredTemplateFiles?.length > 1) {
      filteredTemplateFiles.sort(
        (a, b) => a.templateVersion - b.templateVersion,
      );
    }
    // The above implemenation is a fail proof version to always get the latest version --end

    const templateFile = filteredTemplateFiles.at(0);

    const token = await getAccessToken(
      GovCommonServices.COMMON_DOCUMENT_GENERATION_SERVICE,
      this.httpService,
      this.cacheManager,
    );
    const fileName=createGeneratedDocumentDto.generatedDocumentFileName +'.pdf'

     // Calls the CDOGS service, which converts the the template document into a pdf
     const cdogsResponse = await lastValueFrom(
      this.httpService.post(
        process.env.CDOGS_URL,
        JSON.stringify({
          data: createGeneratedDocumentDto.templateData,
          template: {
            encodingType: 'base64',
            fileType: 'docx',
            content: templateFile.templatefileBase64Encoded,
          },
          options: {
            cacheReport: false,
            convertTo: 'pdf',
            overwrite: true,
            reportName: createGeneratedDocumentDto.generatedDocumentFileName +'.pdf',
          },
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        },
      ),
    );

    const generatedDocument : IFile = {
      originalname: fileName,
      encoding: cdogsResponse.headers['Content-Encoding'] as string,
      mimetype: cdogsResponse.headers['Content-Type'] as string,
      buffer: (await cdogsResponse.data) as ArrayBuffer,
      size: cdogsResponse.headers['Content-Length'] as number,
    }
    return generatedDocument;
  }

}
