import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { ReadCompanyProfileDto } from '../dto/read-company-profile.dto';
import { CreateCompanyProfileDto } from '../dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from '../dto/update-company-profile.dto';
import { Address } from '../entities/address.entity';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class CompanyProfileService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async create(
    powerUnitType: CreateCompanyProfileDto,
  ): Promise<ReadCompanyProfileDto> {
    const newPowerUnitType = this.classMapper.map(
      powerUnitType,
      CreatePowerUnitTypeDto,
      PowerUnitType,
    );
    await this.companyRepository.insert(newPowerUnitType);
    return this.findOne(newPowerUnitType.typeCode);
  }

  async findOne(companyGUID: string): Promise<ReadCompanyProfileDto> {
    return this.classMapper.mapAsync(
      await this.companyRepository.findOne({
        where: { companyGUID: companyGUID },
      }),
      PowerUnitType,
      ReadPowerUnitTypeDto,
    );
  }

  async update(
    companyGUID: string,
    updateCompanyProfileDto: UpdateCompanyProfileDto,
  ): Promise<ReadCompanyProfileDto> {
    const newPowerUnitType = this.classMapper.map(
      updateCompanyProfileDto,
      UpdateCompanyProfileDto,
      Address,
    );

    await this.companyRepository.update({ companyGUID: companyGUID }, newPowerUnitType);
    return this.findOne(companyGUID);
  }
}
