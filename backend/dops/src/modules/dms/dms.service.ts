import { Injectable } from '@nestjs/common';
import { Dms } from './entities/dms.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadCOMSDto } from './dto/response/read-coms.dto';
import { ReadFileDto } from './dto/response/read-file.dto';

@Injectable()
export class DmsService {
  constructor(
    @InjectRepository(Dms)
    private dmsRepository: Repository<Dms>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(
    readCOMSDtoList: ReadCOMSDto[],
    dmsObject?: ReadFileDto,
  ): Promise<ReadFileDto> {
    let dmsVersionId = 1;
    if (dmsObject) {
      dmsVersionId = dmsObject.dmsVersionId + 1;
    }

    const dmsRecord = this.classMapper.map(
      readCOMSDtoList[0],
      ReadCOMSDto,
      Dms,
      {
        extraArgs: () => ({
          dmsVersionId: dmsVersionId,
        }),
      },
    );

    return this.classMapper.mapAsync(
      await this.dmsRepository.save(dmsRecord),
      Dms,
      ReadFileDto,
    );
  }

  async findOne(documentId: string): Promise<ReadFileDto> {
    const readFile = await this.classMapper.mapAsync(
      await this.dmsRepository.findOne({ where: { documentId: documentId } }),
      Dms,
      ReadFileDto,
    );
    return readFile;
  }

  async findLatest(documentId: string): Promise<ReadFileDto> {
    const subQuery = this.dmsRepository
      .createQueryBuilder('dms')
      .select('dms.s3ObjectId')
      .where('dms.documentId = :documentId')
      .getQuery();

    const latestDmsObject = await this.dmsRepository
      .createQueryBuilder('dms')
      .where(`dms.s3ObjectId IN (${subQuery})`, { documentId: documentId })
      .orderBy('dms.dmsVersionId', 'DESC')
      .getOne();

    const readFile = await this.classMapper.mapAsync(
      latestDmsObject,
      Dms,
      ReadFileDto,
    );

    return readFile;
  }
}
