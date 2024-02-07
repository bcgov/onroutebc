import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { DescendingDependsOnOrderByConstraint } from '../../constraint/descending-depends-on-order.constraint';

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
    example: 'id',
    description:
      'The field used to determine sort order in query results. For example, sorting by `id`.',
    required: true,
  })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  readonly orderBy?: string;

  @ApiProperty({
    example: false,
    description:
      'Determines the sort order of results. If `orderBy` is undefined, the results remain unordered.' +
      'When `orderBy` is specified without the `descending` parameter, results sort in descending order by default.' +
      'If `descending` is explicitly set to false, results sort in ascending order.',
    default: true,
    required: false,
  })
  @IsOptional()
  @Validate(DescendingDependsOnOrderByConstraint)
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsBoolean()
  readonly descending?: boolean = true;
}
