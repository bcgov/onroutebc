import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CreatePendingUserDto } from './dto/request/create-pending-user.dto';
import { UpdatePendingUserDto } from './dto/request/update-pending-user.dto';
import { ReadPendingUserDto } from './dto/response/read-pending-user.dto';
import { PendingUser } from './entities/pending-user.entity';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { TPS_MIGRATED_USER } from '../../../common/constants/api.constant';

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
    currentUser: IUserJWT,
  ): Promise<ReadPendingUserDto> {
    const newPendingUserDto = this.classMapper.map(
      createPendingUserDto,
      CreatePendingUserDto,
      PendingUser,
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

    await this.pendingUserRepository.insert(newPendingUserDto);

    const retPendingUser = await this.findPendingUsersDto(
      newPendingUserDto.userName,
      newPendingUserDto.companyId,
    );
    return retPendingUser[0];
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
    currentUser: IUserJWT,
  ): Promise<ReadPendingUserDto> {
    const updatePendingUser = this.classMapper.map(
      updatePendingUserDto,
      UpdatePendingUserDto,
      PendingUser,
      {
        extraArgs: () => ({
          companyId: companyId,
          pendingUserName: userName,
          userName: currentUser.userName,
          directory: currentUser.orbcUserDirectory,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
        }),
      },
    );

    await this.pendingUserRepository.update(
      { companyId, userName },
      updatePendingUser,
    );

    const retPendingUser = await this.findPendingUsersDto(userName, companyId);
    return retPendingUser[0];
  }

  /**
   * Finds pending user entities based on optional filtering criteria of userName
   * and companyId.
   *
   * @param userName (Optional) The username for filtering.
   * @param companyId (Optional) The company ID for filtering.
   * @param userGUID (Optional) The userGuid for filtering.
   *
   * @returns A Promise that resolves to an array of {@link pendingUser} entities.
   */
  private async findPendingUsersEntity(
    userName?: string,
    companyId?: number,
    userGUID?: string,
  ) {
    // Construct the query builder to retrieve pending user entities and associated data

    const queryBuilder = this.pendingUserRepository
      .createQueryBuilder('pendingUser')
      /* Conditional WHERE clause for userName. If userName is provided, the
     WHERE clause is pendingUser.userName = :userName; otherwise, it is 1=1 to
     include all pending users.*/
      .where(userName ? 'UPPER(pendingUser.userName) = :userName' : '1=1', {
        userName: userName?.toUpperCase(),
      });

    if (companyId) {
      queryBuilder.andWhere('pendingUser.companyId= :companyId', {
        companyId: companyId,
      });
    }
    if (userGUID) {
      queryBuilder.andWhere('pendingUser.userGUID= :userGUID', {
        userGUID: userGUID,
      });
    } else {
      queryBuilder.andWhere('pendingUser.userName != :tpsMigratedUserName', {
        tpsMigratedUserName: TPS_MIGRATED_USER,
      });
    }

    return await queryBuilder.getMany();
  }

  /**
   * Finds and returns an array of ReadPendingUserDto objects for pending users
   * with a specific userName or companyId.
   *
   * @param userName (Optional) The username for filtering.
   * @param companyId (Optional) The company ID for filtering.
   * @param userGUID (Optional) The userGuid for filtering.
   *
   * @returns A Promise that resolves to an array of {@link readPendingUserDto}
   * objects.
   */
  async findPendingUsersDto(
    userName?: string,
    companyId?: number,
    userGUID?: string,
  ): Promise<ReadPendingUserDto[]> {
    // Find pending user entities based on the provided filtering criteria
    const pendingUserDetails = await this.findPendingUsersEntity(
      userName,
      companyId,
      userGUID,
    );

    // Map the retrieved pending user entities to ReadPendingUserDto objects
    const readPendingUserDto = await this.classMapper.mapArrayAsync(
      pendingUserDetails,
      PendingUser,
      ReadPendingUserDto,
    );

    // Return the array of ReadPendingUserDto objects
    return readPendingUserDto;
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
