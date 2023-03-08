import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserAuthGroup } from '../../../common/enum/user-auth-group.enum';
import {
  CompanyDirectory,
  UserDirectory,
} from '../../../common/enum/directory.enum';
import { ReadUserDto } from '../users/dto/response/read-user.dto';
import { UsersService } from '../users/users.service';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { ReadCompanyUserDto } from './dto/response/read-company-user.dto';
import { ReadCompanyDto } from './dto/response/read-company.dto';
import { Company } from './entities/company.entity';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';

@Injectable()
export class CompanyService {
  constructor(
    private readonly userService: UsersService,
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
   * @param companyDirectory Company Directory from the access token.
   * @param userName User name from the access token.
   * @param userDirectory User Directory from the access token.
   *
   * @returns The company and admin user details as a promise of type
   * {@link ReadCompanyUserDto}
   */
  async create(
    createCompanyDto: CreateCompanyDto,
    companyDirectory: CompanyDirectory,
    userName: string,
    userDirectory: UserDirectory,
  ): Promise<ReadCompanyUserDto> {
    let newCompany = this.classMapper.map(
      createCompanyDto,
      CreateCompanyDto,
      Company,
      {
        extraArgs: () => ({ companyDirectory: companyDirectory }),
      },
    );

    newCompany.setMailingAddressSameAsCompanyAddress(
      createCompanyDto.mailingAddressSameAsCompanyAddress,
    );

    let newUser: ReadUserDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      newCompany = await queryRunner.manager.save(newCompany);
      newUser = await this.userService.createUser(
        newCompany.companyId,
        createCompanyDto.adminUser,
        userName,
        userDirectory,
        UserAuthGroup.ADMIN,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    const readCompanyUserDto = await this.classMapper.mapAsync(
      newCompany,
      Company,
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
          companyAddress: true,
        },
      }),
      Company,
      ReadCompanyDto,
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
          companyAddress: true,
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
   * @param companyDirectory Company Directory from the access token.
   *
   * @returns The company details as a promise of type {@link ReadCompanyDto}
   */
  async update(
    companyId: number,
    updateCompanyDto: UpdateCompanyDto,
    companyDirectory: CompanyDirectory,
  ): Promise<ReadCompanyDto> {
    const company = await this.companyRepository.findOne({
      where: { companyId: companyId },
      relations: {
        mailingAddress: true,
        primaryContact: true,
        companyAddress: true,
      },
    });

    if (!company) {
      throw new DataNotFoundException();
    }

    const contactId = company.primaryContact.contactId;
    const companyAddressId = company.companyAddress.addressId;
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
          companyDirectory: companyDirectory,
          companyAddressId: companyAddressId,
          mailingAddressId:
            company.mailingAddressSameAsCompanyAddress !==
            updateCompanyDto.mailingAddressSameAsCompanyAddress
              ? null
              : mailingAddressId,
          contactId: contactId,
        }),
      },
    );

    newCompany.setMailingAddressSameAsCompanyAddress(
      updateCompanyDto.mailingAddressSameAsCompanyAddress,
    );

    const updatedCompany = await this.companyRepository.save(newCompany);

    return this.findOne(updatedCompany.companyId);
  }
}
