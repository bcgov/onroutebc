import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTrailerDto } from './dto/request/create-trailer.dto';
import { ReadTrailerDto } from './dto/response/read-trailer.dto';
import { UpdateTrailerDto } from './dto/request/update-trailer.dto';
import { Trailer } from './entities/trailer.entity';
import { DeleteDto } from 'src/modules/common/dto/response/delete.dto';

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

  async removeAll(trailerIds: string[], companyId: number): Promise<DeleteDto> {
    const idsPresentInDB = await this.trailerRepository
      .createQueryBuilder('Trailer')
      .select(['Trailer.trailerId'])
      .where('Trailer.trailerId IN (:...id)', {
        id: trailerIds,
      })
      .andWhere('Trailer.companyId = :companyId', {
        companyId: companyId,
      })
      .getMany();
    const idsFoundInDB: string[] = [];
    const idsNotdeletedfromDB: string[] = [];
    let i = 0;
    for (const id of idsPresentInDB) {
      idsFoundInDB[i] = id.trailerId;
      i = i + 1;
    }
    i = 0;
    await this.trailerRepository
      .createQueryBuilder()
      .delete()
      .from(Trailer)
      .where('trailerId IN (:...id)', {
        id: trailerIds,
      })
      .andWhere('companyId = :companyId', {
        companyId: companyId,
      })
      .execute();
    const notDeletedIds = await this.trailerRepository
      .createQueryBuilder('Trailer')
      .select(['Trailer.trailerId'])
      .where('Trailer.trailerId IN (:...id)', {
        id: trailerIds,
      })
      .andWhere('Trailer.companyId = :companyId', {
        companyId: companyId,
      })
      .getMany();
    //Convert PowerUnitId to flat array
    for (const id of notDeletedIds) {
      idsNotdeletedfromDB[i] = id.trailerId;
      i = i + 1;
    }

    const deleteDto: DeleteDto = new DeleteDto();
    deleteDto.success = idsFoundInDB.filter(
      (x) => !idsNotdeletedfromDB.includes(x),
    );
    deleteDto.failure = trailerIds.filter((x) => !idsFoundInDB.includes(x));
    deleteDto.failure.concat(idsNotdeletedfromDB);

    return deleteDto;
  }
}
