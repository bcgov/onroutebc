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

  async findAll(companyGUID: string): Promise<ReadPendingUserDto[]> {
    console.log(
      await this.pendingUserRepository.find({ where: { companyGUID } }),
    );

    return this.classMapper.mapArrayAsync(
      await this.pendingUserRepository.find({ where: { companyGUID } }),
      PendingUser,
      ReadPendingUserDto,
    );
  }

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

  async remove(companyGUID: string, userName: string): Promise<DeleteResult> {
    return await this.pendingUserRepository.delete({ companyGUID, userName });
  }
}
