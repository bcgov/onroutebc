import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.trailerTypeRepository.find();
  }

  async findOne(typeCode: string): Promise<TrailerType> {
    return this.trailerTypeRepository.findOneOrFail({ where: { typeCode } });
  }

  async update(
    typeCode: string,
    updatePowerUnitDto: UpdateTrailerTypeDto,
  ): Promise<TrailerType> {
    await this.trailerTypeRepository.update({ typeCode }, updatePowerUnitDto);
    return this.findOne(typeCode);
  }

  async remove(
    typeCode: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.trailerTypeRepository.delete(typeCode);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
