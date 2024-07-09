import { Injectable, Logger } from '@nestjs/common';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { CreateLoaDto } from './dto/request/create-loa.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { ReadLoaDto } from './dto/response/read-loa.dto';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoaDetail } from './entities/loa-detail.entity';
import { DataSource, Repository } from 'typeorm';
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
    console.log('document id is: ', documentId);
    const loa = this.classMapper.map(createLoaDto, CreateLoaDto, LoaDetail, {
      extraArgs: () => ({ companyId: companyId, documentId: documentId }),
    });
    console.log('loa detail before saving: ', loa);
    const loaDetail = await this.loaDetailRepository.save(loa);
    const readLoaDto = this.classMapper.map(loaDetail, LoaDetail, ReadLoaDto);
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
  async getById(
    currentUser: IUserJWT,
    companyId: number,
    loaId: number,
  ): Promise<ReadLoaDto> {
    try {
      const loaDetail = await this.loaDetailRepository.findOne({
        where: {
          loaId: loaId,
          company: { companyId: Number(companyId) },
        },
        relations: ['company', 'loaVehicles', 'loaPermitTypes'],
      });

      if (!loaDetail) {
        throw new Error(
          `LOA detail not found for companyId ${companyId} and loaId ${loaId}`,
        );
      }

      const readLoaDto = this.classMapper.map(
        loaDetail,
        LoaDetail,
        ReadLoaDto,
        {
          extraArgs: () => ({ companyId: companyId }),
        },
      );
      try {
        const file = (await this.dopsService.download(
          currentUser,
          readLoaDto.documentId,
          FileDownloadModes.URL,
          undefined,
          companyId,
        )) as ReadFileDto;
        readLoaDto.fileName = file.fileName;
      } catch (error) {
        this.logger.error('Failed to get loa document', error);
      }
      return readLoaDto;
    } catch (error) {
      throw new Error(`Failed to fetch LOA detail: ${error}`);
    }
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

    // Fetch existing LOA detail
    const existingLoaDetail = await this.getById(currentUser,companyId, loaId);

    // Arrays to store entities to delete
    const deletePowerUnits = existingLoaDetail.powerUnits.filter(
      (item) => !powerUnits.includes(item),
    );
    const deleteTrailers = existingLoaDetail.trailers.filter(
      (item) => !trailers.includes(item),
    );
    const deletePermitTypes = existingLoaDetail.loaPermitType.filter(
      (item) => !loaPermitType.includes(item),
    );

    // Begin transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete power units
      if (deletePowerUnits.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(LoaVehicle)
          .where('powerUnit IN (:...deletePowerUnits)', { deletePowerUnits })
          .andWhere('loa = :loaId', { loaId })
          .execute();
      }

      // Delete trailers
      if (deleteTrailers.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(LoaVehicle)
          .where('trailer IN (:...deleteTrailers)', { deleteTrailers })
          .andWhere('loa = :loaId', { loaId })
          .execute();
      }

      // Delete permit types
      if (deletePermitTypes.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(LoaPermitType)
          .where('permitType IN (:...deletePermitTypes)', { deletePermitTypes })
          .andWhere('loa = :loaId', { loaId })
          .execute();
      }

      // Save updated LOA detail
      const updatedLoaDetail = this.classMapper.map(
        updateLoaDto,
        UpdateLoaDto,
        LoaDetail,
        {
          extraArgs: () => ({ companyId, loaId, documentId }),
        },
      );
      if (documentId) updatedLoaDetail.documentId = documentId;
      const savedLoaDetail = await queryRunner.manager.save(updatedLoaDetail);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Map to ReadLoaDto and return
      const readLoaDto = this.classMapper.map(
        savedLoaDetail,
        LoaDetail,
        ReadLoaDto,
      );
      return readLoaDto;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
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
}
