import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Vehicle } from "./entities/vehicle.entity";

import { CreatePowerUnitDto } from './dto/create-powerUnit.dto';
import { UpdatePowerUnitDto } from './dto/update-PowerUnit.dto';
import { Repository } from 'typeorm';
import { PowerUnit } from './entities/powerUnit.entity';


@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(PowerUnit)
    private powerUnitRepository: Repository<PowerUnit>
  ) {}

  async create(vehicle: CreatePowerUnitDto): Promise<Vehicle> {
    const newVehicle = this.powerUnitRepository.create(vehicle);
    await this.powerUnitRepository.save(newVehicle);
    return newVehicle;
  }

  async findAll(): Promise<Vehicle[]> {
    return this.powerUnitRepository.find();
  }

  async findOne(powerUnitId: any): Promise<Vehicle> {
    return this.powerUnitRepository.findOneOrFail({where: {powerUnitId}});
  }

  async update(powerUnitId: number, updateVehicleDto: UpdatePowerUnitDto): Promise<Vehicle> {
    await this.powerUnitRepository.update({ powerUnitId }, updateVehicleDto);
    return this.findOne({where: {powerUnitId}});
  }

  async remove(powerUnitId: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.powerUnitRepository.delete(powerUnitId);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}