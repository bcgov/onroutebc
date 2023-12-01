import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePowerUnitDto } from './dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/request/update-power-unit.dto';
import { DeleteResult, Repository } from 'typeorm';
import { PowerUnit } from './entities/power-unit.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReadPowerUnitDto } from './dto/response/read-power-unit.dto';
import { DeleteDto } from 'src/modules/common/dto/response/delete.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';

@Injectable()
export class PowerUnitsService {
  constructor(
    @InjectRepository(PowerUnit)
    private powerUnitRepository: Repository<PowerUnit>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(
    companyId: number,
    powerUnit: CreatePowerUnitDto,
    currentUser: IUserJWT,
  ): Promise<ReadPowerUnitDto> {
    const newPowerUnit = this.classMapper.map(
      powerUnit,
      CreatePowerUnitDto,
      PowerUnit,
      {
        extraArgs: () => ({
          companyId: companyId,
          userName: currentUser.userName,
          directory: currentUser.orbcUserDirectory,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
        }),
      },
    );
    return this.classMapper.mapAsync(
      await this.powerUnitRepository.save(newPowerUnit),
      PowerUnit,
      ReadPowerUnitDto,
    );
  }

  async findAll(companyId: number): Promise<ReadPowerUnitDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.powerUnitRepository.find({
        where: { companyId: companyId },
        relations: {
          powerUnitType: true,
          province: true,
        },
      }),
      PowerUnit,
      ReadPowerUnitDto,
    );
  }

  async findOne(
    companyId: number,
    powerUnitId: string,
  ): Promise<ReadPowerUnitDto> {
    return this.classMapper.mapAsync(
      await this.powerUnitRepository.findOne({
        where: {
          powerUnitId: powerUnitId,
          companyId: companyId ? companyId : undefined,
        },
        relations: {
          powerUnitType: true,
          province: true,
        },
      }),
      PowerUnit,
      ReadPowerUnitDto,
    );
  }

  async update(
    companyId: number,
    powerUnitId: string,
    updatePowerUnitDto: UpdatePowerUnitDto,
    currentUser: IUserJWT,
  ): Promise<ReadPowerUnitDto> {
    const newPowerUnit = this.classMapper.map(
      updatePowerUnitDto,
      UpdatePowerUnitDto,
      PowerUnit,
      {
        extraArgs: () => ({
          userName: currentUser.userName,
          directory: currentUser.orbcUserDirectory,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
        }),
      },
    );
    await this.powerUnitRepository.update(
      { powerUnitId: powerUnitId, companyId: companyId },
      newPowerUnit,
    );
    return this.findOne(companyId, powerUnitId);
  }

  async remove(companyId: number, powerUnitId: string): Promise<DeleteResult> {
    return await this.powerUnitRepository.delete(powerUnitId);
  }

  async removeAll(
    powerUnitIds: string[],
    companyId: number,
  ): Promise<DeleteDto> {
    const deletedResult = await this.powerUnitRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(powerUnitIds)
      .andWhere('companyId = :companyId', {
        companyId: companyId,
      })
      .output('DELETED.POWER_UNIT_ID')
      .execute();

    const powerUnitsDeleted = Array.from(
      deletedResult?.raw as [{ POWER_UNIT_ID: string }],
    );
    const success = powerUnitsDeleted?.map(
      (powerUnit) => powerUnit.POWER_UNIT_ID,
    );
    const failure = powerUnitIds?.filter((id) => !success?.includes(id));
    const deleteDto: DeleteDto = {
      success: success,
      failure: failure,
    };
    return deleteDto;
  }
}
