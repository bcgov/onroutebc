import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePowerUnitDto } from './dto/create-powerUnit.dto';
import { UpdatePowerUnitDto } from './dto/update-PowerUnit.dto';
import { Repository } from 'typeorm';
import { PowerUnit } from './entities/powerUnit.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(PowerUnit)
    private powerUnitRepository: Repository<PowerUnit>,
  ) {}

  async create(powerUnit: CreatePowerUnitDto): Promise<PowerUnit> {
    const newPowerUnit = this.powerUnitRepository.create(powerUnit);
    await this.powerUnitRepository.save(newPowerUnit);
    return newPowerUnit;
  }

  async findAll(): Promise<PowerUnit[]> {
    return this.powerUnitRepository.find();
  }

  async findOne(powerUnitId: string): Promise<PowerUnit> {
    return this.powerUnitRepository.findOneOrFail({ where: { powerUnitId } });
  }

  async update(
    powerUnitId: string,
    updatePowerUnitDto: UpdatePowerUnitDto,
  ): Promise<PowerUnit> {
    await this.powerUnitRepository.update({ powerUnitId }, updatePowerUnitDto);
    return this.findOne(powerUnitId);
  }

  async remove(
    powerUnitId: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.powerUnitRepository.delete(powerUnitId);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
