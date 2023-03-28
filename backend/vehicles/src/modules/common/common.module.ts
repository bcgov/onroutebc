import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { Country } from './entities/country.entity';
import { Contact } from './entities/contact.entity';
import { Address } from './entities/address.entity';
import { AddressProfile } from './profiles/address.profile';
import { ContactProfile } from './profiles/contact.profile';
import { EmailService } from './email.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, Province, Address, Contact]),
    HttpModule,
  ],
  providers: [AddressProfile, ContactProfile, EmailService],
  exports: [TypeOrmModule, AddressProfile, ContactProfile, EmailService],
})
export class CommonModule {}
