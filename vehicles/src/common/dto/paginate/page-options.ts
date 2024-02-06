import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

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
      'Defines the direction of sorting. Automatically set to false (ascending) if `orderBy` is not provided, true (descending) otherwise. This property is ignored if `orderBy` is not provided.',
    default: true,
    required: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  readonly descending?: boolean = !!this.orderBy;
}
