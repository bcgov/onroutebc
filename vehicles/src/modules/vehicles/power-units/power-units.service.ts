import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePowerUnitDto } from './dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/request/update-power-unit.dto';
import { DeleteResult, In, Repository } from 'typeorm';
import { PowerUnit } from './entities/power-unit.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReadPowerUnitDto } from './dto/response/read-power-unit.dto';
import { DeleteDto } from 'src/modules/common/dto/response/delete.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { LogAsyncMethodExecution } from '../../../common/decorator/log-async-method-execution.decorator';

@Injectable()
export class PowerUnitsService {
  constructor(
    @InjectRepository(PowerUnit)
    private powerUnitRepository: Repository<PowerUnit>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  @LogAsyncMethodExecution()
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

  @LogAsyncMethodExecution()
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

  @LogAsyncMethodExecution()
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

  @LogAsyncMethodExecution()
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

  @LogAsyncMethodExecution()
  async remove(companyId: number, powerUnitId: string): Promise<DeleteResult> {
    return await this.powerUnitRepository.delete(powerUnitId);
  }

  /**
   * Removes all specified power units for a given company from the database.
   *
   * This method first retrieves the existing power units by their IDs and company ID. It then identifies
   * which power units can be deleted (based on whether their IDs were found or not) and proceeds to delete
   * them. Finally, it constructs a response detailing which deletions were successful and which were not.
   *
   * @param {string[]} powerUnitIds The IDs of the power units to be deleted.
   * @param {number} companyId The ID of the company owning the power units.
   * @returns {Promise<DeleteDto>} An object containing arrays of successful and failed deletions.
   */
  @LogAsyncMethodExecution()
  async removeAll(
    powerUnitIds: string[],
    companyId: number,
  ): Promise<DeleteDto> {
    // Retrieve a list of power units by their IDs and company ID before deletion
    const powerUnitsBeforeDelete = await this.powerUnitRepository.findBy({
      powerUnitId: In(powerUnitIds),
      companyId: companyId,
    });

    // Extract only the IDs of the power units to be deleted
    const powerUnitIdsBeforeDelete = powerUnitsBeforeDelete.map(
      (powerUnit) => powerUnit.powerUnitId,
    );

    // Identify which IDs were not found (failure to delete)
    const failure = powerUnitIds?.filter(
      (id) => !powerUnitIdsBeforeDelete?.includes(id),
    );

    // Execute the deletion of power units by their IDs within the specified company
    await this.powerUnitRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(powerUnitIdsBeforeDelete)
      .andWhere('companyId = :companyId', {
        companyId: companyId,
      })
      .execute();

    // Determine successful deletions by filtering out failures
    const success = powerUnitIds?.filter((id) => !failure?.includes(id));

    // Prepare the response DTO with lists of successful and failed deletions
    const deleteDto: DeleteDto = {
      success: success,
      failure: failure,
    };
    return deleteDto;
  }
}
