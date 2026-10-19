import { Module } from '@nestjs/common';
import { PbiService } from './pbi.service';
import { PbiController } from './pbi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PBIFile } from './entities/pbi-file.entity';
import { PrepaidAccountDeposit } from './entities/prepaid-account-deposit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PBIFile, PrepaidAccountDeposit])],
  controllers: [PbiController],
  providers: [PbiService],
})
export class PbiModule {}
