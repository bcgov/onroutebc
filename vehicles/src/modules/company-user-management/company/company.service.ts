import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserAuthGroup } from '../../../common/enum/user-auth-group.enum';
import { ReadUserDto } from '../users/dto/response/read-user.dto';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { ReadCompanyUserDto } from './dto/response/read-company-user.dto';
import { ReadCompanyDto } from './dto/response/read-company.dto';
import { Company } from './entities/company.entity';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ReadCompanyMetadataDto } from './dto/response/read-company-metadata.dto';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { User } from '../users/entities/user.entity';
import { CompanyUser } from '../users/entities/company-user.entity';
import { callDatabaseSequence } from 'src/common/helper/database.helper';
import { randomInt } from 'crypto';
import { EmailService } from '../../email/email.service';
import { EmailTemplate } from '../../../common/enum/email-template.enum';
import { ProfileRegistrationEmailData } from '../../../common/interface/profile-registration-email-data.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { getFromCache } from '../../../common/helper/cache.helper';
import { CacheKey } from '../../../common/enum/cache-key.enum';
import { AccountSource } from '../../../common/enum/account-source.enum';
import { PendingUser } from '../pending-users/entities/pending-user.entity';
import * as crypto from 'crypto';
import { LogMethodExecution } from '../../../common/decorator/log-method-execution.decorator';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * The create() method creates a new Company and an admin user associated with
   * the company.These operations are wrapped in a TypeORM transaction to ensure
   * data consistency. Finally, the newly created company and user are returned
   * in a DTO object.
   * ? Company Directory might not be required once scope of login is finizalied.
   *
   * @param createCompanyDto Request object of type {@link CreateCompanyDto} for
   * creating a new company and admin user.
   * @param currentUser The current user details from the token.
   *
   * @returns The company and admin user details as a promise of type
   * {@link ReadCompanyUserDto}
   */
  @LogMethodExecution()
  async create(
    createCompanyDto: CreateCompanyDto,
    currentUser: IUserJWT,
  ): Promise<ReadCompanyUserDto> {
    let newCompany: Company;
    let newUser: ReadUserDto;
    let migratedClient = false;
    let existingCompanyDetails = await this.findOneByCompanyGuid(
      currentUser.bceid_business_guid,
    );

    if (!existingCompanyDetails && createCompanyDto?.migratedClientHash) {
      existingCompanyDetails = await this.findOneByMigratedClientHash(
        createCompanyDto?.migratedClientHash,
      );
    }

    //TPS migrated companies without any users linked to it is allowed
    if (existingCompanyDetails?.companyUsers?.length) {
      throw new BadRequestException(
        'Company already exists in ORBC. Please use the update endpoint',
      );
    }
    if (existingCompanyDetails?.accountSource === AccountSource.TpsAccount) {
      migratedClient = true;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      newCompany = this.classMapper.map(
        createCompanyDto,
        CreateCompanyDto,
        Company,
        {
          extraArgs: () => ({
            directory: currentUser.orbcUserDirectory,
            companyGUID: currentUser.bceid_business_guid,
            accountSource: currentUser.accountSource,
            userName: currentUser.userName,
            userGUID: currentUser.userGUID,
            timestamp: new Date(),
          }),
        },
      );

      if (!migratedClient) {
        newCompany.clientNumber = await this.generateClientNumber(
          newCompany,
          currentUser,
        );
      } else {
        newCompany.companyId = existingCompanyDetails?.companyId;
        newCompany.mailingAddress.addressId =
          existingCompanyDetails?.mailingAddress?.addressId;

        await queryRunner.manager.delete(PendingUser, {
          companyId: existingCompanyDetails?.companyId,
          userGUID: currentUser.userGUID,
        });
      }

      newCompany = await queryRunner.manager.save(newCompany);

      let user = this.classMapper.map(
        createCompanyDto.adminUser,
        CreateUserDto,
        User,
        {
          extraArgs: () => ({
            userAuthGroup: UserAuthGroup.COMPANY_ADMINISTRATOR,
            userName: currentUser.userName,
            directory: currentUser.orbcUserDirectory,
            userGUID: currentUser.userGUID,
            timestamp: new Date(),
          }),
        },
      );

      const newCompanyUser = new CompanyUser();
      newCompanyUser.company = new Company();
      newCompanyUser.company.companyId = newCompany.companyId;
      newCompanyUser.user = user;
      newCompanyUser.userAuthGroup = UserAuthGroup.COMPANY_ADMINISTRATOR;

      user.companyUsers = [newCompanyUser];
      user = await queryRunner.manager.save(user);
      user.companyUsers = [newCompanyUser]; //To populate Company User Auth Group
      newUser = await this.classMapper.mapAsync(user, User, ReadUserDto);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }

    const readCompanyUserDto = await this.classMapper.mapAsync(
      await this.findOne(newCompany.companyId),
      ReadCompanyDto,
      ReadCompanyUserDto,
    );

    readCompanyUserDto.adminUser = newUser;

    try {
      const emailData: ProfileRegistrationEmailData = {
        companyName: readCompanyUserDto.legalName,
        onRoutebBcClientNumber: readCompanyUserDto.clientNumber,
        companyAddressLine1: readCompanyUserDto.mailingAddress.addressLine1,
        companyAddressLine2: readCompanyUserDto.mailingAddress.addressLine2,
        companyCountry: await getFromCache(
          this.cacheManager,
          CacheKey.COUNTRY,
          readCompanyUserDto.mailingAddress.countryCode,
        ),
        companyProvinceState: await getFromCache(
          this.cacheManager,
          CacheKey.PROVINCE,
          readCompanyUserDto.mailingAddress.provinceCode,
        ),
        companyCity: readCompanyUserDto.mailingAddress.city,
        companyPostalCode: readCompanyUserDto.mailingAddress.postalCode,
        companyEmail: readCompanyUserDto.email,
        companyPhoneNumber: readCompanyUserDto.phone,
        companyFaxNumber: readCompanyUserDto.fax,
        primaryContactFirstname: readCompanyUserDto.primaryContact.firstName,
        primaryContactLastname: readCompanyUserDto.primaryContact.lastName,
        primaryContactEmail: readCompanyUserDto.primaryContact.email,
        primaryContactPhoneNumber: readCompanyUserDto.primaryContact.phone1,
        primaryContactExtension:
          readCompanyUserDto.primaryContact.phone1Extension,
        primaryContactAlternatePhoneNumber:
          readCompanyUserDto.primaryContact.phone2,
        primaryContactCountry: await getFromCache(
          this.cacheManager,
          CacheKey.COUNTRY,
          readCompanyUserDto.primaryContact.countryCode,
        ),
        primaryContactProvinceState: await getFromCache(
          this.cacheManager,
          CacheKey.PROVINCE,
          readCompanyUserDto.primaryContact.provinceCode,
        ),
        primaryContactCity: readCompanyUserDto.primaryContact.city,
      };

      await this.emailService.sendEmailMessage(
        EmailTemplate.PROFILE_REGISTRATION,
        emailData,
        'Welcome to onRouteBC',
        [readCompanyUserDto.email, readCompanyUserDto.primaryContact.email],
      );
    } catch (error: unknown) {
      this.logger.error(error);
    }

    return readCompanyUserDto;
  }

  /**
   * The findOne() method returns a ReadCompanyDto object corresponding to the
   * company with that Id. It retrieves the entity from the database using the
   * Repository, maps it to a DTO object using the Mapper, and returns it.
   *
   * @param companyId The company Id.
   *
   * @returns The company details as a promise of type {@link ReadCompanyDto}
   */
  @LogMethodExecution()
  async findOne(companyId: number): Promise<ReadCompanyDto> {
    return this.classMapper.mapAsync(
      await this.companyRepository.findOne({
        where: { companyId: companyId },
        relations: {
          mailingAddress: true,
          primaryContact: true,
        },
      }),
      Company,
      ReadCompanyDto,
    );
  }

  /**
   * The findOne() method returns a ReadCompanyMetadataDto object corresponding to the given
   * user guid. It retrieves the entity from the database using the
   * Repository, maps it to a DTO object using the Mapper, and returns it.
   *
   * @param userGUID The company Id.
   *
   * @returns The company details list as a promise of type {@link ReadCompanyMetadataDto}
   */
  @LogMethodExecution()
  async findCompanyMetadataByUserGuid(
    userGUID: string,
  ): Promise<ReadCompanyMetadataDto[]> {
    const companyUsers = await this.companyRepository
      .createQueryBuilder('company')
      .innerJoinAndSelect('company.mailingAddress', 'mailingAddress')
      .innerJoinAndSelect('mailingAddress.province', 'mailingAddressProvince')
      .innerJoinAndSelect('company.companyUsers', 'companyUsers')
      .leftJoinAndSelect('companyUsers.user', 'user')
      .where('user.userGUID= :userGUID', {
        userGUID: userGUID,
      })
      .getMany();

    const companyMetadata = await this.classMapper.mapArrayAsync(
      companyUsers,
      Company,
      ReadCompanyMetadataDto,
    );

    return companyMetadata;
  }

  /**
   * The findOne() method returns a ReadCompanyMetadataDto object corresponding to the
   * company with that Id. It retrieves the entity from the database using the
   * Repository, maps it to a DTO object using the Mapper, and returns it.
   *
   * @param companyId The company Id.
   *
   * @returns The company details as a promise of type {@link ReadCompanyMetadataDto}
   */
  @LogMethodExecution()
  async findCompanyMetadata(
    companyId: number,
  ): Promise<ReadCompanyMetadataDto> {
    return this.classMapper.mapAsync(
      await this.companyRepository.findOne({
        where: { companyId: companyId },
      }),
      Company,
      ReadCompanyMetadataDto,
    );
  }

  /**
   * The findOneByCompanyGuid() method returns a Company Entity object corresponding to the
   * company with that company GUID. It retrieves the entity from the database using the
   * Repository
   *
   * @param companyGUID The company Id.
   *
   * @returns The company details as a promise of type {@link Company}
   */
  @LogMethodExecution()
  async findOneByCompanyGuid(companyGUID: string): Promise<Company> {
    return await this.companyRepository.findOne({
      where: { companyGUID: companyGUID },
      relations: {
        mailingAddress: true,
        primaryContact: true,
        companyUsers: true,
      },
    });
  }

  /**
   * The findOneByMigratedClientNumber() method returns a Company Entity object corresponding to the
   * company with that migrated client number. It retrieves the entity from the database using the
   * Repository
   *
   * @param migratedClientNumber The migrated client Number.
   *
   * @returns The company details as a promise of type {@link Company}
   */
  @LogMethodExecution()
  async findOneByMigratedClientNumber(
    migratedClientNumber: string,
  ): Promise<Company> {
    const migratedClientHash = crypto
      .createHash('sha256')
      .update(migratedClientNumber?.replace(/-/g, ''))
      .digest('hex');
    return await this.findOneByMigratedClientHash(migratedClientHash);
  }

  /**
   * The findOneByMigratedClientHash() method returns a Company Entity object corresponding to the
   * company with that migrated client hash. It retrieves the entity from the database using the
   * Repository
   *
   * @param migratedClientHash The migrated client Number.
   *
   * @returns The company details as a promise of type {@link Company}
   */
  @LogMethodExecution()
  async findOneByMigratedClientHash(
    migratedClientHash: string,
  ): Promise<Company> {
    return await this.companyRepository.findOne({
      where: { migratedClientHash: migratedClientHash?.toUpperCase() },
      relations: {
        mailingAddress: true,
        primaryContact: true,
        companyUsers: true,
      },
    });
  }

  /**
   * The mapCompanyEntityToCompanyDto() method returns a ReadCompanyDto object
   * corresponding to the company with that company GUID. It maps the company
   * entity to the DTO.
   *
   * @param company The company Entity.
   *
   * @returns The company details as a promise of type {@link ReadCompanyDto}
   */
  @LogMethodExecution()
  async mapCompanyEntityToCompanyDto(
    company: Company,
  ): Promise<ReadCompanyDto> {
    return this.classMapper.mapAsync(company, Company, ReadCompanyDto);
  }

  /**
   * The mapCompanyEntityToCompanyMetadataDto() method returns a ReadCompanyDto object
   * corresponding to the company with that company GUID. It maps the company
   * entity to the DTO.
   *
   * @param company The company Entity.
   *
   * @returns The company details as a promise of type {@link ReadCompanyMetadataDto}
   */
  @LogMethodExecution()
  async mapCompanyEntityToCompanyMetadataDto(
    company: Company,
  ): Promise<ReadCompanyMetadataDto> {
    return this.classMapper.mapAsync(company, Company, ReadCompanyMetadataDto);
  }

  /**
   * The update() method retrieves the entity from the database using the
   * Repository, maps the DTO object to the entity using the Mapper, sets some
   * additional properties on the entity, and saves it back to the database
   * using the Repository. It then retrieves the updated entity and returns it
   * in a DTO object.
   *
   * ? Company Directory might not be required once scope of login is finizalied.
   * ? Should we be able to update company guid?
   *
   * @param companyId The company Id.
   * @param updateCompanyDto Request object of type {@link UpdateCompanyDto} for
   * updating a company.
   * @param directory Directory derived from the access token.
   *
   * @returns The company details as a promise of type {@link ReadCompanyDto}
   */
  @LogMethodExecution()
  async update(
    companyId: number,
    updateCompanyDto: UpdateCompanyDto,
    currentUser: IUserJWT,
  ): Promise<ReadCompanyDto> {
    const company = await this.companyRepository.findOne({
      where: { companyId: companyId },
      relations: {
        mailingAddress: true,
        primaryContact: true,
      },
    });

    if (!company) {
      throw new DataNotFoundException();
    }

    const contactId = company.primaryContact.contactId;
    const mailingAddressId = company.mailingAddress.addressId;
    const clientNumber = company.clientNumber;

    const newCompany = this.classMapper.map(
      updateCompanyDto,
      UpdateCompanyDto,
      Company,
      {
        extraArgs: () => ({
          companyId: company.companyId,
          clientNumber: clientNumber,
          directory: currentUser.orbcUserDirectory,
          mailingAddressId: mailingAddressId,
          contactId: contactId,
          userName: currentUser.userName,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
        }),
      },
    );
    const updatedCompany = await this.companyRepository.save(newCompany);

    return this.findOne(updatedCompany.companyId);
  }

  /**
   * Generates clientNumber for the newly created company.
   * @param company
   *
   */
  private async generateClientNumber(
    company: Company,
    currentUser: IUserJWT,
  ): Promise<string> {
    const rnd = randomInt(100, 1000);
    const seq = await callDatabaseSequence(
      'dbo.ORBC_CLIENT_NUMBER_SEQ',
      this.dataSource,
    );
    const clientNumber =
      company.accountRegion +
      currentUser.accountSource +
      '-' +
      seq.padStart(6, '0') +
      '-' +
      String(rnd);
    return clientNumber;
  }
}
