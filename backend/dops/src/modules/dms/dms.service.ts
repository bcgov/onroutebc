import { BadRequestException, Injectable } from '@nestjs/common';
import { Dms } from './entities/dms.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadCOMSDto } from '../common/dto/response/read-coms.dto';
import { ReadFileDto } from './dto/response/read-file.dto';
import { ComsService } from '../common/coms.service';
import { IUserJWT } from '../../interface/user-jwt.interface';
import { Response } from 'express';
import { FileDownloadModes } from '../../enum/file-download-modes.enum';
import { IFile } from '../../interface/file.interface';

@Injectable()
export class DmsService {
  constructor(
    @InjectRepository(Dms)
    private dmsRepository: Repository<Dms>,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly comsService: ComsService,
  ) {}

  async create(
    currentUser: IUserJWT,
    file: Express.Multer.File | IFile,
  ): Promise<ReadFileDto> {
    const readCOMSDtoList = await this.comsService.createOrUpdateObject(
      currentUser,
      file,
    );

    if (!readCOMSDtoList?.length) {
      throw new Error('File not Created/Updated in Storage!');
    }

    const dmsVersionId = 1;

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

  async update(
    currentUser: IUserJWT,
    documentId: string,
    file: Express.Multer.File,
  ): Promise<ReadFileDto> {
    const dmsObject = await this.findLatest(documentId);
    if (dmsObject?.documentId !== documentId) {
      throw new BadRequestException('Invalid Document Id');
    }

    const readCOMSDtoList = await this.comsService.createOrUpdateObject(
      currentUser,
      file,
      dmsObject.s3ObjectId,
    );

    if (!readCOMSDtoList?.length) {
      throw new Error('File not Created/Updated in Storage!');
    }

    const dmsRecord = this.classMapper.map(
      readCOMSDtoList[0],
      ReadCOMSDto,
      Dms,
      {
        extraArgs: () => ({
          dmsVersionId: dmsObject.dmsVersionId + 1,
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

  async download(
    currentUser: IUserJWT,
    documentId: string,
    downloadMode: FileDownloadModes,
    res?: Response,
  ): Promise<ReadFileDto> {
    const file = await this.findOne(documentId);

    if (downloadMode === FileDownloadModes.PROXY) {
      await this.comsService.getObject(currentUser, file, downloadMode, res);
    } else {
      file.preSignedS3Url = (await this.comsService.getObject(
        currentUser,
        file,
        FileDownloadModes.URL,
      )) as string;
    }
    return file;
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
