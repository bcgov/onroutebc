import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTrailerDto } from './dto/request/create-trailer.dto';
import { ReadTrailerDto } from './dto/response/read-trailer.dto';
import { UpdateTrailerDto } from './dto/request/update-trailer.dto';
import { Trailer } from './entities/trailer.entity';

@Injectable()
export class TrailersService {
  constructor(
    @InjectRepository(Trailer)
    private trailerRepository: Repository<Trailer>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(trailer: CreateTrailerDto): Promise<ReadTrailerDto> {
    const newTrailer = this.classMapper.map(trailer, CreateTrailerDto, Trailer);
    return this.classMapper.mapAsync(
      await this.trailerRepository.save(newTrailer),
      Trailer,
      ReadTrailerDto,
    );
  }

  async findAll(): Promise<ReadTrailerDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.trailerRepository.find({
        relations: {
          trailerType: true,
          province: true,
        },
      }),
      Trailer,
      ReadTrailerDto,
    );
  }

  async findOne(trailerId: string): Promise<ReadTrailerDto> {
    return this.classMapper.mapAsync(
      await this.trailerRepository.findOne({
        where: { trailerId },
        relations: {
          trailerType: true,
          province: true,
        },
      }),
      Trailer,
      ReadTrailerDto,
    );
  }

  async update(
    trailerId: string,
    updateTrailerDto: UpdateTrailerDto,
  ): Promise<ReadTrailerDto> {
    const newTrailer = this.classMapper.map(
      updateTrailerDto,
      UpdateTrailerDto,
      Trailer,
    );

    await this.trailerRepository.update({ trailerId }, newTrailer);
    return this.findOne(trailerId);
  }

  async remove(trailerId: string): Promise<DeleteResult> {
    return await this.trailerRepository.delete(trailerId);
  }
}
