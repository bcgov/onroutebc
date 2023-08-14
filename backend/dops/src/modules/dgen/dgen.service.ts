import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTemplate } from './entities/document-template.entity';
import { TemplateName } from '../../enum/template-name.enum';
import { CdogsService } from '../common/cdogs.service';
import { DmsService } from '../dms/dms.service';
import { IUserJWT } from '../../interface/user-jwt.interface';
import { CreateGeneratedDocumentDto } from './dto/request/create-generated-document.dto';
import { Response } from 'express';
import { Readable } from 'stream';
import { ExternalDocument } from './entities/external-document.entity';
import * as ExternalDocumentEnum from '../../enum/external-document.enum';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class DgenService {
  constructor(
    @InjectRepository(DocumentTemplate)
    private documentTemplateRepository: Repository<DocumentTemplate>,
    @InjectRepository(ExternalDocument)
    private externalDocumentRepository: Repository<ExternalDocument>,
    private readonly cdogsService: CdogsService,
    private readonly dmsService: DmsService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Find all templates registered in ORBC_DOCUMENT_TEMPLATE
   * @returns A list of templates of type {@link DocumentTemplate}
   */
  async findAllTemplates(): Promise<DocumentTemplate[]> {
    return await this.documentTemplateRepository.find();
  }

  async getLatestTemplates(): Promise<DocumentTemplate[]> {
    const latestTemplates = await this.documentTemplateRepository
      .createQueryBuilder('documentTemplate')
      .innerJoin(
        (query) =>
          query
            .select('template_name')
            .addSelect('MAX(template.templateVersion)', 'max_version')
            .from(DocumentTemplate, 'template')
            .groupBy('template_name'),
        'documentTemplateLatest',
        'documentTemplate.templateName = documentTemplateLatest.template_name AND documentTemplate.templateVersion = documentTemplateLatest.max_version',
      )
      .getMany();

    return latestTemplates;
  }

  /**
   * Find one template from the ORBC database
   * @param permitType permit type, which equals the template name in the ORBC DB
   * @param templateVersion template version
   * @returns
   */
  private async findTemplateEntity(
    templateName: TemplateName,
    templateVersion: number,
  ): Promise<DocumentTemplate> {
    return this.documentTemplateRepository.findOne({
      where: { templateName: templateName, templateVersion: templateVersion },
    });
  }

  async generate(
    currentUser: IUserJWT,
    createGeneratedDocumentDto: CreateGeneratedDocumentDto,
    res: Response,
    companyId?: number,
  ) {
    const generatedDocument = await this.cdogsService.generateDocument(
      currentUser,
      createGeneratedDocumentDto,
    );
    const documentBufferList: Buffer[] = [generatedDocument.buffer];
    const documentsToMerge = createGeneratedDocumentDto.documentsToMerge;
    if (documentsToMerge?.length) {
      await this.fetchDocumentsToMerge(documentsToMerge, documentBufferList);
      const mergedDocument = await this.mergeDocuments(documentBufferList);
      generatedDocument.buffer = Buffer.from(mergedDocument);
      generatedDocument.size = mergedDocument.length;
    }

    const dmsObject = await this.dmsService.create(
      currentUser,
      generatedDocument,
      companyId,
    );
    res.setHeader('x-orbc-dms-id', dmsObject.documentId);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${generatedDocument.originalname}`,
    );
    res.setHeader('Content-Length', generatedDocument.size);
    res.setHeader('Content-Type', generatedDocument.mimetype);
    const stream = new Readable();
    stream.push(generatedDocument.buffer);
    stream.push(null); // indicates end-of-file basically - the end of the stream
    stream.pipe(res);
    /*Wait for the stream to end before sending the response status and
        headers. This ensures that the client receives a complete response and
        prevents any issues with partial responses or response headers being
        sent prematurely.*/
    stream.on('end', () => {
      return null;
    });
    stream.on('error', () => {
      throw new Error('An error occurred while reading the file.');
    });
  }

  private async mergeDocuments(documentBufferList: Buffer[]) {
    const mergedPdf = await PDFDocument.create();
    for (const pdfBuffer of documentBufferList) {
      const pdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedDocument = await mergedPdf.save();
    return mergedDocument;
  }

  private async fetchDocumentsToMerge(
    documentsToMerge: ExternalDocumentEnum.ExternalDocument[],
    documentBufferList: Buffer[],
  ) {
    await Promise.all(
      documentsToMerge.map(async (externalDocument) => {
        const documentFromCache: Buffer = await this.cacheManager.get(
          externalDocument,
        );
        if (!documentFromCache) {
          const externalDocumentDetails =
            await this.externalDocumentRepository.findOne({
              where: {
                documentName: externalDocument,
              },
            });

          const resExternalDocs = await lastValueFrom(
            this.httpService.get(externalDocumentDetails.documentLocation, {
              responseType: 'arraybuffer',
            }),
          );

          const externalDocumentBuffer = Buffer.from(
            resExternalDocs.data as string,
            'binary',
          );

          await this.cacheManager.set(
            externalDocument,
            externalDocumentBuffer,
            600000,
          );
          documentBufferList.push(externalDocumentBuffer);
        } else {
          documentBufferList.push(documentFromCache);
        }
      }),
    );
  }
}
