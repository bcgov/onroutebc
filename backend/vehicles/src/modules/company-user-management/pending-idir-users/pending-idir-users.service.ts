import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PendingIdirUser } from './entities/pending-idir-user.entity';
import { CreatePendingIdirUserDto } from './dto/request/create-pending-idir-user.dto';
import { ReadPendingIdirUserDto } from './dto/response/read-pending-idir-user.dto';

@Injectable()
export class PendingIdirUsersService {
  constructor(
    @InjectRepository(PendingIdirUser)
    private pendingIdirUserRepository: Repository<PendingIdirUser>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  /**
   * Creates a new pending idir user in the database.
   * @param createPendingIdirUserDto Request object of type
   * {@link CreatePendingIdirUserDto} for creating a pending idir user.
   *
   * @returns The pending user details as a promise of type createPendingIdirUserDto
   * {@link CreatePendingIdirUserDto}
   */
  async create(
    createPendingIdirUserDto: CreatePendingIdirUserDto,
  ): Promise<ReadPendingIdirUserDto> {
    const newPendingIdirUserDto = this.classMapper.map(
      createPendingIdirUserDto,
      CreatePendingIdirUserDto,
      PendingIdirUser,
    );
    const idirUser = await this.pendingIdirUserRepository.save(
      newPendingIdirUserDto,
    );
    const readPendingIdirUser = await this.classMapper.mapAsync(
      idirUser,
      PendingIdirUser,
      ReadPendingIdirUserDto,
    );
    return readPendingIdirUser;
  }
  /**
   * Finds and returns ReadPendingIdirUserDto objects for pending idir users
   * with a specific userName.
   * @param userName The username for filtering.
   * @returns Promise resolves to ReadPendingIdirUserDto
   */
  async findPendingIdirUser(userName: string): Promise<ReadPendingIdirUserDto> {
    const idirUser = await this.pendingIdirUserRepository.findOne({
      where: { userName: userName },
    });

    const readPendingIdirUser = await this.classMapper.mapAsync(
      idirUser,
      PendingIdirUser,
      ReadPendingIdirUserDto,
    );
    return readPendingIdirUser;
  }

  async findAll(): Promise<ReadPendingIdirUserDto[]> {
    const idirusers = await this.pendingIdirUserRepository.find();
    const readPendingIdirUsers = await this.classMapper.mapArrayAsync(
      idirusers,
      PendingIdirUser,
      ReadPendingIdirUserDto,
    );
    return readPendingIdirUsers;
  }
}
