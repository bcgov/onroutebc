import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsBoolean,
  IsString,
  Length,
  Validate,
  IsEnum,
} from 'class-validator';
import { OrderByConstraint } from '../../../../../../common/constraint/orderby.constraint';
import { PermitSearchByConstraint } from '../../../../../../common/constraint/permit-search.constraint';
import { PageOptionsDto } from '../../../../../../common/dto/paginate/page-options';
import { PermitOrderBy } from '../../../../../../common/enum/orderBy.enum';
import { PermitSearch } from '../../../../../../common/enum/permit-search.enum';

export class GetPermitQueryParamsDto extends PageOptionsDto {
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

  @ApiProperty({
    description: `The search parameter to filter the results. This field is optional. Available values are: ${Object.values(PermitSearch).join(', ')}`,
    enum: PermitSearch,
    example: PermitSearch.PERMIT_NUMBER,
    required: false,
  })
  @IsOptional()
  @Validate(PermitSearchByConstraint)
  @IsEnum(PermitSearch)
  searchColumn?: PermitSearch;

  @ApiProperty({
    description:
      'The search string used for querying the database. ' +
      'This field is conditionally required. It is mandatory when a searchColumn is defined. ' +
      'If a searchColumn is not defined, the value is searched against Plate, Unit Number or Permit Number, making the field optional.',
    required: false,
    example: 'P0-08000508-500',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  searchString?: string;

  @ApiProperty({
    example: 'permitNumber:DESC,permitType:ASC',
    description:
      'A string defining the sort order for query results. ' +
      'If `orderBy` is undefined, the results remain unordered. ' +
      'Each rule consists of a field name and an optional sort direction, separated by a colon. ' +
      'Field names are case-sensitive and must match those defined in the schema. ' +
      'Sort directions can be "ASC" for ascending or "DESC" for descending. ' +
      'Default sort direction if undefined, default will be DESC. ' +
      'Multiple sorting rules can be combined using commas. ' +
      `sortField can have values ${Object.values(PermitOrderBy).join(', ')}. ` +
      'Syntax: <sortField:sortDirection,sortField:sortDirection>',

    required: false,
  })
  @IsOptional()
  @Validate(OrderByConstraint, [PermitOrderBy])
  @IsString()
  @Length(1, 150)
  declare readonly orderBy?: string;
}
