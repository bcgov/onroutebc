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
   * @param companyId The company Id.
   * @param createPendingUserDto Request object of type
   * {@link CreatePendingUserDto} for creating a pending user.
   *
   * @returns The pending user details as a promise of type
   * {@link ReadPendingUserDto}
   */
  async create(
    companyId: number,
    createPendingUserDto: CreatePendingUserDto,
  ): Promise<ReadPendingUserDto> {
    const newPendingUserDto = this.classMapper.map(
      createPendingUserDto,
      CreatePendingUserDto,
      PendingUser,
      {
        extraArgs: () => ({ companyId: companyId }),
      },
    );
    await this.pendingUserRepository.insert(newPendingUserDto);
    return this.findOne(
      newPendingUserDto.companyId,
      newPendingUserDto.userName,
    );
  }

  /**
   * Finds a pending user in the database based on the companyId and userName
   * parameters.
   *
   * @param companyId The company Id.
   * @param userName The userName of the pending user.
   *
   * @returns The pending user details as a promise of type
   * {@link ReadPendingUserDto}
   */
  async findOne(
    companyId: number,
    userName: string,
  ): Promise<ReadPendingUserDto> {
    return this.classMapper.mapAsync(
      await this.pendingUserRepository.findOne({
        where: { companyId, userName },
      }),
      PendingUser,
      ReadPendingUserDto,
    );
  }

  /**
   * Finds a pending user in the database based on userName.
   *
   * @param userName The userName of the pending user.
   *
   * @returns The pending user details as a promise of type
   * {@link ReadPendingUserDto}
   */
  async findOneByUserName(userName: string): Promise<ReadPendingUserDto> {
    return this.classMapper.mapAsync(
      await this.pendingUserRepository.findOne({
        where: { userName },
      }),
      PendingUser,
      ReadPendingUserDto,
    );
  }

  /**
   * Finds all pending users details in the database for a given user name.
   *
   * @param userName The user name.
   *
   * @returns The list of pending user details as a promise of type
   * {@link ReadPendingUserDto}.
   */
  async findAllbyUserName(userName: string): Promise<ReadPendingUserDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.pendingUserRepository.find({ where: { userName: userName } }),
      PendingUser,
      ReadPendingUserDto,
    );
  }

  /**
   * Finds all pending users in the database for a given companyId.
   *
   * @param companyId The company Id.
   *
   * @returns The pending user details as a promise of type
   * {@link ReadPendingUserDto}.
   */
  async findAll(companyId: number): Promise<ReadPendingUserDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.pendingUserRepository.find({ where: { companyId } }),
      PendingUser,
      ReadPendingUserDto,
    );
  }

  /**
   * Updates a pending user in the database based on the companyId and
   * userName parameters.
   *
   * @param companyId The company Id.
   * @param userName The userName of the pending user.
   * @param updatePendingUserDto Request object of type
   * {@link UpdatePendingUserDto} for creating a pending company.
   *
   * @returns The pending user details as a promise of type
   * {@link ReadPendingUserDto}.
   */
  async update(
    companyId: number,
    userName: string,
    updatePendingUserDto: UpdatePendingUserDto,
  ): Promise<ReadPendingUserDto> {
    const updatePendingUser = this.classMapper.map(
      updatePendingUserDto,
      UpdatePendingUserDto,
      PendingUser,
      {
        extraArgs: () => ({ companyId: companyId, userName: userName }),
      },
    );

    await this.pendingUserRepository.update(
      { companyId, userName },
      updatePendingUser,
    );
    return this.findOne(companyId, userName);
  }

  /**
   * Deletes a pending user from the database based on the companyId and
   * userName parameters.
   * @param companyId The company Id.
   * @param userName The userName of the pending user.
   * @returns The Result object returned by DeleteQueryBuilder execution.
   */
  async remove(companyId: number, userName: string): Promise<DeleteResult> {
    return await this.pendingUserRepository.delete({ companyId, userName });
  }
}
