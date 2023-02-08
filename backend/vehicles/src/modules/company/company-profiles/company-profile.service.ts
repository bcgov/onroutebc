import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { ReadCompanyProfileDto } from './dto/response/read-company-profile.dto';
import { CreateCompanyProfileDto } from './dto/request/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/request/update-company-profile.dto';

@Injectable()
export class CompanyProfileService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(
    createCompanyProfileDto: CreateCompanyProfileDto,
  ): Promise<ReadCompanyProfileDto> {
    const newCompanyProfile = this.classMapper.map(
      createCompanyProfileDto,
      CreateCompanyProfileDto,
      Company,
    );

    newCompanyProfile.setMailingAddressSameAsCompanyAddress(
      createCompanyProfileDto.mailingAddressSameAsCompanyAddress,
    );

    return this.classMapper.mapAsync(
      await this.companyRepository.save(newCompanyProfile),
      Company,
      ReadCompanyProfileDto,
    );
  }

  async findOne(companyGUID: string): Promise<ReadCompanyProfileDto> {
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
      ReadCompanyProfileDto,
    );
  }

  async update(
    companyGUID: string,
    updateCompanyProfileDto: UpdateCompanyProfileDto,
  ): Promise<ReadCompanyProfileDto> {
    const companyProfile = this.classMapper.map(
      updateCompanyProfileDto,
      UpdateCompanyProfileDto,
      Company,
    );

    companyProfile.setMailingAddressSameAsCompanyAddress(
      updateCompanyProfileDto.mailingAddressSameAsCompanyAddress,
    );
    companyProfile.companyGUID = companyGUID;

    await this.companyRepository.save(companyProfile);

    return this.findOne(companyGUID);
  }
}
