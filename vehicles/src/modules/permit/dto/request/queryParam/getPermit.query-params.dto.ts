import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsString,
  Length,
  IsNumber,
} from 'class-validator';
import { PageOptionsDto } from '../../../../../common/dto/paginate/page-options';
import { Transform, Type } from 'class-transformer';
import { idirUserAuthGroupList } from '../../../../../common/enum/user-auth-group.enum';

export class GetPermitQueryParamsDto extends PageOptionsDto {
  @ApiProperty({
    description: `Id of the company requesting the permit. It's optional for UserAuthGroup roles such as ${idirUserAuthGroupList.join(', ')}.`,
    example: 74,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  companyId?: number;

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
