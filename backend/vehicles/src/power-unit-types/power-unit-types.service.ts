import { Injectable } from '@nestjs/common';
import { CreatePowerUnitTypeDto } from './dto/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from './dto/update-power-unit-type.dto';

@Injectable()
export class PowerUnitTypesService {
  create(createPowerUnitTypeDto: CreatePowerUnitTypeDto) {
    return 'This action adds a new powerUnitType';
  }

  findAll() {
    return `This action returns all powerUnitTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} powerUnitType`;
  }

  update(id: number, updatePowerUnitTypeDto: UpdatePowerUnitTypeDto) {
    return `This action updates a #${id} powerUnitType`;
  }

  remove(id: number) {
    return `This action removes a #${id} powerUnitType`;
  }
}
