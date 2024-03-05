import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class PageOptionsDto {
  @ApiProperty({
    minimum: 1,
    default: 1,
    description: 'The page number for pagination, starting from 1.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;

  @ApiProperty({
    minimum: 1,
    maximum: 25,
    default: 10,
    description: 'The number of items to take per page, maximum is 25.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(25)
  readonly take: number = 10;

  @ApiProperty({
    example: '<sortField:sortDirection>',
    description:
      'A string defining the sort order for query results. ' +
      'If `orderBy` is undefined, the results remain unordered. ' +
      'Each rule consists of a field name and an optional sort direction, separated by a colon. ' +
      'Field names are case-sensitive and must match those defined in the schema. ' +
      'Sort directions can be "ASC" for ascending or "DESC" for descending. ' +
      'Default sort direction if undefined, default will be DESC. ' +
      'Multiple sorting rules can be combined using commas. ' +
      '<sortField:sortDirection,sortField:sortDirection>',
    required: true,
  })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  readonly orderBy?: string;
}
