import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class LcvQueryParamDto {
  @ApiProperty({
    type: 'boolean',
    example: false,
    description:
      'Indicates whether the company is permitted to operate long combination vehicles',
  })
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsBoolean()
  isLcvAllowed: boolean;
}
