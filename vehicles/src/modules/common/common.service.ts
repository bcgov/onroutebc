import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { Province } from './entities/province.entity';
import { LogMethodExecution } from '../../common/decorator/log-method-execution.decorator';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
  ) {}

  @LogMethodExecution()
  async findOneCountry(countryCode: string): Promise<Country> {
    return await this.countryRepository.findOne({
      where: { countryCode: countryCode },
    });
  }

  @LogMethodExecution()
  async findAllCountries(): Promise<Country[]> {
    return await this.countryRepository.find({});
  }

  @LogMethodExecution()
  async findOneProvince(provinceCode: string): Promise<Province> {
    return await this.provinceRepository.findOne({
      where: { provinceCode: provinceCode },
    });
  }

  @LogMethodExecution()
  async findAllProvinces(): Promise<Province[]> {
    return await this.provinceRepository.find({});
  }
}
