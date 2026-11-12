import { Module } from '@nestjs/common';
import { BpiService } from './bpi.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BPIFile } from './entities/bpi-file.entity';
import { PrepaidAccountDeposit } from './entities/prepaid-account-deposit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BPIFile, PrepaidAccountDeposit])],
  providers: [BpiService],
  exports: [BpiService],
})
export class BpiModule {}
