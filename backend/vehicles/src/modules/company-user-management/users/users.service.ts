import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { ReadUserDto } from './dto/response/read-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Company } from '../company/entities/company.entity';
import { CompanyUser } from './entities/company-user.entity';
import { UserStatus } from '../../../common/enum/user-status.enum';
import { Directory } from '../../../common/enum/directory.enum';
import { PendingUser } from '../pending-users/entities/pending-user.entity';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ReadUserOrbcStatusDto } from './dto/response/read-user-orbc-status.dto';
import { PendingUsersService } from '../pending-users/pending-users.service';
import { CompanyService } from '../company/company.service';
import { Role } from '../../../common/enum/roles.enum';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
    private readonly pendingUsersService: PendingUsersService,
    private readonly companyService: CompanyService,
  ) {}

  /**
   * The create() method creates a new user entity with the
   * {@link CreateUserDto} object, companyId, userName, and
   * {@link Directory} parameters. It also deletes the corresponding
   * PendingUser entity and commits the transaction if successful. If an error
   * is thrown, it rolls back the transaction and returns the error.
   * TODO verify the role with PENDING_USER and throw exception on mismatch
   *
   * @param createUserDto Request object of type {@link CreateUserDto} for
   * creating a new user.
   * @param companyId The company Id.
   * @param Directory Directory dervied from the access token.
   * @param currentUser The current user details from the token.
   *
   * @returns The user details as a promise of type {@link ReadUserDto}
   */
  async create(
    createUserDto: CreateUserDto,
    companyId: number,
    directory: Directory,
    currentUser: IUserJWT,
  ): Promise<ReadUserDto> {
    let newUser: ReadUserDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let user = this.classMapper.map(createUserDto, CreateUserDto, User, {
        extraArgs: () => ({
          userName: currentUser.userName,
          directory: directory,
          userGUID: currentUser.userGUID,
        }),
      });

      const newCompanyUser = new CompanyUser();
      newCompanyUser.company = new Company();
      newCompanyUser.company.companyId = companyId;
      newCompanyUser.user = user;
      newCompanyUser.userAuthGroup = createUserDto.userAuthGroup;

      user.companyUsers = [newCompanyUser];
      user = await queryRunner.manager.save(user);

      newUser = await this.classMapper.mapAsync(user, User, ReadUserDto);

      await queryRunner.manager.delete(PendingUser, {
        companyId: companyId,
        userName: currentUser.userName,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(); // TODO: Handle the typeorm Error handling
    } finally {
      await queryRunner.release();
    }
    return newUser;
  }

  /**
   * The update() method updates a user with the {@link updateUserDto} object
   * and userGUID parameters, and returns the updated user as a ReadUserDto
   * object. If the user is not found, it throws an error.
   *
   * @param userGUID The user GUID.
   * @param updateUserDto Request object of type {@link UpdateUserDto} for
   * updating a user.
   *
   * @returns The updated user details as a promise of type {@link ReadUserDto}.
   */
  async update(
    userGUID: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const userDetails = await this.findUsersEntity(userGUID);

    if (!userDetails?.length) {
      throw new DataNotFoundException();
    }

    const user = this.classMapper.map(updateUserDto, UpdateUserDto, User, {
      extraArgs: () => ({
        userGUID: userGUID,
      }),
    });
    user.userContact.contactId = userDetails[0]?.userContact?.contactId;
    await this.userRepository.save(user);
    const userListDto = await this.findUsersDto(user.userGUID);
    return userListDto[0];
  }

  /**
   * The updateStatus() method updates the statusCode of the user with
   * userGUID and {@link UserStatus} parameters.
   *
   * @param companyId The company Id.
   * @param userGUID The user GUID.
   * @param statusCode The User status code of type {@link UserStatus}
   *
   * @returns The UpdateResult of the operation
   */
  async updateStatus(
    userGUID: string,
    statusCode: UserStatus,
  ): Promise<UpdateResult> {
    const user = new User();
    user.userGUID = userGUID;
    user.statusCode = statusCode;
    return await this.userRepository.update({ userGUID }, user);
  }

  /**
   * Finds user entities based on optional filtering criteria of userGUID and
   * companyId. Retrieves associated data for userContact, province, companyUser,
   * and company.
   *
   * @param userGUID (Optional) The user GUID for filtering.
   * @param companyId (Optional) The company ID for filtering.
   *
   * @returns A Promise that resolves to an array of {@link User} entities.
   */
  private async findUsersEntity(userGUID?: string, companyId?: number[]) {
    // Construct the query builder to retrieve user entities and associated data
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userContact', 'userContact')
      .innerJoinAndSelect('userContact.province', 'province')
      .leftJoinAndSelect('user.companyUsers', 'companyUser')
      .leftJoinAndSelect('companyUser.company', 'company')
      /* Conditional WHERE clause for userGUID. If userGUID is provided, the
       WHERE clause is user.userGUID = :userGUID; otherwise, it is 1=1 to
       include all users.*/
      .where(userGUID ? 'user.userGUID = :userGUID' : '1=1', {
        userGUID: userGUID,
      })
      /* Conditional WHERE clause for companyId. If companyId is provided, the
        WHERE clause is company.companyId IN (:...companyId); otherwise, it is 1=1 to
        include all companies.*/
      .andWhere(
        companyId?.length ? 'company.companyId IN (:...companyId)' : '1=1',
        {
          companyId: companyId || [],
        },
      )
      .getMany();
  }

  /**
   * Finds and returns an array of ReadUserDto objects for all users with a
   * specific companyId or UserGUID.
   *
   * @param userGUID (Optional) The user GUID for filtering.
   * @param companyId (Optional) The company ID for filtering.
   *
   * @returns A Promise that resolves to an array of {@link ReadUserDto} objects.
   */
  async findUsersDto(
    userGUID?: string,
    companyId?: number[],
  ): Promise<ReadUserDto[]> {
    // Find user entities based on the provided filtering criteria
    const userDetails = await this.findUsersEntity(userGUID, companyId);

    // Map the retrieved user entities to ReadUserDto objects
    const readUserDto = await this.classMapper.mapArrayAsync(
      userDetails,
      User,
      ReadUserDto,
    );

    // Return the array of ReadUserDto objects
    return readUserDto;
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

    const pendingCompanies = await this.pendingUsersService.findPendingUsersDto(
      userName,
    );

    if (pendingCompanies?.length) {
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
      const readCompanyMetadataDto =
        await this.companyService.findCompanyMetadataByUserGuid(userGUID);
      userExistsDto.user = await this.classMapper.mapAsync(
        user,
        User,
        ReadUserDto,
      );
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

  /**
   * The getCompaniesForUser() method finds and returns a {@link number[]} object
   * for a user with a specific userGUID.
   *
   * @param userGUID The user GUID.
   *
   * @returns The associated companies as a promise of type {@link number[]}
   */
  async getCompaniesForUser(userGuid: string): Promise<number[]> {
    const companies = (
      await this.companyService.findCompanyMetadataByUserGuid(userGuid)
    ).map((r) => +r.companyId);
    return companies;
  }
}
