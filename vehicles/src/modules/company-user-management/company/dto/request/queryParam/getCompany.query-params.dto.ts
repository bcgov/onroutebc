import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Validate } from 'class-validator';
import { OrderByConstraint } from '../../../../../../common/constraint/orderby.constraint';
import { PageOptionsDto } from '../../../../../../common/dto/paginate/page-options';
import { CompanyOrderBy } from '../../../../../../common/enum/orderBy.enum';

export class GetCompanyQueryParamsDto extends PageOptionsDto {
  @ApiProperty({
    example: 'Parisian LLC Trucking',
    description:
      'Filters the results with the legal/DBA name of the company. This field is optional.',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    example: 'B3-000005-722',
    description:
      'Filters the results with the unique identifier for a client. This field is optional.',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientNumber?: string;

  @ApiProperty({
    example: 'companyId:DESC',
    description:
      'A string defining the sort order for query results. ' +
      'If `orderBy` is undefined, the results remain unordered. ' +
      'Each rule consists of a field name and an optional sort direction, separated by a colon. ' +
      'Field names are case-sensitive and must match those defined in the schema. ' +
      'Sort directions can be "ASC" for ascending or "DESC" for descending. ' +
      'Default sort direction if undefined, default will be DESC. ' +
      'Multiple sorting rules can be combined using commas. ' +
      `sortField can have values ${Object.values(CompanyOrderBy).join(', ')}. ` +
      'Syntax: <sortField:sortDirection,sortField:sortDirection>',

    required: false,
  })
  @IsOptional()
  @Validate(OrderByConstraint, [CompanyOrderBy])
  @IsString()
  @Length(1, 150)
  declare readonly orderBy?: string;
}
