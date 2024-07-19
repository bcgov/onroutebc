import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { CreateLoaDto } from './dto/request/create-loa.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { ReadLoaDto } from './dto/response/read-loa.dto';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoaDetail } from './entities/loa-detail.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { LoaVehicle } from './entities/loa-vehicles.entity';
import { LoaPermitType } from './entities/loa-permit-type-details.entity';
import { ReadFileDto } from '../common/dto/response/read-file.dto';
import { DopsService } from '../common/dops.service';
import { FileDownloadModes } from 'src/common/enum/file-download-modes.enum';
import { Response } from 'express';
import { UpdateLoaDto } from './dto/request/update-loa.dto';

@Injectable()
export class LoaService {
  private readonly logger = new Logger(LoaService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(LoaDetail)
    private loaDetailRepository: Repository<LoaDetail>,
    private dataSource: DataSource,
    private readonly dopsService: DopsService,
  ) {}

  @LogAsyncMethodExecution()
  async create(
    currentUser: IUserJWT,
    createLoaDto: CreateLoaDto,
    companyId: number,
    documentId?: string,
  ): Promise<ReadLoaDto> {
    const loa = await this.classMapper.mapAsync(
      createLoaDto,
      CreateLoaDto,
      LoaDetail,
      {
        extraArgs: () => ({ companyId: companyId, documentId: documentId }),
      },
    );
    loa.isActive = true;
    const loaDetail = await this.loaDetailRepository.save(loa);
    const readLoaDto = await this.classMapper.mapAsync(
      loaDetail,
      LoaDetail,
      ReadLoaDto,
    );
    try {
      const file = await this.downloadLoaDocument(
        currentUser,
        readLoaDto.documentId,
        companyId,
      );
      readLoaDto.fileName = file.fileName;
    } catch (error) {
      this.logger.error('Failed to get loa document', error);
      // Log the error and continue without setting fileName
    }
    return readLoaDto;
  }

  @LogAsyncMethodExecution()
  async get(companyId: number, expired?: boolean): Promise<ReadLoaDto[]> {
    const loaDetailQB = this.loaDetailRepository
      .createQueryBuilder('loaDetail')
      .leftJoinAndSelect('loaDetail.company', 'company')
      .leftJoinAndSelect('loaDetail.loaVehicles', 'loaVehicles')
      .leftJoinAndSelect('loaDetail.loaPermitTypes', 'loaPermitTypes')
      .where('company.companyId = :companyId', { companyId: companyId })
      .andWhere('loaDetail.isActive = :isActive', { isActive: 'Y' });
    if (expired === true) {
      loaDetailQB.andWhere('loaDetail.expiryDate < :expiryDate', {
        expiryDate: new Date(),
      });
    } else {
      loaDetailQB.andWhere(
        new Brackets((qb) => {
          qb.where('loaDetail.expiryDate >= :expiryDate', {
            expiryDate: new Date(),
          }).orWhere('loaDetail.expiryDate IS NULL');
        }),
      );
    }
    const loaDetail: LoaDetail[] = await loaDetailQB.getMany();
    const readLoaDto = await this.classMapper.mapArrayAsync(
      loaDetail,
      LoaDetail,
      ReadLoaDto,
      {
        extraArgs: () => ({ companyId: companyId }),
      },
    );
    console.log('readLoaDto', readLoaDto);
    return readLoaDto;
  }

  @LogAsyncMethodExecution()
  async findOne(companyId: number, loaId: number): Promise<LoaDetail> {
    return await this.loaDetailRepository.findOne({
      where: {
        loaId: loaId,
        company: { companyId: Number(companyId) },
        isActive: true,
      },
      relations: ['company', 'loaVehicles', 'loaPermitTypes'],
    });
  }

  @LogAsyncMethodExecution()
  async getById(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
  ): Promise<ReadLoaDto> {
    const loaDetail = await this.findOne(companyId, loaId);

    if (!loaDetail) {
      throw new NotFoundException(
        `LOA detail not found for companyId ${companyId} and loaId ${loaId}`,
      );
    }

    const readLoaDto = await this.classMapper.mapAsync(
      loaDetail,
      LoaDetail,
      ReadLoaDto,
      {
        extraArgs: () => ({ companyId }),
      },
    );

    try {
      const file = await this.downloadLoaDocument(
        currentUser,
        readLoaDto.documentId,
        companyId,
      );
      readLoaDto.fileName = file.fileName;
    } catch (error) {
      this.logger.error('Failed to get loa document', error);
      // Log the error and continue without setting fileName
    }

    return readLoaDto;
  }

