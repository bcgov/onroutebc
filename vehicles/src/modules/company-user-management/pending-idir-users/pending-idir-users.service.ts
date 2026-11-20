import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { PendingIdirUser } from './entities/pending-idir-user.entity';
import { CreatePendingIdirUserDto } from './dto/request/create-pending-idir-user.dto';
import { ReadPendingIdirUserDto } from './dto/response/read-pending-idir-user.dto';
import { IUserJWT } from '@common/interface/user-jwt.interface';
import { LogAsyncMethodExecution } from '@common/decorator/log-async-method-execution.decorator';
import { UpdatePendingIdirUserDto } from './dto/request/update-pending-idir-user.dto';
import { UserManagmentActivityService } from '@modules/company-user-management/user-management-activity/user-management-activity.service';
import {
  getQueryRunner,
  setBaseEntityProperties,
} from '@common/helper/database.helper';
import { DataNotFoundException } from '@common/exception/data-not-found.exception';
import { User } from '@modules/company-user-management/users/entities/user.entity';
import { DeleteDto } from '@modules/common/dto/response/delete.dto';

@Injectable()
export class PendingIdirUsersService {
  private readonly logger = new Logger(PendingIdirUsersService.name);
  constructor(
    @InjectRepository(PendingIdirUser)
    private pendingIdirUserRepository: Repository<PendingIdirUser>,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly userManagmentActivityService: UserManagmentActivityService,
    private dataSource: DataSource,
  ) {}

  /**
   * Creates a pending IDIR user and records the invitation activity.
   *
   * @param createPendingIdirUserDto The username and role for the pending user.
   * @param currentUser The authorized user creating the invitation.
   * @returns The created pending user details.
   * @throws {InternalServerErrorException} If the username already belongs to a registered or pending user.
   */
  @LogAsyncMethodExecution()
  async create(
    createPendingIdirUserDto: CreatePendingIdirUserDto,
    currentUser: IUserJWT,
  ): Promise<ReadPendingIdirUserDto> {
    const existingUser = await this.pendingIdirUserRepository.manager.findOne(
      User,
      {
        where: { userName: createPendingIdirUserDto.userName },
      },
    );
    if (existingUser) {
      throw new InternalServerErrorException('User already exists');
    }

    const existingPendingIdirUser =
      await this.pendingIdirUserRepository.findOne({
        where: { userName: createPendingIdirUserDto?.userName },
      });
    if (existingPendingIdirUser) {
      throw new InternalServerErrorException('User has already been invited');
    }
    let newPendingIdirUser = this.classMapper.map(
      createPendingIdirUserDto,
      CreatePendingIdirUserDto,
      PendingIdirUser,
      {
        extraArgs: () => ({
          userName: currentUser.userName,
          directory: currentUser.orbcUserDirectory,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
        }),
      },
    );
    const { localQueryRunner, queryRunner } = await getQueryRunner({
      dataSource: this.dataSource,
    });
    try {
      newPendingIdirUser =
        await queryRunner.manager.save<PendingIdirUser>(newPendingIdirUser);

      await this.userManagmentActivityService.pendingUserAdded({
        currentUser,
        queryRunner,
        user: newPendingIdirUser,
      });

      if (localQueryRunner) {
        await queryRunner.commitTransaction();
      }
    } catch (error) {
      if (localQueryRunner) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(error);
      throw error;
    } finally {
      if (localQueryRunner) {
        await queryRunner.release();
      }
    }
    const readPendingIdirUser = await this.classMapper.mapAsync(
      newPendingIdirUser,
      PendingIdirUser,
      ReadPendingIdirUserDto,
    );
    return readPendingIdirUser;
  }
  /**
   * Finds pending IDIR user details by username.
   *
   * @param userName The username to search for.
   * @returns The matching pending IDIR user details.
   */
  @LogAsyncMethodExecution()
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

  /**
   * Finds a pending IDIR user by username.
   *
   * @param username The username to search for.
   * @returns The matching pending IDIR user details.
   * @throws {DataNotFoundException} If no pending user matches the username.
   */
  @LogAsyncMethodExecution()
  async find(username: string): Promise<ReadPendingIdirUserDto> {
    const idiruser = await this.pendingIdirUserRepository.findOne({
      where: {
        userName: username,
      },
    });
    if (!idiruser) {
      throw new DataNotFoundException();
    }
    const readPendingIdirUser = await this.classMapper.mapAsync(
      idiruser,
      PendingIdirUser,
      ReadPendingIdirUserDto,
    );
    return readPendingIdirUser;
  }

