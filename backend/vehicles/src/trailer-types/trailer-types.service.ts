import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTrailerTypeDto } from './dto/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/update-trailer-type.dto';
import { TrailerType } from './entities/trailer-type.entity';

@Injectable()
export class TrailerTypesService {
  constructor(
    @InjectRepository(TrailerType)
    private trailerTypeRepository: Repository<TrailerType>,
  ) {}

  async create(trailerType: CreateTrailerTypeDto): Promise<TrailerType> {
    const newTrailerType = this.trailerTypeRepository.create(trailerType);
    await this.trailerTypeRepository.save(newTrailerType);
    return newTrailerType;
  }

  async findAll(): Promise<TrailerType[]> {
    return await this.trailerTypeRepository.find();
  }

  async findOne(typeId: number): Promise<TrailerType> {
    return await this.trailerTypeRepository.findOne({ where: { typeId } });
  }

  async update(
    typeId: number,
    updatePowerUnitDto: UpdateTrailerTypeDto,
  ): Promise<TrailerType> {
    await this.trailerTypeRepository.update({ typeId }, updatePowerUnitDto);
    return this.findOne(typeId);
  }

  async remove(
    typeId: number,
  ): Promise<DeleteResult> {
  
       return await this.trailerTypeRepository.delete(typeId);
      
  }
}
