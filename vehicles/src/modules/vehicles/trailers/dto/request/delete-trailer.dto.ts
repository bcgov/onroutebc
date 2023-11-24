import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class DeleteTrailerDto {
  @AutoMap()
  @ApiProperty({
    description: 'Trailer Ids.',
    isArray: true,
    type: [String],
    example: ['74'],
  })
  @IsNumberString({}, { each: true })
  trailers: string[];
}
