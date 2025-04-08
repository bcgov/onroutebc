import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { CreatePendingUserDto } from './dto/request/create-pending-user.dto';
import { UpdatePendingUserDto } from './dto/request/update-pending-user.dto';
import { ReadPendingUserDto } from './dto/response/read-pending-user.dto';
import { PendingUser } from './entities/pending-user.entity';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { LogAsyncMethodExecution } from '../../../common/decorator/log-async-method-execution.decorator';
import { DeleteDto } from '../../common/dto/response/delete.dto';
import { User } from '../users/entities/user.entity';
import { UserStatus } from '../../../common/enum/user-status.enum';
import { Company } from '../company/entities/company.entity';
import { ClientUserRole } from '../../../common/enum/user-role.enum';
import { throwUnprocessableEntityException } from '../../../common/helper/exception.helper';

@Injectable()
export class PendingUsersService {
  private readonly logger = new Logger(PendingUsersService.name);
  constructor(
    @InjectRepository(PendingUser)
    private pendingUserRepository: Repository<PendingUser>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
  ) {}

  /**
   * Retrieves and maps pending user details from the database, based on
   * provided criteria, and checks against existing entries to prevent duplicate
   * active associations within a company.
   *
   * @param companyId The company Id to associate the pending user with.
   * @param createPendingUserDto The data transfer object containing information
   * needed to create a pending user.
   * @param currentUser The current user's information, used to set additional
   * properties on the pending user entity.
   * @returns A promise containing the details of the newly created pending
   * user, mapped to a ReadPendingUserDto object.
   */
  @LogAsyncMethodExecution()
  async create(
    companyId: number,
    createPendingUserDto: CreatePendingUserDto,
    currentUser: IUserJWT,
  ): Promise<ReadPendingUserDto> {
    // Map the DTO to the PendingUser entity, including additional properties like companyId
    let newPendingUser = this.classMapper.map(
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

    // Check if the user with the provided username already exists in the database
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const company = await queryRunner.manager.findOne<Company>(Company, {
        where: {
          companyId: companyId,
        },
        relations: {
          companyUsers: true,
        },
      });

      if (
        !company?.companyUsers?.length &&
        createPendingUserDto?.userRole === ClientUserRole.PERMIT_APPLICANT
      ) {
        throw throwUnprocessableEntityException(
          'First user must be an Administrator.',
          null,
          'FIRST_USER_ADMIN',
        );
      }

      const existingPendingUser = await queryRunner.manager.find<PendingUser>(
        PendingUser,
        {
          where: {
            userName: createPendingUserDto.userName,
          },
        },
      );

      // If the pending user exists, throw an exception to stop the process
      if (existingPendingUser?.length) {
        throw throwUnprocessableEntityException(
          'The addition of a pending user is denied as the user is already added as a pending user to a company and is awaiting processing.',
          null,
          'USER_ALREADY_EXISTS',
        );
      }

      const existingUser = await queryRunner.manager.find<User>(User, {
        where: {
          userName: createPendingUserDto.userName,
          companyUsers: { statusCode: UserStatus.ACTIVE },
        },
        relations: {
          companyUsers: true,
        },
      });

      // If the user exists, throw an exception to stop the process
      if (existingUser?.length) {
        throw throwUnprocessableEntityException(
          'The addition of a pending user is denied as the user is already associated with a company.',
          null,
          'USER_ALREADY_EXISTS',
        );
      }

      // Insert the new pending user into the database
      newPendingUser = await queryRunner.manager.save(newPendingUser);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }

    // Return the first pending user object in the list
    return (await this.mapEntityToDto([newPendingUser]))?.at(0);
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
  @LogAsyncMethodExecution()
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
  @LogAsyncMethodExecution()
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
    const readPendingUserDto = await this.mapEntityToDto(pendingUserDetails);

    // Return the array of ReadPendingUserDto objects
    return readPendingUserDto;
  }

  private async mapEntityToDto(pendingUserDetails: PendingUser[]) {
    return await this.classMapper.mapArrayAsync(
      pendingUserDetails,
      PendingUser,
      ReadPendingUserDto,
    );
  }

  /**
   * Performs checks before deletion, updates user statuses to DELETED for specified users within
   * a given company, and handles the deletion process. This includes retrieving a list of users
   * by company ID before deletion, executing the deletion, and preparing a response DTO with
   * details of successful and failed deletions.
   *
   * @param {string[]} userNames The names of the users slated for deletion.
   * @param {number} companyId The ID of the company the users belong to.
   * @returns {Promise<DeleteDto>} An object containing arrays of successfully deleted user names
   * and those that failed to delete.
   */
  @LogAsyncMethodExecution()
  async removeAll(userNames: string[], companyId: number): Promise<DeleteDto> {
    // Retrieve a list of users by company ID before deletion
    const pendingUsersToDelete = await this.pendingUserRepository.find({
      where: {
        userName: In(userNames),
        companyId: companyId,
      },
    });

    // Extract only the names of the users to be deleted
    const pendingUserNamesToDelete = pendingUsersToDelete.map(
      (pendingUser) => pendingUser.userName,
    );

    // Identify which names were not found (failure to delete)
    const failure = userNames?.filter(
      (name) => !pendingUserNamesToDelete?.includes(name),
    );

    // Execute the deletion of users by their names within the specified company
    await this.pendingUserRepository
      .createQueryBuilder()
      .delete()
      .where('userName IN (:...userNames)', { userNames: userNames || [] })
      .andWhere('companyId = :companyId', {
        companyId: companyId,
      })
      .execute();

    // Determine successful deletions by filtering out failures
    const success = userNames?.filter((name) => !failure?.includes(name));

    // Prepare the response DTO with lists of successful and failed deletions
    const deleteDto: DeleteDto = {
      success: success,
      failure: failure,
    };
    return deleteDto;
  }
}
