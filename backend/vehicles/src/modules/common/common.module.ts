import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { Country } from './entities/country.entity';
import { Contact } from './entities/contact.entity';
import { Address } from './entities/address.entity';
import { AddressProfile } from './profiles/address.profile';
import { ContactProfile } from './profiles/contact.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Province, Address, Contact])],
  providers: [AddressProfile, ContactProfile],
  exports: [TypeOrmModule, AddressProfile, ContactProfile],
})
export class CommonModule {}