  @LogAsyncMethodExecution()
  async updateLoa(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
    updateLoaDto: UpdateLoaDto,
    file?: Express.Multer.File,
  ): Promise<ReadLoaDto> {
    const existingLoaDetail = await this.findOne(companyId, loaId);
    if (!existingLoaDetail) {
      throw new NotFoundException('LOA detail not found');
    }
    if (
      updateLoaDto.documentId &&
      existingLoaDetail.documentId != updateLoaDto.documentId
    ) {
      throw new NotFoundException('LOA documet id mismatch');
    }
    let readFileDto: ReadFileDto = new ReadFileDto();
    if (file && updateLoaDto.documentId)
      readFileDto = await this.dopsService.upload(
        currentUser,
        companyId,
        file,
        updateLoaDto.documentId,
      );
    if (file && !updateLoaDto.documentId)
      readFileDto = await this.dopsService.upload(currentUser, companyId, file);
    return await this.update(
      currentUser,
      companyId,
      loaId,
      updateLoaDto,
      readFileDto.documentId,
    );
  }

  @LogAsyncMethodExecution()
  async update(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
    updateLoaDto: UpdateLoaDto,
    documentId?: string,
  ): Promise<ReadLoaDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingLoaDetail = await queryRunner.manager.findOne(LoaDetail, {
        where: { loaId: loaId, company: { companyId: companyId } },
        relations: { loaVehicles: true, loaPermitTypes: true },
      });
      if (!existingLoaDetail) {
        throw new NotFoundException('LOA detail not found');
      }
      await queryRunner.manager.delete(LoaVehicle, { loa: { loaId: loaId } });
      await queryRunner.manager.delete(LoaPermitType, {
        loa: { loaId: loaId },
      });
      const isActive = existingLoaDetail.isActive;

      const updatedLoaDetail: LoaDetail = await this.classMapper.mapAsync(
        updateLoaDto,
        UpdateLoaDto,
        LoaDetail,
        { extraArgs: () => ({ companyId, loaId, isActive, documentId }) },
      );
      const savedLoaDetail = await queryRunner.manager.save(updatedLoaDetail);
      let readLoaDto = await this.classMapper.mapAsync(
        savedLoaDetail,
        LoaDetail,
        ReadLoaDto,
      );
      await queryRunner.commitTransaction();
      if (updateLoaDto.documentId) {
        try {
          const file = (await this.dopsService.download(
            currentUser,
            readLoaDto.documentId,
            FileDownloadModes.URL,
            undefined,
            companyId,
          )) as ReadFileDto;

          readLoaDto = { ...readLoaDto, fileName: file.fileName };
        } catch (error) {
          this.logger.error('Failed to get loa document', error);
          // Log the error and continue without setting fileName
        }
      }

      return readLoaDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  @LogAsyncMethodExecution()
  async delete(loaId: string, companyId: number): Promise<number> {
    const { affected } = await this.loaDetailRepository
      .createQueryBuilder()
      .update(LoaDetail)
      .set({
        isActive: false,
      })
      .where('loaId = :loaId', { loaId: loaId })
      .andWhere('company.companyId = :companyId', { companyId: companyId })
      .execute();
    return affected;
  }

  async getloaDocument(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
    downloadMode: FileDownloadModes,
    res?: Response,
  ): Promise<ReadFileDto | Buffer> {
    const loaDetail = await this.findOne(companyId, loaId);
    if (!loaDetail) {
      throw new NotFoundException(
        `LOA detail not found for companyId ${companyId} and loaId ${loaId}`,
      );
    }
    const loa: ReadFileDto | Buffer = await this.dopsService.download(
      currentUser,
      loaDetail.documentId,
      downloadMode,
      res,
      companyId,
    );
    return loa;
  }

  private async downloadLoaDocument(
    currentUser: IUserJWT,
    documentId: string,
    companyId: number,
  ): Promise<ReadFileDto> {
    return this.dopsService.download(
      currentUser,
      documentId,
      FileDownloadModes.URL,
      undefined,
      companyId,
    ) as Promise<ReadFileDto>;
  }

  @LogAsyncMethodExecution()
  async deleteLoaDocument(companyId: number, loaId: number): Promise<number> {
    const { affected } = await this.loaDetailRepository.update(
      { loaId: loaId },
      {
        documentId: null,
      },
    );
    return affected;
  }
}
