import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DgenService } from './modules/dgen/dgen.service';
import { CacheKey } from './enum/cache-key.enum';
import { DocumentTemplate } from './modules/dgen/entities/document-template.entity';
import { DmsService } from './modules/dms/dms.service';
import { TemplateFile } from './interface/template-file.interface';
import { FILE_ENCODING_TYPE } from './constants/dops.constant';
import { S3Service } from './modules/common/s3.service';
import { createFile } from './helper/file.helper';
import { addToCache } from './helper/cache.helper';
import * as fs from 'fs';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private dgenService: DgenService,
    private s3Service: S3Service,
    private dmsService: DmsService,
  ) {}

  getHello(): string {
    return 'DOPS Healthcheck!';
  }

  async initializeCache() {
    const startDateTime = new Date();
    const templates = await this.dgenService.findAllTemplates();
    const templateFiles: TemplateFile[] = await Promise.all(
      templates.map(async (template: DocumentTemplate) => {
        const templateMetadata = await this.dmsService.findLatest(
          template.documentId,
        );
        const templatefile = await this.s3Service.getFile(
          templateMetadata.s3ObjectId,
        );

        return {
          ...template,
          templatefile: (await createFile(templatefile)).toString(
            FILE_ENCODING_TYPE,
          ),
        };
      }),
    );
    await this.cacheManager.set(CacheKey.DOCUMENT_TEMPLATE, templateFiles);

    const assetsPath =
      process.env.NODE_ENV === 'local' ? './src/assets/' : './dist/assets/';

    await addToCache(
      this.cacheManager,
      CacheKey.PAYMENT_AND_REFUND_DETAILED_REPORT,
      this.convertFiletoString(
        assetsPath + 'templates/payment-refund-detailed.report.hbs',
      ),
    );

    await addToCache(
      this.cacheManager,
      CacheKey.PAYMENT_AND_REFUND_SUMMARY_REPORT,
      this.convertFiletoString(
        assetsPath + 'templates/payment-refund-summary.report.hbs',
      ),
    );

    const endDateTime = new Date();
    const processingTime = endDateTime.getTime() - startDateTime.getTime();
    console.info(
      `initializeCache() -> Start time: ${startDateTime.toISOString()},` +
        `End time: ${endDateTime.toISOString()},` +
        `Processing time: ${processingTime}ms`,
    );
  }

  private convertFiletoString(filePath: string, encode?: string) {
    const file = fs.readFileSync(filePath, 'utf-8');
    if (encode) {
      return Buffer.from(file).toString('base64');
    } else {
      return Buffer.from(file).toString();
    }
  }
}
