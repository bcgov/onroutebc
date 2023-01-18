import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrailerDto } from './dto/create-trailer.dto';
import { TrailerDto } from './dto/trailer.dto';
import { UpdateTrailerDto } from './dto/update-trailer.dto';
import { Trailer } from './entities/trailer.entity';

@Injectable()
export class TrailersService {
  constructor(
    @InjectRepository(Trailer)
    private trailerRepository: Repository<Trailer>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(trailer: CreateTrailerDto): Promise<TrailerDto> {
    const newTrailer = this.classMapper.map(trailer, CreateTrailerDto, Trailer);
    return this.classMapper.mapAsync(
      await this.trailerRepository.save(newTrailer),
      Trailer,
      TrailerDto,
    );
  }

  async findAll(): Promise<TrailerDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.trailerRepository.find({
        relations: {
          trailerType: true,
          province: true,
        },
      }),
      Trailer,
      TrailerDto,
    );
  }

  async findOne(trailerId: string): Promise<TrailerDto> {
    return this.classMapper.mapAsync(
      await this.trailerRepository.findOneOrFail({
        where: { trailerId },
        relations: {
          trailerType: true,
          province: true,
        },
      }),
      Trailer,
      TrailerDto,
    );
  }

  async update(
    trailerId: string,
    updateTrailerDto: UpdateTrailerDto,
  ): Promise<TrailerDto> {
    const newTrailer = this.classMapper.map(
      updateTrailerDto,
      UpdateTrailerDto,
      Trailer,
    );

    await this.trailerRepository.update({ trailerId }, newTrailer);
    return this.findOne(trailerId);
  }

  async remove(
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
