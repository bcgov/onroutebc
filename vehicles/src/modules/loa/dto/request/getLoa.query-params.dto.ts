import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class GetLoaQueryParamsDto  {
  @ApiProperty({
    description:
      'Determines the expiration status of the permit. Setting to false confines the search to active permits only, while true limits it to expired permits. If unspecified, both active and expired permits are included in the results.',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsBoolean()
  expired?: boolean;

  
}
