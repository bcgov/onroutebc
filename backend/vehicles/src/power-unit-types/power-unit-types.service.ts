import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePowerUnitTypeDto } from './dto/request/create-power-unit-type.dto';
import { ReadPowerUnitTypeDto } from './dto/response/read-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from './dto/request/update-power-unit-type.dto';
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
  ): Promise<ReadPowerUnitTypeDto> {
    const newPowerUnitType = this.classMapper.map(
      powerUnitType,
      CreatePowerUnitTypeDto,
      PowerUnitType,
    );
    await this.powerUnitTypeRepository.insert(newPowerUnitType);
    return this.findOne(newPowerUnitType.typeCode);
  }

  async findAll(): Promise<ReadPowerUnitTypeDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.powerUnitTypeRepository.find(),
      PowerUnitType,
      ReadPowerUnitTypeDto,
    );
  }

  async findOne(typeCode: string): Promise<ReadPowerUnitTypeDto> {
    return this.classMapper.mapAsync(
      await this.powerUnitTypeRepository.findOneOrFail({
        where: { typeCode },
      }),
      PowerUnitType,
      ReadPowerUnitTypeDto,
    );
  }

  async update(
    typeCode: string,
    updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ): Promise<ReadPowerUnitTypeDto> {
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
