import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTrailerDto } from './create-trailer.dto';

export class TrailerDto extends CreateTrailerDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'The Trailer ID',
  })
  trailerId: string;
}
