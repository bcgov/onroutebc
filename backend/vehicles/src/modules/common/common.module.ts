import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { Country } from './entities/country.entity';
import { Contact } from './entities/contact.entity';
import { Address } from './entities/address.entity';
import { AddressProfile } from './profiles/address.profile';
import { ContactProfile } from './profiles/contact.profile';
import { CommonService } from './common.service';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Province, Address, Contact])],
  providers: [AddressProfile, ContactProfile, CommonService],
  exports: [TypeOrmModule, AddressProfile, ContactProfile, CommonService],
})
export class CommonModule {}
