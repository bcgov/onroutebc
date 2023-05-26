import { Injectable } from '@nestjs/common';
import { Dms } from './entities/dms.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadCOMSDto } from './dto/response/read-coms.dto';
import { ReadFileDto } from './dto/response/read-file.dto';
import { ComsService } from './coms.service';

@Injectable()
export class DmsService {
  constructor(
    @InjectRepository(Dms)
    private dmsRepository: Repository<Dms>,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly comsService: ComsService,
  ) {}
  async create(file: Express.Multer.File): Promise<ReadFileDto> {
    const readCOMSDto = await this.comsService.createObject(file);

    const dmsRecord = this.classMapper.map(readCOMSDto, ReadCOMSDto, Dms);

    return this.classMapper.mapAsync(
      await this.dmsRepository.save(dmsRecord),
      Dms,
      ReadFileDto,
    );
  }

  async findOne(documentId: string): Promise<ReadFileDto> {
    const readFile = await this.classMapper.mapAsync(
      await this.dmsRepository.findOneBy({ documentId }),
      Dms,
      ReadFileDto,
    );

    const url = await this.comsService.getObjectUrl(readFile);
    readFile.preSignedS3Url = url;
    return readFile;
  }
}
