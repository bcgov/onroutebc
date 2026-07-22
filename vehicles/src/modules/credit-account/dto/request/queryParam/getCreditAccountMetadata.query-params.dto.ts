import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetCreditAccountMetadataQueryParamsDto {
  @ApiProperty({
    description:
      'A flag indicating whether to validate the Credit Account for payment. This field is optional.',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsBoolean()
  validateForPayment?: boolean = false;
}
