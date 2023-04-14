import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { PermitController } from './permit.controller';
import { PermitMetadata } from './entities/permit-metadata.entity';
import { Permit } from './entities/permit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitProfile } from './profile/permit.profile';

@Module({
  imports: [TypeOrmModule.forFeature([PermitMetadata, Permit])],
  controllers: [PermitController],
  providers: [PermitService, PermitProfile],
})
export class PermitModule {}
