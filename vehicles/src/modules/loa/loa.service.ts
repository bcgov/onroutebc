import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { CreateLoaDto } from './dto/request/create-loa.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { ReadLoaDto } from './dto/response/read-loa.dto';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoaDetail } from './entities/loa-detail.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { UpdateLoaDto } from './dto/request/update-loa.dto';
import { LoaVehicle } from './entities/loa-vehicles.entity';
import { LoaPermitType } from './entities/loa-permit-type-details.entity';
import { ReadFileDto } from '../common/dto/response/read-file.dto';
import { DopsService } from '../common/dops.service';
import { FileDownloadModes } from 'src/common/enum/file-download-modes.enum';

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
    let loaDetailQB = this.loaDetailRepository
      .createQueryBuilder('loaDetail')
      .leftJoinAndSelect('loaDetail.company', 'company')
      .leftJoinAndSelect('loaDetail.loaVehicles', 'loaVehicles')
      .leftJoinAndSelect('loaDetail.loaPermitTypes', 'loaPermitTypes')
      .where('company.companyId = :companyId', { companyId: companyId });
    if (expired === true) {
      loaDetailQB = loaDetailQB.andWhere('loaDetail.expiryDate < :expiryDate', {
        expiryDate: new Date(),
      });
    } else {
      loaDetailQB = loaDetailQB.andWhere(
        'loaDetail.expiryDate >= :expiryDate',
        {
          expiryDate: new Date(),
        },
      );
      loaDetailQB = loaDetailQB.orWhere('loaDetail.expiryDate IS NULL');
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

    return readLoaDto;
  }

  @LogAsyncMethodExecution()
  async findOne(companyId: number, loaId: number): Promise<LoaDetail> {
    return await this.loaDetailRepository.findOne({
      where: {
        loaId: loaId,
        company: { companyId: Number(companyId) },
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
  async update(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
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
        { extraArgs: () => ({ companyId, loaId, documentId }) },
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
  async delete(companyId: number, loaId: number): Promise<ReadLoaDto> {
    try {
      const loaDetail = await this.loaDetailRepository.findOne({
        where: {
          loaId: loaId,
          company: { companyId: companyId },
        },
        relations: ['company', 'loaVehicles', 'loaPermitTypes'],
      });

      if (!loaDetail) {
        throw new Error(
          `LOA detail not found for companyId ${companyId} and loaId ${loaId}`,
        );
      }
      const loa = await this.loaDetailRepository.remove(loaDetail);
      const readLoaDto = this.classMapper.map(loa, LoaDetail, ReadLoaDto);
      return readLoaDto;
    } catch (error) {
      throw new Error(`Failed to fetch LOA detail: ${error}`);
    }
  }

  async getloaDocument(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
    downloadMode: FileDownloadModes,
  ): Promise<ReadFileDto | Buffer> {
    const loaDetail = await this.findOne(companyId, loaId);
    const loa: ReadFileDto | Buffer = await this.dopsService.download(
      currentUser,
      loaDetail.documentId,
      downloadMode,
      undefined,
      companyId,
    );
    return loa;
  }

  private async deleteEntities(
    entityManager: EntityManager,
    entity: typeof LoaVehicle | typeof LoaPermitType,
    field: 'powerUnit' | 'trailer' | 'permitType',
    items: string[],
    loaId: number,
  ): Promise<void> {
    if (items.length > 0) {
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
}
