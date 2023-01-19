import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePowerUnitDto } from './dto/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/update-power-unit.dto';
import { DeleteResult, Repository } from 'typeorm';
import { PowerUnit } from './entities/power-unit.entity';

@Injectable()
export class PowerUnitsService {
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
    return await this.powerUnitRepository.find({
      relations: {
        powerUnitType: true,
        province: true,
      },
    });
  }

  async findOne(powerUnitId: string): Promise<PowerUnit> {
    return await this.powerUnitRepository.findOne({ where: { powerUnitId } });
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
  ): Promise<DeleteResult> {
    
     return await this.powerUnitRepository.delete(powerUnitId);
     
  }
}
