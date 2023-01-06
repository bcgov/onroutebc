import { Injectable } from '@nestjs/common';
import { CreateTrailerTypeDto } from './dto/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/update-trailer-type.dto';

@Injectable()
export class TrailerTypesService {
  create(createTrailerTypeDto: CreateTrailerTypeDto) {
    return 'This action adds a new trailerType';
  }

  findAll() {
    return `This action returns all trailerTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trailerType`;
  }

  update(id: number, updateTrailerTypeDto: UpdateTrailerTypeDto) {
    return `This action updates a #${id} trailerType`;
  }

  remove(id: number) {
    return `This action removes a #${id} trailerType`;
  }
}
