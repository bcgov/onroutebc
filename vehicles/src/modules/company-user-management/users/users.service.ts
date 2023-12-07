import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { ReadUserDto } from './dto/response/read-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Company } from '../company/entities/company.entity';
import { CompanyUser } from './entities/company-user.entity';
import { UserStatus } from '../../../common/enum/user-status.enum';
import { PendingUser } from '../pending-users/entities/pending-user.entity';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ReadUserOrbcStatusDto } from './dto/response/read-user-orbc-status.dto';
import { PendingUsersService } from '../pending-users/pending-users.service';
import { CompanyService } from '../company/company.service';
import { Role } from '../../../common/enum/roles.enum';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { UserAuthGroup } from 'src/common/enum/user-auth-group.enum';
import { PendingIdirUser } from '../pending-idir-users/entities/pending-idir-user.entity';
import { IdirUser } from './entities/idir.user.entity';
import { PendingIdirUsersService } from '../pending-idir-users/pending-idir-users.service';
import { ReadPendingUserDto } from '../pending-users/dto/response/read-pending-user.dto';
import { BadRequestExceptionDto } from '../../../common/exception/badRequestException.dto';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { IDP } from '../../../common/enum/idp.enum';
import { Contact } from '../../common/entities/contact.entity';
import { getProvinceId } from '../../../common/helper/province-country.helper';
import { Base } from '../../common/entities/base.entity';
import { AccountSource } from '../../../common/enum/account-source.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(IdirUser)
    private idirUserRepository: Repository<IdirUser>,
    @InjectRepository(PendingIdirUser)
    private pendingIdirUserRepository: Repository<PendingIdirUser>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
    private readonly pendingUsersService: PendingUsersService,
    private readonly pendingUsersIdirService: PendingIdirUsersService,
    private readonly companyService: CompanyService,
  ) {}

  /**
   * The create() method creates a new user entity with the
   * {@link CreateUserDto} object, companyId, and userName parameters. It also
   * deletes the corresponding PendingUser entity and commits the transaction if
   * successful. If an error is thrown, it rolls back the transaction and
   * returns the error.
   * TODO verify the role with PENDING_USER and throw exception on mismatch
   *
   * @param createUserDto Request object of type {@link CreateUserDto} for
   * creating a new user.
   * @param companyId The company Id.
   * @param currentUser The current user details from the token.
   *
   * @returns The user details as a promise of type {@link ReadUserDto}
   */
  async create(
    createUserDto: CreateUserDto,
    companyId: number,
    currentUser: IUserJWT,
  ): Promise<ReadUserDto> {
    let newUser: ReadUserDto;
    //Comment Begin: Business BCeID validation.
    //In case of busines bceid, validate that the user's bceid matches the company bceid.
    //If matches then create user else throw error.
    if (currentUser.bceid_business_guid) {
      const company = await this.companyService.findOneByCompanyGuid(
        currentUser.bceid_business_guid,
      );
      const pendingUser = await this.pendingUsersService.findPendingUsersDto(
        currentUser.userName,
      );
      if (pendingUser.some((e) => e.companyId != company.companyId)) {
        throw new InternalServerErrorException(
          'User not invited for this company.',
        );
      }
    }
    //Comment End: Business BCeID validation end
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let user = this.classMapper.map(createUserDto, CreateUserDto, User, {
        extraArgs: () => ({
          userName: currentUser.userName,
          directory: currentUser.orbcUserDirectory,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
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
   * @param companyId The CompanyId.
   * @param currentUser The details of the current authorized user.
   * @returns The updated user details as a promise of type {@link ReadUserDto}.
   */
  async update(
    userGUID: string,
    updateUserDto: UpdateUserDto,
    companyId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentUser?: IUserJWT,
  ): Promise<ReadUserDto> {
    const userDetails = await this.findUsersEntity(userGUID, [companyId]);

    if (!userDetails?.length) {
      throw new DataNotFoundException();
    }

    //Searching with UserGuid will only return one result at max
    const companyUser = userDetails.at(0).companyUsers.at(0);
    //A CV user's auth group should not be allowed to be downgraded from CVADMIN
    //if they are the last remaining CVADMIN of the Company
    if (
      companyUser.userAuthGroup === UserAuthGroup.COMPANY_ADMINISTRATOR &&
      companyUser.userAuthGroup !== updateUserDto.userAuthGroup
    ) {
      //Find all employees of the company
      const employees = await this.findUsersEntity(undefined, [companyId]);

      //Verify if there are more than one CVAdmin
      const secondCVAdmin = employees.filter(
        (employee) =>
          employee.userGUID != userDetails.at(0).userGUID &&
          employee.companyUsers.at(0).userAuthGroup ===
            UserAuthGroup.COMPANY_ADMINISTRATOR,
      );

      //Throw BadRequestException if only one CVAdmin exists for the company.
      if (!secondCVAdmin?.length) {
        const badRequestExceptionDto = new BadRequestExceptionDto();
        badRequestExceptionDto.field = 'userAuthGroup';
        badRequestExceptionDto.message = [
          'This operation is not allowed as a company should have atlease one CVAdmin at any given moment.',
        ];
        const exceptionDto = new ExceptionDto(
          HttpStatus.BAD_REQUEST,
          'Bad Request',
          [badRequestExceptionDto],
        );
        throw new BadRequestException(exceptionDto);
      }
    }

    //Updates the entities
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const auditMetadata: Base = {
        createdDateTime: new Date(),
        createdUser: currentUser.userName,
        createdUserDirectory: currentUser.orbcUserDirectory,
        createdUserGuid: currentUser.userGUID,
        updatedDateTime: new Date(),
        updatedUser: currentUser.userName,
        updatedUserDirectory: currentUser.orbcUserDirectory,
        updatedUserGuid: currentUser.userGUID,
      };

      await queryRunner.manager.update(
        Contact,
        { contactId: userDetails[0]?.userContact?.contactId },
        {
          firstName: updateUserDto.firstName,
          lastName: updateUserDto.lastName,
          email: updateUserDto.email,
          phone1: updateUserDto.phone1,
          extension1: updateUserDto.phone1Extension,
          phone2: updateUserDto.phone2,
          extension2: updateUserDto.phone2Extension,
          fax: updateUserDto.fax,
          city: updateUserDto.city,
          province: {
            provinceId: getProvinceId(
              updateUserDto.countryCode,
              updateUserDto.provinceCode,
            ),
          },
          ...auditMetadata,
        },
      );

      // Should be allowed to update userAuthGroupID if current user is an
      // IDIR(PPC Clerk) or CVAdmin
      if (
        (companyUser.userAuthGroup === UserAuthGroup.COMPANY_ADMINISTRATOR ||
          currentUser.identity_provider === IDP.IDIR) &&
        companyUser.userAuthGroup !== updateUserDto.userAuthGroup
      ) {
        await queryRunner.manager.update(
          CompanyUser,
          { companyUserId: companyUser.companyUserId },
          { userAuthGroup: updateUserDto.userAuthGroup, ...auditMetadata },
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(); // TODO: Handle the typeorm Error handling
    } finally {
      await queryRunner.release();
    }

    const userListDto = await this.findUsersDto(userGUID);
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
    currentUser?: IUserJWT,
  ): Promise<UpdateResult> {
    const user = new User();
    user.userGUID = userGUID;
    user.statusCode = statusCode;
    user.updatedUserGuid = currentUser.userGUID;
    user.updatedDateTime = new Date();
    user.updatedUser = currentUser.userName;
    user.updatedUserDirectory = currentUser.orbcUserDirectory;
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
      .innerJoinAndSelect('province.country', 'country')
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
    pendingUser?: boolean,
  ): Promise<ReadUserDto[]> {
    // Find user entities based on the provided filtering criteria
    const userDetails = await this.findUsersEntity(userGUID, companyId);
    let pendingUsersList: ReadUserDto[] = [];
    if (pendingUser?.valueOf() && companyId?.length) {
      const pendingUser = await this.pendingUsersService.findPendingUsersDto(
        undefined,
        companyId?.at(0),
      );

      pendingUsersList = await this.classMapper.mapArrayAsync(
        pendingUser,
        ReadPendingUserDto,
        ReadUserDto,
      );
    }
    // Map the retrieved user entities to ReadUserDto objects

    const readUserDto = await this.classMapper.mapArrayAsync(
      userDetails,
      User,
      ReadUserDto,
    );
    return readUserDto.concat(pendingUsersList);
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
          if (
            company.accountSource === AccountSource.TpsAccount &&
            !company?.companyUsers?.length
          ) {
            userExistsDto.migratedTPSClient =
              await this.companyService.mapCompanyEntityToCompanyDto(company);
          } else {
            const companyMetadata =
              await this.companyService.mapCompanyEntityToCompanyMetadataDto(
                company,
              );
            userExistsDto.associatedCompanies.push(companyMetadata);
          }
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
      'SELECT ROLE_TYPE FROM access.ORBC_GET_ROLES_FOR_USER_FN(@0,@1)',
      [userGUID, companyId],
    )) as [{ ROLE_TYPE: Role }];

    const roles = queryResult.map((r) => r.ROLE_TYPE);

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

  async checkIdirUser(currentUser: IUserJWT): Promise<ReadUserOrbcStatusDto> {
    let userExists: ReadUserOrbcStatusDto = null;
    const idirUser = await this.findOneIdirUser(currentUser.idir_user_guid);
    if (!idirUser) {
      /**
       * IF IDIR use is not found in DB then check pending user table to see if the user has been invited
       */
      const pendingIdirUser =
        await this.pendingUsersIdirService.findPendingIdirUser(
          currentUser.userName,
        );
      /**
       * IF user found in pending idir user table that means user has been invited
       * in this case create user in the database followed by a deletion from pending user table.
       * ELSE it implies that user has been been invited and raise unauthorized exception.
       */
      if (pendingIdirUser) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const user: IdirUser = this.mapIdirUser(
            currentUser,
            pendingIdirUser.userAuthGroup,
          );
          await queryRunner.manager.save(user);
          await queryRunner.manager.delete(PendingIdirUser, {
            userName: currentUser.idir_username,
          });
          await queryRunner.commitTransaction();
          userExists = await this.classMapper.mapAsync(
            user,
            IdirUser,
            ReadUserOrbcStatusDto,
          );
        } catch (err) {
          await queryRunner.rollbackTransaction();
          throw new InternalServerErrorException(); // TODO: Handle the typeorm Error handling
        } finally {
          await queryRunner.release();
        }
      }
    } else {
      userExists = await this.classMapper.mapAsync(
        idirUser,
        IdirUser,
        ReadUserOrbcStatusDto,
      );
    }
    return userExists;
  }

  private mapIdirUser(
    currentUser: IUserJWT,
    userAuthGroup: UserAuthGroup,
  ): IdirUser {
    const user: IdirUser = new IdirUser();
    user.firstName = currentUser.given_name;
    user.lastName = currentUser.family_name;
    user.email = currentUser.email;
    user.statusCode = UserStatus.ACTIVE;
    user.userAuthGroup = userAuthGroup;
    user.userGUID = currentUser.idir_user_guid;
    user.userName = currentUser.idir_username;
    return user;
  }

  async findIdirUser(userGUID?: string): Promise<ReadUserDto> {
    // Find user entities based on the provided filtering criteria
    const userDetails = await this.idirUserRepository.findOne({
      where: { userGUID: userGUID },
    });
    // Map the retrieved user entities to ReadUserDto objects
    const readUserDto: ReadUserDto = await this.classMapper.mapAsync(
      userDetails,
      IdirUser,
      ReadUserDto,
    );
    return readUserDto;
  }

  async findOneIdirUser(userGUID?: string): Promise<IdirUser> {
    // Find user entities based on the provided filtering criteria
    const userDetails = await this.idirUserRepository.findOne({
      where: { userGUID: userGUID },
    });

    return userDetails;
  }

  async findPermitIssuerPPCUser(): Promise<ReadUserDto[]> {
    const subQueryBuilder = this.idirUserRepository
      .createQueryBuilder()
      .select('ISSUER_USER_GUID')
      .from('permit.ORBC_PERMIT_ISSUED_PPC_USER_VW', 'vw');

    // Find user entities based on the provided filtering criteria
    const userDetails = await this.idirUserRepository
      .createQueryBuilder('idirUser')
      .where('idirUser.userGUID IN (' + subQueryBuilder.getQuery() + ' )')
      .getMany();

    // Map the retrieved user entities to ReadUserDto objects
    const readUserDto: ReadUserDto[] = await this.classMapper.mapArrayAsync(
      userDetails,
      IdirUser,
      ReadUserDto,
    );
    return readUserDto;
  }
}
