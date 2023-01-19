import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePowerUnitTypeDto } from './dto/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from './dto/update-power-unit-type.dto';
import { PowerUnitType } from './entities/power-unit-type.entity';

@Injectable()
export class PowerUnitTypesService {
  constructor(
    @InjectRepository(PowerUnitType)
    private powerUnitTypeRepository: Repository<PowerUnitType>,
  ) {}

  async create(powerUnitType: CreatePowerUnitTypeDto): Promise<PowerUnitType> {
    const newPowerUnitType = this.powerUnitTypeRepository.create(powerUnitType);
    await this.powerUnitTypeRepository.save(newPowerUnitType);
    return newPowerUnitType;
  }

  async findAll(): Promise<PowerUnitType[]> {
    return await this.powerUnitTypeRepository.find();
  }

  async findOne(typeId: number): Promise<PowerUnitType> {
    return await this.powerUnitTypeRepository.findOne({ where: { typeId } });
  }

  async update(
    typeId: number,
    updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ): Promise<PowerUnitType> {
    await this.powerUnitTypeRepository.update(
      { typeId },
      updatePowerUnitTypeDto,
    );
    return this.findOne(typeId);
  }

  async remove(
    typeId: number,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.powerUnitTypeRepository.delete(typeId);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
