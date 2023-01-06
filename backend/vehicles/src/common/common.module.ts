import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { Country } from './entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Province])],
  exports: [TypeOrmModule],
})
export class CommonModule {}
