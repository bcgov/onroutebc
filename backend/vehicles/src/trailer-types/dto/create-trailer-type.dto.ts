import { PickType } from '@nestjs/swagger';
import { TrailerTypeDto } from './trailer-type.dto';

export class CreateTrailerTypeDto extends PickType(TrailerTypeDto, [
  'typeCode',
  'type',
  'description',
] as const) {}
