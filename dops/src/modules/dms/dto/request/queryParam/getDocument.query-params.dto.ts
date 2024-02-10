import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { FileDownloadModes } from '../../../../../enum/file-download-modes.enum';
import { Type } from 'class-transformer';

export class GetDocumentQueryParamsDto {
  @ApiProperty({
    enum: FileDownloadModes,
    example: FileDownloadModes.PROXY,
    description:
      'Download mode behavior.' +
      'Default behavior (undefined) will yield an HTTP 302 redirect to the S3 bucket via presigned URL.' +
      'If proxy is specified, the object contents will be available proxied through DMS.' +
      'If url is specified, expect an HTTP 201 cotaining the presigned URL as a JSON string in the response.',
    required: false,
  })
  @IsEnum(FileDownloadModes)
  download?: FileDownloadModes;

  @ApiProperty({
    description: 'Required when IDP is not IDIR.',
    example: 74,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  companyId?: number;
}
