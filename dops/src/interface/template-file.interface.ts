import { TemplateName } from '../enum/template-name.enum';

export interface TemplateFile {
  templateId: number;
  templateName: TemplateName;
  templateVersion: number;
  documentId: string;
  templatefile: string;
}
