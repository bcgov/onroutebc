import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
  Length,
} from 'class-validator';
import { PageOptionsDto } from '../../../../../common/dto/paginate/page-options';
import { Type } from 'class-transformer';

export class GetPermitQueryParamsDto extends PageOptionsDto {
  @ApiProperty({
    description:
      "Id of the company requesting the permit. It's optional for UserAuthGroup roles such as PPC_CLERK, SYSTEM_ADMINISTRATOR, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR, FINANCE.",
    example: 74,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @ApiProperty({
    description: 'Indicates whether the permit is expired.',
    example: true,
    required: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  expired?: boolean;

  @ApiProperty({
    name: 'searchColumn',
    description: 'The column to perform the search on.',
    required: false,
    example: 'permitNumber',
  })
  @IsOptional()
  @IsString()
  searchColumn?: string;

  @ApiProperty({
    description: 'The search string used for querying the database.',
    required: false,
    example: 'P0-08000508-500',
  })
  @IsOptional()
  @IsString()
  searchString?: string;

  @ApiProperty({
    example: 'permitNumber',
    description:
      'The field used to determine sort order in query results. For example, sorting by `permitNumber`.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  readonly orderBy?: string;
}
