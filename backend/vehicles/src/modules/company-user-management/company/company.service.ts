import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserAuthGroup } from '../../../common/enum/user-auth-group.enum';
import { Directory } from '../../../common/enum/directory.enum';
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

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
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
   * @param directory Directory derived from the access token.
   * @param currentUser The current user details from the token.
   *
   * @returns The company and admin user details as a promise of type
   * {@link ReadCompanyUserDto}
   */
  async create(
    createCompanyDto: CreateCompanyDto,
    directory: Directory,
    currentUser: IUserJWT,
  ): Promise<ReadCompanyUserDto> {
    let newCompany: Company;
    let newUser: ReadUserDto;
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
            directory: directory,
            companyGUID: currentUser.bceid_business_guid,
          }),
        },
      );

      newCompany = await queryRunner.manager.save(newCompany);

      let user = this.classMapper.map(
        createCompanyDto.adminUser,
        CreateUserDto,
        User,
        {
          extraArgs: () => ({
            userName: currentUser.userName,
            directory: directory,
            userGUID: currentUser.userGUID,
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

      newUser = await this.classMapper.mapAsync(user, User, ReadUserDto);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(); // TODO: Handle the typeorm Error handling
    } finally {
      await queryRunner.release();
    }

    const readCompanyUserDto = await this.classMapper.mapAsync(
      await this.findOne(newCompany.companyId),
      ReadCompanyDto,
      ReadCompanyUserDto,
    );

    readCompanyUserDto.adminUser = newUser;

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
   * The findOneByCompanyGuid() method returns a ReadCompanyDto object corresponding to the
   * company with that company GUID. It retrieves the entity from the database using the
   * Repository, maps it to a DTO object using the Mapper, and returns it.
   *
   * @param companyGUID The company Id.
   *
   * @returns The company details as a promise of type {@link ReadCompanyDto}
   */
  async findOneByCompanyGuid(companyGUID: string): Promise<ReadCompanyDto> {
    return this.classMapper.mapAsync(
      await this.companyRepository.findOne({
        where: { companyGUID: companyGUID },
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
  async update(
    companyId: number,
    updateCompanyDto: UpdateCompanyDto,
    directory: Directory,
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
          directory: directory,
          mailingAddressId: mailingAddressId,
          contactId: contactId,
        }),
      },
    );
    const updatedCompany = await this.companyRepository.save(newCompany);

    return this.findOne(updatedCompany.companyId);
  }
}
