import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { CacheKey } from './enum/cache-key.enum';
import { DocumentTemplate } from './modules/dgen/entities/document-template.entity';
import { DmsService } from './modules/dms/dms.service';
import { TemplateFile } from './interface/template-file.interface';
import { FILE_ENCODING_TYPE } from './constants/dops.constant';
import { S3Service } from './modules/common/s3.service';
import { createFile } from './helper/file.helper';
import { addToCache, createCacheMap } from './helper/cache.helper';
import * as fs from 'fs';
import { DgenService } from './modules/dgen/dgen.service';
import { LogAsyncMethodExecution } from './decorator/log-async-method-execution.decorator';
import { FeatureFlagsService } from './modules/feature-flags/feature-flags.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private dgenService: DgenService,
    private s3Service: S3Service,
    private dmsService: DmsService,
    private featureFlagsService: FeatureFlagsService,
  ) {}

  getHello(): string {
    return 'DOPS Healthcheck!';
  }

  @LogAsyncMethodExecution({ printMemoryStats: true })
  async initializeCache() {
    const startDateTime = new Date();
    const templates = await this.dgenService.findAllTemplates();
    const templateFiles: TemplateFile[] = await Promise.all(
      templates.map(async (template: DocumentTemplate) => {
        const templateMetadata = await this.dmsService.findLatest(
          template.documentId,
        );
        //TODO: Temporary stopgap for release 1
        const templatefile = await this.s3Service.getFile(
          templateMetadata.fileName, //TODO: Should be templateMetadata.s3ObjectId. Using filename as temporary stopgap for release 1 integration with BCBox.
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

    await addToCache(
      this.cacheManager,
      CacheKey.EMAIL_TEMPLATE_PROFILE_REGISTRATION,
      this.convertFiletoString(
        assetsPath + 'templates/profile-registration.email.hbs',
      ),
    );
    await addToCache(
      this.cacheManager,
      CacheKey.EMAIL_TEMPLATE_ISSUE_PERMIT,
      this.convertFiletoString(assetsPath + 'templates/issue-permit.email.hbs'),
    );
    await addToCache(
      this.cacheManager,
      CacheKey.EMAIL_TEMPLATE_COMPANY_SUSPEND,
      this.convertFiletoString(
        assetsPath + 'templates/suspend-company.email.hbs',
      ),
    );
    await addToCache(
      this.cacheManager,
      CacheKey.EMAIL_TEMPLATE_COMPANY_UNSUSPEND,
      this.convertFiletoString(
        assetsPath + 'templates/unsuspend-company.email.hbs',
      ),
    );

    const featureFlags = await this.featureFlagsService.findAll();
    await addToCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
      createCacheMap(featureFlags, 'featureKey', 'featureValue'),
    );

    const endDateTime = new Date();
    const processingTime = endDateTime.getTime() - startDateTime.getTime();
    this.logger.log(
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
