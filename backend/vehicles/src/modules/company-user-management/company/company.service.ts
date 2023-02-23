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

@Injectable()
export class CompanyService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    companyDirectory: CompanyDirectory,
    userDirectory: UserDirectory,
  ): Promise<ReadCompanyDto> {
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
        createCompanyDto.adminUser,
        newCompany.companyGUID,
        userDirectory,
        UserAuthGroup.ADMIN,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
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

  async findOne(companyGUID: string): Promise<ReadCompanyDto> {
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

  async update(
    companyGUID: string,
    updateCompanyDto: UpdateCompanyDto,
    companyDirectory: CompanyDirectory,
  ): Promise<ReadCompanyDto> {
    const companyProfile = this.classMapper.map(
      updateCompanyDto,
      UpdateCompanyDto,
      Company,
      {
        extraArgs: () => ({ companyDirectory: companyDirectory }),
      },
    );

    companyProfile.setMailingAddressSameAsCompanyAddress(
      updateCompanyDto.mailingAddressSameAsCompanyAddress,
    );
    companyProfile.companyGUID = companyGUID;

    await this.companyRepository.save(companyProfile);

    return this.findOne(companyGUID);
  }
}
