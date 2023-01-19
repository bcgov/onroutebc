import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTrailerTypeDto } from './dto/request/create-trailer-type.dto';
import { ReadTrailerTypeDto } from './dto/response/read-trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/request/update-trailer-type.dto';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TrailerTypesService {
  constructor(
    @InjectRepository(TrailerType)
    private trailerTypeRepository: Repository<TrailerType>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(trailerType: CreateTrailerTypeDto): Promise<ReadTrailerTypeDto> {
    const newTrailerType = this.classMapper.map(
      trailerType,
      CreateTrailerTypeDto,
      TrailerType,
    );
    await this.trailerTypeRepository.insert(newTrailerType);
    return this.findOne(newTrailerType.typeCode);
  }

  async findAll(): Promise<ReadTrailerTypeDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.trailerTypeRepository.find(),
      TrailerType,
      ReadTrailerTypeDto,
    );
  }

  async findOne(typeCode: string): Promise<ReadTrailerTypeDto> {
    return this.classMapper.mapAsync(
      await this.trailerTypeRepository.findOne({
        where: { typeCode },
      }),
      TrailerType,
      ReadTrailerTypeDto,
    );
  }

  async update(
    typeCode: string,
    updateTrailerTypeDto: UpdateTrailerTypeDto,
  ): Promise<ReadTrailerTypeDto> {
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
