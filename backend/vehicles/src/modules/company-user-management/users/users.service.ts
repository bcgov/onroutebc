import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ReadUserOrbcStatusDto } from './dto/response/read-user-orbc-status.dto';
import { PendingUsersService } from '../pending-users/pending-users.service';
import { CompanyService } from '../company/company.service';
import { ReadCompanyMetadataDto } from '../company/dto/response/read-company-metadata.dto';
import { Role } from '../../../common/enum/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CompanyUser)
    private companyUserRepository: Repository<CompanyUser>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
    private readonly pendingUsersService: PendingUsersService,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
  ) {}

  /**
   * The create() method creates a new user entity with the
   * {@link CreateUserDto} object, companyId, userName, and
   * {@link UserDirectory} parameters. It also deletes the corresponding
   * PendingUser entity and commits the transaction if successful. If an error
   * is thrown, it rolls back the transaction and returns the error.
   * TODO verify the role with PENDING_USER and throw exception on mismatch
   *
   * @param createUserDto Request object of type {@link CreateUserDto} for
   * creating a new user.
   * @param companyId The company Id.
   * @param userName User name from the access token.
   * @param userDirectory User Directory from the access token.
   *
   * @returns The user details as a promise of type {@link ReadUserDto}
   */
  async create(
    createUserDto: CreateUserDto,
    companyId: number,
    userName: string,
    userDirectory: UserDirectory,
  ): Promise<ReadUserDto> {
    let newUser: ReadUserDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      newUser = await this.createUser(
        companyId,
        createUserDto,
        userName,
        userDirectory,
        createUserDto.userAuthGroup,
        queryRunner,
      );

      await queryRunner.manager.delete(PendingUser, {
        companyId: companyId,
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
   * The createUser() method creates a new user with createUserDto, companyId,
   * userName, userDirectory, and userAuthGroup parameters, creates a
   * CompanyUser entity, associates it with the new user, and returns a
   * ReadUserDto object.
   *
   * @param companyId The company Id.
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
    companyId: number,
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
      companyId,
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
   * {@link CompanyUser} entity with the companyId, newUser, and userAuthGroup
   * parameters and returns it.
   *
   * @param companyId The company Id.
   * @param newUser The new user entity to be associated with the company.
   * @param userAuthGroup User auth group.
   *
   * @returns The {@link CompanyUser}.
   */
  private createCompanyUserUtil(
    companyId: number,
    newUser: User,
    userAuthGroup: UserAuthGroup,
  ): CompanyUser {
    const newCompanyUser = new CompanyUser();
    newCompanyUser.company = new Company();
    newCompanyUser.company.companyId = companyId;
    newCompanyUser.user = newUser;
    newCompanyUser.userAuthGroup = userAuthGroup;
    return newCompanyUser;
  }

  /**
   * The findUserbyUserGUID() method finds and returns a {@link ReadUserDto} object for a
   * user with a specific userGUID parameters.
   *
   * @param userGUID The user GUID.
   *
   * @returns The user details as a promise of type {@link ReadUserDto}
   */
  async findUserbyUserGUID(userGUID: string): Promise<ReadUserDto> {
    const user = await this.findUserEntitybyUserGUID(userGUID);
    const readUserDto = await this.mapUserEntitytoReadUserDto(user);
    return readUserDto;
  }

  /**
   * The findUserbyUserGUIDandCompanyId() method finds and returns a {@link ReadUserDto} object for a
   * user with a specific userGUID and companyId parameters.
   *
   * @param userGUID The user GUID.
   * @param companyId The company Id.
   *
   * @returns The user details as a promise of type {@link ReadUserDto}
   */
  async findUserbyUserGUIDandCompanyId(
    userGUID: string,
    companyId: number,
  ): Promise<ReadUserDto> {
    const user = await this.findUserEntitybyUserGUIDandCompanyId(
      userGUID,
      companyId,
    );

    if (user) {
      const readUserDto = await this.mapUserEntitytoReadUserDto(user);
      return readUserDto;
    }
  }

  /**
   * The findUserEntitybyUserGUIDandCompanyId() helper method finds and returns a User entity for a
   * user with a specific userGUID parameters.
   *
   * @param userGUID The user GUID.
   * @param companyId The company Id.
   *
   * @returns The {@link User} entity.
   */
  private async findUserEntitybyUserGUIDandCompanyId(
    userGUID: string,
    companyId: number,
  ) {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userContact', 'userContact')
      .innerJoinAndSelect('userContact.province', 'province')
      .innerJoinAndSelect('user.companyUsers', 'companyUser')
      .innerJoin('companyUser.company', 'company')
      .where('user.userGUID = :userGUID', { userGUID: userGUID })
      .andWhere('company.companyId= :companyId', {
        companyId: companyId,
      })
      .getOne();
  }

  /**
   * The findUserEntitybyUserGUID() helper method finds and returns a User entity for a
   * user with a specific userGUID parameters.
   *
   * @param userGUID The user GUID.
   *
   * @returns The {@link User} entity.
   */
  private async findUserEntitybyUserGUID(userGUID: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userContact', 'userContact')
      .innerJoinAndSelect('userContact.province', 'province')
      .where('user.userGUID = :userGUID', { userGUID: userGUID })
      .getOne();
  }

  /**
   * The findAll() method finds and returns an array of ReadUserDto objects for
   * all users with a specific companyId.
   *
   * @param companyId The company Id.
   *
   * @returns The list of users as an array of type {@link ReadUserDto}
   */
  async findAllUsers(companyId: number): Promise<ReadUserDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userContact', 'userContact')
      .innerJoinAndSelect('userContact.province', 'province')
      .innerJoinAndSelect('user.companyUsers', 'companyUser')
      .innerJoin('companyUser.company', 'company')
      .andWhere('company.companyId= :companyId', {
        companyId: companyId,
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
   * userGUID, userName, and {@link UserDirectory} parameters, and returns
   * the updated user as a ReadUserDto object. If the user is not found, it
   * throws an error.
   *
   * @param userGUID The user GUID.
   * @param userName User name from the access token.
   * @param userDirectory User directory from the access token.
   * @param updateUserDto Request object of type {@link UpdateUserDto} for
   * updating a user.
   *
   * @returns The updated user details as a promise of type {@link ReadUserDto}.
   */
  async update(
    userGUID: string,
    userName: string,
    userDirectory: UserDirectory,
    updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const userDetails = await this.findUserEntitybyUserGUID(userGUID);

    if (!userDetails) {
      throw new DataNotFoundException();
    }

    const user = this.classMapper.map(updateUserDto, UpdateUserDto, User, {
      extraArgs: () => ({
        userGUID: userGUID,
        userName: userName,
        userDirectory: userDirectory,
      }),
    });
    user.userContact.contactId = userDetails.userContact.contactId;
    await this.userRepository.save(user);
    return this.findUserbyUserGUID(user.userGUID);
  }

  /**
   * The updateStatus() method updates the statusCode of the user with
   * companyId, userGUID and {@link UserStatus} parameters.
   *
   * @param companyId The company Id.
   * @param userGUID The user GUID.
   * @param statusCode The User status code of type {@link UserStatus}
   *
   * @returns The UpdateResult of the operation
   */
  async updateStatus(
    companyId: number,
    userGUID: string,
    statusCode: UserStatus,
  ): Promise<UpdateResult> {
    const user = new User();
    user.userGUID = userGUID;
    user.statusCode = statusCode;
    return await this.userRepository.update({ userGUID }, user);
  }

  /**
   * The findAllCompanyUsersByUserGuid() helper method finds and returns an
   * array of CompanyUser objects for a specific userGUID.
   *
   * @param userGUID The user GUID.
   *
   * @returns The list of users as an array of type {@link ReadUserDto}
   */
  async findAllCompanyUsersByUserGuid(
    userGUID: string,
  ): Promise<CompanyUser[]> {
    const companyUsers = await this.companyUserRepository
      .createQueryBuilder('companyUser')
      .leftJoinAndSelect('companyUser.company', 'company')
      .leftJoinAndSelect('company.companyAddress', 'companyAddress')
      .innerJoinAndSelect('companyAddress.province', 'companyAddressProvince')
      .leftJoinAndSelect('company.mailingAddress', 'mailingAddress')
      .innerJoinAndSelect('mailingAddress.province', 'mailingAddressProvince')
      .leftJoinAndSelect('companyUser.user', 'user')
      .where('user.userGUID= :userGUID', {
        userGUID: userGUID,
      })
      .getMany();

    return companyUsers;
  }

  /**
   * The findORBCUser() method searches ORBC if the user exists by its GUID and
   * returns a DTO with user details and its associated companies.
   *
   * @param userGUID The user GUID.
   * @param userName The user Name.
   * @param companyGUID The company GUID.
   *
   * @returns The {@link ReadUserOrbcStatusDto} entity.
   */
  async findORBCUser(
    userGUID: string,
    userName: string,
    companyGUID: string,
  ): Promise<ReadUserOrbcStatusDto> {
    const userExistsDto = new ReadUserOrbcStatusDto();
    userExistsDto.associatedCompanies = [];
    userExistsDto.pendingCompanies = [];

    const user = await this.userRepository.findOne({
      where: { userGUID: userGUID },
      relations: {
        userContact: true,
        companyUsers: true,
      },
    });

    const pendingCompanies = await this.pendingUsersService.findAllbyUserName(
      userName,
    );
    if (pendingCompanies) {
      for (const pendingCompany of pendingCompanies) {
        userExistsDto.pendingCompanies.push(
          await this.companyService.findCompanyMetadata(
            pendingCompany.companyId,
          ),
        );
      }
    }

    if (!user) {
      if (companyGUID) {
        const company = await this.companyService.findOneByCompanyGuid(
          companyGUID,
        );
        if (company) {
          userExistsDto.associatedCompanies.push(company);
          return userExistsDto;
        }
      }
    } else {
      const companyUsers = await this.findAllCompanyUsersByUserGuid(userGUID);
      const readCompanyMetadataDto: ReadCompanyMetadataDto[] = [];
      for (const companyUser of companyUsers) {
        readCompanyMetadataDto.push(
          await this.classMapper.mapAsync(
            companyUser.company,
            Company,
            ReadCompanyMetadataDto,
          ),
        );
      }
      userExistsDto.user = await this.mapUserEntitytoReadUserDto(user);
      userExistsDto.associatedCompanies = readCompanyMetadataDto;
    }

    return userExistsDto;
  }

  /**
   * The getRolesForUser() method finds and returns a {@link Role} object
   * for a user with a specific userGUID and companyId parameters. CompanyId is
   * optional and defaults to 0
   *
   * @param userGUID The user GUID.
   * @param companyId The company Id. Optional - Defaults to 0
   *
   * @returns The Roles as a promise of type {@link Role}
   */
  async getRolesForUser(userGUID: string, companyId = 0): Promise<Role[]> {
    const queryResult = (await this.userRepository.query(
      'SELECT ROLE_ID FROM access.ORBC_GET_ROLES_FOR_USER_FN(@0,@1)',
      [userGUID, companyId],
    )) as [{ ROLE_ID: Role }];

    const roles = queryResult.map((r) => r.ROLE_ID);

    return roles;
  }
}
