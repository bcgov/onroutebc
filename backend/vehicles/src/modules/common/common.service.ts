import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { Province } from './entities/province.entity';
import { OrbcError } from './entities/error.entity';
import { CreateErrorDto } from './dto/request/create-error.dto';
import { ReadErrorDto } from './dto/response/read-error.dto';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(OrbcError)
    private orbcErrorRepository: Repository<OrbcError>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
  ) {}

  async findOneCountry(countryCode: string): Promise<Country> {
    return await this.countryRepository.findOne({
      where: { countryCode: countryCode },
    });
  }

  async findAllCountries(): Promise<Country[]> {
    return await this.countryRepository.find({});
  }

  async findOneProvince(provinceCode: string): Promise<Province> {
    return await this.provinceRepository.findOne({
      where: { provinceCode: provinceCode },
    });
  }

  async findAllProvinces(): Promise<Province[]> {
    return await this.provinceRepository.find({});
  }

  async createOrbcError(
    createErrorDto: CreateErrorDto,
  ): Promise<ReadErrorDto> {
    let newAddedError: ReadErrorDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let error = new OrbcError();
      error.errorTypeId = createErrorDto.errorTypeId;
      error.errorOccuredTime = createErrorDto.errorOccuredTime;
      error.sessionId = createErrorDto.sessionId;
      error.userGuid = createErrorDto.userGuid;
      error.corelationId = createErrorDto.corelationId;
      await queryRunner.manager.save(error);
      newAddedError = error as ReadErrorDto;
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
    return newAddedError;
  }
}
