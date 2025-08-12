import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Document } from './entities/document.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadFileDto } from '../common/dto/response/read-file.dto';
import { IUserJWT } from '../../interface/user-jwt.interface';
import { FileDownloadModes } from '../../enum/file-download-modes.enum';
import { IFile } from '../../interface/file.interface';
import { S3Service } from '../common/s3.service';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { IDP } from '../../enum/idp.enum';
import { LogAsyncMethodExecution } from '../../decorator/log-async-method-execution.decorator';

@Injectable()
export class DmsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly s3Service: S3Service,
  ) {}

  @LogAsyncMethodExecution()
  async create(
    currentUser: IUserJWT,
    file: Express.Multer.File | IFile,
    companyId?: number,
  ): Promise<ReadFileDto> {
    const s3ObjectId = uuidv4();
    const s3Object = await this.s3Service.uploadFile(file, s3ObjectId);

    const dmsVersionId = 1;

    const dmsRecord = {
      documentId: undefined,
      s3ObjectId: s3ObjectId,
      s3VersionId: s3Object.VersionId,
      s3Location: s3Object.Location,
      objectMimeType: file.mimetype,
      fileName: file.filename ? file.filename : file.originalname,
      dmsVersionId: dmsVersionId,
      companyId: companyId,
      createdDateTime: new Date(),
      createdUser: currentUser.userName,
      createdUserDirectory: currentUser.orbcUserDirectory,
      createdUserGuid: currentUser.userGUID,
      updatedUser: currentUser.userName,
      updatedDateTime: new Date(),
      updatedUserGuid: currentUser.userGUID,
      updatedUserDirectory: currentUser.orbcUserDirectory,
    };

    return this.classMapper.mapAsync(
      await this.documentRepository.save(dmsRecord),
      Document,
      ReadFileDto,
    );
  }

  @LogAsyncMethodExecution()
  async update(
    currentUser: IUserJWT,
    documentId: string,
    file: Express.Multer.File,
    companyId?: number,
  ): Promise<ReadFileDto> {
    const dmsObject = await this.findLatest(documentId);
    if (dmsObject?.documentId !== documentId) {
      throw new BadRequestException('Invalid Document Id');
    } else if (
      currentUser.identity_provider !== IDP.IDIR &&
      dmsObject?.companyId != companyId
    ) {
      throw new ForbiddenException('Invalid Company Id');
    }
    const s3Object = await this.s3Service.uploadFile(
      file,
      dmsObject.s3ObjectId,
    );

    const dmsRecord = {
      documentId: undefined,
      s3ObjectId: dmsObject.s3ObjectId,
      s3VersionId: s3Object.VersionId,
      s3Location: s3Object.Location,
      objectMimeType: file.mimetype,
      fileName: file.filename,
      dmsVersionId: dmsObject.dmsVersionId + 1,
      companyId: companyId,
      updatedUser: currentUser.userName,
      updatedDateTime: new Date(),
      updatedUserGuid: currentUser.userGUID,
      updatedUserDirectory: currentUser.orbcUserDirectory,
    };

    return this.classMapper.mapAsync(
      await this.documentRepository.save(dmsRecord),
      Document,
      ReadFileDto,
    );
  }

  @LogAsyncMethodExecution()
  async findOne(documentId: string): Promise<ReadFileDto> {
    const readFile = this.classMapper.mapAsync(
      await this.documentRepository.findOne({
        where: { documentId: documentId },
      }),
      Document,
      ReadFileDto,
    );
    return readFile;
  }

  @LogAsyncMethodExecution()
  async download(
    currentUser: IUserJWT,
    documentId: string,
    downloadMode: FileDownloadModes,
    res?: Response,
    companyId?: number,
  ) {
    let s3Object: NodeJS.ReadableStream = undefined;
    const file = await this.findOne(documentId);

    if (
      currentUser.identity_provider !== IDP.IDIR &&
      currentUser.identity_provider !== IDP.SERVICE_ACCOUNT &&
      file?.companyId != companyId
    ) {
      throw new ForbiddenException('Invalid Company Id');
    }

    if (downloadMode === FileDownloadModes.PROXY) {
      s3Object = await this.s3Service.getFile(file.s3ObjectId, res);
    } else {
      file.preSignedS3Url = await this.s3Service.presignUrl(file.s3ObjectId);
    }

    return { file, s3Object };
  }

  @LogAsyncMethodExecution()
  async findLatest(documentId: string): Promise<ReadFileDto> {
    const subQuery = this.documentRepository
      .createQueryBuilder('document')
      .select('document.s3ObjectId')
      .where('document.documentId = :documentId')
      .getQuery();

    const latestDmsObject = await this.documentRepository
      .createQueryBuilder('document')
      .where(`document.s3ObjectId IN (${subQuery})`, { documentId: documentId })
      .orderBy('document.dmsVersionId', 'DESC')
      .getOne();

    const readFile = await this.classMapper.mapAsync(
      latestDmsObject,
      Document,
      ReadFileDto,
    );

    return readFile;
  }
}
