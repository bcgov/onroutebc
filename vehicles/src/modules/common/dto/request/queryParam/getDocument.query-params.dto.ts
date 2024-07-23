import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { FileDownloadModes } from '../../../../../common/enum/file-download-modes.enum';

export class GetDocumentQueryParamsDto {
  @ApiProperty({
    enum: FileDownloadModes,
    example: FileDownloadModes.PROXY,
    description:
      'Download mode behavior.' +
      'If proxy is specified, the object contents will be available proxied through DMS.' +
      'If url is specified, expect an HTTP 201 cotaining the presigned URL as a JSON string in the response.',
    required: false,
  })
  @IsEnum(FileDownloadModes)
  download?: FileDownloadModes;
}
