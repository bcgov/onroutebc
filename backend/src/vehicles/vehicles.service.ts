import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePowerUnitDto } from './dto/create-powerUnit.dto';
import { UpdatePowerUnitDto } from './dto/update-PowerUnit.dto';
import {  Repository } from 'typeorm';
import { PowerUnit } from './entities/powerUnit.entity';
import { Trailer } from './entities/trailer.entity';
import { CreateTrailerDto } from './dto/create-trailer.dto';
import { UpdateTrailerDto } from './dto/update-Trailer.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(PowerUnit)
    private powerUnitRepository: Repository<PowerUnit>,
    @InjectRepository(Trailer)
    private trailerRepository: Repository<Trailer>,
  ) {}

  async createTrailer(trailer: CreateTrailerDto): Promise<Trailer> {
    const newTrailer = this.trailerRepository.create(trailer);
    await this.trailerRepository.save(newTrailer);
    return newTrailer;
  }


  async createPowerUnit(powerUnit: CreatePowerUnitDto): Promise<PowerUnit> {
    const newPowerUnit = this.powerUnitRepository.create(powerUnit);
    await this.powerUnitRepository.save(newPowerUnit);
    return newPowerUnit;
  } 
  async findAllPowerUnit(): Promise<PowerUnit[]> {

    return await this.powerUnitRepository.find({
      relations: {
        powerUnitType: true,
        province:true
      },
  });
   

  }

  async findAlltrailer(): Promise<Trailer[]> {
  
    return await this.trailerRepository.find({
      relations: {
        trailerType: true,
        province:true
      },
  });
   

  }

  async findOnePowerUnit(powerUnitId: string): Promise<PowerUnit> {
    return this.powerUnitRepository.findOneOrFail({ where: { powerUnitId } });
  }

  async findOneTrailer(trailerId: string): Promise<Trailer> {
    return this.trailerRepository.findOneOrFail({ where: { trailerId } });
  }

  async updatePowerUnit(
    powerUnitId: string,
    updatePowerUnitDto: UpdatePowerUnitDto,
  ): Promise<PowerUnit> {
    await this.powerUnitRepository.update({ powerUnitId }, updatePowerUnitDto);
    return this.findOnePowerUnit(powerUnitId);
  }

  async updateTrailer(
    trailerId: string,
    updateTrailerDto: UpdateTrailerDto,
  ): Promise<Trailer> {
    await this.trailerRepository.update({ trailerId }, updateTrailerDto);
    return this.findOneTrailer(trailerId);
  }
  

  async removePowerUnit(
    powerUnitId: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.powerUnitRepository.delete(powerUnitId);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }



  async removeTrailer(
    trailerId: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.trailerRepository.delete(trailerId);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
