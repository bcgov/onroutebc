import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @IsBoolean()
  @IsOptional()
  allApplications?: boolean = true;
}
