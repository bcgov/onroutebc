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
    return this.powerUnitTypeRepository.find();
  }

  async findOne(typeCode: string): Promise<PowerUnitType> {
    return this.powerUnitTypeRepository.findOneOrFail({ where: { typeCode } });
  }

  async update(
    typeCode: string,
    updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ): Promise<PowerUnitType> {
    await this.powerUnitTypeRepository.update(
      { typeCode },
      updatePowerUnitTypeDto,
    );
    return this.findOne(typeCode);
  }

  async remove(
    typeCode: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.powerUnitTypeRepository.delete(typeCode);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
