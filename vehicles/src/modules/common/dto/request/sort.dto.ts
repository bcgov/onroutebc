import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

/**
 * JSON representation of a physical address
 */
export class SortDto {
  @AutoMap()
  @ApiProperty({
    example: 'startDate',
    description: 'Name of the column to sort',
    required: true,
  })
  @IsString()
  @Length(1, 150)
  orderBy: string;

  @AutoMap()
  @ApiProperty({
    example: true,
    description: 'Decides sorting order i.e. ascending or descending',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  descending: boolean;
}
