import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { ReadUserDto } from './dto/response/read-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Contact } from '../../common/entities/contact.entity';
import { ReadContactDto } from '../../common/dto/response/read-contact.dto';
import { Company } from '../company/entities/company.entity';
import { CompanyUser } from './entities/company-user.entity';
import { UserStatus } from '../../../common/enum/user-status.enum';
import { UserAuthGroup } from '../../../common/enum/user-auth-group.enum';
import { UserDirectory } from '../../../common/enum/directory.enum';
import { PendingUser } from '../pending-users/entities/pending-user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
  ) {}

  /**
   * The create() method creates a new user entity with the
   * {@link CreateUserDto} object, companyGUID, userName, and
   * {@link UserDirectory} parameters. It also deletes the corresponding
   * PendingUser entity and commits the transaction if successful. If an error
   * is thrown, it rolls back the transaction and returns the error.
   *
   * @param createUserDto Request object of type {@link CreateUserDto} for
   * creating a new user.
   * @param companyGUID The company GUID.
   * @param userName User name from the access token.
   * @param userDirectory User Directory from the access token.
   *
   * @returns The user details as a promise of type {@link ReadUserDto}
   */
  async create(
    createUserDto: CreateUserDto,
    companyGUID: string,
    userName: string,
    userDirectory: UserDirectory,
  ): Promise<ReadUserDto> {
    let newUser: ReadUserDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      newUser = await this.createUser(
        companyGUID,
        createUserDto,
        userName,
        userDirectory,
        createUserDto.userAuthGroup,
        queryRunner,
      );

      await queryRunner.manager.delete(PendingUser, {
        companyGUID: companyGUID,
        userName: userName,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return newUser;
  }

  /**
   * The createUser() method creates a new user with createUserDto, companyGUID,
   * userName, userDirectory, and userAuthGroup parameters, creates a
   * CompanyUser entity, associates it with the new user, and returns a
   * ReadUserDto object.
   *
   * @param companyGUID The company GUID.
   * @param createUserDto Request object of type {@link CreateUserDto} for
   * creating a new user.
   * @param userName User name from the access token.
   * @param userDirectory User directory from the access token.
   * @param userAuthGroup User auth group from the access token.
   * @param queryRunner Query runner passed from calling function.
   *
   * @returns The user details as a promise of type {@link ReadUserDto}
   */
  async createUser(
    companyGUID: string,
    createUserDto: CreateUserDto,
    userName: string,
    userDirectory: UserDirectory,
    userAuthGroup: UserAuthGroup,
    queryRunner: QueryRunner,
  ): Promise<ReadUserDto> {
    let user = this.classMapper.map(createUserDto, CreateUserDto, User, {
      extraArgs: () => ({ userName: userName, userDirectory: userDirectory }),
    });

    const newCompanyUser = this.createCompanyUserUtil(
      companyGUID,
      user,
      userAuthGroup,
    );
    user.companyUsers = [newCompanyUser];

    user = await queryRunner.manager.save(user);

    const readUserDto = await this.mapUserEntitytoReadUserDto(user);
    return readUserDto;
  }

  /**
   * The mapUserEntitytoReadUserDto() helper method maps a User entity to a
   * ReadUserDto object and returns it.
   *
   * @param user The {@link User} entity.
   *
   * @returns The mapped {@link ReadUserDto} Dto.
   */
  private async mapUserEntitytoReadUserDto(user: User) {
    const readUserDto = await this.classMapper.mapAsync(
      user,
      User,
      ReadUserDto,
    );

    const readContactDto = await this.classMapper.mapAsync(
      user.userContact,
      Contact,
      ReadContactDto,
    );
    Object.assign(readUserDto, readContactDto);
    return readUserDto;
  }

  /**
   * The createCompanyUserUtil() is a helper method creates a
   * {@link CompanyUser} entity with the companyGUID, newUser, and userAuthGroup
   * parameters and returns it.
   *
   * @param companyGUID The company GUID.
   * @param newUser The new user entity to be associated with the company.
   * @param userAuthGroup User auth group.
   *
   * @returns The {@link CompanyUser}.
   */
  private createCompanyUserUtil(
    companyGUID: string,
    newUser: User,
    userAuthGroup: UserAuthGroup,
  ): CompanyUser {
    const newCompanyUser = new CompanyUser();
    newCompanyUser.company = new Company();
    newCompanyUser.company.companyGUID = companyGUID;
    newCompanyUser.user = newUser;
    newCompanyUser.userAuthGroup = userAuthGroup;
    return newCompanyUser;
  }

  /**
   * The findOne() method finds and returns a {@link ReadUserDto} object for a
   * user with a specific userGUID and companyGUID parameters.
   *
   * @param companyGUID The company GUID.
   * @param userGUID The user GUID.
   *
   * @returns The user details as a promise of type {@link ReadUserDto}
   */
  async findOne(companyGUID: string, userGUID: string): Promise<ReadUserDto> {
    const user = await this.findOneUserEntity(companyGUID, userGUID);
    const readUserDto = await this.mapUserEntitytoReadUserDto(user);
    return readUserDto;
  }

  /**
   * The findOneUserEntity() helper method finds and returns a User entity for a
   * user with a specific userGUID and companyGUID parameters.
   *
   * @param companyGUID The company GUID.
   * @param userGUID The user GUID.
   *
   * @returns The {@link User} entity.
   */
  private async findOneUserEntity(companyGUID: string, userGUID: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userContact', 'userContact')
      .innerJoinAndSelect('userContact.province', 'province')
      .innerJoinAndSelect('user.companyUsers', 'companyUser')
      .innerJoin('companyUser.company', 'company')
      .where('user.userGUID = :userGUID', { userGUID: userGUID })
      .andWhere('company.companyGUID= :companyGUID', {
        companyGUID: companyGUID,
      })
      .getOne();
  }

  /**
   * The findAll() method finds and returns an array of ReadUserDto objects for
   * all users with a specific companyGUID.
   *
   * @param companyGUID The company GUID.
   *
   * @returns The list of users as an array of type {@link ReadUserDto}
   */
  async findAll(companyGUID: string): Promise<ReadUserDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userContact', 'userContact')
      .innerJoinAndSelect('userContact.province', 'province')
      .innerJoinAndSelect('user.companyUsers', 'companyUser')
      .innerJoin('companyUser.company', 'company')
      .andWhere('company.companyGUID= :companyGUID', {
        companyGUID: companyGUID,
      })
      .getMany();

    const userList: ReadUserDto[] = [];

    for (const user of users) {
      const readUserDto = this.mapUserEntitytoReadUserDto(user);
      userList.push(await readUserDto);
    }
    return userList;
  }

  /**
   * The update() method updates a user with the {@link updateUserDto} object,
   * companyGUID, userGUID, userName, and {@link UserDirectory} parameters, and returns
   * the updated user as a ReadUserDto object. If the user is not found, it
   * throws an error.
   *
   * @param companyGUID The company GUID.
   * @param userGUID The user GUID.
   * @param userName User name from the access token.
   * @param userDirectory User directory from the access token.
   * @param updateUserDto Request object of type {@link UpdateUserDto} for
   * updating a user.
   *
   * @returns The updated user details as a promise of type {@link ReadUserDto}.
   */
  async update(
    companyGUID: string,
    userGUID: string,
    userName: string,
    userDirectory: UserDirectory,
    updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const userDetails = await this.findOneUserEntity(companyGUID, userGUID);

    const user = this.classMapper.map(updateUserDto, UpdateUserDto, User, {
      extraArgs: () => ({
        companyGUID: companyGUID,
        userGUID: userGUID,
        userName: userName,
        userDirectory: userDirectory,
      }),
    });
    user.userContact.contactId = userDetails.userContact.contactId;
    await this.userRepository.update({ userGUID }, user);
    return this.findOne(companyGUID, userGUID);
  }

  /**
   * The updateStatus() method updates the statusCode of the user with
   * companyGUID, userGUID and {@link UserStatus} parameters.
   *
   * @param companyGUID The company GUID.
   * @param userGUID The user GUID.
   * @param statusCode The User status code of type {@link UserStatus}
   *
   * @returns The UpdateResult of the operation
   */
  async updateStatus(
    companyGUID: string,
    userGUID: string,
    statusCode: UserStatus,
  ): Promise<UpdateResult> {
    const user = new User();
    user.userGUID = userGUID;
    user.statusCode = statusCode;
    return await this.userRepository.update({ userGUID }, user);
  }
}
