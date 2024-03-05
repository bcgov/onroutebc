import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsString, Length } from 'class-validator';

/**
 * JSON representation of a physical address
 */
export class SortDto {
  @ApiProperty({
    example: 'id',
    description:
      'The field used to determine sort order in query results. For example, sorting by `id`.',
    required: true,
  })
  @IsString()
  @Length(1, 150)
  readonly orderBy: string;

  @ApiProperty({
    example: false,
    description:
      'Defines the direction of sorting. Set to true for descending or false for ascending order.',
    default: true,
    required: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  readonly descending: boolean = false;
}
