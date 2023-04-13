import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTrailerDto {
  @AutoMap()
  @ApiProperty({
    description: 'Trailer Ids.',
    isArray: true,
    type: [String],
    example: ['74'],
  })
  trailers: string[];
}
