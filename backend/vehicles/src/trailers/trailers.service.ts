import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTrailerDto } from './dto/create-trailer.dto';
import { UpdateTrailerDto } from './dto/update-trailer.dto';
import { Trailer } from './entities/trailer.entity';

@Injectable()
export class TrailersService {
  constructor(
    @InjectRepository(Trailer)
    private trailerRepository: Repository<Trailer>,
  ) {}

  async create(trailer: CreateTrailerDto): Promise<Trailer> {
    const newTrailer = this.trailerRepository.create(trailer);
    await this.trailerRepository.save(newTrailer);
    return newTrailer;
  }

  async findAll(): Promise<Trailer[]> {
    return await this.trailerRepository.find({
      relations: {
        trailerType: true,
        province: true,
      },
    });
  }

  async findOne(trailerId: string): Promise<Trailer> {
    return await this.trailerRepository.findOne({ where: { trailerId } });
  }

  async update(
    trailerId: string,
    updateTrailerDto: UpdateTrailerDto,
  ): Promise<Trailer> {
    await this.trailerRepository.update({ trailerId }, updateTrailerDto);
    return this.findOne(trailerId);
  }

  async remove(
    trailerId: number,
  ): Promise<DeleteResult> {
       return await this.trailerRepository.delete(trailerId);
  }
}
