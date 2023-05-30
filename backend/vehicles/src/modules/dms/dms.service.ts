import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    const readCOMSDtoList = await this.comsService.createObject(file);

    if (!readCOMSDtoList?.length) {
      throw new InternalServerErrorException();
    }
    const dmsRecord = this.classMapper.map(
      readCOMSDtoList[0],
      ReadCOMSDto,
      Dms,
    );
    //dmsRecord.objectMimeType = file.mimetype; //TODO confirm mime type

    return this.classMapper.mapAsync(
      await this.dmsRepository.save(dmsRecord),
      Dms,
      ReadFileDto,
    );
  }

  // TODO: Once dms becomes its own microservice, replace ArrayBuffer with Express.Multer.File
  async create_TEMP(file: ArrayBuffer): Promise<ReadFileDto> {
    const readCOMSDtoList = await this.comsService.createObject_TEMP(file);

    if (!readCOMSDtoList?.length) {
      throw new InternalServerErrorException();
    }
    const dmsRecord = this.classMapper.map(
      readCOMSDtoList[0],
      ReadCOMSDto,
      Dms,
    );
    //dmsRecord.objectMimeType = file.mimetype; //TODO confirm mime type

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

    readFile.s3ObjectId = readFile.s3ObjectId.toLowerCase();

    const url = await this.comsService.getObjectUrl(readFile);
    readFile.preSignedS3Url = url;
    return readFile;
  }
}
