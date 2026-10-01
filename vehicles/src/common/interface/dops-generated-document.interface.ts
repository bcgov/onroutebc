import { TemplateName } from '@common/enum/template-name.enum';

export interface DopsGeneratedDocument {
  templateName: TemplateName;
  templateVersion?: number;
  templateData: object;
  generatedDocumentFileName: string;
  documentsToMerge?: string[];
}
