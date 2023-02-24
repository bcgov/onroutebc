import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CreatePendingUserDto } from './dto/request/create-pending-user.dto';
import { UpdatePendingUserDto } from './dto/request/update-pending-user.dto';
import { ReadPendingUserDto } from './dto/response/read-pending-user.dto';
import { PendingUser } from './entities/pending-user.entity';

@Injectable()
export class PendingUsersService {
  constructor(
    @InjectRepository(PendingUser)
    private pendingUserRepository: Repository<PendingUser>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  /**
   * Creates a new pending user in the database.
   *
   * @param companyGUID The company GUID.
   * @param createPendingUserDto Request object of type
   * {@link CreatePendingUserDto} for creating a pending user.
   *
   * @returns The pending user details as a promise of type
   * {@link ReadPendingUserDto}
   */
  async create(
    companyGUID: string,
    createPendingUserDto: CreatePendingUserDto,
  ): Promise<ReadPendingUserDto> {
    const newPendingUserDto = this.classMapper.map(
      createPendingUserDto,
      CreatePendingUserDto,
      PendingUser,
      {
        extraArgs: () => ({ companyGUID: companyGUID }),
      },
    );
    await this.pendingUserRepository.insert(newPendingUserDto);
    return this.findOne(
      newPendingUserDto.companyGUID,
      newPendingUserDto.userName,
    );
  }

  /**
   * Finds a pending user in the database based on the companyGUID and userName
   * parameters.
   *
   * @param companyGUID The company GUID.
   * @param userName The userName of the pending user.
   *
   * @returns The pending user details as a promise of type
   * {@link ReadPendingUserDto}
   */
  async findOne(
    companyGUID: string,
    userName: string,
  ): Promise<ReadPendingUserDto> {
    return this.classMapper.mapAsync(
      await this.pendingUserRepository.findOne({
        where: { companyGUID, userName },
      }),
      PendingUser,
      ReadPendingUserDto,
    );
  }

  /**
   * Finds all pending users in the database for a given companyGUID.
   *
   * @param companyGUID The company GUID.
   *
   * @returns The pending user details as a promise of type
   * {@link ReadPendingUserDto}.
   */
  async findAll(companyGUID: string): Promise<ReadPendingUserDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.pendingUserRepository.find({ where: { companyGUID } }),
      PendingUser,
      ReadPendingUserDto,
    );
  }

  /**
   * Updates a pending user in the database based on the companyGUID and
   * userName parameters.
   *
   * @param companyGUID The company GUID.
   * @param userName The userName of the pending user.
   * @param updatePendingUserDto Request object of type
   * {@link UpdatePendingUserDto} for creating a pending company.
   *
   * @returns The pending user details as a promise of type
   * {@link ReadPendingUserDto}.
   */
  async update(
    companyGUID: string,
    userName: string,
    updatePendingUserDto: UpdatePendingUserDto,
  ): Promise<ReadPendingUserDto> {
    const updatePendingUser = this.classMapper.map(
      updatePendingUserDto,
      UpdatePendingUserDto,
      PendingUser,
      {
        extraArgs: () => ({ companyGUID: companyGUID, userName: userName }),
      },
    );

    await this.pendingUserRepository.update(
      { companyGUID, userName },
      updatePendingUser,
    );
    return this.findOne(companyGUID, userName);
  }

  /**
   * Deletes a pending user from the database based on the companyGUID and
   * userName parameters.
   * @param companyGUID The company GUID.
   * @param userName The userName of the pending user.
   * @returns The Result object returned by DeleteQueryBuilder execution.
   */
  async remove(companyGUID: string, userName: string): Promise<DeleteResult> {
    return await this.pendingUserRepository.delete({ companyGUID, userName });
  }
}
