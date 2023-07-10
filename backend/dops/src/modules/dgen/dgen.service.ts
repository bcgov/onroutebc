import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { DocumentTemplate } from './entities/document-template.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TemplateName } from '../../enum/template-name.enum';

@Injectable()
export class DgenService {
  constructor(
    @InjectRepository(DocumentTemplate)
    private documentTemplateRepository: Repository<DocumentTemplate>,
    private httpService: HttpService,
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
}
