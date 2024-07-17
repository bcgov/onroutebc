import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPolicyConfigQueryParamsDto {
  @ApiProperty({
    description:
      'A flag indicating to fetch only the current policy configuration.',
    example: true,
    default: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsBoolean()
  isCurrent?: boolean = false;
}
