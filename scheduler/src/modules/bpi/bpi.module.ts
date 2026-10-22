import { Module } from '@nestjs/common';
import { BpiService } from './bpi.service';
import { BpiController } from './bpi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BPIFile } from './entities/bpi-file.entity';
import { PrepaidAccountDeposit } from './entities/prepaid-account-deposit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BPIFile, PrepaidAccountDeposit])],
  controllers: [BpiController],
  providers: [BpiService],
})
export class BpiModule {}
