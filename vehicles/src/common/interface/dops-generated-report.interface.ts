import { ReportTemplate } from '@common/enum/report-template.enum';

export interface DopsGeneratedReport {
  reportTemplate: ReportTemplate;
  reportData: object;
  generatedDocumentFileName: string;
}
