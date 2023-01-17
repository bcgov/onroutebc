import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePowerUnitDto } from './dto/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/update-power-unit.dto';
import { Repository } from 'typeorm';
import { PowerUnit } from './entities/power-unit.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PowerUnitDto } from './dto/power-unit.dto';

@Injectable()
export class PowerUnitsService {
  constructor(
    @InjectRepository(PowerUnit)
    private powerUnitRepository: Repository<PowerUnit>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(powerUnit: CreatePowerUnitDto): Promise<PowerUnitDto> {
    const newPowerUnit = this.classMapper.map(powerUnit, CreatePowerUnitDto, PowerUnit);
    return this.classMapper.mapAsync(await this.powerUnitRepository.save(newPowerUnit),PowerUnit, PowerUnitDto) ;
   // return newPowerUnit;
  }

  async findAll(): Promise<PowerUnitDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.powerUnitRepository.find({
        relations: {
          powerUnitType: true,
          province: true,
        },
      }),
      PowerUnit,
      PowerUnitDto,
    );
  }

  async findOne(powerUnitId: string): Promise<PowerUnitDto> {
    return this.classMapper.mapAsync(
      await this.powerUnitRepository.findOneOrFail({
        where: { powerUnitId },
        relations: {
          powerUnitType: true,
          province: true,
        },
      }),
      PowerUnit,
      PowerUnitDto,
    );
  }

  async update(
    powerUnitId: string,
    updatePowerUnitDto: UpdatePowerUnitDto,
  ): Promise<PowerUnitDto> {
    const newPowerUnit = this.classMapper.map(updatePowerUnitDto, UpdatePowerUnitDto, PowerUnit);
    await this.powerUnitRepository.update({ powerUnitId }, newPowerUnit);
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
