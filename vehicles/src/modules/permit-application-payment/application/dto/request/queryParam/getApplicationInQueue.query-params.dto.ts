import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  Validate,
  IsEnum,
} from 'class-validator';
import { OrderByConstraint } from '../../../../../../common/constraint/orderby.constraint';
import { PageOptionsDto } from '../../../../../../common/dto/paginate/page-options';
import { ApplicationInQueueOrderBy } from '../../../../../../common/enum/orderBy.enum';
import { ApplicationSearch } from '../../../../../../common/enum/application-search.enum';
import { ApplicationSearchByConstraint } from '../../../../../../common/constraint/application-search.constraint';
import { Nullable } from '../../../../../../common/types/common';

export class GetApplicationInQueueQueryParamsDto extends PageOptionsDto {
  @ApiProperty({
    description: `The search parameter to filter the results. This field is optional. Available values are: ${Object.values(ApplicationSearch).join(', ')}`,
    enum: ApplicationSearch,
    example: ApplicationSearch.APPLICATION_NUMBER,
    required: false,
  })
  @IsOptional()
  @Validate(ApplicationSearchByConstraint)
  @IsEnum(ApplicationSearch)
  searchColumn?: Nullable<ApplicationSearch>;

  @ApiProperty({
    example: 'A0-08000508-500',
    description:
      'The search string used for querying the database. ' +
      'This field is conditionally required. It is mandatory when a searchColumn is defined. ' +
      'If a searchColumn is not defined, the value is searched against Plate or Unit Number, making the field optional.',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  searchString?: Nullable<string>;

  @ApiProperty({
    example: 'applicationNumber:DESC,permitType:ASC',
    description:
      'A string defining the sort order for query results. ' +
      'If `orderBy` is undefined, the results are returned based on their appearance in the application queue. ' +
      'Each rule consists of a field name and an optional sort direction, separated by a colon. ' +
      'Field names are case-sensitive and must match those defined in the schema. ' +
      'Sort directions can be "ASC" for ascending or "DESC" for descending. ' +
      'Default sort direction, if undefined, will be DESC. ' +
      'Multiple sorting rules can be combined using commas. ' +
      `sortField can have values ${Object.values(ApplicationInQueueOrderBy).join(', ')}. ` +
      'Syntax: <sortField:sortDirection,sortField:sortDirection>',

    required: false,
  })
  @IsOptional()
  @Validate(OrderByConstraint, [ApplicationInQueueOrderBy])
  @IsString()
  @Length(1, 150)
  readonly orderBy?: Nullable<string>;
}
