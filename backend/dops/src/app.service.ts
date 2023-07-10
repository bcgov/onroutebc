import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DgenService } from './modules/dgen/dgen.service';
import { ComsService } from './modules/common/coms.service';
import { CacheKey } from './enum/cache-key.enum';
import { DocumentTemplate } from './modules/dgen/entities/document-template.entity';
import { DmsService } from './modules/dms/dms.service';
import { FileDownloadModes } from './enum/file-download-modes.enum';
import { TemplateFile } from './interface/template-file.interface';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private dgenService: DgenService,
    private comsService: ComsService,
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
        const templatefile = (await this.comsService.getObject(
          undefined,
          templateMetadata,
          FileDownloadModes.PROXY,
        )) as Buffer;
        return { ...template, templatefile: templatefile.toString('base64') };
      }),
    );
    await this.cacheManager.set(CacheKey.DOCUMENT_TEMPLATE, templateFiles);

    const endDateTime = new Date();
    const processingTime = endDateTime.getTime() - startDateTime.getTime();
    console.log(
      `initializeCache() -> Start time: ${startDateTime.toISOString()},` +
        `End time: ${endDateTime.toISOString()},` +
        `Processing time: ${processingTime}ms`,
    );
  }
}
