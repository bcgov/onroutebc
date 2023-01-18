import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePowerUnitTypeDto } from './dto/create-power-unit-type.dto';
import { PowerUnitTypeDto } from './dto/power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from './dto/update-power-unit-type.dto';
import { PowerUnitType } from './entities/power-unit-type.entity';

@Injectable()
export class PowerUnitTypesService {
  constructor(
    @InjectRepository(PowerUnitType)
    private powerUnitTypeRepository: Repository<PowerUnitType>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(
    powerUnitType: CreatePowerUnitTypeDto,
  ): Promise<PowerUnitTypeDto> {
    const newPowerUnitType = this.classMapper.map(
      powerUnitType,
      CreatePowerUnitTypeDto,
      PowerUnitType,
    );
    await this.powerUnitTypeRepository.insert(newPowerUnitType);
    return this.findOne(newPowerUnitType.typeCode);
  }

  async findAll(): Promise<PowerUnitTypeDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.powerUnitTypeRepository.find(),
      PowerUnitType,
      PowerUnitTypeDto,
    );
  }

  async findOne(typeCode: string): Promise<PowerUnitTypeDto> {
    return this.classMapper.mapAsync(
      await this.powerUnitTypeRepository.findOneOrFail({
        where: { typeCode },
      }),
      PowerUnitType,
      PowerUnitTypeDto,
    );
  }

  async update(
    typeCode: string,
    updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ): Promise<PowerUnitTypeDto> {
    const newPowerUnitType = this.classMapper.map(
      updatePowerUnitTypeDto,
      UpdatePowerUnitTypeDto,
      PowerUnitType,
    );

    await this.powerUnitTypeRepository.update({ typeCode }, newPowerUnitType);
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
