import { Injectable, Logger } from '@nestjs/common';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { CreateLoaDto } from './dto/request/create-loa.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { ReadLoaDto } from './dto/response/read-loa.dto';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoaDetail } from './entities/loa-detail.entity';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { UpdateLoaDto } from './dto/request/update-loa.dto';
import { LoaVehicle } from './entities/loa-vehicles.entity';
import { LoaPermitType } from './entities/loa-permit-type-details.entity';

@Injectable()
export class LoaService {
  private readonly logger = new Logger(LoaService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(LoaDetail)
    private loaDetailRepository: Repository<LoaDetail>,
    @InjectRepository(LoaVehicle)
    private loaVehicleRepository: Repository<LoaVehicle>,
    @InjectRepository(LoaPermitType)
    private loaPermitTypeRepository: Repository<LoaPermitType>,
  ) {}

  @LogAsyncMethodExecution()
  async create(
    currentUser: IUserJWT,
    createLoaDto: CreateLoaDto,
    companyId: number,
  ): Promise<ReadLoaDto> {
    console.log(companyId);
    const loa = this.classMapper.map(createLoaDto, CreateLoaDto, LoaDetail, {
      extraArgs: () => ({ companyId: companyId }),
    });
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
    }
    const loaDetail: LoaDetail[] = await loaDetailQB.getMany();

    console.log('Loa details is: ', loaDetail.toString());

    const readLoaDto = this.classMapper.mapArray(
      loaDetail,
      LoaDetail,
      ReadLoaDto,
      {
        extraArgs: () => ({ companyId: companyId }),
      },
    );
    console.log('Loa dto is: ', readLoaDto);

    return readLoaDto;
  }

  @LogAsyncMethodExecution()
  async getById(companyId: number, loaId: number): Promise<ReadLoaDto> {
    const loaDetail: LoaDetail = await this.loaDetailRepository
      .createQueryBuilder('loaDetail')
      .leftJoinAndSelect('loaDetail.company', 'company')
      .leftJoinAndSelect('loaDetail.loaVehicles', 'loaVehicles')
      .leftJoinAndSelect('loaDetail.loaPermitTypes', 'loaPermitTypes')
      .where('loaDetail.loaId = :loaId', { loaId: loaId })
      .andWhere('company.companyId = :companyId', { companyId: companyId })
      .getOne();

    const readLoaDto = this.classMapper.map(loaDetail, LoaDetail, ReadLoaDto, {
      extraArgs: () => ({ companyId: companyId }),
    });
    return readLoaDto;
  }

  @LogAsyncMethodExecution()
  async update(
    currentUser: IUserJWT,
    companyId: number,
    updateLoaDto: UpdateLoaDto,
  ): Promise<ReadLoaDto> {
    const result = await this.getById(companyId, Number(updateLoaDto.loaId));

    const deletePowerUnit = result.powerUnits.filter(
      (item) => updateLoaDto.powerUnits.indexOf(item) < 0,
    );
    const deleteTrailer = result.trailers.filter(
      (item) => updateLoaDto.trailers.indexOf(item) < 0,
    );
    const deletePermitTypes = result.loaPermitType.filter(
      (item) => updateLoaDto.loaPermitType.indexOf(item) < 0,
    );

    if (deletePowerUnit.length > 0) {
      console.log('deleting vehicles');
      const result = await this.loaVehicleRepository
        .createQueryBuilder()
        .delete()
        .where('powerUnit IN (:...deletePowerUnit)', {
          deletePowerUnit: deletePowerUnit,
        })
        .andWhere('loa = :loaId', { loaId: updateLoaDto.loaId })
        .execute();
      console.log('deleted powerunit result: ', result.affected);
    }
    if (deleteTrailer.length > 0) {
      console.log('deleting vehicles');
      const result = await this.loaVehicleRepository
        .createQueryBuilder()
        .delete()
        .where('trailer IN (:...deleteTrailer)', {
          deleteTrailer: deleteTrailer,
        })
        .andWhere('loa = :loaId', { loaId: updateLoaDto.loaId })
        .execute();
      console.log('deleted vehicle result: ', result.raw);
    }
    if (deletePermitTypes.length > 0) {
      console.log('deleting permit types');
      const result = await this.loaPermitTypeRepository
        .createQueryBuilder()
        .delete()
        .where('permitType IN (:...deletePermitTypes)', {
          deletePermitTypes: deletePermitTypes,
        })
        .andWhere('loa = :loaId', { loaId: updateLoaDto.loaId })
        .execute();
      console.log('deleted permit types result: ', result.raw);
    }

    const loa = this.classMapper.map(updateLoaDto, UpdateLoaDto, LoaDetail, {
      extraArgs: () => ({ companyId: companyId, loadId: updateLoaDto.loaId }),
    });
    console.log('loa being updated: ', loa);
    const loaDetail = await this.loaDetailRepository.save(loa);
    console.log('updated loa: ', loaDetail);
    const readLoaDto = this.classMapper.map(loaDetail, LoaDetail, ReadLoaDto);
    return readLoaDto;
  }
}
