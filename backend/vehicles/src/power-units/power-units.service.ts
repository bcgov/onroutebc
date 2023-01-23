import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePowerUnitDto } from './dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/request/update-power-unit.dto';
import { DeleteResult, Repository } from 'typeorm';
import { PowerUnit } from './entities/power-unit.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReadPowerUnitDto } from './dto/response/read-power-unit.dto';

@Injectable()
export class PowerUnitsService {
  constructor(
    @InjectRepository(PowerUnit)
    private powerUnitRepository: Repository<PowerUnit>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(powerUnit: CreatePowerUnitDto): Promise<ReadPowerUnitDto> {
    const newPowerUnit = this.classMapper.map(
      powerUnit,
      CreatePowerUnitDto,
      PowerUnit,
    );
    return this.classMapper.mapAsync(
      await this.powerUnitRepository.save(newPowerUnit),
      PowerUnit,
      ReadPowerUnitDto,
    );
  }

  async findAll(): Promise<ReadPowerUnitDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.powerUnitRepository.find({
        relations: {
          powerUnitType: true,
          province: true,
        },
      }),
      PowerUnit,
      ReadPowerUnitDto,
    );
  }

  async findOne(powerUnitId: string): Promise<ReadPowerUnitDto> {
    return this.classMapper.mapAsync(
      await this.powerUnitRepository.findOne({
        where: { powerUnitId },
        relations: {
          powerUnitType: true,
          province: true,
        },
      }),
      PowerUnit,
      ReadPowerUnitDto,
    );
  }

  async update(
    powerUnitId: string,
    updatePowerUnitDto: UpdatePowerUnitDto,
  ): Promise<ReadPowerUnitDto> {
    const newPowerUnit = this.classMapper.map(
      updatePowerUnitDto,
      UpdatePowerUnitDto,
      PowerUnit,
    );
    await this.powerUnitRepository.update({ powerUnitId }, newPowerUnit);
    return this.findOne(powerUnitId);
  }
  async remove(powerUnitId: string): Promise<DeleteResult> {
    return await this.powerUnitRepository.delete(powerUnitId);
  }
}