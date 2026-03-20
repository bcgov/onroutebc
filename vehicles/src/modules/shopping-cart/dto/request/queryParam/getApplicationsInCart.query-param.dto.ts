import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetApplicationInCartQueryParams {
  @ApiPropertyOptional({
    description:
      `If true, all applications in the company are retrieved; ` +
      `if false, only the current user's own applications are retrieved.` +
      `This field is only accepted for company administrators or staff;` +
      `Ignored otherwise.`,
    example: true,
  })
  @Type(() => Boolean)
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    if (obj[key] === 'true') return true;
    return obj[key] === 'false' ? false : obj[key];
  })
  @IsOptional()
  @IsBoolean()
  allApplications?: boolean;
}
