import { Module } from '@nestjs/common';
import { GarmsService } from './garms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GarmsExtractFile } from './entities/garms-extract-file.entity';
import { GarmsFileTransaction } from './entities/garms-file-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GarmsExtractFile, GarmsFileTransaction])],
  providers: [GarmsService],
})
export class GarmsModule {}
