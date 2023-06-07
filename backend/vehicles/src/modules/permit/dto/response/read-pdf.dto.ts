import { StreamableFile } from "@nestjs/common";

export class ReadPdfDto {
  documentId: string;
  document: string | StreamableFile ;
}
