import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Dms } from './entities/dms.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadCOMSDto } from './dto/response/read-coms.dto';
import { ReadFileDto } from './dto/response/read-file.dto';
import { ComsService } from './coms.service';
import { IFile } from '../../common/interface/file.interface';

@Injectable()
export class DmsService {
  constructor(
    @InjectRepository(Dms)
    private dmsRepository: Repository<Dms>,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly comsService: ComsService,
  ) {}

  async create(file: Express.Multer.File | IFile): Promise<ReadFileDto> {
    const readCOMSDtoList = await this.comsService.createObject(file);

    if (!readCOMSDtoList?.length) {
      throw new InternalServerErrorException();
    }
    const dmsRecord = this.classMapper.map(
      readCOMSDtoList[0],
      ReadCOMSDto,
      Dms,
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

    const url = await this.comsService.getObjectUrl(readFile);
    readFile.preSignedS3Url = url;
    return readFile;
  }
}
