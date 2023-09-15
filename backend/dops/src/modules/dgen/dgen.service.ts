import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { getFromCache } from '../../helper/cache.helper';
import * as Handlebars from 'handlebars';
import { CacheKey } from '../../enum/cache-key.enum';
import { CreateGeneratedReportDto } from './dto/request/create-generated-report.dto';
import puppeteer, { Browser } from 'puppeteer';
import { IFile } from '../../interface/file.interface';
import { ReportTemplate } from '../../enum/report-template.enum';

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

  private readonly _dopsCVSEFormsCacheTTLms =
    process.env.DOPS_CVSE_FORMS_CACHE_TTL_MS;
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
    const documentBufferMap = new Map<string, Buffer>();
    documentBufferMap.set('PERMIT', generatedDocument.buffer);
    const documentsToMerge = createGeneratedDocumentDto.documentsToMerge;
    if (documentsToMerge?.length) {
      await this.fetchDocumentsToMerge(documentsToMerge, documentBufferMap);
      const documentsToStringArray = documentsToMerge.map((document) =>
        document.toString(),
      );
      documentsToStringArray.unshift('PERMIT');
      try {
        const mergedDocument = await this.mergeDocuments(
          documentsToStringArray,
          documentBufferMap,
        );
        generatedDocument.buffer = Buffer.from(mergedDocument);
        generatedDocument.size = mergedDocument.length;
      } catch (err) {
        console.log('Error while trying to merge files', err);
      }
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

  private async mergeDocuments(
    documentsToMerge: string[],
    documentBufferMap: Map<string, Buffer>,
  ): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    for (const document of documentsToMerge) {
      const pdf = await PDFDocument.load(documentBufferMap.get(document));
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedDocument = await mergedPdf.save();
    return mergedDocument;
  }

  private async fetchDocumentsToMerge(
    documentsToMerge: ExternalDocumentEnum.ExternalDocument[],
    documentBufferMap: Map<string, Buffer>,
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
            +this._dopsCVSEFormsCacheTTLms,
          );
          documentBufferMap.set(externalDocument, externalDocumentBuffer);
        } else {
          documentBufferMap.set(externalDocument, documentFromCache);
        }
      }),
    );
  }

  async generateReport(
    currentUser: IUserJWT,
    createGeneratedReportDto: CreateGeneratedReportDto,
    res: Response,
  ) {
    const template = await getFromCache(
      this.cacheManager,
      this.getCacheKeyforReport(createGeneratedReportDto.reportTemplate),
    );

    if (!template?.length) {
      throw new InternalServerErrorException('Template not found');
    }
    const compiledTemplate = Handlebars.compile(template);

    const htmlBody = compiledTemplate({
      ...createGeneratedReportDto.reportData,
    });

    const generatedDocument: IFile = {
      originalname: createGeneratedReportDto.generatedDocumentFileName,
      encoding: undefined,
      mimetype: 'application/pdf',
      buffer: undefined,
      size: undefined,
    };

    let browser: Browser;
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          // '--disable-dev-shm-usage',
          // '--disable-gpu',
          // '--no-first-run',
          // '--no-zygote',
          // '--single-process',
        ],
      });
      const page = await browser.newPage();
      await page.setContent(htmlBody);
      await page.emulateMediaType('print');

      generatedDocument.buffer = await page.pdf({
        format: 'letter',
        displayHeaderFooter: true,
        printBackground: true,
        landscape: true,
        footerTemplate: `
        <div style="color: black; font-size: 6.0pt; text-align: right; width: 100%; margin-right: 32pt;">
          <span>Page </span><span class="pageNumber"></span><span> of </span><span class="totalPages"></span> 
        </div>
       `,
      });
      generatedDocument.size = generatedDocument.buffer.length;
    } catch (err) {
      throw new InternalServerErrorException(err);
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${createGeneratedReportDto.generatedDocumentFileName}`,
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

  getCacheKeyforReport(reportName: ReportTemplate): CacheKey {
    switch (reportName) {
      case ReportTemplate.PAYMENT_AND_REFUND_DETAILED_REPORT:
        return CacheKey.PAYMENT_AND_REFUND_DETAILED_REPORT;
      case ReportTemplate.PAYMENT_AND_REFUND_SUMMARY_REPORT:
        return CacheKey.PAYMENT_AND_REFUND_SUMMARY_REPORT;
      default:
        throw new Error('Invalid Report name');
    }
  }
}