  /**
   * Retrieves all pending IDIR users, ordered by username.
   *
   * @returns The pending IDIR user details.
   */
  @LogAsyncMethodExecution()
  async findAll(): Promise<ReadPendingIdirUserDto[]> {
    const idirusers = await this.pendingIdirUserRepository.find({
      order: { userName: { direction: 'ASC' } },
    });
    const readPendingIdirUsers = await this.classMapper.mapArrayAsync(
      idirusers,
      PendingIdirUser,
      ReadPendingIdirUserDto,
    );
    return readPendingIdirUsers;
  }

  /**
   * Updates a pending IDIR user's role and records the role-change activity.
   *
   * @param userName The username of the pending user to update.
   * @param updatePendingIdirUserDto The updated role.
   * @param currentUser The authorized user performing the update.
   * @returns The updated pending user details.
   * @throws {DataNotFoundException} If no pending user matches the username.
   */
  @LogAsyncMethodExecution()
  async update(
    userName: string,
    updatePendingIdirUserDto: UpdatePendingIdirUserDto,
    currentUser: IUserJWT,
  ): Promise<ReadPendingIdirUserDto> {
    const existingPendingIdirUser = await this.find(userName);
    if (!existingPendingIdirUser) {
      throw new DataNotFoundException();
    }
    if (
      updatePendingIdirUserDto.userRole === existingPendingIdirUser.userRole
    ) {
      return await this.classMapper.mapAsync(
        existingPendingIdirUser,
        PendingIdirUser,
        ReadPendingIdirUserDto,
      );
    }
    let newPendingIdirUser = this.classMapper.map(
      updatePendingIdirUserDto,
      UpdatePendingIdirUserDto,
      PendingIdirUser,
      {
        extraArgs: () => ({
          userName: userName,
        }),
      },
    );
    setBaseEntityProperties({
      entity: newPendingIdirUser,
      currentUser,
      update: true,
    });
    const { localQueryRunner, queryRunner } = await getQueryRunner({
      dataSource: this.dataSource,
    });
    try {
      newPendingIdirUser =
        await queryRunner.manager.save<PendingIdirUser>(newPendingIdirUser);

      const user = this.classMapper.map(
        newPendingIdirUser,
        PendingIdirUser,
        User,
        {
          extraArgs: () => ({
            userName: userName,
          }),
        },
      );

      setBaseEntityProperties({ entity: user, currentUser, update: true });

      await this.userManagmentActivityService.userRoleUpdate({
        currentUser,
        queryRunner,
        user,
        assignedUserRole: updatePendingIdirUserDto?.userRole,
      });

      if (localQueryRunner) {
        await queryRunner.commitTransaction();
      }
    } catch (error) {
      if (localQueryRunner) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(error);
      throw error;
    } finally {
      if (localQueryRunner) {
        await queryRunner.release();
      }
    }

    const readPendingIdirUser = await this.classMapper.mapAsync(
      newPendingIdirUser,
      PendingIdirUser,
      ReadPendingIdirUserDto,
    );
    return readPendingIdirUser;
  }

  /**
   * Removes pending IDIR users and records a removal activity for each user
   * found.
   *
   * @param userNames The usernames to remove.
   * @param currentUser The authorized user performing the removal.
   * @returns Usernames that were successfully deleted and usernames that were not found.
   */
  @LogAsyncMethodExecution()
  async removeAll(
    userNames: string[],
    currentUser: IUserJWT,
  ): Promise<DeleteDto> {
    // Retrieve a list of users
    const pendingUsersToDelete = await this.pendingIdirUserRepository.find({
      where: {
        userName: In(userNames),
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
    const { localQueryRunner, queryRunner } = await getQueryRunner({
      dataSource: this.dataSource,
    });
    try {
      await queryRunner.manager
        .createQueryBuilder(PendingIdirUser, 'pendingIdirUser')
        .delete()
        .where('userName IN (:...userNames)', { userNames: userNames || [] })
        .execute();

      for (const user of pendingUsersToDelete) {
        await this.userManagmentActivityService.pendingUserRemoved({
          currentUser,
          queryRunner,
          user,
        });
      }

      if (localQueryRunner) {
        await queryRunner.commitTransaction();
      }
    } catch (error) {
      if (localQueryRunner) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(error);
      throw error;
    } finally {
      if (localQueryRunner) {
        await queryRunner.release();
      }
    }

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
