import { PartialType } from '@nestjs/swagger';
import { CreateTrailerTypeDto } from './create-trailer-type.dto';

export class UpdateTrailerTypeDto extends PartialType(CreateTrailerTypeDto) {}
