import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { CreateLoaDto } from './dto/request/create-loa.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { ReadLoaDto } from './dto/response/read-loa.dto';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoaDetail } from './entities/loa-detail.entity';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { UpdateLoaDto } from './dto/request/update-loa.dto';
import { LoaVehicle } from './entities/loa-vehicles.entity';
import { LoaPermitType } from './entities/loa-permit-type-details.entity';
import { ReadFileDto } from '../common/dto/response/read-file.dto';
import { DopsService } from '../common/dops.service';
import { FileDownloadModes } from 'src/common/enum/file-download-modes.enum';
import { Response } from 'express';

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
    const loa = this.classMapper.map(createLoaDto, CreateLoaDto, LoaDetail, {
      extraArgs: () => ({ companyId: companyId, documentId: documentId }),
    });
    loa.isActive = true;
    const loaDetail = await this.loaDetailRepository.save(loa);
    const readLoaDto = this.classMapper.map(loaDetail, LoaDetail, ReadLoaDto);
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
    const readLoaDto = this.classMapper.mapArray(
      loaDetail,
      LoaDetail,
      ReadLoaDto,
      {
        extraArgs: () => ({ companyId: companyId }),
      },
    );
console.log('readLoaDto',readLoaDto);
    return readLoaDto;
  }

  @LogAsyncMethodExecution()
  async findOne(companyId: number, loaId: string): Promise<LoaDetail> {
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
    loaId: string,
  ): Promise<ReadLoaDto> {
    const loaDetail = await this.findOne(companyId, loaId);

    if (!loaDetail) {
      throw new NotFoundException(
        `LOA detail not found for companyId ${companyId} and loaId ${loaId}`,
      );
    }

    const readLoaDto = this.classMapper.map(loaDetail, LoaDetail, ReadLoaDto, {
      extraArgs: () => ({ companyId }),
    });

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
    loaId: string,
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
    loaId: string,
    updateLoaDto: UpdateLoaDto,
    documentId?: string,
  ): Promise<ReadLoaDto> {
    const { powerUnits, trailers, loaPermitType } = updateLoaDto;
    const queryRunner =
      this.loaDetailRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingLoaDetail = await this.findOne(companyId, loaId);

      if (!existingLoaDetail) {
        throw new NotFoundException('LOA detail not found');
      }

      await this.deleteEntities(
        queryRunner.manager,
        LoaVehicle,
        'powerUnit',
        powerUnits,
        loaId,
      );
      await this.deleteEntities(
        queryRunner.manager,
        LoaVehicle,
        'trailer',
        trailers,
        loaId,
      );
      await this.deleteEntities(
        queryRunner.manager,
        LoaPermitType,
        'permitType',
        loaPermitType,
        loaId,
      );

      const updatedLoaDetail = this.classMapper.map(
        updateLoaDto,
        UpdateLoaDto,
        LoaDetail,
        { extraArgs: () => ({ companyId, loaId }) },
      );

      if (documentId) {
        updatedLoaDetail.documentId = documentId;
      }

      const savedLoaDetail = await queryRunner.manager.save(updatedLoaDetail);
      await queryRunner.commitTransaction();

      let readLoaDto = this.classMapper.map(
        savedLoaDetail,
        LoaDetail,
        ReadLoaDto,
      );

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

      return readLoaDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @LogAsyncMethodExecution()
  async delete(loaId: string,companyId: number): Promise<number> {
    const { affected } = await this.loaDetailRepository
    .createQueryBuilder()
    .update(LoaDetail)
    .set({
        isActive: false,
    })
    .where("loaId = :loaId", { loaId: loaId })
    .andWhere("company.companyId = :companyId",{companyId: companyId})
    .execute()
    return affected;
  }

  async getloaDocument(
    currentUser: IUserJWT,
    companyId: number,
    loaId: string,
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

  private async deleteEntities(
    entityManager: EntityManager,
    entity: typeof LoaVehicle | typeof LoaPermitType,
    field: 'powerUnit' | 'trailer' | 'permitType',
    items: string[],
    loaId: string,
  ): Promise<void> {
    if (items && items.length > 0) {
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(entity)
        .where(`${field} IN (:...items)`, { items })
        .andWhere('loa = :loaId', { loaId })
        .execute();
    }
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
  async deleteLoaDocument(companyId: number, loaId: string): Promise<number> {
    const { affected } = await this.loaDetailRepository.update(
      { loaId: loaId },
      {
        documentId: null,
      },
    );
    return affected;
  }
}
