import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  IsNumber,
  Validate,
} from 'class-validator';
import { PageOptionsDto } from '../../../../../common/dto/paginate/page-options';
import { Type } from 'class-transformer';
import { OrderByConstraint } from '../../../../../common/constraint/orderby.constraint';
import { ApplicationOrderBy } from '../../../../../common/enum/orderBy.enum';
import { IDIR_USER_AUTH_GROUP_LIST } from '../../../../../common/enum/user-auth-group.enum';

export class GetApplicationQueryParamsDto extends PageOptionsDto {
  @ApiProperty({
    description: `Id of the company requesting the permit. It's optional for UserAuthGroup roles such as ${IDIR_USER_AUTH_GROUP_LIST.join(', ')}.`,
    example: 74,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @ApiProperty({
    example: 'applicationNumber:DESC,permitType:ASC',
    description:
      'A string defining the sort order for query results. ' +
      'If `orderBy` is undefined, the results remain unordered. ' +
      'Each rule consists of a field name and an optional sort direction, separated by a colon. ' +
      'Field names are case-sensitive and must match those defined in the schema. ' +
      'Sort directions can be "ASC" for ascending or "DESC" for descending. ' +
      'Default sort direction if undefined, default will be DESC. ' +
      'Multiple sorting rules can be combined using commas. ' +
      `sortField can have values ${Object.values(ApplicationOrderBy).join(', ')}. ` +
      'Syntax: <sortField:sortDirection,sortField:sortDirection>',

    required: false,
  })
  @IsOptional()
  @Validate(OrderByConstraint, [ApplicationOrderBy])
  @IsString()
  @Length(1, 150)
  readonly orderBy?: string;
}
