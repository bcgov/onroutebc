import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'typeorm';
import { VehicleDto } from './vehicle.dto';

export class TrailerDto extends VehicleDto {
  @ApiProperty({
    description: 'The Trailer ID'
  })
  trailerId: number;

   @ApiProperty({
    description: 'The Empty Trailer',
    example: '3.2'
  })
  emptyTrailerWidth: number;

  @ApiProperty({
    description: 'The Trailer Sub Type',
    example : 'Pole'
  })
  trailerSubType: string;
}
