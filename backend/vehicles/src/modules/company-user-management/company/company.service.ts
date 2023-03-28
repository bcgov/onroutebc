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
import { EmailService } from '../../common/email.service';
import { ReadCompanyMetadataDto } from './dto/response/read-company-metadata.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
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
        UserAuthGroup.COMPANY_ADMINISTRATOR,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    const readCompanyUserDto = await this.classMapper.mapAsync(
      await this.findOne(newCompany.companyId),
      ReadCompanyDto,
      ReadCompanyUserDto,
    );

    readCompanyUserDto.adminUser = newUser;

    const template = this.messageBodyUtil(
      readCompanyUserDto.primaryContact.firstName,
      readCompanyUserDto.primaryContact.lastName,
      readCompanyUserDto.legalName,
      readCompanyUserDto.clientNumber,
      readCompanyUserDto.companyAddress.addressLine1,
      readCompanyUserDto.companyAddress.addressLine2,
      readCompanyUserDto.companyAddress.countryCode,
      readCompanyUserDto.companyAddress.provinceCode,
      readCompanyUserDto.companyAddress.city,
      readCompanyUserDto.companyAddress.postalCode,
      readCompanyUserDto.email,
      readCompanyUserDto.phone,
      readCompanyUserDto.fax,
      readCompanyUserDto.primaryContact.email,
      readCompanyUserDto.primaryContact.phone1,
      readCompanyUserDto.primaryContact.phone1Extension,
      readCompanyUserDto.primaryContact.phone2,
      readCompanyUserDto.primaryContact.countryCode,
      readCompanyUserDto.primaryContact.provinceCode,
      readCompanyUserDto.primaryContact.city,
    );

    const emailSubject = 'Welcome to onRouteBC';
    await this.emailService.sendEmailMessage(template, emailSubject, [
      readCompanyUserDto.email,
      readCompanyUserDto.primaryContact.email,
    ]);

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
    const companyUsers = await this.userService.findAllCompanyUsersByUserGuid(
      userGUID,
    );

    const companyMetadata: ReadCompanyMetadataDto[] = [];
    for (const companyUser of companyUsers) {
      companyMetadata.push(
        await this.classMapper.mapAsync(
          companyUser.company,
          Company,
          ReadCompanyMetadataDto,
        ),
      );
    }
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

  private messageBodyUtil(
    primary_contact_firstname: string,
    primary_contact_lastname: string,
    company_name: string,
    onroutebc_client_number: string,
    company_address_line1: string,
    company_address_line2: string,
    company_country: string,
    company_province_state: string,
    company_city: string,
    company_postal_code: string,
    company_email: string,
    company_phone_number: string,
    company_fax_number: string,
    primary_contact_email: string,
    primary_contact_phone_number: string,
    primary_contact_extension: string,
    primary_contact_alternate_phone_number: string,
    primary_contact_country: string,
    primary_contact_province_state: string,
    primary_contact_city: string,
  ) {
    return `<h1>Welcome to onRouteBC</h1>
      <p>Hello ${primary_contact_firstname} ${primary_contact_lastname},</p>
      <p>Your company profile for ${company_name} has been successfully completed. The details you provided are listed below. You can start applying for permits online at <a href="https://www.onroutebc.gov.bc.ca/">onRouteBC</a>.</p>
      <h3>onRouteBC Client Number</h3>
      <p> ${onroutebc_client_number} </p>
      <h3>Company Contact Address:</h3>
      <p>
        ${company_address_line1}</br>
        ${company_address_line2}</br>
        ${company_country}</br>
        ${company_province_state}</br>
        ${company_city} ${company_postal_code}</br>
      </p>
      <h3>Company Contact Details:</h3>
      <p>
        Email: ${company_email}</br>
        Phone: ${company_phone_number}</br>
        Fax: ${company_fax_number}</br>
      </p>
      <h3>Company Primary Contact:</h3>
      <p>
        ${primary_contact_firstname} ${primary_contact_lastname}</br>
        Email: ${primary_contact_email}</br>
        Primary Phone: ${primary_contact_phone_number} Ext: ${primary_contact_extension}</br>
        Alternate Phone: ${primary_contact_alternate_phone_number}</br>
        ${primary_contact_country}</br>
        ${primary_contact_province_state}</br>
        ${primary_contact_city}</br>
      </p>
      </br>

      <img src="data:image/jpg;base64,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" />
      </br>
      <p>Have questions or need help? Check out the <a href="https://www2.gov.bc.ca/gov/content/transportation/vehicle-safety-enforcement/services/permitting/commercial-transport-permits">Commercial Vehicle Permits</a> page or email us at <a href="mailto:onRouteBC@gov.bc.ca">onRouteBC@gov.bc.ca</a>.</p>`;
  }
}
