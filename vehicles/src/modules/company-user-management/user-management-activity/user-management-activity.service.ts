import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import { UserStatus } from '@common/enum/user-status.enum';

import { IUserJWT } from '@common/interface/user-jwt.interface';
import { IDIRUserRole } from '@common/enum/user-role.enum';

import { LogAsyncMethodExecution } from '@common/decorator/log-async-method-execution.decorator';

import {
  getQueryRunner,
  setBaseEntityProperties,
} from '@common/helper/database.helper';

import { UserManagementActivity } from './entities/user-management-activity.entity';
import { UserManagementActivityType } from '@common/enum/user-management-activity-type.enum';
import { Nullable } from '@common/types/common';
import { User } from '@modules/company-user-management/users/entities/user.entity';
import { PendingIdirUser } from '@modules/company-user-management/pending-idir-users/entities/pending-idir-user.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReadUserManagementActivityDto } from './dto/response/read-user-management-activity.dto';

@Injectable()
export class UserManagmentActivityService {
  private readonly logger = new Logger(UserManagmentActivityService.name);
  constructor(
    @InjectRepository(UserManagementActivity)
    private userManagementActivityRepository: Repository<UserManagementActivity>,
    private dataSource: DataSource,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  /**
   * Records a staff user's role change for a registered or pending account.
   *
   * @param currentUser The authorized user performing the change.
   * @param queryRunner An optional query runner for an existing transaction.
   * @param user The registered or pending user whose role changed.
   * @param assignedUserRole The role assigned to the user.
   * @returns The saved user management activity.
   */
  @LogAsyncMethodExecution()
  async userRoleUpdate({
    currentUser,
    queryRunner,
    user,
    assignedUserRole,
  }: {
    currentUser: IUserJWT;
    queryRunner?: Nullable<QueryRunner>;
    user: User | PendingIdirUser;
    assignedUserRole: IDIRUserRole;
  }): Promise<UserManagementActivity> {
    let userManagementActivity = new UserManagementActivity();
    let localQueryRunner = true;
    ({ localQueryRunner, queryRunner } = await getQueryRunner({
      queryRunner,
      dataSource: this.dataSource,
    }));
    try {
      userManagementActivity.userManagementActivityDateTime = new Date();
      userManagementActivity.userManagementActivityType =
        UserManagementActivityType.USER_GROUP_UPDATED;
      userManagementActivity.assignedUserRole = assignedUserRole;
      userManagementActivity.comment = `User Group changed from ${user?.userRole} to ${assignedUserRole}`;
      userManagementActivity.updatedByStaffUser = new User();
      userManagementActivity.updatedByStaffUser.userGUID = currentUser.userGUID;
      if (user instanceof User) {
        userManagementActivity.user = new User();
        userManagementActivity.user.userGUID = user.userGUID;
      } else {
        userManagementActivity.pendingStaffUser = user;
      }

      setBaseEntityProperties({
        entity: userManagementActivity,
        currentUser,
      });
      userManagementActivity =
        await queryRunner.manager.save<UserManagementActivity>(
          userManagementActivity,
        );

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
    return userManagementActivity;
  }

  /**
   * Records a registered user's status change.
   *
   * @param currentUser The authorized user performing the change.
   * @param queryRunner An optional query runner for an existing transaction.
   * @param user The user whose status changed.
   * @param userStatus The new user status.
   * @returns The saved user management activity.
   */
  @LogAsyncMethodExecution()
  async userStatusUpdate({
    currentUser,
    queryRunner,
    user,
    userStatus,
  }: {
    currentUser: IUserJWT;
    queryRunner?: Nullable<QueryRunner>;
    user: User;
    userStatus: UserStatus;
  }): Promise<UserManagementActivity> {
    let userManagementActivity = new UserManagementActivity();
    let localQueryRunner = true;
    ({ localQueryRunner, queryRunner } = await getQueryRunner({
      queryRunner,
      dataSource: this.dataSource,
    }));
    try {
      const status = userStatus === UserStatus.ACTIVE ? 'Active' : 'Inactive';
      userManagementActivity.userManagementActivityDateTime = new Date();
      userManagementActivity.userManagementActivityType =
        UserManagementActivityType.USER_STATUS_UPDATED;
      userManagementActivity.comment = `${user?.userName} status changed to ${status}`;
      userManagementActivity.updatedByStaffUser = new User();
      userManagementActivity.updatedByStaffUser.userGUID = currentUser.userGUID;
      userManagementActivity.user = new User();
      userManagementActivity.user.userGUID = user?.userGUID;
      setBaseEntityProperties({
        entity: userManagementActivity,
        currentUser,
      });
      userManagementActivity =
        await queryRunner.manager.save<UserManagementActivity>(
          userManagementActivity,
        );

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
    return userManagementActivity;
  }

  /**
   * Records a newly registered IDIR user's first login and moves their
   * previous pending-user activity history to the registered account.
   *
   * @param currentUser The IDIR user performing the first login.
   * @param queryRunner An optional query runner for an existing transaction.
   * @param user The newly registered user.
   * @returns The saved first-login activity.
   */
  @LogAsyncMethodExecution()
  async firstLogin({
    currentUser,
    queryRunner,
    user,
  }: {
    currentUser: IUserJWT;
    queryRunner?: Nullable<QueryRunner>;
    user: User;
  }): Promise<UserManagementActivity> {
    let userManagementActivity = new UserManagementActivity();
    let localQueryRunner = true;
    ({ localQueryRunner, queryRunner } = await getQueryRunner({
      queryRunner,
      dataSource: this.dataSource,
    }));
    try {
      userManagementActivity.userManagementActivityDateTime = new Date();
      userManagementActivity.userManagementActivityType =
        UserManagementActivityType.USER_FIRST_LOGIN;
      userManagementActivity.comment = `${user?.userName} logged into onRouteBC`;
      userManagementActivity.updatedByStaffUser = new User();
      userManagementActivity.updatedByStaffUser.userGUID = currentUser.userGUID;
      userManagementActivity.user = new User();
      userManagementActivity.user.userGUID = user?.userGUID;
      setBaseEntityProperties({
        entity: userManagementActivity,
        currentUser,
      });
      userManagementActivity =
        await queryRunner.manager.save<UserManagementActivity>(
          userManagementActivity,
        );

      await queryRunner.manager.update(
        UserManagementActivity,
        { pendingStaffUser: { userName: user?.userName } },
        {
          user: { userGUID: user.userGUID },
          pendingStaffUser: null,
          updatedUser: currentUser.userName,
          updatedDateTime: new Date(),
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        },
      );

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
    return userManagementActivity;
  }

  /**
   * Records an IDIR username change and moves the user's pending activity
   * history to the registered account.
   *
   * @param currentUser The authorized user performing the change.
   * @param queryRunner An optional query runner for an existing transaction.
   * @param user The registered user with the previous username.
   * @returns The saved username-change activity.
   */
  @LogAsyncMethodExecution()
  async userNameUpdate({
    currentUser,
    queryRunner,
    user,
  }: {
    currentUser: IUserJWT;
    queryRunner?: Nullable<QueryRunner>;
    user: User;
  }): Promise<UserManagementActivity> {
    let userManagementActivity = new UserManagementActivity();
    let localQueryRunner = true;
    ({ localQueryRunner, queryRunner } = await getQueryRunner({
      queryRunner,
      dataSource: this.dataSource,
    }));
    try {
      userManagementActivity.userManagementActivityDateTime = new Date();
      userManagementActivity.userManagementActivityType =
        UserManagementActivityType.USERNAME_UPDATED;
      userManagementActivity.comment = `${user?.userName} IDIR changed to ${currentUser.userName}`;
      userManagementActivity.updatedByStaffUser = new User();
      userManagementActivity.updatedByStaffUser.userGUID = currentUser.userGUID;
      userManagementActivity.user = new User();
      userManagementActivity.user.userGUID = user?.userGUID;
      setBaseEntityProperties({
        entity: userManagementActivity,
        currentUser,
      });
      userManagementActivity =
        await queryRunner.manager.save<UserManagementActivity>(
          userManagementActivity,
        );

      await queryRunner.manager.update(
        UserManagementActivity,
        { pendingStaffUser: { userName: user?.userName } },
        {
          user: { userGUID: user.userGUID },
          pendingStaffUser: null,
          updatedUser: currentUser.userName,
          updatedDateTime: new Date(),
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        },
      );

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
    return userManagementActivity;
  }

  /**
   * Records the addition of a pending IDIR user.
   *
   * @param currentUser The authorized user who added the pending user.
   * @param queryRunner An optional query runner for an existing transaction.
   * @param user The pending IDIR user that was added.
   * @returns The saved user-added activity.
   */
  @LogAsyncMethodExecution()
  async pendingUserAdded({
    currentUser,
    queryRunner,
    user,
  }: {
    currentUser: IUserJWT;
    queryRunner?: Nullable<QueryRunner>;
    user: PendingIdirUser;
  }): Promise<UserManagementActivity> {
    let userManagementActivity = new UserManagementActivity();
    let localQueryRunner = true;
    ({ localQueryRunner, queryRunner } = await getQueryRunner({
      queryRunner,
      dataSource: this.dataSource,
    }));
    try {
      userManagementActivity.userManagementActivityDateTime = new Date();
      userManagementActivity.userManagementActivityType =
        UserManagementActivityType.USER_ADDED;
      userManagementActivity.comment = `${user?.userName} added to onRouteBC`;
      userManagementActivity.updatedByStaffUser = new User();
      userManagementActivity.updatedByStaffUser.userGUID = currentUser.userGUID;
      userManagementActivity.pendingStaffUser = user;
      setBaseEntityProperties({
        entity: userManagementActivity,
        currentUser,
      });
      userManagementActivity =
        await queryRunner.manager.save<UserManagementActivity>(
          userManagementActivity,
        );

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
    return userManagementActivity;
  }

  /**
   * Records the removal of a pending IDIR user.
   *
   * @param currentUser The authorized user who removed the pending user.
   * @param queryRunner An optional query runner for an existing transaction.
   * @param user The pending IDIR user that was removed.
   * @returns The saved user-removed activity.
   */
  @LogAsyncMethodExecution()
  async pendingUserRemoved({
    currentUser,
    queryRunner,
    user,
  }: {
    currentUser: IUserJWT;
    queryRunner?: Nullable<QueryRunner>;
    user: PendingIdirUser;
  }): Promise<UserManagementActivity> {
    let userManagementActivity = new UserManagementActivity();
    let localQueryRunner = true;
    ({ localQueryRunner, queryRunner } = await getQueryRunner({
      queryRunner,
      dataSource: this.dataSource,
    }));
    try {
      userManagementActivity.userManagementActivityDateTime = new Date();
      userManagementActivity.userManagementActivityType =
        UserManagementActivityType.USER_REMOVED;
      userManagementActivity.comment = `${user?.userName} removed from onRouteBC`;
      userManagementActivity.updatedByStaffUser = new User();
      userManagementActivity.updatedByStaffUser.userGUID = currentUser.userGUID;
      userManagementActivity.pendingStaffUser = user;
      setBaseEntityProperties({
        entity: userManagementActivity,
        currentUser,
      });
      userManagementActivity =
        await queryRunner.manager.save<UserManagementActivity>(
          userManagementActivity,
        );

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
    return userManagementActivity;
  }

  /**
   * Retrieves activity history for a registered user or pending IDIR user.
   * When both filters are supplied, the user GUID takes precedence.
   *
   * @param userGUID The GUID of a registered user.
   * @param userName The username of a pending IDIR user.
   * @returns The matching activity history, mapped to response DTOs.
   */
  @LogAsyncMethodExecution()
  async fetchUserManagementActivity({
    userGUID,
    userName,
  }: {
    userGUID?: string;
    userName?: string;
  }): Promise<ReadUserManagementActivityDto[]> {
    const userManagementActivityQB = this.userManagementActivityRepository
      .createQueryBuilder('userManagementActivity')
      .leftJoinAndSelect('userManagementActivity.user', 'user')
      .leftJoinAndSelect(
        'userManagementActivity.pendingStaffUser',
        'pendingStaffUser',
      )
      .leftJoinAndSelect(
        'userManagementActivity.updatedByStaffUser',
        'updatedByStaffUser',
      );

    if (userGUID) {
      userManagementActivityQB.where('user.userGUID = :userGUID', {
        userGUID: userGUID,
      });
    } else if (userName) {
      userManagementActivityQB.where('pendingStaffUser.userName = :userName', {
        userName: userName,
      });
    }

    const userManagementActivityList = await userManagementActivityQB.getMany();
    const readUserManagementActivityDto = await this.classMapper.mapArrayAsync(
      userManagementActivityList,
      UserManagementActivity,
      ReadUserManagementActivityDto,
    );
    return readUserManagementActivityDto;
  }
}
