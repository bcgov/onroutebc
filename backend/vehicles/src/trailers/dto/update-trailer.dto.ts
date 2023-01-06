import { PartialType } from '@nestjs/swagger';
import { CreateTrailerDto } from './create-trailer.dto';

export class UpdateTrailerDto extends PartialType(CreateTrailerDto) {}
