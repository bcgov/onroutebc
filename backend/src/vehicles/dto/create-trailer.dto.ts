import { PickType } from '@nestjs/swagger';
import { TrailerDto } from './trailer.dto';

export class CreateTrailerDto extends PickType(TrailerDto, [
    'unitNumber',
    'plateNumber',
    'province',
    'year',
    'make',
    'vin',
    'trailerType',
  ] as const) {}