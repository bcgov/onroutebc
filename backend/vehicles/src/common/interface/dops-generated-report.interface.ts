import { ReportTemplate } from '../enum/report-template.enum';

export interface DopsGeneratedReport {
  reportTemplate: ReportTemplate;
  reportData: object;
  generatedDocumentFileName: string;
}
