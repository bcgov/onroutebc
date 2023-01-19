import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTrailerTypeDto } from './dto/create-trailer-type.dto';
import { TrailerTypeDto } from './dto/trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/update-trailer-type.dto';
import { TrailerType } from './entities/trailer-type.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TrailerTypesService {
  constructor(
    @InjectRepository(TrailerType)
    private trailerTypeRepository: Repository<TrailerType>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(trailerType: CreateTrailerTypeDto): Promise<TrailerTypeDto> {
    const newTrailerType = this.classMapper.map(
      trailerType,
      CreateTrailerTypeDto,
      TrailerType,
    );
    await this.trailerTypeRepository.insert(newTrailerType);
    return this.findOne(newTrailerType.typeCode);
  }

  async findAll(): Promise<TrailerTypeDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.trailerTypeRepository.find(),
      TrailerType,
      TrailerTypeDto,
    );
  }

  async findOne(typeCode: string): Promise<TrailerTypeDto> {
    return this.classMapper.mapAsync(
      await this.trailerTypeRepository.findOneOrFail({
        where: { typeCode },
      }),
      TrailerType,
      TrailerTypeDto,
    );
  }

  async update(
    typeCode: string,
    updateTrailerTypeDto: UpdateTrailerTypeDto,
  ): Promise<TrailerTypeDto> {
    const newTrailerType = this.classMapper.map(
      updateTrailerTypeDto,
      UpdateTrailerTypeDto,
      TrailerType,
    );

    await this.trailerTypeRepository.update({ typeCode }, newTrailerType);
    return this.findOne(typeCode);
  }


  async remove(
    typeCode: string,
  ): Promise<DeleteResult> {
  
       return await this.trailerTypeRepository.delete(typeCode);
      
  }
}
