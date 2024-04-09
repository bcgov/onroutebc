import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetApplicationInCartQueryParams {
  @ApiPropertyOptional({
    description:
      `If true, all applications in the company are retrieved; ` +
      `if false, only the current user's own applications are retrieved.` +
      `This field only applies to company administrators or staff;` +
      `permit applicants will receive a bad request.`,
    example: true,
    default: true,
  })
  @Type(() => Boolean)
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsOptional()
  @IsBoolean()
  allApplications?: boolean;
}
